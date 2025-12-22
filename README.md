# LeilaoCash API

Este diretório contém a configuração para rodar a API do LeilaoCash com Docker.

## Passos para Configuração

Devido a limitações no ambiente de execução, a criação do projeto Laravel não pôde ser automatizada. Siga os passos abaixo para configurar o ambiente.

### 1. Criar o Projeto Laravel

Você precisa ter o Composer instalado na sua máquina local.

```bash
# Navegue até o diretório da api e execute o comando
cd api
composer create-project laravel/laravel .
```

### 2. Subir os Contêineres Docker

Após a criação do projeto Laravel, volte para a raiz do projeto e execute o `docker-compose`.

```bash
# Na raiz do projeto
docker-compose up -d --build
```

### 3. Instalar Dependências e Configurar o Laravel

Acesse o contêiner da aplicação para rodar os comandos do Laravel.

```bash
docker-compose exec app bash
```

Dentro do contêiner, execute os seguintes comandos:

```bash
# Instalar dependências do composer
composer install

# Copiar o arquivo de ambiente
cp .env.example .env

# Gerar a chave da aplicação
php artisan key:generate

# Rodar as migrações do banco de dados
php artisan migrate
```

### 4. Implementar Autenticação

Para implementar o login e autenticação, você pode usar o Laravel Breeze. Dentro do contêiner `app`, execute:

```bash
# Instalar o Laravel Breeze
composer require laravel/breeze --dev

# Instalar o Breeze com a stack de API
php artisan breeze:install api

# Rodar as migrações novamente para criar as tabelas do Breeze
php artisan migrate
```

Após esses passos, sua API Laravel estará rodando em `http://localhost:8000` com os endpoints de autenticação prontos para serem usados.
