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
     * Credita o valor no saldo do usuário
     */
    private function creditUserBalance(Transaction $transaction)
    {
        $user = User::find($transaction->user_id);

        if ($user) {
            $user->balance += $transaction->amount;
            $user->save();

            Log::info("[Webhook] Saldo creditado para usuário #{$user->id}. Valor: {$transaction->amount}. Novo saldo: {$user->balance}");
        } else {
            Log::error("[Webhook] Usuário #{$transaction->user_id} não encontrado para creditar saldo.");
        }
    }
}
