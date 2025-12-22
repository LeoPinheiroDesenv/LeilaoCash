# 🔧 Configuração de Ambiente - VibeGet

## 📋 Visão Geral

Este documento explica como configurar as variáveis de ambiente para o **Frontend (React)** e **Backend (Laravel)**.

---

## 🎨 Frontend (React)

### 📁 Arquivo: `.env`

```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:8000/api

# Outras configurações (futuro)
# REACT_APP_SITE_NAME=VibeGet
# REACT_APP_ENABLE_LOGS=false
```

### 🔄 Como Usar

O arquivo `.env` é usado pelo React para configurar variáveis de ambiente durante o build e execução.

**Importante:**
- Variáveis devem começar com `REACT_APP_`
- Após alterar o `.env`, **reinicie o servidor**:
  ```bash
  npm start
  ```

### 📍 Acesso no Código

```javascript
// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### 🌍 Ambientes Diferentes

#### Desenvolvimento
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

#### Produção
```bash
REACT_APP_API_URL=https://api.vibeget.com/api
```

#### Staging
```bash
REACT_APP_API_URL=https://staging-api.vibeget.com/api
```

---

## 🚀 Backend (Laravel)

### 📁 Arquivo: `api/.env`

```bash
# Aplicação
APP_NAME=VibeGet
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Banco de Dados (MySQL)
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=vibeget_db
DB_USERNAME=vibeget_user
DB_PASSWORD=vibeget_secure_pass_2024

# CORS - URLs permitidas (separadas por vírgula)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://vibeget.com

# Autenticação
AUTH_GUARD=web

# JWT (se necessário)
# JWT_SECRET=...
# JWT_ALGO=HS256
```

### 🔄 Como Usar

Após alterar o `.env` do backend:

```bash
cd api
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
```

### 📍 Acesso no Código

```php
// Qualquer arquivo PHP
$apiUrl = env('APP_URL', 'http://localhost');
$allowedOrigins = env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000');
```

---

## 🌐 CORS (Cross-Origin Resource Sharing)

### ❓ O que é CORS?

CORS é um mecanismo de segurança que permite que aplicações web em um domínio (ex: `localhost:3000`) façam requisições para outro domínio (ex: `localhost:8000`).

### ⚙️ Configuração

#### 1️⃣ Laravel (`api/config/cors.php`)
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS')),
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 86400,
    'supports_credentials' => true,
];
```

#### 2️⃣ Nginx (`api/docker/nginx/conf.d/app.conf`)
```nginx
# CORS Headers
add_header 'Access-Control-Allow-Origin' $http_origin always;
add_header 'Access-Control-Allow-Credentials' 'true' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN' always;
add_header 'Access-Control-Expose-Headers' 'Authorization' always;
add_header 'Access-Control-Max-Age' '86400' always;

# Handle preflight OPTIONS requests
if ($request_method = 'OPTIONS') {
    return 204;
}
```

#### 3️⃣ Laravel Bootstrap (`api/bootstrap/app.php`)
```php
->withMiddleware(function (Middleware $middleware) {
    // Habilitar CORS globalmente
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

### 🧪 Testar CORS

```bash
# Teste preflight (OPTIONS)
curl -I -X OPTIONS http://localhost:8000/api/settings/public \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"

# Teste GET
curl -X GET http://localhost:8000/api/settings/public \
  -H "Origin: http://localhost:3000"
```

**Resposta esperada:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN
```

---

## 🐛 Troubleshooting

### ❌ Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solução:**
1. Verifique se `CORS_ALLOWED_ORIGINS` está configurado no `api/.env`
2. Limpe o cache do Laravel:
   ```bash
   docker-compose exec app php artisan config:clear
   ```
3. Reinicie o Nginx:
   ```bash
   docker-compose restart nginx
   ```

### ❌ Erro: "Failed to fetch"

**Solução:**
1. Verifique se o backend está rodando: `curl http://localhost:8000/api/settings/public`
2. Verifique se a URL no `.env` está correta
3. Abra o DevTools do navegador e veja o erro específico

### ❌ Erro: "Network Error"

**Solução:**
1. Verifique se a `REACT_APP_API_URL` está correta
2. Reinicie o frontend: `npm start`
3. Verifique se não há firewall bloqueando

---

## 📦 Arquivos de Configuração

### Frontend
```
/var/www/html/LeilaoCash/
├── .env                    # ✅ Configurações (não versionado)
├── .env.example            # ✅ Template (versionado)
├── .gitignore              # ✅ Ignora .env
└── src/
    └── services/
        └── api.js          # ✅ Usa process.env.REACT_APP_API_URL
```

### Backend
```
/var/www/html/LeilaoCash/api/
├── .env                    # ✅ Configurações (não versionado)
├── .env.example            # ✅ Template (versionado)
├── config/
│   └── cors.php            # ✅ Configuração CORS
├── bootstrap/
│   └── app.php             # ✅ Middleware CORS habilitado
└── docker/
    └── nginx/
        └── conf.d/
            └── app.conf    # ✅ Headers CORS no Nginx
```

---

## 🚀 Deploy para Produção

### Frontend

1. **Criar arquivo `.env.production`:**
   ```bash
   REACT_APP_API_URL=https://api.vibeget.com/api
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   - Upload da pasta `build/` para o servidor
   - Configure o servidor web (Nginx/Apache)

### Backend

1. **Atualizar `api/.env`:**
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.vibeget.com
   CORS_ALLOWED_ORIGINS=https://vibeget.com,https://www.vibeget.com
   ```

2. **Otimizar:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Permissões:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

---

## 📚 Referências

- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Laravel Environment Configuration](https://laravel.com/docs/11.x/configuration)
- [CORS in Laravel](https://laravel.com/docs/11.x/routing#cors)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ✅ Checklist de Configuração

### Desenvolvimento
- [x] Frontend `.env` criado
- [x] Backend `api/.env` configurado
- [x] CORS habilitado
- [x] Docker containers rodando
- [x] Teste de comunicação Frontend ↔ Backend

### Produção
- [ ] URLs de produção configuradas
- [ ] HTTPS habilitado
- [ ] Certificado SSL instalado
- [ ] Cache otimizado
- [ ] Logs configurados
- [ ] Backup configurado

---

**Desenvolvido com ❤️ para VibeGet**  
**Última atualização:** Dezembro 2024

