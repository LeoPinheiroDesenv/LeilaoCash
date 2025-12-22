# 🔍 Diagnóstico de Produção - "Sessão Expirada"

## 📋 Passos para Diagnosticar

### 1. Verificar Console do Navegador

Abra o DevTools (F12) e vá para a aba **Console**. Você deve ver logs como:

```javascript
[API] Configuração da API: {
  apiUrl: "https://apileilao.verticos.com.br/api",
  currentHost: "leilao.verticos.com.br",
  currentOrigin: "https://leilao.verticos.com.br",
  isProduction: true
}

[Configuracoes] Verificando autenticação: {
  hasToken: true,
  tokenLength: 123,
  hasUser: true,
  userData: { id: 1, name: "...", is_admin: 1 },
  isAdmin: true,
  isAuthenticated: true
}

[Configuracoes] Validando token com /auth/me...
[API Interceptor] Enviando requisição: {
  hasToken: true,
  tokenLength: 123,
  tokenPrefix: "1|abc123def456...",
  url: "/auth/me",
  fullUrl: "https://apileilao.verticos.com.br/api/auth/me",
  method: "get",
  headers: {
    "Authorization": "Bearer 1|abc123def456...",
    "Content-Type": "application/json"
  }
}
```

### 2. Verificar Aba Network

1. Abra DevTools (F12)
2. Vá para a aba **Network**
3. Filtre por "XHR" ou "Fetch"
4. Tente acessar a página de configurações
5. Procure por requisições para `/auth/me` e `/settings`

**Verificar:**
- ✅ Status code (deve ser 200 para sucesso, 401 para erro)
- ✅ Headers da requisição (deve ter `Authorization: Bearer TOKEN`)
- ✅ Headers da resposta (deve ter `Access-Control-Allow-Origin`)
- ✅ Response body (ver mensagem de erro se houver)

### 3. Verificar Token no localStorage

No console do navegador, execute:

```javascript
// Verificar token
const token = localStorage.getItem('access_token');
console.log('Token:', token ? token.substring(0, 50) + '...' : 'NÃO ENCONTRADO');

// Verificar usuário
const user = localStorage.getItem('user');
console.log('Usuário:', user ? JSON.parse(user) : 'NÃO ENCONTRADO');
```

### 4. Testar Requisição Manual

No console do navegador, execute:

```javascript
// Testar /auth/me
const token = localStorage.getItem('access_token');
fetch('https://apileilao.verticos.com.br/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('✅ /auth/me:', data))
.catch(err => console.error('❌ /auth/me:', err));

// Testar /settings
fetch('https://apileilao.verticos.com.br/api/settings', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('✅ /settings:', data))
.catch(err => console.error('❌ /settings:', err));
```

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Token não está sendo enviado

**Sintoma:** No Network, a requisição não tem header `Authorization`

**Solução:**
1. Verificar se o token existe no localStorage
2. Verificar se o interceptor está funcionando
3. Limpar cache do navegador e fazer login novamente

### Problema 2: CORS Error

**Sintoma:** Erro no console: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solução:**
1. Verificar se `CORS_ALLOWED_ORIGINS` no `api/.env` inclui `https://leilao.verticos.com.br`
2. Limpar cache do Laravel: `php artisan config:clear`
3. Reiniciar servidor web

### Problema 3: Token Inválido (401)

**Sintoma:** Requisição retorna 401 Unauthorized

**Possíveis causas:**
1. Token expirado (padrão: 7 dias)
2. Token inválido ou corrompido
3. Token foi gerado em outro domínio
4. Backend não está reconhecendo o token

**Solução:**
1. Fazer logout e login novamente
2. Verificar se o token não expirou
3. Verificar logs do backend
4. Verificar se `SANCTUM_STATEFUL_DOMAINS` está configurado corretamente

### Problema 4: Token válido mas ainda retorna 401

**Sintoma:** `/auth/me` funciona mas `/settings` retorna 401

**Possíveis causas:**
1. Middleware `admin` está bloqueando
2. Usuário não é admin (`is_admin !== 1`)
3. Problema com a rota `/settings`

**Solução:**
1. Verificar se o usuário é admin (`is_admin === 1`)
2. Verificar logs do backend
3. Testar a rota diretamente com curl

---

## 🔧 Comandos Úteis

### Limpar Cache do Laravel

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Verificar Configuração do Laravel

```bash
cd /var/www/html/LeilaoCash/api
php artisan config:show cors
php artisan config:show sanctum
```

### Testar API com curl

```bash
# Login
curl -X POST https://apileilao.verticos.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"sua_senha"}'

# Usar token retornado
TOKEN="seu_token_aqui"

# Testar /auth/me
curl -X GET https://apileilao.verticos.com.br/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: https://leilao.verticos.com.br"

# Testar /settings
curl -X GET https://apileilao.verticos.com.br/api/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: https://leilao.verticos.com.br"
```

---

## 📝 Informações para Suporte

Ao reportar o problema, inclua:

1. **Logs do Console do Navegador** (aba Console do DevTools)
2. **Requisições da Aba Network** (screenshot ou export)
3. **Token (primeiros 20 caracteres)** para verificação
4. **Status do usuário** (is_admin, id, email)
5. **Erros específicos** (mensagens completas)

---

**Última atualização:** Dezembro 2024

