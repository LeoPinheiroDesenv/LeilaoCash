# Guia Rápido de Configuração - VibeGet API

## 🚀 Início Rápido

### 1. Subir os containers Docker

```bash
cd /var/www/html/LeilaoCash/api
docker-compose up -d
```

### 2. Instalar dependências

```bash
docker-compose exec app composer install
```

### 3. Gerar chave da aplicação

```bash
docker-compose exec app php artisan key:generate
```

### 4. Executar migrations

```bash
docker-compose exec app php artisan migrate
```

### 5. Executar seeders (opcional - cria usuários de teste)

```bash
docker-compose exec app php artisan db:seed
```

### 6. Ajustar permissões

```bash
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

## ✅ Verificar instalação

### Teste de saúde da API:

```bash
curl http://localhost:8000/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "VibeGet API is running",
  "timestamp": "2024-12-18T..."
}
```

### Teste de login:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"teste123"}'
```

## 🔑 Credenciais de Teste

Após executar o seeder (`php artisan db:seed`), você terá:

**Admin:**
- Email: `admin@vibeget.com`
- Senha: `admin123`

**Usuário:**
- Email: `usuario@teste.com`
- Senha: `teste123`

## 🌐 URLs de Acesso

- API: http://localhost:8000
- PhpMyAdmin: http://localhost:8080
  - Servidor: `db`
  - Usuário: `vibeget_user`
  - Senha: `vibeget_password`

## 🛠️ Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Entrar no container
docker-compose exec app bash

# Limpar cache
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear

# Criar nova migration
docker-compose exec app php artisan make:migration nome_da_migration

# Criar novo controller
docker-compose exec app php artisan make:controller NomeController

# Criar novo model
docker-compose exec app php artisan make:model NomeModel
```

## 📝 Próximos Passos

1. ✅ API rodando em http://localhost:8000
2. ✅ Autenticação funcionando
3. ✅ Banco de dados configurado
4. 📋 Implementar endpoints de produtos/leilões
5. 📋 Implementar sistema de lances
6. 📋 Implementar sistema de cashback
7. 📋 Integração com frontend React

## 🐛 Problemas Comuns

### "Connection refused" ao acessar API

```bash
# Verifique se os containers estão rodando
docker-compose ps

# Reinicie os containers
docker-compose restart
```

### Erro ao conectar no banco de dados

```bash
# Aguarde alguns segundos para o MySQL iniciar completamente
docker-compose logs db

# Se necessário, recrie os containers
docker-compose down
docker-compose up -d
```

### Erro "Class not found"

```bash
# Recrie o autoload
docker-compose exec app composer dump-autoload
```

## 📚 Documentação Completa

Consulte o arquivo `README.md` para documentação detalhada de todos os endpoints e funcionalidades.

