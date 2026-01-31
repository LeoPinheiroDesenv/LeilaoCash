<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Dotenv\Dotenv;


// Carregar variáveis de ambiente personalizadas antes da configuração da aplicação
$envFile = '.env';

// Detecção de ambiente mais robusta
$isLocal = php_sapi_name() === 'cli-server' ||
           (isset($_SERVER['SERVER_NAME']) && strpos($_SERVER['SERVER_NAME'], 'localhost') !== false) ||
           (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], '172.18.0.5') !== false);

$isProduction = (isset($_SERVER['SERVER_NAME']) && strpos($_SERVER['SERVER_NAME'], 'vibeget.net') !== false) ||
                (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'vibeget.net') !== false);

if (file_exists(__DIR__.'/../.env.local') && $isLocal) {
    $envFile = '.env.local';
} elseif (file_exists(__DIR__.'/../.env.producao') && $isProduction) {
    $envFile = '.env.producao';
}

// Carregar o arquivo de ambiente detectado
if (file_exists(__DIR__.'/../'.$envFile)) {
    $dotenv = Dotenv::createImmutable(__DIR__.'/../', $envFile);
    $dotenv->load();
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Removido EnsureFrontendRequestsAreStateful para API stateless
        // Usamos apenas tokens Bearer no header Authorization

        // IMPORTANTE: CORS deve ser o PRIMEIRO middleware para capturar OPTIONS
        // Aplicar globalmente para garantir que todas as requisições OPTIONS sejam tratadas
        $middleware->prepend(\App\Http\Middleware\HandleCorsWithErrors::class);

        // Habilitar CORS e garantir JSON para API
        $middleware->api(prepend: [
            \App\Http\Middleware\EnsureApiJsonResponse::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'debug.auth' => \App\Http\Middleware\DebugAuthMiddleware::class,
        ]);

        // Excluir rotas de API da verificação CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Tratar exceções de autenticação para API
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            // Para requisições API, SEMPRE retornar JSON ao invés de redirecionar
            if ($request->is('api/*') || $request->expectsJson() || $request->wantsJson()) {
                $response = response()->json([
                    'success' => false,
                    'message' => 'Não autenticado. Token inválido ou ausente.',
                    'error' => 'Unauthenticated'
                ], 401);

                // Adicionar headers CORS mesmo em caso de erro
                return \App\Http\Middleware\HandleCorsWithErrors::addCorsHeaders($response, $request);
            }

            // Para outras requisições, comportamento padrão
            return null;
        });

        // Tratar exceções de rota não encontrada
        $exceptions->render(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, $request) {
            // Se for tentativa de redirecionar para rota 'login' em API, retornar JSON
            if ($request->is('api/*') || $request->expectsJson() || $request->wantsJson()) {
                $response = response()->json([
                    'success' => false,
                    'message' => 'Não autenticado. Token inválido ou ausente.',
                    'error' => 'Unauthenticated'
                ], 401);

                // Adicionar headers CORS mesmo em caso de erro
                return \App\Http\Middleware\HandleCorsWithErrors::addCorsHeaders($response, $request);
            }

            return null;
        });

    })->create();
