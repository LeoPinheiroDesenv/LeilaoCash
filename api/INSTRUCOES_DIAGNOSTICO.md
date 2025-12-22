# 🔍 Instruções de Diagnóstico - Problema de Autenticação

## 📋 Passo a Passo para Identificar o Problema

### 1. Fazer Deploy dos Arquivos

Fazer upload dos seguintes arquivos:
- `api/app/Http/Middleware/DebugAuthMiddleware.php`
- `api/app/Http/Controllers/Api/AuthController.php`
- `api/bootstrap/app.php`
- `api/routes/api.php`

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

### 4. Fazer Login e Testar

1. **Fazer login como admin:**
   - Acessar https://leilao.verticos.com.br/login
   - Fazer login com credenciais de admin
   - Copiar o token retornado (ou verificar no localStorage)

2. **Acessar página de configurações:**
   - Acessar https://leilao.verticos.com.br/dashboard-admin/configuracoes

3. **Verificar logs em tempo real:**
   ```bash
   tail -f /var/www/html/LeilaoCash/api/storage/logs/laravel.log
   ```

### 5. Analisar os Logs

Procure por estas entradas nos logs:

#### ✅ Se Token Está Sendo Enviado:
```
[DebugAuthMiddleware] Requisição recebida
has_token: true  ← Token está sendo enviado
token_length: 123  ← Tamanho do token
```

#### ✅ Se Token Existe na Base:
```
[DebugAuthMiddleware] Token encontrado na base
token_exists: true  ← Token foi encontrado
token_id: 1  ← ID do token na base
```

#### ✅ Se Usuário Está Autenticado:
```
[DebugAuthMiddleware] Usuário DEPOIS do auth:sanctum
has_user: true  ← Usuário está autenticado
user_id: 1
user_is_admin: 1
```

### 6. Identificar o Problema

Com base nos logs, identifique qual é o problema:

#### Problema A: Token Não Está Sendo Enviado
**Sintoma:** `has_token: false`
**Solução:** Problema no frontend (interceptor do axios)

#### Problema B: Token Não Existe na Base
**Sintoma:** `token_exists: false` mas `has_token: true`
**Solução:** 
- Token não foi salvo corretamente no login
- Token foi deletado
- Fazer login novamente

#### Problema C: Usuário Não Está Autenticado
**Sintoma:** `has_user: false` mas `token_exists: true`
**Solução:** 
- Problema com o middleware `auth:sanctum`
- Verificar configuração do Sanctum
- Verificar se guard está correto

#### Problema D: Usuário Não É Admin
**Sintoma:** `has_user: true` mas `user_is_admin: 0`
**Solução:** 
- Usuário não é admin
- Verificar `is_admin = 1` no banco de dados

### 7. Testar Token Manualmente

Se quiser testar um token específico:

```bash
cd /var/www/html/LeilaoCash/api
php artisan test:token "seu_token_completo_aqui"
```

Isso vai mostrar:
- Se token existe na base
- Informações do token
- Usuário associado
- Se é admin

### 8. Verificar Tabela de Tokens

```bash
cd /var/www/html/LeilaoCash/api
php artisan tinker
```

No tinker:
```php
// Ver total de tokens
\Laravel\Sanctum\PersonalAccessToken::count()

// Ver últimos tokens
\Laravel\Sanctum\PersonalAccessToken::latest()->take(5)->get()

// Ver tokens de um usuário específico
$user = \App\Models\User::where('email', 'admin@vibeget.com')->first();
$user->tokens
```

---

## 📊 Exemplo de Logs Corretos

Se tudo estiver funcionando, você verá:

```
[DebugAuthMiddleware] Requisição recebida
has_token: true
token_length: 123
token_prefix: "1|abc123def456..."

[DebugAuthMiddleware] Token encontrado na base
token_exists: true
token_id: 1
token_name: "auth_token"

[DebugAuthMiddleware] Usuário do token
user_id: 1
user_email: "admin@vibeget.com"
user_is_admin: 1

[DebugAuthMiddleware] Usuário DEPOIS do auth:sanctum
has_user: true
user_id: 1
user_email: "admin@vibeget.com"
user_is_admin: 1
response_status: 200

[AdminMiddleware] Verificando acesso admin
has_user: true
user_id: 1
is_admin: 1

[AdminMiddleware] Acesso admin permitido

[SettingsController] index chamado
user_id: 1
is_admin: 1

[SettingsController] Configurações retornadas com sucesso
```

---

## 🐛 Exemplo de Logs com Problema

Se houver problema, você verá algo como:

```
[DebugAuthMiddleware] Requisição recebida
has_token: false  ← PROBLEMA: Token não está sendo enviado

OU

[DebugAuthMiddleware] Requisição recebida
has_token: true
token_length: 123

[DebugAuthMiddleware] Token encontrado na base
token_exists: false  ← PROBLEMA: Token não existe na base

OU

[DebugAuthMiddleware] Usuário DEPOIS do auth:sanctum
has_user: false  ← PROBLEMA: Sanctum não autenticou
response_status: 401
```

---

## ✅ Após Identificar o Problema

Com base no problema identificado, aplicar a correção específica:

- **Problema A:** Corrigir interceptor do axios no frontend
- **Problema B:** Verificar criação de tokens no login
- **Problema C:** Verificar configuração do Sanctum
- **Problema D:** Verificar is_admin no banco de dados

---

**Última atualização:** Dezembro 2024

