# 🔧 Correção - CSRF Token Mismatch

## ❌ Problema

**Erro:** "CSRF token mismatch"

### Sintomas:
- Requisições POST retornando erro de CSRF
- Frontend não consegue fazer login
- API rejeitando requisições sem token CSRF

### Causa Raiz:
O Laravel estava configurado para usar **Sanctum Stateful** (com cookies e sessões), que requer tokens CSRF. Porém, nossa API é **stateless** (usa apenas tokens JWT no header Authorization), não precisando de CSRF.

---

## ✅ Solução Aplicada

### Arquivo Modificado: `bootstrap/app.php`

**Antes (causando erro CSRF):**
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);

    $middleware->alias([
        'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
    ]);
})
```

**Depois (corrigido - API stateless):**
```php
->withMiddleware(function (Middleware $middleware) {
    // Removido EnsureFrontendRequestsAreStateful para API stateless
    // Usamos apenas tokens Bearer no header Authorization
    
    $middleware->alias([
        'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
    ]);
    
    // Excluir rotas de API da verificação CSRF
    $middleware->validateCsrfTokens(except: [
        'api/*',
    ]);
})
```

### O que foi feito:
1. **Removido** `EnsureFrontendRequestsAreStateful` das rotas de API
2. **Adicionado** exceção de CSRF para todas as rotas `api/*`
3. **Configurado** API como completamente stateless

---

## 🎯 Como Funciona Agora

### API Stateless (Sem CSRF)
```
┌─────────────────────────────────────────┐
│  Frontend faz requisição                │
│  POST /api/auth/login                   │
│  { email, password }                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Laravel API                            │
│  ✅ SEM verificação CSRF                │
│  ✅ Valida credenciais                  │
│  ✅ Gera token JWT                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Retorna token                          │
│  { access_token: "6|xxx..." }           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Frontend salva token                   │
│  localStorage.setItem('access_token')   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Requisições autenticadas               │
│  Header: Authorization: Bearer 6|xxx... │
│  ✅ SEM cookies                          │
│  ✅ SEM sessão                           │
│  ✅ SEM CSRF                             │
└─────────────────────────────────────────┘
```

---

## 🔐 Diferença: Stateful vs Stateless

### Stateful (com CSRF - NÃO usamos)
```
✗ Usa cookies
✗ Usa sessões
✗ Requer token CSRF
✗ Precisa fazer GET /sanctum/csrf-cookie primeiro
✗ Mais complexo
```

### Stateless (sem CSRF - O QUE USAMOS) ✅
```
✓ Usa apenas tokens JWT
✓ Token no header Authorization
✓ SEM cookies
✓ SEM sessões
✓ SEM CSRF
✓ Mais simples e RESTful
```

---

## ✅ Testes de Validação

### Teste 1: Login sem CSRF
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"teste123"}'
```

**Resultado:** ✅ Status 200
```json
{
    "success": true,
    "message": "Login realizado com sucesso",
    "data": {
        "user": { ... },
        "access_token": "6|Dsnw37rRYbFNS8gD13Pqnz9uOkMM0OFYSZHO8FHL9ee3573d",
        "token_type": "Bearer"
    }
}
```

### Teste 2: Requisição Autenticada
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer 6|Dsnw37rRYbFNS8gD13Pqnz9uOkMM0OFYSZHO8FHL9ee3573d"
```

**Resultado:** ✅ Status 200
```json
{
    "success": true,
    "data": {
        "id": 2,
        "name": "Usuário Teste",
        "email": "usuario@teste.com",
        ...
    }
}
```

---

## 📝 Frontend - Não Precisa Mudar Nada

O frontend já está configurado corretamente:

```javascript
// src/services/api.js

// Interceptor adiciona token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Login
const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    // Token é retornado e salvo automaticamente
};
```

**✅ Nenhuma mudança necessária no frontend!**

---

## 🔒 Segurança

### ✅ API Stateless é Segura

1. **Token JWT**: Criptografado e assinado
2. **HTTPS**: Use sempre em produção
3. **Expiração**: Tokens podem expirar
4. **Revogação**: Tokens podem ser revogados
5. **Header Only**: Token apenas no header, não em cookies

### Quando usar Stateful vs Stateless?

**Use Stateful (com CSRF) quando:**
- Frontend e backend no mesmo domínio
- Precisa de cookies
- Aplicação monolítica

**Use Stateless (sem CSRF) quando:** ✅ NOSSO CASO
- API REST separada
- Frontend SPA em domínio diferente
- Mobile apps
- Múltiplos clientes (web, mobile, etc)

---

## 📚 Referências

### Laravel Sanctum - Modos de Uso

**1. SPA Authentication (Stateful):**
- Usa cookies e sessões
- Requer CSRF token
- Para SPAs no mesmo domínio

**2. API Token Authentication (Stateless):** ✅ O QUE USAMOS
- Usa tokens Bearer
- Sem cookies ou sessões
- Sem CSRF
- Para APIs REST

Documentação: https://laravel.com/docs/11.x/sanctum#api-token-authentication

---

## ✅ Status Final

**Data:** 18/12/2024
**Status:** ✅ CORRIGIDO

- ✅ CSRF desabilitado para rotas `api/*`
- ✅ API configurada como stateless
- ✅ Login funcionando sem erro
- ✅ Autenticação via tokens Bearer
- ✅ Frontend funcionando normalmente

---

## 🎯 Resumo da Mudança

| Item | Antes | Depois |
|------|-------|--------|
| **Modo** | Stateful (cookies) | Stateless (tokens) |
| **CSRF** | ✗ Requerido | ✅ Desabilitado |
| **Autenticação** | Cookies + Token | Apenas Token |
| **Middleware** | EnsureFrontendRequestsAreStateful | Removido |
| **Status** | ❌ Erro CSRF | ✅ Funcionando |

---

**Conclusão:** API agora funciona como uma verdadeira API REST stateless, usando apenas tokens JWT no header Authorization, sem necessidade de cookies, sessões ou tokens CSRF.

