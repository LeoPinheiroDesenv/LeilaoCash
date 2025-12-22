<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCorsWithErrors
{
    /**
     * Handle an incoming request.
     * 
     * Garante que headers CORS sejam sempre enviados, mesmo em caso de erro.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Se for requisição OPTIONS (preflight), retornar 204 com CORS
        if ($request->getMethod() === 'OPTIONS') {
            $origin = $this->getAllowedOrigin($request);
            return response('', 204)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN')
                ->header('Access-Control-Max-Age', '86400');
        }
        
        try {
            // Processar requisição
            $response = $next($request);
            
            // Adicionar headers CORS à resposta
            return $this->addCorsHeaders($response, $request);
        } catch (\Throwable $e) {
            // Mesmo em caso de exceção, garantir CORS
            $origin = $this->getAllowedOrigin($request);
            $response = response()->json([
                'success' => false,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
            
            return $this->addCorsHeaders($response, $request);
        }
    }
    
    /**
     * Adicionar headers CORS à resposta
     */
    public static function addCorsHeaders(Response $response, Request $request): Response
    {
        $origin = self::getAllowedOriginStatic($request);
        
        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');
        $response->headers->set('Access-Control-Max-Age', '86400');
        
        return $response;
    }
    
    /**
     * Obter origem permitida (método estático)
     */
    private static function getAllowedOriginStatic(Request $request): string
    {
        $origin = $request->headers->get('Origin');
        
        // Se não há origem na requisição, retornar *
        if (!$origin) {
            return '*';
        }
        
        // Lista de origens permitidas do .env
        $allowedOrigins = array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,https://leilao.verticos.com.br'))));
        
        // Se origem estiver na lista, usar ela
        if (in_array($origin, $allowedOrigins)) {
            return $origin;
        }
        
        // Em desenvolvimento, permitir localhost automaticamente
        if (app()->environment('local', 'development') && (
            str_starts_with($origin, 'http://localhost') ||
            str_starts_with($origin, 'http://127.0.0.1') ||
            str_starts_with($origin, 'http://0.0.0.0')
        )) {
            return $origin;
        }
        
        // Se a origem da requisição parece válida e não está na lista, ainda assim usar ela
        // (útil para desenvolvimento quando .env não está configurado)
        if (filter_var($origin, FILTER_VALIDATE_URL)) {
            // Verificar se é localhost ou domínio conhecido
            $host = parse_url($origin, PHP_URL_HOST);
            if ($host && (
                $host === 'localhost' ||
                $host === '127.0.0.1' ||
                str_ends_with($host, '.localhost') ||
                in_array($host, ['leilao.verticos.com.br', 'apileilao.verticos.com.br'])
            )) {
                return $origin;
            }
        }
        
        // Caso contrário, usar primeira permitida ou a origem da requisição
        return !empty($allowedOrigins) ? $allowedOrigins[0] : $origin;
    }
    
    /**
     * Obter origem permitida
     */
    private function getAllowedOrigin(Request $request): string
    {
        return self::getAllowedOriginStatic($request);
    }
}

