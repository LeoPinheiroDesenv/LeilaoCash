# 🔧 Correção: Route [login] not defined

## ❌ Problema

**Erro:** `Route [login] not defined` quando o middleware `auth:sanctum` falha na autenticação.

**Causa:** O Laravel estava tentando redirecionar para a rota `login` quando a autenticação falhava, mas essa rota não existe porque é uma API stateless que não usa rotas web de login.

**Stack Trace:**
```
Symfony\Component\Routing\Exception\RouteNotFoundException: Route [login] not defined
at Illuminate\Routing\UrlGenerator->route('login', Array, true)
at Illuminate\Auth\Middleware\Authenticate->redirectTo()
```

---

## ✅ Solução Aplicada

### 1. Middleware `EnsureApiJsonResponse.php` - NOVO

Criado middleware para garantir que requisições de API sempre retornem JSON:

```php
class EnsureApiJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        // Forçar que requisições de API sempre esperem JSON
        if ($request->is('api/*')) {
            $request->headers->set('Accept', 'application/json');
        }
        
        return $next($request);
    }
}
```

**Benefícios:**
- ✅ Força `Accept: application/json` em todas as requisições de API
- ✅ Impede que o Laravel tente redirecionar para rotas web
- ✅ Garante que exceções de autenticação retornem JSON

### 2. `bootstrap/app.php` - Atualizado

#### Adicionado middleware `EnsureApiJsonResponse`:
```php
$middleware->api(prepend: [
    \Illuminate\Http\Middleware\HandleCors::class,
    \App\Http\Middleware\EnsureApiJsonResponse::class,  // ← Adicionado
]);
```

#### Melhorado tratamento de exceções:
```php
->withExceptions(function (Exceptions $exceptions) {
    // Tratar exceções de autenticação para API
    $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
        // Para requisições API, SEMPRE retornar JSON
        if ($request->is('api/*') || $request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Não autenticado. Token inválido ou ausente.',
                'error' => 'Unauthenticated'
            ], 401);
        }
        return null;
    });
    
    // Tratar exceções de rota não encontrada (RouteNotFoundException)
    $exceptions->render(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, $request) {
        // Se for tentativa de redirecionar para rota 'login' em API, retornar JSON
        if ($request->is('api/*') || $request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Não autenticado. Token inválido ou ausente.',
                'error' => 'Unauthenticated'
            ], 401);
        }
        return null;
    });
})
```

---

## 🎯 Como Funciona Agora

### Fluxo de Autenticação:

1. **Requisição chega em `/api/auth/me`**
   - Middleware `EnsureApiJsonResponse` força `Accept: application/json`
   - Middleware `DebugAuthMiddleware` loga detalhes
   - Middleware `auth:sanctum` valida token

2. **Se token inválido:**
   - `auth:sanctum` lança `AuthenticationException`
   - Como `Accept: application/json` está definido, não tenta redirecionar
   - Tratamento de exceções retorna JSON 401

3. **Se tentar redirecionar (RouteNotFoundException):**
   - Tratamento de exceções captura e retorna JSON 401
   - Nunca tenta acessar rota `login` que não existe

---

## 📋 Estrutura de Middlewares

```
Requisição → EnsureApiJsonResponse (força JSON)
           → HandleCors (CORS)
           → DebugAuthMiddleware (logs)
           → auth:sanctum (valida token)
           → Controller
```

---

## 🚀 Deploy

### 1. Atualizar Arquivos

Fazer upload dos arquivos:
- `api/app/Http/Middleware/EnsureApiJsonResponse.php` (NOVO)
- `api/bootstrap/app.php`

### 2. Limpar Cache

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 3. Testar

1. **Fazer login:**
   ```bash
   curl -X POST https://apileilao.verticos.com.br/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@vibeget.com","password":"senha"}'
   ```

2. **Testar com token válido:**
   ```bash
   curl https://apileilao.verticos.com.br/api/auth/me \
     -H "Authorization: Bearer SEU_TOKEN"
   ```
   ✅ Deve retornar dados do usuário

3. **Testar com token inválido:**
   ```bash
   curl https://apileilao.verticos.com.br/api/auth/me \
     -H "Authorization: Bearer token_invalido"
   ```
   ✅ Deve retornar JSON 401 (não erro de rota)

---

## ✅ Resultado Esperado

### Antes da Correção:
```
GET /api/auth/me (token inválido)
→ RouteNotFoundException: Route [login] not defined ❌
→ Erro 500
```

### Depois da Correção:
```
GET /api/auth/me (token inválido)
→ JSON 401: {"success": false, "message": "Não autenticado..."} ✅
→ Sem tentativa de redirecionamento
```

---

## 📝 Arquivos Modificados/Criados

- ✅ `api/app/Http/Middleware/EnsureApiJsonResponse.php` - NOVO: Middleware para forçar JSON
- ✅ `api/bootstrap/app.php` - Atualizado: Adicionado middleware e melhorado tratamento de exceções

---

## 🔍 Verificação

Após o deploy, verificar logs:

```bash
tail -f storage/logs/laravel.log | grep -E "DebugAuthMiddleware|AuthenticationException|RouteNotFoundException"
```

**O que deve aparecer:**
- ✅ Logs do `DebugAuthMiddleware` mostrando token
- ✅ Se token inválido: JSON 401 (não RouteNotFoundException)
- ✅ Se token válido: Dados do usuário

---

**Última atualização:** Dezembro 2024

