<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;
use App\Models\Setting;
use App\Models\User;
use GuzzleHttp\Client;

class WebhookController extends Controller
{
    /**
     * Handle Mercado Pago Webhooks
     */
    public function handleMercadoPago(Request $request)
    {
        try {
            // Log da notificação recebida para debug
            Log::info('[Webhook] Notificação recebida do Mercado Pago', $request->all());

            $type = $request->input('type');
            $action = $request->input('action');
            $data = $request->input('data');

            // Mercado Pago envia notificações de 'payment'
            if ($type === 'payment' || $action === 'payment.created' || $action === 'payment.updated') {
                $paymentId = $data['id'] ?? $request->input('data.id');

                if ($paymentId) {
                    return $this->processPayment($paymentId);
                }
            }

            // Retornar 200 OK para o Mercado Pago não reenviar
            return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
            Log::error('[Webhook] Erro ao processar webhook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Mesmo com erro, retornar 200 para evitar loop de retentativas se for erro de lógica interna
            // Se for erro de conexão, o MP tentará novamente
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Processa a atualização de um pagamento
     */
    private function processPayment($paymentId)
    {
        // Buscar configurações
        $accessToken = Setting::getValue('mercadopago_access_token');

        if (!$accessToken) {
            Log::error('[Webhook] Token de acesso do Mercado Pago não configurado.');
            return response()->json(['status' => 'error', 'message' => 'Configuração ausente'], 500);
        }

        // Consultar API do Mercado Pago para garantir dados atualizados e seguros
        $client = new Client();
        try {
            $response = $client->get("https://api.mercadopago.com/v1/payments/{$paymentId}", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]);

            $paymentData = json_decode($response->getBody()->getContents(), true);

            Log::info('[Webhook] Dados do pagamento consultados', ['id' => $paymentId, 'status' => $paymentData['status']]);

            // Buscar a transação no banco de dados pelo ID externo (ID do pagamento no MP)
            $transaction = Transaction::where('external_id', $paymentId)->first();

            if (!$transaction) {
                Log::warning('[Webhook] Transação não encontrada para o pagamento ID: ' . $paymentId);
                // Pode ser um pagamento que não foi originado pelo sistema ou erro de registro
                return response()->json(['status' => 'ok', 'message' => 'Transação não encontrada']);
            }

            // Verificar se o status mudou
            if ($transaction->status !== $paymentData['status']) {
                $oldStatus = $transaction->status;
                $newStatus = $paymentData['status'];

                $transaction->status = $newStatus;
                $transaction->save();

                Log::info("[Webhook] Status da transação #{$transaction->id} atualizado: {$oldStatus} -> {$newStatus}");

                // Se o pagamento foi aprovado e ainda não foi processado (evitar duplicidade)
                // O status 'approved' é o principal, mas 'completed' também pode ser usado em alguns contextos
                if (($newStatus === 'approved' || $newStatus === 'completed') &&
                    ($oldStatus !== 'approved' && $oldStatus !== 'completed')) {

                    $this->creditUserBalance($transaction);
                }
            }

            return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
            Log::error('[Webhook] Erro ao consultar pagamento no Mercado Pago', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage()
            ]);
            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Credita o valor no saldo do usuário e aplica bônus de GetCoin
     */
    private function creditUserBalance(Transaction $transaction)
    {
        $user = User::find($transaction->user_id);

        if (!$user) {
            Log::error("[Webhook] Usuário #{$transaction->user_id} não encontrado para creditar saldo.");
            return;
        }

        $user->balance += $transaction->amount;
        $user->save();

        Log::info("[Webhook] Saldo creditado para usuário #{$user->id}. Valor: {$transaction->amount}. Novo saldo: {$user->balance}");

        // === 1º CRÉDITO: ganha o mesmo valor em GetCoin ===
        $this->applyFirstCreditBonus($user, $transaction);

        // === CASHBACK por percentual do nível do Viber ===
        $this->applyLevelCashback($user, $transaction);

        // === INDICAÇÃO: creditar quem indicou ===
        $this->applyReferralBonus($user, $transaction);
    }

    /**
     * 1º crédito: ganha o mesmo valor em GetCoin (apenas uma vez)
     */
    private function applyFirstCreditBonus(User $user, Transaction $transaction)
    {
        $enabled = Setting::getValue('first_credit_bonus_enabled', 'true');
        if ($enabled !== 'true') return;

        // Verificar se é o primeiro depósito concluído deste usuário
        $previousDeposits = Transaction::where('user_id', $user->id)
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->where('id', '!=', $transaction->id)
            ->count();

        if ($previousDeposits === 0) {
            // É o primeiro crédito! Dar o mesmo valor em GetCoin
            $bonusAmount = $transaction->amount;
            $user->cashback_balance += $bonusAmount;
            $user->save();

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'cashback',
                'amount' => $bonusAmount,
                'status' => 'completed',
                'description' => "Bônus 1º crédito: R$ " . number_format($bonusAmount, 2, ',', '.') . " em GetCoin",
            ]);

            Log::info("[Webhook] Bônus 1º crédito aplicado ao usuário #{$user->id}. Valor: {$bonusAmount} GetCoin");
        }
    }

    /**
     * Cashback por nível: percentual de GetCoin por cada Get/crédito em R$
     */
    private function applyLevelCashback(User $user, Transaction $transaction)
    {
        if ($transaction->payment_method !== 'pix') return;

        $userLevel = \Schema::hasColumn('users', 'viber_level') ? ($user->viber_level ?? 'inscrito') : 'inscrito';
        $settingKey = "getcoin_pct_{$userLevel}";
        $percentage = (float) Setting::getValue($settingKey, '5');
        $percentage = max(0, min(100, $percentage));

        // Fallback para o antigo pix_cashback se a setting do nível não existir
        if ($percentage <= 0) {
            $percentage = (float) Setting::getValue('pix_cashback_percentage', '10');
        }

        $cashbackAmount = round($transaction->amount * ($percentage / 100), 2);

        if ($cashbackAmount > 0) {
            $user->cashback_balance += $cashbackAmount;
            $user->save();

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'cashback',
                'payment_method' => 'pix',
                'amount' => $cashbackAmount,
                'status' => 'completed',
                'description' => "GetCoin: {$percentage}% (nível {$userLevel}) na recarga de R$ " . number_format($transaction->amount, 2, ',', '.'),
            ]);

            Log::info("[Webhook] GetCoin nível creditado ao usuário #{$user->id}. Nível: {$userLevel}, {$percentage}%, Valor: {$cashbackAmount}");
        }
    }

    /**
     * Indicação: quando indicado faz crédito, quem indicou ganha X GetCoins
     */
    private function applyReferralBonus(User $user, Transaction $transaction)
    {
        if (!\Schema::hasColumn('users', 'referred_by')) return;
        if (!$user->referred_by) return;

        $referrer = User::find($user->referred_by);
        if (!$referrer) return;

        // Verificar se é o primeiro crédito do indicado (só dá bônus no primeiro)
        $previousDeposits = Transaction::where('user_id', $user->id)
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->where('id', '!=', $transaction->id)
            ->count();

        if ($previousDeposits > 0) return; // Só no primeiro crédito da pessoa indicada

        $referrerLevel = $referrer->viber_level ?? 'inscrito';
        $settingKey = "referral_getcoin_{$referrerLevel}";
        $bonusAmount = (float) Setting::getValue($settingKey, '50');

        if ($bonusAmount > 0) {
            $referrer->cashback_balance += $bonusAmount;
            if (\Schema::hasColumn('users', 'referral_count')) {
                $referrer->referral_count = ($referrer->referral_count ?? 0) + 1;
            }
            $referrer->save();

            Transaction::create([
                'user_id' => $referrer->id,
                'type' => 'cashback',
                'amount' => $bonusAmount,
                'status' => 'completed',
                'description' => "Indicação: {$bonusAmount} GetCoin(s) — {$user->name} fez seu 1º crédito",
            ]);

            Log::info("[Webhook] Bônus indicação: {$bonusAmount} GetCoin para usuário #{$referrer->id} (indicou #{$user->id})");
        }
    }
}
