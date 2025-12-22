# 🔧 Correção: Route [login] not defined - VibeGet API

## 🐛 Erro Identificado

```
Route [login] not defined.
Symfony\Component\Routing\Exception\RouteNotFoundException
at /vendor/laravel/framework/src/Illuminate/Routing/UrlGenerator.php:517
```

---

## 📋 Causa Raiz

### Problema

Quando um usuário **não autenticado** ou com **token inválido** tenta acessar uma rota protegida (ex: `/api/settings/public`), o Laravel tenta redirecionar para a rota nomeada `login`.

**Mas:** Em uma **API REST pura** (sem views), não existe uma rota `login` tradicional do Laravel, resultando no erro `Route [login] not defined`.

### Por que acontece?

1. Usuário acessa rota protegida sem token válido
2. Middleware `auth:sanctum` detecta falha de autenticação
3. Laravel lança `AuthenticationException`
4. Por padrão, Laravel tenta redirecionar para `route('login')`
5. ❌ Rota `login` não existe (API REST)
6. ❌ Erro: `Route [login] not defined`

---

## ✅ Solução Implementada

### Arquivo: `api/bootstrap/app.php`

```php
->withExceptions(function (Exceptions $exceptions) {
    // Tratar exceções de autenticação para API
    $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
        // Para requisições API, retornar JSON ao invés de redirecionar
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Não autenticado. Token inválido ou ausente.',
                'error' => 'Unauthenticated'
            ], 401);
        }
        
        // Para outras requisições, comportamento padrão
        return null;
    });
})
```

### O que faz?

1. **Intercepta** `AuthenticationException` antes do Laravel tentar redirecionar
2. **Verifica** se é uma requisição API (`api/*` ou `expectsJson()`)
3. **Retorna JSON** com status `401 Unauthorized`
4. **Não tenta redirecionar** para rota `login`

---

## 📊 Respostas HTTP Antes e Depois

### ❌ Antes (Erro)

**Request:**
```bash
GET https://apileilao.verticos.com.br/api/settings/public
Authorization: Bearer token_invalido
```

**Response:**
```
HTTP/1.1 500 Internal Server Error

{
  "error": "Route [login] not defined."
}
```

---

### ✅ Depois (Correto)

**Request:**
```bash
GET https://apileilao.verticos.com.br/api/settings/public
Authorization: Bearer token_invalido
```

**Response:**
```
HTTP/1.1 401 Unauthorized

{
  "success": false,
  "message": "Não autenticado. Token inválido ou ausente.",
  "error": "Unauthenticated"
}
```

---

## 🧪 Testes

### Teste 1: Sem Token
```bash
curl -X GET https://apileilao.verticos.com.br/api/settings/public

# Resposta esperada:
# HTTP 401
# {
#   "success": false,
#   "message": "Não autenticado. Token inválido ou ausente.",
#   "error": "Unauthenticated"
# }
```

### Teste 2: Token Inválido
```bash
curl -X GET https://apileilao.verticos.com.br/api/settings/public \
  -H "Authorization: Bearer token_invalido_123"

# Resposta esperada:
# HTTP 401
# {
#   "success": false,
#   "message": "Não autenticado. Token inválido ou ausente.",
#   "error": "Unauthenticated"
# }
```

### Teste 3: Token Válido (Usuário Comum)
```bash
curl -X GET https://apileilao.verticos.com.br/api/settings/public \
  -H "Authorization: Bearer {token_usuario_comum}"

# Resposta esperada:
# HTTP 403
# {
#   "success": false,
#   "message": "Acesso negado. Apenas administradores podem acessar este recurso."
# }
```

### Teste 4: Token Válido (Admin)
```bash
curl -X GET https://apileilao.verticos.com.br/api/settings/public \
  -H "Authorization: Bearer {token_admin}"

# Resposta esperada:
# HTTP 200
# {
#   "success": true,
#   "data": { ... configurações ... }
# }
```

---

## 🚀 Deploy para Produção

### 1. Atualizar Código

```bash
# No servidor de produção
cd /home2/a04a8140/public_html/leilao/api

# Pull das últimas mudanças
git pull origin main

# OU fazer upload manual do arquivo:
# api/bootstrap/app.php
```

### 2. Limpar Caches

```bash
cd /home2/a04a8140/public_html/leilao/api

# Limpar todos os caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# Otimizar para produção
php artisan config:cache
php artisan route:cache
```

### 3. Verificar Permissões

```bash
# Garantir permissões corretas
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 4. Testar

```bash
# Testar endpoint
curl -X GET https://apileilao.verticos.com.br/api/settings/public

# Deve retornar 401 JSON (não mais 500)
```

---

## 📝 Alterações em Outros Arquivos

### ✅ AdminMiddleware (Já Correto)

**Arquivo:** `api/app/Http/Middleware/AdminMiddleware.php`

```php
public function handle(Request $request, Closure $next): Response
{
    if (!$request->user() || !$request->user()->is_admin) {
        return response()->json([
            'success' => false,
            'message' => 'Acesso negado. Apenas administradores podem acessar este recurso.'
        ], 403);
    }

    return $next($request);
}
```

✅ Já retorna JSON corretamente (403 Forbidden)

---

### ✅ Configuração de Autenticação (Já Correta)

**Arquivo:** `api/config/auth.php`

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

✅ Guard `api` usa Sanctum corretamente

---

## 🔍 Como Funciona Agora?

### Fluxo de Requisição Protegida

```
1. Cliente → GET /api/settings/public (sem token)
   ↓
2. Middleware auth:sanctum
   ↓
3. Token ausente/inválido
   ↓
4. Lança AuthenticationException
   ↓
5. Exception Handler (bootstrap/app.php)
   ↓
6. Verifica: request->is('api/*') ? ✅
   ↓
7. Retorna JSON 401
   ↓
8. Cliente ← { "success": false, "message": "Não autenticado..." }
```

### Antes da Correção

```
1. Cliente → GET /api/settings/public (sem token)
   ↓
2. Middleware auth:sanctum
   ↓
3. Token ausente/inválido
   ↓
4. Lança AuthenticationException
   ↓
5. Laravel tenta: redirect()->route('login')
   ↓
6. ❌ Rota 'login' não existe
   ↓
7. ❌ Route [login] not defined
   ↓
8. Cliente ← HTTP 500 (erro interno)
```

---

## 📚 Conceitos Importantes

### AuthenticationException

Exceção lançada quando a autenticação falha. Por padrão, o Laravel tenta redirecionar para a página de login.

### API REST Stateless

- ✅ Usa tokens (Bearer) no header `Authorization`
- ✅ Não usa sessões ou cookies
- ✅ Não tem páginas de login (HTML)
- ✅ Retorna JSON para todas as respostas
- ❌ Não deve fazer redirecionamentos

### Exception Handler

Permite customizar como exceções são tratadas e renderizadas.

```php
$exceptions->render(function (ExceptionClass $e, $request) {
    // Lógica customizada
    return response()->json([...], status);
});
```

---

## 🐛 Troubleshooting

### Problema: Ainda retorna 500

**Solução:**
```bash
# Limpar caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# Verificar se o arquivo foi atualizado
cat api/bootstrap/app.php | grep "AuthenticationException"
```

---

### Problema: Retorna HTML ao invés de JSON

**Solução:**
```bash
# Verificar header Accept
curl -X GET https://api.vibeget.com/api/settings/public \
  -H "Accept: application/json"

# Garantir que rotas estão sob prefixo 'api'
# Verificar: routes/api.php
```

---

### Problema: Erro persiste após atualização

**Solução:**
```bash
# 1. Limpar opcache do PHP
php artisan cache:clear

# 2. Reiniciar PHP-FPM (se aplicável)
sudo systemctl restart php8.2-fpm

# 3. Reiniciar Apache/Nginx
sudo systemctl restart apache2
# OU
sudo systemctl restart nginx
```

---

## ✅ Checklist de Deploy

- [x] Atualizar `api/bootstrap/app.php`
- [ ] Fazer upload/push para produção
- [ ] Executar `php artisan config:clear`
- [ ] Executar `php artisan route:clear`
- [ ] Executar `php artisan cache:clear`
- [ ] Executar `php artisan config:cache`
- [ ] Verificar permissões dos diretórios
- [ ] Testar endpoint: `curl /api/settings/public`
- [ ] Verificar logs: `tail -f storage/logs/laravel.log`
- [ ] Confirmar JSON 401 (não mais 500)

---

## 📊 Comparação de Respostas

| Situação | Status | Resposta |
|----------|--------|----------|
| **Sem Token** | 401 | `{"success": false, "message": "Não autenticado..."}` |
| **Token Inválido** | 401 | `{"success": false, "message": "Não autenticado..."}` |
| **Token Expirado** | 401 | `{"success": false, "message": "Não autenticado..."}` |
| **Usuário Comum** | 403 | `{"success": false, "message": "Acesso negado..."}` |
| **Admin Válido** | 200 | `{"success": true, "data": {...}}` |

---

## 📖 Referências

- [Laravel Exception Handling](https://laravel.com/docs/11.x/errors)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [RESTful API Design](https://restfulapi.net/)

---

## 🎉 Resumo

**Problema:** API retornava erro 500 "Route [login] not defined"  
**Causa:** Laravel tentava redirecionar para rota inexistente  
**Solução:** Exception handler customizado retorna JSON 401  
**Resultado:** API REST totalmente funcional e consistente  

---

**Desenvolvido com ❤️ para VibeGet**  
**Data:** Dezembro 2024  
**Versão:** 1.0 (API REST Error Handling)

