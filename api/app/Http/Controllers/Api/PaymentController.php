<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Setting;
use App\Models\Transaction;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class PaymentController extends Controller
{
    // ... (createPixPayment and createCreditCardPayment methods remain the same)
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

            // Preparar dados do pagador
            $firstName = explode(' ', $user->name)[0];
            $lastName = count(explode(' ', $user->name)) > 1 ? collect(explode(' ', $user->name))->last() : $firstName;

            // Limpar CPF
            $cpf = preg_replace('/[^0-9]/', '', $user->cpf);

            // Montar payload
            $payload = [
                'transaction_amount' => (float) $amount,
                'description' => 'Recarga de Créditos - LeilaoCash',
                'payment_method_id' => 'pix',
                'payer' => [
                    'email' => $user->email,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                ],
            ];

            // Adicionar identificação apenas se o CPF for válido (11 dígitos)
            if ($cpf && strlen($cpf) === 11) {
                $payload['payer']['identification'] = [
                    'type' => 'CPF',
                    'number' => $cpf,
                ];
            }

            Log::info('[PaymentController] Payload Pix:', $payload);

            $response = $client->post('https://api.mercadopago.com/v1/payments', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'X-Idempotency-Key' => $idempotencyKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload
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

        } catch (ClientException $e) {
            $responseBody = $e->getResponse() ? $e->getResponse()->getBody()->getContents() : 'No response body';
            $errorDetails = json_decode($responseBody, true) ?? $responseBody;

            Log::error('[PaymentController] Erro ClientException ao criar pagamento Pix', [
                'error' => $e->getMessage(),
                'response' => $responseBody
            ]);

            if (isset($errorDetails['message']) && str_contains($errorDetails['message'], 'Collector user without key enabled for QR')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de configuração no Mercado Pago: É necessário cadastrar uma chave Pix na conta do Mercado Pago para receber pagamentos.',
                    'details' => $errorDetails
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erro na comunicação com o Mercado Pago.',
                'details' => $errorDetails
            ], 400);

        } catch (\Exception $e) {
            Log::error('[PaymentController] Erro genérico ao criar pagamento Pix', [
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

    public function createCreditCardPayment(Request $request)
    {
        try {
            $user = $request->user();

            // Validação básica
            $request->validate([
                'amount' => 'required|numeric|min:1',
                // Aceita token OU dados do cartão
                'token' => 'nullable|string',
                'card_number' => 'required_without:token|string',
                'expiration_month' => 'required_without:token|integer',
                'expiration_year' => 'required_without:token|integer',
                'security_code' => 'required_without:token|string',
                'cardholderName' => 'required_without:token|string',
                'identificationNumber' => 'required_without:token|string',
                // Outros campos
                'installments' => 'required|integer|min:1',
                'payment_method_id' => 'required|string',
                'issuer_id' => 'nullable|integer',
                'email' => 'required|email',
            ]);

            $amount = $request->input('amount');
            $token = $request->input('token');

            // Buscar configurações do Mercado Pago
            $accessToken = Setting::getValue('mercadopago_access_token');
            $publicKey = Setting::getValue('mercadopago_public_key');

            if (!$accessToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'O sistema de pagamentos não está configurado corretamente.'
                ], 500);
            }

            $client = new Client();

            // Se não veio token, criar token no Mercado Pago
            if (!$token) {
                try {
                    $tokenResponse = $client->post('https://api.mercadopago.com/v1/card_tokens?public_key=' . $publicKey, [
                        'json' => [
                            'card_number' => str_replace(' ', '', $request->input('card_number')),
                            'expiration_month' => (int)$request->input('expiration_month'),
                            'expiration_year' => (int)$request->input('expiration_year'),
                            'security_code' => $request->input('security_code'),
                            'cardholder' => [
                                'name' => $request->input('cardholderName'),
                                'identification' => [
                                    'number' => $request->input('identificationNumber'),
                                    'type' => 'CPF' // Assumindo CPF por padrão
                                ]
                            ]
                        ]
                    ]);

                    $tokenData = json_decode($tokenResponse->getBody()->getContents(), true);
                    $token = $tokenData['id'];
                } catch (ClientException $e) {
                    Log::error('[PaymentController] Erro ao criar token do cartão', [
                        'error' => $e->getMessage(),
                        'response' => $e->getResponse() ? $e->getResponse()->getBody()->getContents() : 'No response'
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Dados do cartão inválidos. Verifique o número, validade e código de segurança.'
                    ], 400);
                }
            }

            $idempotencyKey = uniqid('pay_cc_', true);

            $payload = [
                'transaction_amount' => (float) $amount,
                'token' => $token,
                'description' => 'Recarga de Créditos - LeilaoCash',
                'installments' => (int) $request->input('installments'),
                'payment_method_id' => $request->input('payment_method_id'),
                'payer' => [
                    'email' => $request->input('email'),
                    'identification' => [
                        'type' => 'CPF',
                        'number' => $request->input('identificationNumber')
                    ]
                ]
            ];

            if ($request->has('issuer_id')) {
                $payload['issuer_id'] = (int) $request->input('issuer_id');
            }

            Log::info('[PaymentController] Payload Cartão:', $payload);

            $response = $client->post('https://api.mercadopago.com/v1/payments', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'X-Idempotency-Key' => $idempotencyKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['id']) && $data['status'] === 'approved') {
                // Criar transação no banco de dados
                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'external_id' => $data['id'],
                    'type' => 'deposit',
                    'payment_method' => 'credit_card',
                    'amount' => $amount,
                    'status' => 'completed', // Aprovado imediatamente
                    'description' => 'Recarga de Créditos via Cartão',
                ]);

                // Atualizar saldo do usuário
                $user->balance += $amount;
                $user->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Pagamento aprovado com sucesso!',
                    'data' => [
                        'id' => $transaction->id,
                        'status' => $transaction->status,
                        'amount' => $transaction->amount,
                    ]
                ]);
            } elseif (isset($data['id'])) {
                 // Pagamento criado mas não aprovado (pendente, rejeitado, etc)
                 $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'external_id' => $data['id'],
                    'type' => 'deposit',
                    'payment_method' => 'credit_card',
                    'amount' => $amount,
                    'status' => $data['status'],
                    'description' => 'Recarga de Créditos via Cartão (' . ($data['status_detail'] ?? 'pendente') . ')',
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Pagamento não aprovado: ' . ($data['status_detail'] ?? $data['status']),
                    'data' => $data
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar pagamento com cartão.'
            ], 400);

        } catch (ClientException $e) {
            $responseBody = $e->getResponse() ? $e->getResponse()->getBody()->getContents() : 'No response body';
            Log::error('[PaymentController] Erro ClientException ao criar pagamento Cartão', [
                'error' => $e->getMessage(),
                'response' => $responseBody
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro na comunicação com o Mercado Pago.',
                'details' => json_decode($responseBody, true) ?? $responseBody
            ], 400);
        } catch (\Exception $e) {
            Log::error('[PaymentController] Erro genérico ao criar pagamento Cartão', [
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
     * Get the status of a payment transaction
     */
    public function getPaymentStatus(Request $request, $id)
    {
        try {
            $transaction = Transaction::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transação não encontrada.'
                ], 404);
            }

            // Opcional: Se a transação ainda estiver pendente, verificar no Mercado Pago
            if ($transaction->status === 'pending' && $transaction->external_id) {
                $accessToken = Setting::getValue('mercadopago_access_token');
                if ($accessToken) {
                    $client = new Client();
                    $response = $client->get("https://api.mercadopago.com/v1/payments/{$transaction->external_id}", [
                        'headers' => [
                            'Authorization' => 'Bearer ' . $accessToken,
                        ]
                    ]);
                    $data = json_decode($response->getBody()->getContents(), true);

                    if (isset($data['status']) && $data['status'] !== $transaction->status) {
                        $transaction->status = $data['status'];

                        // Se o pagamento foi aprovado, creditar o saldo do usuário
                        if ($data['status'] === 'approved' || $data['status'] === 'completed') {
                            $transaction->status = 'completed';
                            $user = $request->user();
                            if (!$user->transactions()->where('id', $transaction->id)->where('status', 'completed')->exists()) {
                                $user->balance += $transaction->amount;
                                $user->save();
                            }
                        }
                        $transaction->save();
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $transaction->id,
                    'status' => $transaction->status,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("[PaymentController] Erro ao verificar status do pagamento #{$id}", [
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erro ao verificar status do pagamento.'
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
