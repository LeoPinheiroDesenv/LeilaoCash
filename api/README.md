# VibeGet API - Laravel REST API

API REST desenvolvida em Laravel 11 para o sistema VibeGet, com autenticação via Laravel Sanctum e banco de dados MySQL.

## 🚀 Tecnologias

- **Laravel 11** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **Laravel Sanctum** - Autenticação API
- **Docker & Docker Compose** - Containerização
- **Nginx** - Servidor web
- **PHP 8.2-FPM** - Runtime PHP

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Git

## 🔧 Instalação e Configuração

### 1. Clone o repositório (se ainda não tiver)

```bash
cd /var/www/html/LeilaoCash/api
```

### 2. Configure o ambiente

```bash
# Copie o arquivo de ambiente
cp .env.example .env
```

### 3. Suba os containers Docker

```bash
docker-compose up -d
```

### 4. Instale as dependências do Composer

```bash
docker-compose exec app composer install
```

### 5. Gere a chave da aplicação

```bash
docker-compose exec app php artisan key:generate
```

### 6. Execute as migrations e seeders

```bash
# Rodar migrations
docker-compose exec app php artisan migrate

# Rodar seeders (cria usuários de teste)
docker-compose exec app php artisan db:seed
```

### 7. Configure as permissões

```bash
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

## 🌐 Acesso

- **API**: http://localhost:8000
- **PhpMyAdmin**: http://localhost:8080
  - Servidor: `db`
  - Usuário: `vibeget_user`
  - Senha: `vibeget_password`

## 📡 Endpoints da API

### Health Check

```http
GET /api/health
```

**Resposta:**
```json
{
  "success": true,
  "message": "VibeGet API is running",
  "timestamp": "2024-12-18T10:00:00.000000Z"
}
```

### Autenticação

#### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "password_confirmation": "senha123",
  "cpf": "12345678900",
  "phone": "(11) 99999-9999",
  "birth_date": "1990-01-01"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": { ... },
    "access_token": "token_aqui",
    "token_type": "Bearer"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": { ... },
    "access_token": "token_aqui",
    "token_type": "Bearer"
  }
}
```

#### Usuários de Teste (criados pelo seeder)

**Admin:**
- Email: `admin@vibeget.com`
- Senha: `admin123`

**Usuário:**
- Email: `usuario@teste.com`
- Senha: `teste123`

### Rotas Protegidas (Requerem Autenticação)

Todas as rotas abaixo requerem o header de autenticação:

```http
Authorization: Bearer {seu_token_aqui}
```

#### Obter dados do usuário autenticado

```http
GET /api/auth/me
```

#### Logout

```http
POST /api/auth/logout
```

#### Logout de todos os dispositivos

```http
POST /api/auth/logout-all
```

#### Atualizar perfil

```http
PUT /api/auth/profile
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "phone": "(11) 88888-8888",
  "address": "Rua Exemplo, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567"
}
```

#### Alterar senha

```http
PUT /api/auth/change-password
Content-Type: application/json

{
  "current_password": "senha_atual",
  "password": "nova_senha",
  "password_confirmation": "nova_senha"
}
```

#### Obter saldo

```http
GET /api/user/balance
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "balance": "500.00",
    "cashback_balance": "50.00"
  }
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: users

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint | ID do usuário |
| name | string | Nome completo |
| email | string | Email (único) |
| password | string | Senha (hash) |
| cpf | string | CPF (único) |
| phone | string | Telefone |
| birth_date | date | Data de nascimento |
| address | string | Endereço |
| city | string | Cidade |
| state | string | Estado (UF) |
| zip_code | string | CEP |
| balance | decimal | Saldo em créditos |
| cashback_balance | decimal | Saldo de cashback |
| is_admin | boolean | Se é administrador |
| is_active | boolean | Se está ativo |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

## 🐳 Comandos Docker Úteis

```bash
# Ver logs
docker-compose logs -f

# Ver logs apenas da API
docker-compose logs -f app

# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild dos containers
docker-compose up -d --build

# Acessar o container da aplicação
docker-compose exec app bash

# Rodar comandos artisan
docker-compose exec app php artisan [comando]

# Limpar cache
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
```

## 🔒 Segurança

- Todas as senhas são criptografadas com bcrypt
- Autenticação via tokens (Laravel Sanctum)
- CORS configurado para permitir apenas origens específicas
- Validação de dados em todas as requisições
- SQL injection protection (Eloquent ORM)

## 📝 Variáveis de Ambiente

As principais variáveis no arquivo `.env`:

```env
APP_NAME="VibeGet API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=vibeget_db
DB_USERNAME=vibeget_user
DB_PASSWORD=vibeget_password

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🧪 Testando a API

### Usando cURL

```bash
# Health check
curl http://localhost:8000/api/health

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"teste123"}'

# Acessar rota protegida
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Usando Postman ou Insomnia

1. Importe a coleção de requisições
2. Configure a variável de ambiente com a base URL: `http://localhost:8000`
3. Após o login, salve o token na variável de ambiente
4. Use o token nas requisições protegidas

## 🛠️ Desenvolvimento

### Estrutura de Pastas

```
api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── AuthController.php
│   │   └── Middleware/
│   └── Models/
│       └── User.php
├── config/
│   ├── auth.php
│   ├── cors.php
│   ├── database.php
│   └── sanctum.php
├── database/
│   ├── migrations/
│   └── seeders/
├── docker/
│   ├── nginx/
│   └── php/
├── routes/
│   ├── api.php
│   └── console.php
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## 🐛 Troubleshooting

### Erro de conexão com o banco

```bash
# Verifique se o container do MySQL está rodando
docker-compose ps

# Reinicie os containers
docker-compose restart
```

### Permissões negadas

```bash
# Ajuste as permissões
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### Erro "Class not found"

```bash
# Recrie o autoload
docker-compose exec app composer dump-autoload
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
