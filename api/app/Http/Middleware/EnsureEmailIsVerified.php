<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || 
            (! $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail ||
            $request->user()->hasVerifiedEmail())) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Seu email precisa ser verificado.'
        ], 403);
    }
}

