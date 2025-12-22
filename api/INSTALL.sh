#!/bin/bash

echo "🚀 Iniciando instalação da VibeGet API..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para printar com cor
print_green() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_blue() {
    echo -e "${BLUE}→ $1${NC}"
}

print_red() {
    echo -e "${RED}✗ $1${NC}"
}

# 1. Verificar se Docker está instalado
print_blue "Verificando instalação do Docker..."
if ! command -v docker &> /dev/null; then
    print_red "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi
print_green "Docker encontrado"

# 2. Verificar se Docker Compose está instalado
print_blue "Verificando instalação do Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_red "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi
print_green "Docker Compose encontrado"

# 3. Copiar arquivo .env
print_blue "Configurando arquivo de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_green "Arquivo .env criado"
else
    print_green "Arquivo .env já existe"
fi

# 4. Subir containers Docker
print_blue "Iniciando containers Docker..."
docker-compose up -d
if [ $? -eq 0 ]; then
    print_green "Containers iniciados com sucesso"
else
    print_red "Erro ao iniciar containers"
    exit 1
fi

# 5. Aguardar MySQL estar pronto
print_blue "Aguardando MySQL inicializar..."
sleep 10
print_green "MySQL pronto"

# 6. Instalar dependências do Composer
print_blue "Instalando dependências do Composer..."
docker-compose exec -T app composer install --no-interaction
if [ $? -eq 0 ]; then
    print_green "Dependências instaladas"
else
    print_red "Erro ao instalar dependências"
    exit 1
fi

# 7. Gerar chave da aplicação
print_blue "Gerando chave da aplicação..."
docker-compose exec -T app php artisan key:generate
print_green "Chave gerada"

# 8. Executar migrations
print_blue "Executando migrations..."
docker-compose exec -T app php artisan migrate --force
if [ $? -eq 0 ]; then
    print_green "Migrations executadas"
else
    print_red "Erro ao executar migrations"
    exit 1
fi

# 9. Executar seeders
print_blue "Executando seeders (criando usuários de teste)..."
docker-compose exec -T app php artisan db:seed
if [ $? -eq 0 ]; then
    print_green "Seeders executados"
else
    print_red "Erro ao executar seeders"
fi

# 10. Ajustar permissões
print_blue "Ajustando permissões..."
docker-compose exec -T app chmod -R 777 storage bootstrap/cache
print_green "Permissões ajustadas"

echo ""
echo "======================================"
echo "✅ Instalação concluída com sucesso!"
echo "======================================"
echo ""
echo "📝 URLs de Acesso:"
echo "   API: http://localhost:8000"
echo "   PhpMyAdmin: http://localhost:8080"
echo ""
echo "🔑 Credenciais de Teste:"
echo "   Admin: admin@vibeget.com / admin123"
echo "   Usuário: usuario@teste.com / teste123"
echo ""
echo "🧪 Testar API:"
echo "   curl http://localhost:8000/api/health"
echo ""
echo "📚 Documentação completa: README.md"
echo ""

