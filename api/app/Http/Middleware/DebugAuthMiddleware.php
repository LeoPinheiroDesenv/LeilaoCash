<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class DebugAuthMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log detalhado da requisição
        $authHeader = $request->header('Authorization');
        $token = null;
        
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        
        Log::info('[DebugAuthMiddleware] Requisição recebida', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'has_auth_header' => !!$authHeader,
            'auth_header' => $authHeader ? substr($authHeader, 0, 30) . '...' : null,
            'has_token' => !!$token,
            'token_length' => $token ? strlen($token) : 0,
            'token_prefix' => $token ? substr($token, 0, 20) . '...' : null,
        ]);
        
        // Tentar validar o token manualmente
        if ($token) {
            try {
                $accessToken = PersonalAccessToken::findToken($token);
                
                Log::info('[DebugAuthMiddleware] Token encontrado na base', [
                    'token_exists' => !!$accessToken,
                    'token_id' => $accessToken?->id,
                    'token_name' => $accessToken?->name,
                    'token_abilities' => $accessToken?->abilities,
                    'token_last_used_at' => $accessToken?->last_used_at,
                    'token_created_at' => $accessToken?->created_at,
                    'token_expires_at' => $accessToken?->expires_at,
                ]);
                
                if ($accessToken) {
                    $user = $accessToken->tokenable;
                    Log::info('[DebugAuthMiddleware] Usuário do token', [
                        'user_id' => $user?->id,
                        'user_email' => $user?->email,
                        'user_is_admin' => $user?->is_admin,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('[DebugAuthMiddleware] Erro ao validar token', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
        
        // Verificar usuário autenticado ANTES do auth:sanctum
        $userBefore = $request->user();
        Log::info('[DebugAuthMiddleware] Usuário ANTES do auth:sanctum', [
            'has_user' => !!$userBefore,
            'user_id' => $userBefore?->id,
        ]);
        
        // Continuar para o próximo middleware (auth:sanctum)
        $response = $next($request);
        
        // Verificar usuário autenticado DEPOIS do auth:sanctum
        $userAfter = $request->user();
        Log::info('[DebugAuthMiddleware] Usuário DEPOIS do auth:sanctum', [
            'has_user' => !!$userAfter,
            'user_id' => $userAfter?->id,
            'user_email' => $userAfter?->email,
            'user_is_admin' => $userAfter?->is_admin,
            'response_status' => $response->getStatusCode(),
        ]);
        
        return $response;
    }
}

