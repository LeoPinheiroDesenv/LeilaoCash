# 🔧 Configuração de Produção - API e Frontend

## 📋 Informações do Ambiente

- **Frontend:** https://leilao.verticos.com.br
- **API:** https://apileilao.verticos.com.br

---

## ✅ Configuração do Frontend

### Arquivo: `.env` (já configurado)

```bash
REACT_APP_API_URL=https://apileilao.verticos.com.br/api
```

**Status:** ✅ Configurado corretamente

---

## ⚠️ Configuração do Backend (NECESSÁRIA)

### Arquivo: `api/.env`

Você **DEVE** configurar as seguintes variáveis:

```bash
# CORS - Permitir requisições do frontend de produção
CORS_ALLOWED_ORIGINS=https://leilao.verticos.com.br,https://www.leilao.verticos.com.br

# Sanctum - Domínios stateful (para cookies, se necessário)
SANCTUM_STATEFUL_DOMAINS=leilao.verticos.com.br,www.leilao.verticos.com.br

# URL da aplicação
APP_URL=https://apileilao.verticos.com.br

# Ambiente
APP_ENV=production
APP_DEBUG=false
```

### Como Aplicar

1. **Editar o arquivo `api/.env`:**
   ```bash
   cd /var/www/html/LeilaoCash/api
   nano .env
   ```

2. **Adicionar/Atualizar as variáveis:**
   ```bash
   CORS_ALLOWED_ORIGINS=https://leilao.verticos.com.br,https://www.leilao.verticos.com.br
   SANCTUM_STATEFUL_DOMAINS=leilao.verticos.com.br,www.leilao.verticos.com.br
   APP_URL=https://apileilao.verticos.com.br
   APP_ENV=production
   APP_DEBUG=false
   ```

3. **Limpar cache do Laravel:**
   ```bash
   cd /var/www/html/LeilaoCash/api
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

4. **Reiniciar serviços (se usar Docker):**
   ```bash
   docker-compose restart
   ```

---

## 🔍 Verificação

### 1. Verificar CORS

```bash
curl -X OPTIONS https://apileilao.verticos.com.br/api/settings \
  -H "Origin: https://leilao.verticos.com.br" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

**Deve retornar:**
```
Access-Control-Allow-Origin: https://leilao.verticos.com.br
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
```

### 2. Verificar Sanctum

```bash
# Fazer login primeiro para obter token
curl -X POST https://apileilao.verticos.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"sua_senha"}'

# Usar o token retornado
curl -X GET https://apileilao.verticos.com.br/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Origin: https://leilao.verticos.com.br"
```

**Deve retornar:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "...",
    "email": "...",
    "is_admin": 1
  }
}
```

---

## 🐛 Troubleshooting

### Problema: "Sessão expirada" mesmo após login

**Possíveis causas:**
1. ❌ CORS não configurado corretamente
2. ❌ Sanctum não reconhecendo o domínio
3. ❌ Token não sendo enviado corretamente
4. ❌ Token expirado

**Solução:**
1. Verificar se `CORS_ALLOWED_ORIGINS` inclui `https://leilao.verticos.com.br`
2. Verificar se `SANCTUM_STATEFUL_DOMAINS` inclui `leilao.verticos.com.br`
3. Limpar cache do Laravel
4. Verificar logs do backend
5. Verificar console do navegador para ver se o token está sendo enviado

### Problema: Erro CORS no navegador

**Solução:**
1. Verificar se `CORS_ALLOWED_ORIGINS` está correto no `api/.env`
2. Limpar cache: `php artisan config:clear`
3. Reiniciar servidor web (Nginx/Apache)
4. Verificar se o Nginx está passando os headers CORS corretamente

### Problema: Token não é reconhecido

**Solução:**
1. Verificar se o token está sendo enviado no header `Authorization: Bearer TOKEN`
2. Verificar se o token não expirou (padrão: 7 dias)
3. Verificar se o token foi gerado no mesmo domínio
4. Verificar logs do backend para ver o erro específico

---

## 📝 Checklist de Configuração

### Backend (api/.env)
- [ ] `CORS_ALLOWED_ORIGINS` configurado com `https://leilao.verticos.com.br`
- [ ] `SANCTUM_STATEFUL_DOMAINS` configurado com `leilao.verticos.com.br`
- [ ] `APP_URL` configurado com `https://apileilao.verticos.com.br`
- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] Cache limpo (`php artisan config:clear`)

### Frontend (.env)
- [x] `REACT_APP_API_URL` configurado com `https://apileilao.verticos.com.br/api`
- [ ] Build feito com `npm run build`
- [ ] Arquivos de build deployados

### Testes
- [ ] Login funciona
- [ ] Token é salvo no localStorage
- [ ] Requisições para `/api/auth/me` funcionam
- [ ] Requisições para `/api/settings` funcionam
- [ ] Não há erros CORS no console
- [ ] Não há mensagens "Sessão expirada" após login válido

---

## 🚀 Deploy

### 1. Atualizar Backend

```bash
cd /var/www/html/LeilaoCash/api
# Editar .env com as configurações acima
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 2. Rebuild Frontend

```bash
cd /var/www/html/LeilaoCash
npm run build
# Upload da pasta build/ para o servidor web
```

### 3. Verificar

1. Acessar https://leilao.verticos.com.br/login
2. Fazer login
3. Acessar https://leilao.verticos.com.br/dashboard-admin/configuracoes
4. ✅ Não deve mostrar "Sessão expirada"
5. ✅ Deve carregar configurações normalmente

---

**Última atualização:** Dezembro 2024

