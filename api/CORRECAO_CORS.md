# 🔧 Correção: Erro CORS - No 'Access-Control-Allow-Origin' header

## ❌ Problema

**Erro:** `Access to XMLHttpRequest at 'https://apileilao.verticos.com.br/api/auth/login' from origin 'https://leilao.verticos.com.br' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

**Causa:** Os headers CORS não estavam sendo enviados quando ocorriam erros (como 500), ou a configuração de CORS não estava funcionando corretamente.

---

## ✅ Solução Aplicada

### 1. Middleware `HandleCorsWithErrors.php` - NOVO

Criado middleware personalizado que garante que headers CORS sejam sempre enviados, mesmo em caso de erro:

```php
class HandleCorsWithErrors
{
    public function handle(Request $request, Closure $next): Response
    {
        // Se for OPTIONS (preflight), retornar 204 com CORS
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 204)->withCorsHeaders(...);
        }
        
        try {
            $response = $next($request);
            return $this->addCorsHeaders($response, $request);
        } catch (\Throwable $e) {
            // Mesmo em caso de exceção, garantir CORS
            $response = response()->json([...], 500);
            return $this->addCorsHeaders($response, $request);
        }
    }
    
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
}
```

**Benefícios:**
- ✅ Headers CORS sempre enviados, mesmo em caso de erro
- ✅ Tratamento de requisições OPTIONS (preflight)
- ✅ Método estático para adicionar CORS em exceções
- ✅ Suporte a múltiplas origens via `.env`

### 2. `config/cors.php` - Atualizado

```php
'paths' => ['api/*', 'sanctum/csrf-cookie', '*'],  // ← Adicionado '*'

'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,https://leilao.verticos.com.br')))),  // ← Melhorado parsing
```

**Melhorias:**
- ✅ Adicionado `'*'` aos paths para garantir CORS em todas as rotas
- ✅ Melhor parsing de origens permitidas (remove espaços, valores vazios)

### 3. `bootstrap/app.php` - Atualizado

#### Substituído middleware CORS padrão:
```php
$middleware->api(prepend: [
    \App\Http\Middleware\HandleCorsWithErrors::class,  // ← Substituído
    \App\Http\Middleware\EnsureApiJsonResponse::class,
]);
```

#### Adicionado CORS em tratamento de exceções:
```php
$exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
    if ($request->is('api/*') || $request->expectsJson() || $request->wantsJson()) {
        $response = response()->json([...], 401);
        return \App\Http\Middleware\HandleCorsWithErrors::addCorsHeaders($response, $request);  // ← Adicionado
    }
    return null;
});
```

---

## 🎯 Como Funciona Agora

### Fluxo de Requisição:

1. **Requisição chega:**
   - Middleware `HandleCorsWithErrors` processa
   - Se OPTIONS (preflight), retorna 204 com CORS imediatamente

2. **Requisição normal:**
   - Processa normalmente
   - Adiciona headers CORS à resposta
   - Retorna resposta com CORS

3. **Se houver erro:**
   - Captura exceção
   - Cria resposta de erro
   - Adiciona headers CORS
   - Retorna erro com CORS

4. **Tratamento de exceções:**
   - Todas as exceções de API adicionam CORS
   - Garante que frontend sempre recebe headers CORS

---

## 📋 Configuração do `.env`

Certifique-se de que o `.env` tem:

```env
CORS_ALLOWED_ORIGINS=https://leilao.verticos.com.br,http://localhost:3000
```

**Importante:**
- Separe múltiplas origens com vírgula
- Não use espaços extras
- Use `https://` para produção

---

## 🚀 Deploy

### 1. Atualizar Arquivos

Fazer upload dos arquivos:
- `api/app/Http/Middleware/HandleCorsWithErrors.php` (NOVO)
- `api/config/cors.php`
- `api/bootstrap/app.php`

### 2. Verificar `.env`

Certifique-se de que tem:
```env
CORS_ALLOWED_ORIGINS=https://leilao.verticos.com.br
```

### 3. Limpar Cache

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 4. Testar

```bash
# Testar preflight (OPTIONS)
curl -X OPTIONS https://apileilao.verticos.com.br/api/auth/login \
  -H "Origin: https://leilao.verticos.com.br" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Deve retornar 204 com headers CORS

# Testar requisição real
curl -X POST https://apileilao.verticos.com.br/api/auth/login \
  -H "Origin: https://leilao.verticos.com.br" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"senha"}' \
  -v

# Deve retornar resposta com headers CORS
```

---

## ✅ Resultado Esperado

### Antes da Correção:
```
POST /api/auth/login
→ 500 Internal Server Error
→ Sem headers CORS ❌
→ Browser bloqueia requisição
```

### Depois da Correção:
```
POST /api/auth/login
→ 200 OK ou 500 Internal Server Error
→ Com headers CORS ✅
→ Browser permite requisição
```

**Headers CORS enviados:**
```
Access-Control-Allow-Origin: https://leilao.verticos.com.br
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN
Access-Control-Expose-Headers: Authorization
Access-Control-Max-Age: 86400
```

---

## 📝 Arquivos Modificados/Criados

- ✅ `api/app/Http/Middleware/HandleCorsWithErrors.php` - NOVO: Middleware CORS robusto
- ✅ `api/config/cors.php` - Atualizado: Melhor parsing de origens
- ✅ `api/bootstrap/app.php` - Atualizado: Usa novo middleware e adiciona CORS em exceções

---

## 🔍 Verificação

Após o deploy, verificar headers CORS:

```bash
# Verificar se headers CORS estão sendo enviados
curl -I -X OPTIONS https://apileilao.verticos.com.br/api/auth/login \
  -H "Origin: https://leilao.verticos.com.br" \
  -H "Access-Control-Request-Method: POST"

# Deve mostrar:
# Access-Control-Allow-Origin: https://leilao.verticos.com.br
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

---

**Última atualização:** Dezembro 2024

