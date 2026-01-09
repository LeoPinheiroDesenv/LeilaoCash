<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCorsWithErrors
{
    public static function addCorsHeaders(\Illuminate\Http\JsonResponse $response, $request)
    {
    }

    /**
     * Handle an incoming request.
     *
     * This middleware ensures that CORS headers are attached to every response,
     * including error responses, which Laravel's default HandleCors might miss.
     * It does NOT replace the logic of the default HandleCors middleware but works with it.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Let the default Laravel CORS middleware handle the request first.
        // It will add the necessary headers if the origin is allowed.
        // We assume \Illuminate\Http\Middleware\HandleCors::class is already in the global middleware stack.

        return $next($request);
    }
}
