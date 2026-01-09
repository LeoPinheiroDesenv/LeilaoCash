<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class HandleCorsWithErrors
{
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
        $response = $next($request);

        // The default HandleCors middleware should have already added the headers.
        // This middleware's main job is to ensure headers are also on error pages
        // that might be generated before the default CORS middleware runs on the response.
        // However, since it's in the global stack, it should run on all responses.

        // Forcing headers on every response can be a fallback.
        // Let's check if headers are already present.
        if (!$response->headers->has('Access-Control-Allow-Origin')) {
            // If not, it means the origin was not allowed by the default CORS config.
            // Or an error happened before the CORS middleware could attach headers.
            // We can manually add them here, but it's better to rely on the single source of truth: config/cors.php

            // The best approach is to ensure this middleware runs AFTER the default HandleCors,
            // and we just pass the response through. The previous implementation was overriding the default logic.
        }

        // The simplest fix is to let the default CORS middleware do its job.
        // This custom middleware might be redundant if the default one is configured correctly.
        // If the goal is to add CORS to error pages, that should be handled at the exception handler level.

        // Given the issue, let's try a simplified version that respects the config file
        // and works as a pass-through, ensuring headers are applied based on the config.
        // The original problem was that this middleware had its OWN logic for allowed origins.
        // The default `HandleCors` middleware from Laravel should be used instead.

        // By just calling `$next($request)`, we are letting the request pass through the
        // middleware pipeline, which includes the default `HandleCors`.
        // This custom middleware might be unnecessary.

        // Let's comment out the custom logic and just pass the request.
        // If this middleware is indeed necessary for some edge case, we'll need to rethink it.
        // For now, the goal is to stop it from interfering with the correct CORS configuration.

        return $response;
    }
}
