# 🧪 Guia de Testes - Sistema de Autenticação

## ✅ Pré-requisitos

- ✅ API Laravel rodando em http://localhost:8000
- ✅ Frontend React rodando em http://localhost:3000
- ✅ Axios instalado (`npm install axios`)
- ✅ Banco de dados com usuários de teste criados

---

## 🔐 Credenciais de Teste

### Usuário Normal
```
Email: usuario@teste.com
Senha: teste123
Tipo: Usuário (is_admin = 0)
Redireciona para: /dashboard-usuario
```

### Administrador
```
Email: admin@vibeget.com
Senha: admin123
Tipo: Admin (is_admin = 1)
Redireciona para: /dashboard-admin
```

---

## 📋 Checklist de Testes

### ✅ Teste 1: Login de Usuário Normal

**Passos:**
1. Acesse: http://localhost:3000/login
2. Digite:
   - Email: `usuario@teste.com`
   - Senha: `teste123`
3. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Não deve exibir erros
- ✅ Deve mostrar "Entrando..." durante o loading
- ✅ Deve redirecionar para: http://localhost:3000/dashboard-usuario
- ✅ Dashboard do usuário deve carregar corretamente

---

### ✅ Teste 2: Login de Administrador

**Passos:**
1. Acesse: http://localhost:3000/login
2. Digite:
   - Email: `admin@vibeget.com`
   - Senha: `admin123`
3. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Não deve exibir erros
- ✅ Deve mostrar "Entrando..." durante o loading
- ✅ Deve redirecionar para: http://localhost:3000/dashboard-admin
- ✅ Dashboard admin deve carregar corretamente

---

### ✅ Teste 3: Credenciais Inválidas

**Passos:**
1. Acesse: http://localhost:3000/login
2. Digite:
   - Email: `teste@invalido.com`
   - Senha: `senhaerrada`
3. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Deve exibir mensagem de erro vermelha
- ✅ Mensagem: "Credenciais inválidas" ou similar
- ✅ NÃO deve redirecionar
- ✅ Usuário permanece na tela de login

---

### ✅ Teste 4: Proteção de Rotas - Usuário não autenticado

**Passos:**
1. Faça logout ou abra aba anônima
2. Tente acessar diretamente: http://localhost:3000/dashboard-usuario

**Resultado Esperado:**
- ✅ Deve redirecionar automaticamente para: http://localhost:3000/login
- ✅ NÃO deve mostrar conteúdo do dashboard

---

### ✅ Teste 5: Proteção Admin - Usuário normal tentando acessar admin

**Passos:**
1. Faça login como usuário normal (usuario@teste.com)
2. Tente acessar: http://localhost:3000/dashboard-admin

**Resultado Esperado:**
- ✅ Deve redirecionar para: http://localhost:3000/dashboard-usuario
- ✅ NÃO deve mostrar dashboard admin
- ✅ Usuário normal não tem acesso a rotas admin

---

### ✅ Teste 6: Persistência de Sessão

**Passos:**
1. Faça login (qualquer usuário)
2. Recarregue a página (F5)
3. Navegue entre páginas

**Resultado Esperado:**
- ✅ Usuário deve permanecer autenticado após reload
- ✅ Não deve ser redirecionado para login
- ✅ Dados do usuário devem permanecer disponíveis

---

### ✅ Teste 7: Logout

**Passos:**
1. Faça login
2. Vá para o dashboard
3. Clique em "Sair" ou botão de logout
4. Tente acessar dashboard novamente

**Resultado Esperado:**
- ✅ Deve voltar para página inicial ou login
- ✅ Token deve ser removido do localStorage
- ✅ Ao tentar acessar dashboard, deve redirecionar para login

---

### ✅ Teste 8: Redirecionamento Automático quando já está logado

**Passos:**
1. Faça login como usuário normal
2. Tente acessar: http://localhost:3000/login

**Resultado Esperado:**
- ✅ Deve redirecionar para: http://localhost:3000/dashboard-usuario
- ✅ Não deve mostrar a tela de login

**Repita com admin:**
1. Faça login como admin
2. Tente acessar: http://localhost:3000/login

**Resultado Esperado:**
- ✅ Deve redirecionar para: http://localhost:3000/dashboard-admin

---

## 🔍 Verificações no Console do Navegador

### Verificar Token no localStorage

Abra o DevTools (F12) → Application/Storage → Local Storage → http://localhost:3000

Deve conter:
```
access_token: "1|xxxxxxxxxxxxx..."
user: "{\"id\":2,\"name\":\"Usuário Teste\",\"email\":\"usuario@teste.com\",...}"
```

### Verificar Requisições de API

Abra o DevTools (F12) → Network → XHR

Ao fazer login, deve ver:
```
POST http://localhost:8000/api/auth/login
Status: 200
Response: {"success":true,"message":"Login realizado com sucesso",...}
```

Todas as requisições autenticadas devem ter:
```
Headers:
  Authorization: Bearer 1|xxxxxxxxxxxxx...
```

---

## 🐛 Troubleshooting

### Erro: "Network Error" ou "Failed to fetch"

**Problema:** API não está respondendo

**Solução:**
```bash
# Verifique se a API está rodando
curl http://localhost:8000/api/health

# Se não estiver, inicie os containers
cd /var/www/html/LeilaoCash/api
docker-compose up -d
```

---

### Erro: "CORS policy"

**Problema:** Erro de CORS bloqueando requisições

**Solução:**
1. Verifique o arquivo `.env` da API
2. Certifique-se que `CORS_ALLOWED_ORIGINS` inclui `http://localhost:3000`
3. Reinicie os containers: `docker-compose restart`

---

### Erro: "Credenciais inválidas" com credenciais corretas

**Problema:** Usuários não foram criados no banco

**Solução:**
```bash
# Execute o seeder novamente
cd /var/www/html/LeilaoCash/api
docker-compose exec app php artisan db:seed
```

---

### Erro: Redirecionamento não funciona

**Problema:** AuthContext não está envolvendo a aplicação

**Solução:**
- Verifique se o `<AuthProvider>` está no App.js
- Verifique se não há erros no console
- Limpe o cache e recarregue: Ctrl + Shift + R

---

## 📊 Status dos Testes

Execute todos os testes acima e marque:

- [ ] Teste 1: Login de Usuário Normal
- [ ] Teste 2: Login de Administrador
- [ ] Teste 3: Credenciais Inválidas
- [ ] Teste 4: Proteção de Rotas
- [ ] Teste 5: Proteção Admin
- [ ] Teste 6: Persistência de Sessão
- [ ] Teste 7: Logout
- [ ] Teste 8: Redirecionamento Automático

---

## 🎯 Resultado Final Esperado

Após todos os testes, o sistema deve:

✅ Autenticar usuários corretamente
✅ Redirecionar baseado em `is_admin`
✅ Proteger rotas adequadamente
✅ Manter sessão após reload
✅ Exibir erros apropriadamente
✅ Fazer logout corretamente

---

## 📝 Notas

- Todos os testes devem ser executados tanto no Chrome quanto no Firefox
- Teste também em modo anônimo/privado
- Verifique o console para erros JavaScript
- Verifique a aba Network para erros de API

---

**Data:** 18/12/2024
**Status:** Sistema pronto para testes

