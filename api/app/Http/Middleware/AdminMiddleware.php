<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Log para debug em produção
        Log::info('[AdminMiddleware] Verificando acesso admin', [
            'has_user' => !!$user,
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'is_admin' => $user?->is_admin,
            'is_admin_type' => gettype($user?->is_admin),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
        ]);
        
        // Verificar se usuário está autenticado
        if (!$user) {
            Log::warning('[AdminMiddleware] Usuário não autenticado');
            return response()->json([
                'success' => false,
                'message' => 'Não autenticado. Token inválido ou ausente.',
                'error' => 'Unauthenticated'
            ], 401);
        }
        
        // Verificar se é admin (aceita 1, true, ou '1')
        $isAdmin = $user->is_admin === 1 
                || $user->is_admin === true 
                || $user->is_admin === '1';
        
        if (!$isAdmin) {
            Log::warning('[AdminMiddleware] Usuário não é admin', [
                'user_id' => $user->id,
                'is_admin' => $user->is_admin,
                'is_admin_type' => gettype($user->is_admin)
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado. Apenas administradores podem acessar este recurso.'
            ], 403);
        }
        
        Log::info('[AdminMiddleware] Acesso admin permitido', [
            'user_id' => $user->id,
            'user_email' => $user->email
        ]);
        
        return $next($request);
    }
}

