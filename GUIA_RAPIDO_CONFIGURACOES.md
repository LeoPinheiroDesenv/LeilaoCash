# Guia Rápido - Sistema de Configurações

## 🚀 Acesso Rápido

**URL do Painel**: `http://localhost:3000/dashboard-admin/configuracoes`

**Credenciais**:
- Email: `admin@vibeget.com`
- Senha: `password`

## 🎨 Como Usar

### 1. Personalizar Cores

1. Acesse a aba **"Tema e Cores"**
2. Clique no campo de cor ou digite o código hexadecimal
3. Veja o preview em tempo real
4. Clique em **"Salvar Configurações"**

**Cores Disponíveis:**
- **Primária**: Cor principal (botões, links, CTAs)
- **Secundária**: Cor de apoio
- **Fundo**: Cor de fundo da aplicação
- **Texto**: Cor do texto principal

### 2. Alterar Fontes

1. Acesse a aba **"Tema e Cores"**
2. Digite o nome da fonte (ex: "Roboto", "Poppins")
3. Clique em **"Salvar Configurações"**

**Fontes Disponíveis:**
- **Primária**: Fonte para textos gerais
- **Secundária**: Fonte para títulos

### 3. Upload de Imagens

1. Acesse a aba **"Aparência"**
2. Clique em **"Escolher Imagem"**
3. Selecione o arquivo (máx 2MB)
4. A imagem será enviada automaticamente

**Imagens Disponíveis:**
- **Logo Principal**: Exibida em todo o site
- **Favicon**: Ícone da aba do navegador
- **Background**: Imagem de fundo (opcional)

### 4. Configurações Gerais

1. Acesse a aba **"Geral"**
2. Altere nome e descrição do site
3. Clique em **"Salvar Configurações"**

## ⚡ Comandos Úteis

### Resetar Cache (se algo não atualizar)

```bash
cd api
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
```

### Ver Logs de Erro

```bash
cd api
docker-compose exec app tail -f storage/logs/laravel.log
```

### Testar API Manualmente

```bash
# Testar rota pública
curl http://localhost:8000/api/settings/public

# Login e teste de rota protegida
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vibeget.com","password":"password"}' | \
  grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

curl http://localhost:8000/api/settings \
  -H "Authorization: Bearer $TOKEN"
```

## 🔧 Problemas Comuns

### "The route api/settings could not be found"

**Solução 1**: Limpar cache do Laravel
```bash
cd api
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan config:clear
```

**Solução 2**: Verificar se está logado
- Faça logout e login novamente
- Use as credenciais: `admin@vibeget.com` / `password`

### "api/api/settings" (duplo /api)

**Causa**: Chamada incorreta da API no código

**Solução**: Usar caminhos relativos sem `/api`
```javascript
// ❌ ERRADO
api.get('/api/settings')

// ✅ CORRETO
api.get('/settings')
```

### Cores não atualizam

**Solução**:
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se salvou as configurações
3. Recarregue a página

### Imagem não aparece

**Solução**:
1. Verifique o tamanho (máx 2MB)
2. Formatos aceitos: JPEG, PNG, JPG, GIF, SVG
3. Veja se o upload foi concluído (mensagem de sucesso)

## 📝 Padrão de Cores VibeGet

```css
Primária:    #E55F52 (Coral/Laranja)
Secundária:  #4A9FD8 (Azul)
Fundo:       #0a1628 (Azul escuro)
Texto:       #e6eef8 (Branco azulado)
```

## 🎯 Exemplos de Uso

### Tema Escuro Moderno
```
Primária:    #00D9FF
Secundária:  #7B2CBF
Fundo:       #0D1117
Texto:       #F0F6FC
```

### Tema Claro Corporativo
```
Primária:    #2563EB
Secundária:  #0891B2
Fundo:       #F9FAFB
Texto:       #111827
```

### Tema Vibrante
```
Primária:    #F43F5E
Secundária:  #8B5CF6
Fundo:       #18181B
Texto:       #FAFAFA
```

## 📚 Documentação Completa

Para informações detalhadas, consulte:
- `SISTEMA_CONFIGURACOES.md` - Documentação completa
- `TESTE_API_SETTINGS.md` - Testes e troubleshooting
- `api/CORRECAO_SANCTUM_GUARD.md` - Correções técnicas

## 💡 Dicas

1. **Preview**: Use o preview de cores antes de salvar
2. **Backup**: Anote as cores originais antes de mudar
3. **Consistência**: Mantenha contraste entre fundo e texto
4. **Fontes**: Use fontes disponíveis no Google Fonts
5. **Imagens**: Use logos em PNG com fundo transparente

---

**Precisa de ajuda?** Consulte a documentação completa ou verifique os logs!
