# 🔒 Segurança da Rota /settings/public - VibeGet

## 📋 Visão Geral

A rota `/api/settings/public` foi configurada para ser **protegida e acessível apenas para administradores**, garantindo que as configurações do sistema não sejam expostas publicamente.

---

## 🔐 Configuração de Segurança

### Backend (Laravel)

**Arquivo:** `api/routes/api.php`

```php
// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // ... outras rotas ...
    
    // Admin only routes
    Route::middleware('admin')->group(function () {
        // Settings public (apenas admin)
        Route::get('/settings/public', [SettingsController::class, 'getPublic']);
        
        // Settings management
        Route::prefix('settings')->group(function () {
            Route::get('/', [SettingsController::class, 'index']);
            Route::post('/batch', [SettingsController::class, 'updateBatch']);
            // ... outras rotas ...
        });
    });
});
```

**Middlewares Aplicados:**
1. `auth:sanctum` - Requer token de autenticação válido
2. `admin` - Requer `is_admin = 1`

**Respostas HTTP:**
- `200 OK` - Admin autenticado com sucesso
- `401 Unauthorized` - Token ausente ou inválido
- `403 Forbidden` - Usuário autenticado mas não é admin

---

## 🎨 Frontend - ThemeContext Resiliente

### Estratégia de Carregamento

O `ThemeContext` foi modificado para **verificar permissões antes** de tentar carregar as configurações da API.

**Arquivo:** `src/contexts/ThemeContext.js`

```javascript
const loadSettings = async () => {
  try {
    // 1. Verifica autenticação
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      // Não autenticado - usa configurações padrão
      console.log('[Theme] Usuário não autenticado, usando configurações padrão');
      applyTheme(settings);
      setLoading(false);
      return;
    }

    // 2. Verifica se é admin
    const user = JSON.parse(userStr);
    if (user.is_admin !== 1) {
      // Não é admin - usa configurações padrão
      console.log('[Theme] Usuário não é admin, usando configurações padrão');
      applyTheme(settings);
      setLoading(false);
      return;
    }

    // 3. É admin - carrega da API
    console.log('[Theme] Carregando configurações da API...');
    const response = await api.get('/settings/public');
    if (response.data.success) {
      console.log('[Theme] Configurações carregadas com sucesso');
      setSettings(prevSettings => ({
        ...prevSettings,
        ...response.data.data
      }));
      applyTheme(response.data.data);
    }
  } catch (error) {
    // Erro - usa configurações padrão
    console.warn('[Theme] Erro ao carregar configurações, usando padrão:', error.message);
    applyTheme(settings);
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 Fluxo de Decisão

```
┌─────────────────────────────────────┐
│   Aplicação Inicia / Página Carrega │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   ThemeContext: loadSettings()      │
└──────────────┬──────────────────────┘
               │
               ▼
       ┌───────────────┐
       │ Token existe? │
       └───────┬───────┘
               │
       ┌───────┴───────┐
       │ NÃO           │ SIM
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│ Tema Padrão │  │ is_admin=1? │
└─────────────┘  └──────┬──────┘
                        │
                ┌───────┴───────┐
                │ NÃO           │ SIM
                ▼               ▼
         ┌─────────────┐  ┌──────────────┐
         │ Tema Padrão │  │ GET /settings│
         └─────────────┘  │    /public   │
                          └──────┬───────┘
                                 │
                         ┌───────┴───────┐
                         │ Sucesso       │ Erro
                         ▼               ▼
                  ┌─────────────┐  ┌─────────────┐
                  │Tema da API  │  │ Tema Padrão │
                  └─────────────┘  └─────────────┘
```

---

## 🎨 Configurações Padrão (Hardcoded)

Quando não há acesso às configurações da API, o sistema usa:

```javascript
{
  // Cores
  primary_color: '#E55F52',        // Coral
  secondary_color: '#4A9FD8',      // Azul
  background_color: '#0a1628',     // Escuro
  text_color: '#e6eef8',           // Claro
  
  // Fontes
  font_primary: 'Inter',
  font_secondary: 'Orbitron',
  
  // Identidade
  logo_url: '/logo-vibeget.png',
  favicon_url: '/favicon.ico',
  site_name: 'VibeGet',
  site_description: 'Leilões Online com Cashback',
  
  // Imagem de fundo
  background_image: null,
  
  // Conteúdos (vazios por padrão)
  home_hero_title: 'Leilões Online com Cashback',
  home_hero_subtitle: 'Dispute produtos incríveis...',
  page_como_funciona: '',
  page_termos: '',
  // ... outros conteúdos vazios
}
```

---

## 🔍 Logs de Debug

O sistema gera logs no console do navegador para facilitar diagnóstico:

### Usuário Não Autenticado
```
[Theme] Usuário não autenticado, usando configurações padrão
```

### Usuário Comum (Não Admin)
```
[Theme] Usuário não é admin, usando configurações padrão
```

### Admin - Sucesso
```
[Theme] Carregando configurações da API...
[Theme] Configurações carregadas com sucesso
```

### Admin - Erro
```
[Theme] Carregando configurações da API...
[Theme] Erro ao carregar configurações, usando padrão: Network Error
```

---

## ✅ Vantagens da Implementação

### 1. **Segurança**
- ✅ Configurações não expostas publicamente
- ✅ Apenas administradores têm acesso
- ✅ Proteção contra scraping de dados

### 2. **Resiliência**
- ✅ Funciona sem autenticação (tema padrão)
- ✅ Funciona para usuários comuns (tema padrão)
- ✅ Funciona em caso de erro de rede
- ✅ Não quebra a aplicação

### 3. **Performance**
- ✅ Não faz requisições desnecessárias
- ✅ Verifica permissões antes de requisitar
- ✅ Carregamento rápido do tema padrão

### 4. **Flexibilidade**
- ✅ Admin pode personalizar completamente
- ✅ Tema padrão profissional e funcional
- ✅ Fácil manutenção

---

## 🧪 Testes

### Teste 1: Usuário Não Autenticado
```bash
1. Acesse http://localhost:3000 (sem login)
2. Abra DevTools Console (F12)
3. Veja: [Theme] Usuário não autenticado
4. ✅ Site carrega com tema padrão
```

### Teste 2: Usuário Comum
```bash
1. Login com usuário comum (is_admin=0)
2. Abra DevTools Console
3. Veja: [Theme] Usuário não é admin
4. ✅ Site carrega com tema padrão
```

### Teste 3: Administrador
```bash
1. Login com admin@vibeget.com
2. Abra DevTools Console
3. Veja: [Theme] Carregando configurações da API...
4. Veja: [Theme] Configurações carregadas com sucesso
5. ✅ Site carrega com tema personalizado da API
```

### Teste 4: Admin - API Offline
```bash
1. Login como admin
2. Pare o backend Docker: docker-compose down
3. Recarregue a página (F5)
4. Veja: [Theme] Erro ao carregar configurações
5. ✅ Site carrega com tema padrão (não quebra)
```

### Teste 5: Acesso Direto à API
```bash
# Sem autenticação
curl -X GET https://apileilao.verticos.com.br/api/settings/public
# Resultado: 401 Unauthorized ✅

# Com token de usuário comum
curl -X GET https://apileilao.verticos.com.br/api/settings/public \
  -H "Authorization: Bearer {token_usuario_comum}"
# Resultado: 403 Forbidden ✅

# Com token de admin
curl -X GET https://apileilao.verticos.com.br/api/settings/public \
  -H "Authorization: Bearer {token_admin}"
# Resultado: 200 OK + dados ✅
```

---

## 🔧 Configuração de Produção

### 1. Backend (.env)
```bash
# Domínios permitidos
CORS_ALLOWED_ORIGINS=https://vibeget.com,https://www.vibeget.com

# Domínios stateful (para cookies)
SANCTUM_STATEFUL_DOMAINS=vibeget.com,www.vibeget.com
```

### 2. Frontend (.env.production)
```bash
# URL da API em produção
REACT_APP_API_URL=https://apileilao.verticos.com.br/api
```

### 3. URLs Dinâmicas

O ThemeContext agora usa `REACT_APP_API_URL` automaticamente:

```javascript
// Automaticamente usa a URL correta do .env
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api')
  .replace('/api', '');

// Exemplos de uso:
// - Logo: ${API_BASE_URL}/uploads/logo.png
// - Background: ${API_BASE_URL}/uploads/bg.jpg
// - Favicon: ${API_BASE_URL}/favicon.ico
```

---

## 📝 Arquivos Modificados

### Backend
```
api/routes/api.php
  - Rota movida para dentro de middleware admin
  - GET /settings/public → requer auth:sanctum + admin
```

### Frontend
```
src/contexts/ThemeContext.js
  - Verificação de autenticação antes de requisitar
  - Verificação de permissão admin
  - URLs dinâmicas usando REACT_APP_API_URL
  - Logs de debug
  - Tratamento de erros resiliente
```

---

## 🚨 Troubleshooting

### Problema: Tema não carrega para admin

**Solução 1: Verificar autenticação**
```javascript
// No Console do navegador:
console.log('Token:', localStorage.getItem('access_token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

**Solução 2: Verificar logs**
```javascript
// Deve aparecer no console:
[Theme] Carregando configurações da API...
```

**Solução 3: Limpar cache**
```bash
# Backend
docker-compose exec app php artisan config:clear

# Frontend (navegador)
Ctrl + Shift + R (hard refresh)
```

---

### Problema: 401 Unauthorized

**Causa:** Token inválido ou expirado

**Solução:**
1. Faça logout
2. Faça login novamente
3. Token será renovado

---

### Problema: 403 Forbidden

**Causa:** Usuário não é admin (is_admin !== 1)

**Solução:**
1. Verificar no banco de dados: `SELECT is_admin FROM users WHERE email = '...'`
2. Atualizar se necessário: `UPDATE users SET is_admin = 1 WHERE email = '...'`
3. Fazer logout e login novamente

---

## 📚 Referências

- [Laravel API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Laravel Middleware](https://laravel.com/docs/11.x/middleware)
- [React Context API](https://react.dev/reference/react/useContext)
- [Environment Variables in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## ✅ Checklist de Implementação

- [x] Rota protegida com middleware admin
- [x] ThemeContext verifica permissões
- [x] Configurações padrão definidas
- [x] Logs de debug implementados
- [x] URLs dinâmicas usando .env
- [x] Tratamento de erros resiliente
- [x] Testes documentados
- [x] Documentação criada

---

**Desenvolvido com ❤️ para VibeGet**  
**Data:** Dezembro 2024  
**Versão:** 1.0 (Settings API Segura)

