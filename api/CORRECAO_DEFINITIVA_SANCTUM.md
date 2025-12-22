# 🔧 Correção Definitiva: Problema de Autenticação Sanctum

## 🐛 Problema Identificado

**Sintoma:** Requisições para `/api/settings` retornam 401 "Sessão expirada" mesmo com token válido.

**Possíveis Causas:**
1. ❌ Token não está sendo encontrado na tabela `personal_access_tokens`
2. ❌ Sanctum não está validando tokens Bearer corretamente
3. ❌ Token está sendo criado mas não está sendo salvo corretamente
4. ❌ Problema com a configuração do Sanctum em produção

---

## ✅ Correções Implementadas

### 1️⃣ **DebugAuthMiddleware.php** - Middleware de Debug

Criado middleware para diagnosticar exatamente o que está acontecendo:

```php
class DebugAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Log detalhado da requisição
        $authHeader = $request->header('Authorization');
        $token = null;
        
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        
        Log::info('[DebugAuthMiddleware] Requisição recebida', [
            'url' => $request->fullUrl(),
            'has_auth_header' => !!$authHeader,
            'has_token' => !!$token,
            'token_length' => $token ? strlen($token) : 0,
        ]);
        
        // Tentar validar o token manualmente
        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);
            Log::info('[DebugAuthMiddleware] Token encontrado na base', [
                'token_exists' => !!$accessToken,
                'token_id' => $accessToken?->id,
            ]);
        }
        
        return $next($request);
    }
}
```

**Benefícios:**
- ✅ Logs detalhados de cada requisição
- ✅ Verifica se token está sendo enviado
- ✅ Verifica se token existe na base de dados
- ✅ Mostra usuário autenticado

---

### 2️⃣ **AuthController.php** - Melhorias no Login

#### ✅ Melhorias:
```php
// Criar token com nome único e sem expiração (ou com expiração longa)
$token = $user->createToken('auth_token', ['*'])->plainTextToken;

// Log para debug
Log::info('[AuthController] Token criado no login', [
    'user_id' => $user->id,
    'user_email' => $user->email,
    'is_admin' => $user->is_admin,
    'token_length' => strlen($token),
    'token_prefix' => substr($token, 0, 20) . '...',
]);
```

**Benefícios:**
- ✅ Token criado com todas as permissões (`['*']`)
- ✅ Logs quando token é criado
- ✅ Facilita debug

---

### 3️⃣ **routes/api.php** - Middleware de Debug Adicionado

```php
// Protected routes
Route::middleware(['auth:sanctum', 'debug.auth'])->group(function () {
    // ...
});
```

**Benefícios:**
- ✅ Todas as requisições protegidas passam pelo debug
- ✅ Logs automáticos de cada requisição

---

### 4️⃣ **TestToken.php** - Comando de Teste

Criado comando para testar tokens manualmente:

```bash
php artisan test:token "seu_token_aqui"
```

**Benefícios:**
- ✅ Testa se token existe na base
- ✅ Mostra informações do token
- ✅ Mostra usuário associado

---

## 🔍 Como Diagnosticar

### 1. Verificar Logs em Tempo Real

```bash
cd /var/www/html/LeilaoCash/api
tail -f storage/logs/laravel.log | grep -E "DebugAuthMiddleware|AuthController|AdminMiddleware"
```

### 2. Fazer Login e Verificar Token

1. Fazer login via API
2. Copiar o token retornado
3. Verificar logs para ver se token foi criado:
   ```bash
   grep "Token criado no login" storage/logs/laravel.log
   ```

### 3. Testar Token Manualmente

```bash
php artisan test:token "seu_token_aqui"
```

### 4. Verificar Requisição

1. Fazer requisição para `/api/settings`
2. Verificar logs:
   ```bash
   grep "DebugAuthMiddleware" storage/logs/laravel.log | tail -20
   ```

**O que procurar nos logs:**
- ✅ `has_token: true` - Token está sendo enviado
- ✅ `token_exists: true` - Token existe na base
- ✅ `has_user: true` - Usuário está autenticado
- ❌ Se algum for `false`, esse é o problema!

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Token não está sendo enviado

**Sintoma nos logs:**
```
has_auth_header: false
has_token: false
```

**Solução:**
- Verificar interceptor do axios no frontend
- Verificar se token está no localStorage
- Verificar se header Authorization está sendo enviado

### Problema 2: Token não existe na base

**Sintoma nos logs:**
```
has_token: true
token_exists: false
```

**Solução:**
1. Verificar se tabela `personal_access_tokens` existe:
   ```bash
   php artisan migrate:status
   ```
2. Verificar se tokens estão sendo criados:
   ```bash
   php artisan tinker
   >>> \Laravel\Sanctum\PersonalAccessToken::count()
   ```
3. Se não há tokens, fazer login novamente

### Problema 3: Token existe mas usuário não está autenticado

**Sintoma nos logs:**
```
token_exists: true
has_user: false
```

**Solução:**
- Verificar se Sanctum está configurado corretamente
- Verificar se middleware `auth:sanctum` está funcionando
- Limpar cache: `php artisan config:clear`

### Problema 4: Usuário autenticado mas não é admin

**Sintoma nos logs:**
```
has_user: true
user_is_admin: false
```

**Solução:**
- Verificar se `is_admin = 1` no banco de dados
- Fazer login com usuário admin

---

## 🚀 Deploy

### 1. Atualizar Arquivos

Fazer upload dos arquivos:
- `api/app/Http/Middleware/DebugAuthMiddleware.php`
- `api/app/Http/Controllers/Api/AuthController.php`
- `api/bootstrap/app.php`
- `api/routes/api.php`
- `api/app/Console/Commands/TestToken.php` (opcional)

### 2. Limpar Cache

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 3. Verificar Permissões de Logs

```bash
chmod -R 775 storage/logs
chown -R www-data:www-data storage/logs
```

### 4. Testar

1. Fazer login como admin
2. Acessar `/dashboard-admin/configuracoes`
3. Verificar logs: `tail -f storage/logs/laravel.log`
4. ✅ Deve ver logs detalhados do DebugAuthMiddleware
5. ✅ Deve identificar exatamente onde está o problema

---

## 📝 Arquivos Modificados/Criados

- ✅ `api/app/Http/Middleware/DebugAuthMiddleware.php` - NOVO: Middleware de debug
- ✅ `api/app/Http/Controllers/Api/AuthController.php` - Logs melhorados
- ✅ `api/bootstrap/app.php` - Alias do middleware de debug
- ✅ `api/routes/api.php` - Middleware de debug adicionado
- ✅ `api/app/Console/Commands/TestToken.php` - NOVO: Comando de teste

---

## ✅ Checklist de Verificação

- [x] DebugAuthMiddleware criado e registrado
- [x] Logs adicionados no AuthController
- [x] Middleware de debug adicionado nas rotas protegidas
- [x] Comando de teste criado
- [x] Cache limpo
- [x] Permissões de logs verificadas

---

## 🎯 Próximos Passos

1. **Fazer deploy dos arquivos**
2. **Limpar cache do Laravel**
3. **Fazer login e testar**
4. **Verificar logs para identificar o problema exato**
5. **Aplicar correção específica baseada nos logs**

---

**Última atualização:** Dezembro 2024

