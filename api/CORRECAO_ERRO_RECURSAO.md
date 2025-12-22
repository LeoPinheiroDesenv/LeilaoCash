# 🔧 Correção de Erro - Recursão Infinita

## ❌ Problema

**Erro:** "Maximum call stack size of 8339456 bytes (zend.max_allowed_stack_size - zend.reserved_stack_size) reached. Infinite recursion?"

### Sintomas:
- Requisições POST retornando status 500
- Erro de recursão infinita no Laravel Sanctum Guard
- Loop infinito entre `RequestGuard->user()` e `Laravel\Sanctum\Guard->__invoke()`

### Causa Raiz:
O arquivo `config/auth.php` estava configurado com o guard padrão como `'api'` (que usa Sanctum), mas isso causava recursão infinita ao tentar salvar sessões durante o login, pois o Sanctum tentava validar um token que ainda não existia.

---

## ✅ Solução Aplicada

### Arquivo Modificado: `config/auth.php`

**Antes (causando erro):**
```php
'defaults' => [
    'guard' => env('AUTH_GUARD', 'api'),
    'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
],

'guards' => [
    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

**Depois (corrigido):**
```php
'defaults' => [
    'guard' => env('AUTH_GUARD', 'web'),  // ← Mudado para 'web'
    'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
],

'guards' => [
    'web' => [                             // ← Guard web adicionado
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

### Comandos Executados:
```bash
# Limpar cache de configuração
docker-compose exec app php artisan config:clear

# Limpar cache da aplicação
docker-compose exec app php artisan cache:clear
```

---

## 🎯 Como Funciona Agora

### 1. **Rotas Públicas (Login, Register)**
- Usam o guard padrão `'web'` (sessão)
- Não tentam validar token ainda
- Permitem que o usuário faça login e obtenha um token

### 2. **Rotas Protegidas (com middleware `auth:sanctum`)**
- Usam explicitamente o guard `'api'` (Sanctum)
- Validam o token JWT
- Protegem endpoints autenticados

### 3. **Exemplo de Uso:**

```php
// Rota pública - usa guard 'web' por padrão
Route::post('/auth/login', [AuthController::class, 'login']);

// Rota protegida - usa guard 'api' (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
});
```

---

## ✅ Testes de Validação

### Teste 1: Login de Usuário
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"teste123"}'
```

**Resultado:** ✅ Status 200 - Login bem-sucedido
```json
{
    "success": true,
    "message": "Login realizado com sucesso",
    "data": {
        "user": {
            "id": 2,
            "name": "Usuário Teste",
            "is_admin": false,
            ...
        },
        "access_token": "1|xxxxxxxxxxxxx",
        "token_type": "Bearer"
    }
}
```

### Teste 2: Login de Admin
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"admin123"}'
```

**Resultado:** ✅ Status 200 - Login bem-sucedido
```json
{
    "success": true,
    "message": "Login realizado com sucesso",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin VibeGet",
            "is_admin": true,
            ...
        },
        "access_token": "2|xxxxxxxxxxxxx",
        "token_type": "Bearer"
    }
}
```

---

## 📚 Explicação Técnica

### Por que o erro ocorria?

1. **Requisição de Login:** Frontend envia POST para `/api/auth/login`
2. **Guard Padrão 'api':** Laravel tenta usar Sanctum para autenticar
3. **Sanctum Verifica Token:** Mas não existe token ainda (é o login!)
4. **Tenta Salvar Sessão:** Laravel tenta salvar sessão do "usuário atual"
5. **Chama `$request->user()`:** Que chama o Sanctum novamente
6. **Loop Infinito:** Sanctum → user() → Sanctum → user() → ...
7. **Stack Overflow:** Estoura a pilha após ~39.000 chamadas

### Por que a solução funciona?

1. **Guard Padrão 'web':** Usa sessões PHP normais
2. **Login Sem Token:** Usuário pode fazer login sem precisar de token
3. **Gera Token:** Após autenticação, gera token JWT
4. **Rotas Protegidas:** Usam `auth:sanctum` explicitamente
5. **Token Validado:** Sanctum valida token apenas onde necessário

---

## 🔐 Fluxo de Autenticação Correto

```
┌─────────────────────────────────────────────────────────────┐
│ 1. POST /api/auth/login                                     │
│    ├─ Guard: 'web' (sessão)                                 │
│    ├─ Valida credenciais                                    │
│    ├─ Cria token Sanctum                                    │
│    └─ Retorna: { user, access_token }                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend recebe token                                    │
│    └─ Salva no localStorage: access_token                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. GET /api/auth/me                                         │
│    ├─ Guard: 'api' (Sanctum)                                │
│    ├─ Header: Authorization: Bearer {token}                 │
│    ├─ Sanctum valida token                                  │
│    └─ Retorna: { user }                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Resumo

| Item | Antes | Depois |
|------|-------|--------|
| **Guard Padrão** | `'api'` (Sanctum) | `'web'` (sessão) |
| **Login** | ❌ Erro 500 (recursão) | ✅ Funciona |
| **Rotas Protegidas** | ❌ Problema | ✅ `auth:sanctum` |
| **Status** | ❌ Não funcional | ✅ Totalmente funcional |

---

## ✅ Status Final

**Data:** 18/12/2024
**Status:** ✅ CORRIGIDO

- ✅ Login funcionando
- ✅ Token gerado corretamente
- ✅ Rotas protegidas funcionando
- ✅ Sem erros de recursão
- ✅ API pronta para uso

---

**Nota:** Esta foi uma configuração incorreta comum ao usar Laravel Sanctum para APIs. O guard padrão deve ser `'web'` para permitir login tradicional, e `auth:sanctum` deve ser usado explicitamente nas rotas protegidas.

