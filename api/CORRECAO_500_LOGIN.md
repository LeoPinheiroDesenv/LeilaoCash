# 🔧 Correção: Erro 500 no Login

## ❌ Problema

**Erro:** `500 Internal Server Error` ao fazer login em `/api/auth/login`.

**Causa:** O método `login` não tinha tratamento de exceções (`try-catch`), então qualquer erro (como falha ao criar token, problema com banco de dados, etc.) resultava em erro 500 sem informações úteis.

---

## ✅ Solução Aplicada

### Arquivo Modificado: `app/Http/Controllers/Api/AuthController.php`

**Antes (sem tratamento de exceções):**
```php
public function login(Request $request)
{
    $validator = Validator::make($request->all(), [...]);
    // ... validações ...
    
    $token = $user->createToken('auth_token', ['*'])->plainTextToken;
    // Se houver erro aqui, retorna 500 sem detalhes
    
    return response()->json([...], 200);
}
```

**Depois (com tratamento completo de exceções):**
```php
public function login(Request $request)
{
    try {
        // Validações
        $validator = Validator::make($request->all(), [...]);
        
        // Verificações de usuário
        $user = User::where('email', $request->email)->first();
        
        // Criar token com tratamento específico
        try {
            $token = $user->createToken('auth_token', ['*'])->plainTextToken;
        } catch (\Exception $tokenException) {
            Log::error('[AuthController] Erro ao criar token', [...]);
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar token de autenticação',
                'error' => $tokenException->getMessage()
            ], 500);
        }
        
        // Retornar sucesso
        return response()->json([...], 200);
        
    } catch (\Exception $e) {
        Log::error('[AuthController] Erro no login', [...]);
        return response()->json([
            'success' => false,
            'message' => 'Erro ao realizar login',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

### O que foi feito:
1. ✅ Adicionado `try-catch` externo para capturar qualquer exceção
2. ✅ Adicionado `try-catch` específico para criação de token
3. ✅ Logs detalhados de erros para debug
4. ✅ Mensagens de erro mais informativas
5. ✅ Retorno de JSON estruturado mesmo em caso de erro

---

## 🎯 Possíveis Causas de Erro 500

### 1. Problema com Tabela `personal_access_tokens`
**Sintoma:** Erro ao criar token
**Solução:**
```bash
php artisan migrate
# Verificar se a tabela existe
php artisan tinker
>>> \Laravel\Sanctum\PersonalAccessToken::count()
```

### 2. Problema com Sanctum
**Sintoma:** `createToken` lança exceção
**Solução:**
- Verificar se `HasApiTokens` está no modelo `User`
- Verificar configuração do Sanctum em `config/sanctum.php`

### 3. Problema com Banco de Dados
**Sintoma:** Erro de conexão ou query
**Solução:**
- Verificar conexão com banco
- Verificar se tabela `users` existe
- Verificar permissões do banco

### 4. Problema com Modelo User
**Sintoma:** Erro ao acessar propriedades do usuário
**Solução:**
- Verificar se modelo `User` está correto
- Verificar se `is_active` existe na tabela

---

## 🔍 Como Diagnosticar

### 1. Verificar Logs

```bash
tail -f storage/logs/laravel.log | grep -E "AuthController|login|createToken"
```

**O que procurar:**
- `[AuthController] Erro ao criar token` - Problema com Sanctum
- `[AuthController] Erro no login` - Erro geral no login
- Stack trace completo do erro

### 2. Testar Criação de Token Manualmente

```bash
php artisan tinker
```

```php
$user = \App\Models\User::where('email', 'admin@vibeget.com')->first();
$token = $user->createToken('test_token')->plainTextToken;
echo $token;
```

Se der erro aqui, o problema é com o Sanctum ou banco de dados.

### 3. Verificar Estrutura do Banco

```bash
php artisan migrate:status
```

Verificar se todas as migrations foram executadas, especialmente:
- `create_users_table`
- `create_personal_access_tokens_table`

---

## 🚀 Deploy

### 1. Atualizar Arquivo

Fazer upload do arquivo:
- `api/app/Http/Controllers/Api/AuthController.php`

### 2. Limpar Cache

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
```

### 3. Testar

```bash
curl -X POST https://apileilao.verticos.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"senha"}'
```

**Resultado esperado:**
- ✅ Se credenciais corretas: JSON 200 com token
- ✅ Se credenciais incorretas: JSON 401
- ✅ Se erro: JSON 500 com mensagem de erro detalhada

---

## ✅ Resultado Esperado

### Antes da Correção:
```
POST /api/auth/login
→ 500 Internal Server Error (sem detalhes) ❌
→ Logs não mostram o erro específico
```

### Depois da Correção:
```
POST /api/auth/login
→ 500 Internal Server Error (com mensagem detalhada) ✅
→ Logs mostram exatamente qual foi o erro
→ JSON estruturado com informações úteis
```

---

## 📝 Arquivos Modificados

- ✅ `api/app/Http/Controllers/Api/AuthController.php` - Adicionado tratamento de exceções completo

---

## 🔍 Exemplo de Logs de Erro

Após a correção, os logs vão mostrar:

```
[2025-12-22 12:00:00] production.ERROR: [AuthController] Erro ao criar token no login {
  "user_id": 4,
  "user_email": "admin@vibeget.com",
  "error": "SQLSTATE[42S02]: Base table or view not found: 1146 Table 'database.personal_access_tokens' doesn't exist",
  "trace": "..."
}
```

Ou:

```
[2025-12-22 12:00:00] production.ERROR: [AuthController] Erro no login {
  "email": "admin@vibeget.com",
  "error": "Call to undefined method App\Models\User::createToken()",
  "trace": "..."
}
```

Com essas informações, é possível identificar e corrigir o problema específico.

---

**Última atualização:** Dezembro 2024

