# Teste da API de Configurações

## Como testar a API de Settings

### 1. Fazer login como admin

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vibeget.com",
    "password": "password"
  }'
```

Copie o `access_token` da resposta.

### 2. Testar rota pública (não requer autenticação)

```bash
curl http://localhost:8000/api/settings/public
```

### 3. Testar rota protegida (requer autenticação + admin)

```bash
curl http://localhost:8000/api/settings \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Atualizar uma configuração

```bash
curl -X PUT http://localhost:8000/api/settings/primary_color \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"value": "#FF0000"}'
```

### 5. Atualizar múltiplas configurações

```bash
curl -X POST http://localhost:8000/api/settings/batch \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "primary_color": "#FF0000",
      "secondary_color": "#0000FF"
    }
  }'
```

### 6. Upload de imagem

```bash
curl -X POST http://localhost:8000/api/settings/upload-image \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "image=@/path/to/your/image.png" \
  -F "key=logo_url"
```

## Credenciais de Teste

- **Admin**: admin@vibeget.com / password
- **Usuário**: user@vibeget.com / password

## Resolução de Problemas

### Erro "The route api/settings could not be found"

**Causas possíveis:**
1. Cache de rotas do Laravel
2. Aplicação Laravel não está rodando
3. Configuração de CORS

**Soluções:**
```bash
# Limpar cache
cd api
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear

# Verificar se rotas estão registradas
docker-compose exec app php artisan route:list --path=settings

# Reiniciar containers
docker-compose restart
```

### Erro 401 Unauthorized

**Causas:**
1. Token não está sendo enviado
2. Token expirado
3. Usuário não tem permissão de admin

**Solução:**
- Faça login novamente para obter novo token
- Verifique se o usuário tem `is_admin = 1`

### Erro 403 Forbidden

**Causa:**
- Usuário autenticado mas não é admin

**Solução:**
- Use credenciais de admin (admin@vibeget.com)

### Erro "api/api/settings" (duplo /api)

**Causa:**
- `api.js` tem `baseURL: 'http://localhost:8000/api'`
- Código usando `api.get('/api/settings')` duplica o `/api`

**Solução:**
```javascript
// ❌ ERRADO
api.get('/api/settings')  // Resulta em: /api/api/settings

// ✅ CORRETO
api.get('/settings')      // Resulta em: /api/settings
```

### Frontend não está pegando as configurações

**Verificações:**
1. Verifique se a API está respondendo:
```bash
curl http://localhost:8000/api/settings/public
```

2. Abra o console do navegador (F12) e verifique:
   - Se há erros na aba Console
   - Se as requisições estão sendo feitas na aba Network
   - Se o token está sendo enviado no header Authorization

3. Verifique o localStorage:
```javascript
// No console do navegador
console.log('Token:', localStorage.getItem('access_token'));
console.log('User:', localStorage.getItem('user'));
```

## Logs

Para ver logs de erro do Laravel:
```bash
cd api
docker-compose exec app tail -f storage/logs/laravel.log
```

