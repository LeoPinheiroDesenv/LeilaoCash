<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Setting;

class PaymentController extends Controller
{
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
