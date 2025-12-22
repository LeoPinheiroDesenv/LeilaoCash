# 🔍 Diagnóstico: Erro 401 em /auth/me

## ❌ Problema

**Erro:** Requisição para `/api/auth/me` retorna 401 (Unauthorized) mesmo com token válido sendo enviado.

**Sintomas:**
- Token está sendo enviado no header `Authorization: Bearer TOKEN`
- Token tem 50 caracteres (formato correto do Sanctum)
- Requisição retorna 401
- `$request->user()` retorna `null`

---

## 🔍 Diagnóstico Implementado

### 1. Logs Detalhados no `AuthController::me()`

Adicionados logs para diagnosticar o problema:

```php
public function me(Request $request)
{
    // Log do header Authorization
    $authHeader = $request->header('Authorization');
    $token = null;
    
    if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
        $token = substr($authHeader, 7);
    }
    
    Log::info('[AuthController] me chamado', [
        'has_auth_header' => !!$authHeader,
        'token_length' => $token ? strlen($token) : 0,
        'token_prefix' => $token ? substr($token, 0, 20) . '...' : null,
    ]);
    
    // Validar token manualmente
    if ($token) {
        $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
        
        Log::info('[AuthController] Token encontrado na base', [
            'token_exists' => !!$accessToken,
            'token_id' => $accessToken?->id,
            'token_expires_at' => $accessToken?->expires_at,
        ]);
    }
    
    $user = $request->user();
    
    // ... resto do código
}
```

### 2. Logs no `DebugAuthMiddleware`

O middleware `DebugAuthMiddleware` já está logando:
- Header Authorization recebido
- Token extraído
- Token encontrado na base de dados
- Usuário antes e depois do `auth:sanctum`

---

## 📋 Como Verificar os Logs

### 1. Verificar Logs do Laravel

```bash
cd /var/www/html/LeilaoCash/api
tail -f storage/logs/laravel.log | grep -E "(AuthController|DebugAuthMiddleware)"
```

### 2. Buscar Logs Específicos

```bash
# Logs do AuthController
grep "AuthController" storage/logs/laravel.log | tail -20

# Logs do DebugAuthMiddleware
grep "DebugAuthMiddleware" storage/logs/laravel.log | tail -20
```

### 3. Verificar Token na Base de Dados

```bash
# Conectar ao banco de dados
mysql -u usuario -p nome_do_banco

# Verificar tokens recentes
SELECT id, tokenable_id, name, token, last_used_at, expires_at, created_at 
FROM personal_access_tokens 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔍 Possíveis Causas

### 1. Token Não Está na Base de Dados

**Sintoma:** `token_exists: false` nos logs

**Causa:** Token não foi salvo corretamente no login

**Solução:**
- Verificar se a tabela `personal_access_tokens` existe
- Verificar se o método `createToken()` está funcionando
- Verificar logs do login para ver se o token foi criado

### 2. Token Está Expirado

**Sintoma:** `token_expires_at` está no passado

**Causa:** Token foi criado com expiração e já expirou

**Solução:**
- Verificar `SANCTUM_EXPIRATION` no `.env`
- Fazer login novamente para obter novo token

### 3. Token Está com Formato Incorreto

**Sintoma:** Token não é encontrado mesmo existindo

**Causa:** Token pode estar sendo salvo com hash diferente

**Solução:**
- Verificar se o token no banco corresponde ao token enviado
- Verificar se há algum prefixo sendo adicionado

### 4. Problema com Guard do Sanctum

**Sintoma:** `$request->user()` retorna null mesmo com token válido

**Causa:** Guard do Sanctum não está configurado corretamente

**Solução:**
- Verificar `config/sanctum.php` - deve ter `'guard' => ['web']`
- Verificar `config/auth.php` - guard 'web' deve existir
- Limpar cache: `php artisan config:clear`

### 5. Middleware Não Está Sendo Executado

**Sintoma:** Logs do `DebugAuthMiddleware` não aparecem

**Causa:** Middleware não está sendo aplicado à rota

**Solução:**
- Verificar `routes/api.php` - rota deve ter `auth:sanctum`
- Verificar `bootstrap/app.php` - middleware deve estar registrado

---

## ✅ Verificações Necessárias

### 1. Verificar Configuração do Sanctum

```bash
cd /var/www/html/LeilaoCash/api
cat config/sanctum.php | grep guard
# Deve mostrar: 'guard' => ['web'],
```

### 2. Verificar Tabela personal_access_tokens

```bash
php artisan tinker
>>> \Laravel\Sanctum\PersonalAccessToken::count()
# Deve retornar número > 0
```

### 3. Verificar Token Específico

```bash
php artisan tinker
>>> $token = 'SEU_TOKEN_AQUI';
>>> \Laravel\Sanctum\PersonalAccessToken::findToken($token);
# Deve retornar objeto PersonalAccessToken ou null
```

### 4. Verificar Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## 🚀 Próximos Passos

1. **Fazer upload do arquivo atualizado:**
   - `api/app/Http/Controllers/Api/AuthController.php`

2. **Verificar logs após tentar acessar `/auth/me`:**
   ```bash
   tail -f storage/logs/laravel.log | grep AuthController
   ```

3. **Analisar os logs para identificar a causa:**
   - Se `token_exists: false` → Token não está na base
   - Se `token_exists: true` mas `has_user: false` → Problema com guard
   - Se não há logs → Middleware não está sendo executado

4. **Com base nos logs, aplicar a correção específica**

---

## 📝 Arquivos Modificados

- ✅ `api/app/Http/Controllers/Api/AuthController.php` - Adicionados logs detalhados

---

**Última atualização:** Dezembro 2024

