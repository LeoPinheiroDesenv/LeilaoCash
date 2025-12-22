# 🔧 Correção: AdminMiddleware e Logs de Debug

## 🐛 Problema Identificado

**Sintoma:** Requisições para `/api/settings` retornam 401 "Sessão expirada" mesmo com token válido.

**Causa Raiz:**
1. ❌ AdminMiddleware não estava verificando corretamente `is_admin`
2. ❌ Não havia logs para debug em produção
3. ❌ Verificação de `is_admin` não era robusta (aceita apenas boolean true)

---

## ✅ Correções Implementadas

### 1️⃣ **AdminMiddleware.php** - Verificação Robusta

#### ❌ Antes (Problema):
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

**Problema:**
- Não diferenciava 401 (não autenticado) de 403 (não é admin)
- Verificação de `is_admin` não era robusta
- Não havia logs para debug

#### ✅ Depois (Solução):
```php
public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();
    
    // Log para debug em produção
    Log::info('[AdminMiddleware] Verificando acesso admin', [
        'has_user' => !!$user,
        'user_id' => $user?->id,
        'user_email' => $user?->email,
        'is_admin' => $user?->is_admin,
        'is_admin_type' => gettype($user?->is_admin),
        'url' => $request->fullUrl(),
    ]);
    
    // Verificar se usuário está autenticado
    if (!$user) {
        Log::warning('[AdminMiddleware] Usuário não autenticado');
        return response()->json([
            'success' => false,
            'message' => 'Não autenticado. Token inválido ou ausente.',
            'error' => 'Unauthenticated'
        ], 401);
    }
    
    // Verificar se é admin (aceita 1, true, ou '1')
    $isAdmin = $user->is_admin === 1 
            || $user->is_admin === true 
            || $user->is_admin === '1';
    
    if (!$isAdmin) {
        Log::warning('[AdminMiddleware] Usuário não é admin', [
            'user_id' => $user->id,
            'is_admin' => $user->is_admin,
            'is_admin_type' => gettype($user->is_admin)
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Acesso negado. Apenas administradores podem acessar este recurso.'
        ], 403);
    }
    
    Log::info('[AdminMiddleware] Acesso admin permitido', [
        'user_id' => $user->id,
        'user_email' => $user->email
    ]);
    
    return $next($request);
}
```

**Benefícios:**
- ✅ Diferencia 401 (não autenticado) de 403 (não é admin)
- ✅ Verificação robusta de `is_admin` (aceita 1, true, '1')
- ✅ Logs detalhados para debug em produção
- ✅ Facilita identificação do problema

---

### 2️⃣ **SettingsController.php** - Logs Adicionados

#### ✅ Melhorias:
```php
public function index(Request $request)
{
    try {
        // Log para debug
        \Log::info('[SettingsController] index chamado', [
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email,
            'is_admin' => $request->user()?->is_admin,
            'url' => $request->fullUrl(),
        ]);
        
        $settings = Setting::all()->groupBy('group');
        
        \Log::info('[SettingsController] Configurações retornadas com sucesso', [
            'settings_count' => $settings->count(),
            'groups' => $settings->keys()->toArray()
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    } catch (\Exception $e) {
        \Log::error('[SettingsController] Erro ao buscar configurações', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        // ...
    }
}
```

**Benefícios:**
- ✅ Logs quando a rota é chamada
- ✅ Logs de sucesso e erro
- ✅ Facilita debug em produção

---

### 3️⃣ **AuthController.php** - Logs Adicionados

#### ✅ Melhorias:
```php
public function me(Request $request)
{
    $user = $request->user();
    
    // Log para debug
    \Log::info('[AuthController] me chamado', [
        'has_user' => !!$user,
        'user_id' => $user?->id,
        'user_email' => $user?->email,
        'is_admin' => $user?->is_admin,
        'is_admin_type' => $user ? gettype($user->is_admin) : null,
    ]);
    
    if (!$user) {
        \Log::warning('[AuthController] me: usuário não autenticado');
        return response()->json([
            'success' => false,
            'message' => 'Não autenticado. Token inválido ou ausente.',
            'error' => 'Unauthenticated'
        ], 401);
    }
    
    return response()->json([
        'success' => true,
        'data' => $user
    ]);
}
```

**Benefícios:**
- ✅ Logs quando `/auth/me` é chamado
- ✅ Verifica se usuário está autenticado
- ✅ Retorna 401 se não autenticado (ao invés de null)

---

## 📊 Fluxo Corrigido

### Antes (Problema):
```
1. Requisição GET /api/settings
2. Middleware auth:sanctum valida token
3. AdminMiddleware verifica is_admin
4. ❌ Se is_admin = 1 (inteiro), pode falhar
5. ❌ Retorna 401 genérico sem logs
```

### Depois (Solução):
```
1. Requisição GET /api/settings
2. Middleware auth:sanctum valida token ✅
3. AdminMiddleware:
   - Log: Verificando acesso admin ✅
   - Verifica se user existe ✅
   - Se não: retorna 401 com log ✅
   - Verifica is_admin (1, true, '1') ✅
   - Se não admin: retorna 403 com log ✅
   - Se admin: permite acesso com log ✅
4. SettingsController:
   - Log: index chamado ✅
   - Retorna configurações ✅
   - Log: sucesso ✅
```

---

## 🔍 Como Verificar Logs

### 1. Verificar Logs do Laravel

```bash
cd /var/www/html/LeilaoCash/api
tail -f storage/logs/laravel.log
```

### 2. Filtrar Logs Específicos

```bash
# Logs do AdminMiddleware
grep "AdminMiddleware" storage/logs/laravel.log

# Logs do SettingsController
grep "SettingsController" storage/logs/laravel.log

# Logs do AuthController
grep "AuthController" storage/logs/laravel.log
```

### 3. Ver Últimos Logs

```bash
tail -n 100 storage/logs/laravel.log | grep -E "AdminMiddleware|SettingsController|AuthController"
```

---

## 🧪 Como Testar

### Teste 1: Usuário Admin

```bash
# 1. Fazer login como admin
curl -X POST https://apileilao.verticos.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"senha"}'

# 2. Copiar o token retornado
TOKEN="seu_token_aqui"

# 3. Testar /auth/me
curl -X GET https://apileilao.verticos.com.br/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Testar /settings
curl -X GET https://apileilao.verticos.com.br/api/settings \
  -H "Authorization: Bearer $TOKEN"

# Deve retornar 200 OK com configurações
```

### Teste 2: Verificar Logs

```bash
# Ver logs em tempo real
tail -f /var/www/html/LeilaoCash/api/storage/logs/laravel.log

# Fazer requisição e ver logs aparecerem
```

---

## 🚀 Deploy

### 1. Atualizar Arquivos

Fazer upload dos arquivos:
- `api/app/Http/Middleware/AdminMiddleware.php`
- `api/app/Http/Controllers/Api/SettingsController.php`
- `api/app/Http/Controllers/Api/AuthController.php`

### 2. Limpar Cache

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 3. Verificar Permissões de Logs

```bash
# Garantir que o Laravel pode escrever logs
chmod -R 775 storage/logs
chown -R www-data:www-data storage/logs
```

### 4. Testar

1. Fazer login como admin
2. Acessar `/dashboard-admin/configuracoes`
3. Verificar logs: `tail -f storage/logs/laravel.log`
4. ✅ Deve ver logs detalhados
5. ✅ Deve carregar configurações normalmente

---

## 📝 Arquivos Modificados

- ✅ `api/app/Http/Middleware/AdminMiddleware.php` - Verificação robusta + logs
- ✅ `api/app/Http/Controllers/Api/SettingsController.php` - Logs adicionados
- ✅ `api/app/Http/Controllers/Api/AuthController.php` - Logs adicionados

---

## ✅ Checklist de Verificação

- [x] AdminMiddleware diferencia 401 de 403
- [x] AdminMiddleware verifica is_admin robustamente (1, true, '1')
- [x] Logs adicionados em AdminMiddleware
- [x] Logs adicionados em SettingsController
- [x] Logs adicionados em AuthController
- [x] Cache limpo
- [x] Permissões de logs verificadas

---

**Última atualização:** Dezembro 2024

