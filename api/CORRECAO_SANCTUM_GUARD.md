# Correção: Recursão Infinita no Sanctum Guard

## Problema

Erro ao acessar rotas protegidas por `auth:sanctum`:

```
"Maximum call stack size of 8339456 bytes (zend.max_allowed_stack_size - zend.reserved_stack_size) reached. Infinite recursion?"
```

## Causa

Configuração circular no Laravel Sanctum:

1. `config/sanctum.php` estava configurado com:
   ```php
   'guard' => ['api'],
   ```

2. `config/auth.php` define o guard 'api' com:
   ```php
   'api' => [
       'driver' => 'sanctum',
       'provider' => 'users',
   ],
   ```

3. **Resultado**: Loop infinito
   - Sanctum tenta usar guard 'api'
   - Guard 'api' usa driver 'sanctum'
   - Sanctum tenta usar guard 'api' novamente
   - Loop infinito! 🔄

## Solução

Alterar `config/sanctum.php` para usar o guard 'web':

```php
// Antes (ERRADO):
'guard' => ['api'],

// Depois (CORRETO):
'guard' => ['web'],
```

## Como Aplicar

```bash
# 1. Editar o arquivo
nano config/sanctum.php

# 2. Alterar a linha do guard

# 3. Limpar cache
php artisan config:clear
php artisan cache:clear

# 4. Reiniciar servidor se necessário
```

## Como Testar

```bash
# 1. Fazer login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"password"}'

# 2. Copiar o access_token da resposta

# 3. Testar rota protegida
curl http://localhost:8000/api/settings \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Deve retornar JSON com success: true
```

## Configuração Correta

### config/sanctum.php
```php
<?php

use Laravel\Sanctum\Sanctum;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    'guard' => ['web'],  // ✅ CORRETO: usa 'web', não 'api'

    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_signature' => Illuminate\Routing\Middleware\ValidateSignature::class,
    ],
];
```

### config/auth.php
```php
<?php

return [
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),  // ✅ Default é 'web'
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

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

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', App\Models\User::class),
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),
];
```

## Entendendo a Solução

### Por que funciona?

1. **Guard 'web'**: Usa driver 'session', não causa recursão
2. **Sanctum**: Quando precisa verificar o usuário, usa o guard 'web'
3. **Middleware `auth:sanctum`**: Continua funcionando normalmente
4. **Tokens**: São gerenciados pela tabela `personal_access_tokens`

### Fluxo de Autenticação

```
1. Cliente faz login → Recebe token Bearer
2. Cliente envia requisição com: Authorization: Bearer TOKEN
3. Middleware auth:sanctum verifica o token
4. Sanctum usa guard 'web' para resolver o usuário
5. Usuário autenticado é injetado na requisição
6. Rotas protegidas funcionam normalmente ✅
```

## Erros Relacionados

### Se ainda houver problemas:

1. **Erro 401 Unauthorized**
   - Token inválido ou expirado
   - Solução: Fazer login novamente

2. **Erro 403 Forbidden**
   - Usuário não tem permissão (não é admin)
   - Solução: Usar credenciais de admin

3. **Token não é enviado**
   - Verificar se `Authorization: Bearer TOKEN` está no header
   - Verificar interceptor do axios (frontend)

## Referências

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Issue similar no GitHub](https://github.com/laravel/sanctum/issues/209)
- Correção aplicada em: 2025-12-18

---

**Status**: ✅ RESOLVIDO
**Data**: 2025-12-18
**Versão Laravel**: 11.x
**Versão Sanctum**: ^4.0

