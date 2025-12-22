# 🔧 Correção CORS em Produção - Requisições OPTIONS

## ❌ Problema

**Erro:** `Access to XMLHttpRequest at 'https://apileilao.verticos.com.br/api/auth/login' from origin 'https://leilao.verticos.com.br' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

**Causa:** As requisições OPTIONS (preflight) não estavam recebendo os headers CORS porque:
1. O middleware CORS estava aplicado apenas em rotas de API
2. Requisições OPTIONS podem não corresponder a rotas específicas
3. O servidor web pode estar interceptando antes do Laravel

---

## ✅ Solução Aplicada

### 1. Middleware CORS Aplicado Globalmente

**Arquivo:** `api/bootstrap/app.php`

```php
->withMiddleware(function (Middleware $middleware) {
    // IMPORTANTE: CORS deve ser o PRIMEIRO middleware
    // Aplicar globalmente para garantir que todas as requisições OPTIONS sejam tratadas
    $middleware->prepend(\App\Http\Middleware\HandleCorsWithErrors::class);
    
    // ... resto da configuração
})
```

**Mudança:**
- ✅ `prepend()` aplica o middleware **ANTES** de qualquer outro middleware
- ✅ Aplicado **globalmente** (não apenas em rotas de API)
- ✅ Captura **TODAS** as requisições OPTIONS, mesmo que não correspondam a rotas

### 2. Rota Catch-All para OPTIONS

**Arquivo:** `api/routes/api.php`

```php
// IMPORTANTE: Rota catch-all para requisições OPTIONS (preflight)
// DEVE ser a primeira rota para capturar todas as requisições OPTIONS
Route::options('/{any}', function (Request $request) {
    // Esta rota será interceptada pelo middleware HandleCorsWithErrors
    // que retornará 204 com headers CORS antes de chegar aqui
    return response('', 204);
})->where('any', '.*')->fallback();
```

**Benefícios:**
- ✅ Captura todas as requisições OPTIONS que não correspondem a rotas específicas
- ✅ Garante que o middleware seja executado

### 3. Middleware HandleCorsWithErrors

**Arquivo:** `api/app/Http/Middleware/HandleCorsWithErrors.php`

O middleware já estava correto, tratando requisições OPTIONS:

```php
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
    
    // ... resto do código
}
```

---

## 🎯 Como Funciona Agora

### Fluxo de Requisição OPTIONS (Preflight):

```
1. Browser envia OPTIONS /api/auth/login
   ↓
2. Servidor Web (Apache/Nginx) recebe
   ↓
3. .htaccess redireciona para index.php (Laravel)
   ↓
4. Laravel Bootstrap carrega
   ↓
5. HandleCorsWithErrors (PRIMEIRO middleware) intercepta
   ↓
6. Detecta método OPTIONS
   ↓
7. Retorna 204 com headers CORS
   ↓
8. Browser recebe headers CORS ✅
   ↓
9. Browser envia requisição real (POST /api/auth/login)
```

### Por que `prepend()` é importante:

- **Antes:** Middleware executado apenas em rotas de API, depois de outros middlewares
- **Depois:** Middleware executado **PRIMEIRO**, **GLOBALMENTE**, capturando todas as requisições

---

## 📋 Configuração do `.env`

Certifique-se de que o `.env` em produção tem:

```env
CORS_ALLOWED_ORIGINS=https://leilao.verticos.com.br
```

**Importante:**
- Use `https://` para produção
- Não use espaços extras
- Se tiver múltiplas origens, separe com vírgula

---

## 🚀 Deploy

### 1. Atualizar Arquivos

Fazer upload dos arquivos:
- `api/bootstrap/app.php` (atualizado)
- `api/routes/api.php` (já atualizado)
- `api/app/Http/Middleware/HandleCorsWithErrors.php` (já existe)

### 2. Verificar `.env`

```bash
cd /var/www/html/LeilaoCash/api
cat .env | grep CORS_ALLOWED_ORIGINS
```

Deve mostrar:
```
CORS_ALLOWED_ORIGINS=https://leilao.verticos.com.br
```

### 3. Limpar Cache

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan optimize:clear
```

### 4. Testar

```bash
# Testar preflight (OPTIONS)
curl -X OPTIONS https://apileilao.verticos.com.br/api/auth/login \
  -H "Origin: https://leilao.verticos.com.br" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Deve retornar:
# HTTP/1.1 204 No Content
# Access-Control-Allow-Origin: https://leilao.verticos.com.br
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
# Access-Control-Allow-Headers: Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN
# Access-Control-Max-Age: 86400
```

---

## ✅ Resultado Esperado

### Antes da Correção:
```
OPTIONS /api/auth/login
→ Servidor web intercepta ou Laravel não trata
→ Sem headers CORS ❌
→ Browser bloqueia requisição
```

### Depois da Correção:
```
OPTIONS /api/auth/login
→ HandleCorsWithErrors (PRIMEIRO middleware) intercepta
→ Retorna 204 com headers CORS ✅
→ Browser permite requisição real
```

---

## 🔍 Verificação

Após o deploy, verificar no console do browser:

1. **Network tab:**
   - Requisição OPTIONS deve retornar 204
   - Headers de resposta devem incluir `Access-Control-Allow-Origin`

2. **Console:**
   - Não deve haver erros de CORS
   - Requisição POST deve ser enviada após OPTIONS

---

## 📝 Arquivos Modificados

- ✅ `api/bootstrap/app.php` - Atualizado: CORS aplicado globalmente com `prepend()`
- ✅ `api/routes/api.php` - Já tinha rota catch-all para OPTIONS
- ✅ `api/app/Http/Middleware/HandleCorsWithErrors.php` - Já estava correto

---

## ⚠️ Notas Importantes

1. **Servidor Web:** Se usar Nginx em produção, certifique-se de que não está interceptando requisições OPTIONS antes do Laravel
2. **Cache:** Sempre limpar cache após atualizar configuração
3. **.env:** Verificar que `CORS_ALLOWED_ORIGINS` está configurado corretamente

---

**Última atualização:** Dezembro 2024

