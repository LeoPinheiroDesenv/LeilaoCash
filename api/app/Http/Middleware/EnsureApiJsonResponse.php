<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiJsonResponse
{
    /**
     * Handle an incoming request.
     * 
     * Garante que requisições de API sempre retornem JSON
     * em vez de tentar redirecionar para rotas web.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Forçar que requisições de API sempre esperem JSON
        if ($request->is('api/*')) {
            $request->headers->set('Accept', 'application/json');
        }
        
        return $next($request);
    }
}

