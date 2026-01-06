<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Setting;
use App\Models\Transaction;
use GuzzleHttp\Client;

class PaymentController extends Controller
{
    /**
     * Cria um pagamento via Pix no Mercado Pago
     */
    public function createPixPayment(Request $request)
    {
        try {
            $user = $request->user();
            $amount = $request->input('amount');

            if (!$amount || $amount <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'O valor da recarga é obrigatório e deve ser maior que zero.'
                ], 422);
            }

            // Buscar configurações do Mercado Pago
            $accessToken = Setting::getValue('mercadopago_access_token');

            if (!$accessToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'O sistema de pagamentos não está configurado corretamente.'
                ], 500);
            }

            $client = new Client();

            // Gerar um ID único para a requisição (Idempotency-Key)
            $idempotencyKey = uniqid('pay_', true);

            $response = $client->post('https://api.mercadopago.com/v1/payments', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'X-Idempotency-Key' => $idempotencyKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'transaction_amount' => (float) $amount,
                    'description' => 'Recarga de Créditos - LeilaoCash',
                    'payment_method_id' => 'pix',
                    'payer' => [
                        'email' => $user->email,
                        'first_name' => explode(' ', $user->name)[0],
                        'last_name' => count(explode(' ', $user->name)) > 1 ? collect(explode(' ', $user->name))->last() : '',
                        'identification' => [
                            'type' => 'CPF',
                            'number' => preg_replace('/[^0-9]/', '', $user->cpf ?? '00000000000'),
                        ],
                    ],
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['id'])) {
                // Criar transação no banco de dados
                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'external_id' => $data['id'],
                    'type' => 'deposit',
                    'payment_method' => 'pix',
                    'amount' => $amount,
                    'status' => 'pending',
                    'description' => 'Recarga de Créditos via Pix',
                    'qr_code' => $data['point_of_interaction']['transaction_data']['qr_code'],
                    'qr_code_base64' => $data['point_of_interaction']['transaction_data']['qr_code_base64'],
                ]);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => $transaction->id,
                        'external_id' => $transaction->external_id,
                        'qr_code' => $transaction->qr_code,
                        'qr_code_base64' => $transaction->qr_code_base64,
                        'amount' => $transaction->amount,
                        'status' => $transaction->status,
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar o pagamento no Mercado Pago.'
            ], 400);

        } catch (\Exception $e) {
            Log::error('[PaymentController] Erro ao criar pagamento Pix', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar o pagamento. Tente novamente mais tarde.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valida as credenciais do Mercado Pago
     */
    public function validateMercadoPago(Request $request)
    {
        try {
            Log::info('[PaymentController] Validando Mercado Pago', $request->all());

            $publicKey = $request->input('mercadopago_public_key');
            $accessToken = $request->input('mercadopago_access_token');

            if (!$publicKey || !$accessToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chave Pública e Token de Acesso são obrigatórios.'
                ], 422);
            }

            // Aqui seria feita a chamada real para a API do Mercado Pago
            // Por enquanto, vamos simular uma validação básica de formato
            $isValid = str_starts_with($publicKey, 'APP_USR-') || str_starts_with($publicKey, 'TEST-');

            if ($isValid) {
                // Salvar as configurações se forem válidas
                Setting::setValue('mercadopago_public_key', $publicKey, 'string', 'payment', 'Chave Pública do Mercado Pago');
                Setting::setValue('mercadopago_access_token', $accessToken, 'string', 'payment', 'Token de Acesso do Mercado Pago');
                Setting::setValue('mercadopago_environment', $request->input('mercadopago_environment', 'sandbox'), 'string', 'payment', 'Ambiente do Mercado Pago');

                return response()->json([
                    'success' => true,
                    'message' => 'Credenciais validadas e salvas com sucesso!'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'As credenciais informadas parecem inválidas. Verifique os dados e tente novamente.'
            ], 400);

        } catch (\Exception $e) {
            Log::error('[PaymentController] Erro ao validar Mercado Pago', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro interno ao validar credenciais.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
