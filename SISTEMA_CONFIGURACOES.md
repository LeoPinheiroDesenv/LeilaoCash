# Sistema de Configurações Personalizáveis - VibeGet

## 📋 Visão Geral

Sistema completo que permite ao administrador personalizar cores, fontes, imagens e configurações gerais da aplicação através de uma interface web intuitiva.

## 🎨 Funcionalidades

### 1. Personalização de Cores
- **Cor Primária**: Cor principal da marca (botões, links, destaques)
- **Cor Secundária**: Cor de apoio (elementos secundários)
- **Cor de Fundo**: Cor de fundo principal da aplicação
- **Cor do Texto**: Cor do texto principal

**Preview em Tempo Real**: Visualize as cores antes de salvar

### 2. Personalização de Fontes
- **Fonte Primária**: Fonte para textos gerais
- **Fonte Secundária**: Fonte para títulos e destaques

### 3. Personalização de Imagens
- **Logo Principal**: Logo exibida em todo o site
- **Favicon**: Ícone exibido na aba do navegador
- **Imagem de Fundo**: Background opcional para o site

**Upload Seguro**: 
- Formatos: JPEG, PNG, JPG, GIF, SVG
- Tamanho máximo: 2MB
- Validação automática

### 4. Configurações Gerais
- **Nome do Site**: Título exibido no navegador
- **Descrição do Site**: Meta description para SEO

## 🔧 Backend (Laravel API)

### Estrutura do Banco de Dados

```sql
CREATE TABLE settings (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NULL,
    type VARCHAR(255) DEFAULT 'string',
    group VARCHAR(255) DEFAULT 'general',
    description TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Tipos de Configurações
- `string`: Texto simples
- `color`: Cor hexadecimal
- `image`: URL de imagem
- `json`: Dados estruturados

### Grupos de Configurações
- `theme`: Cores e fontes
- `appearance`: Imagens e aparência
- `general`: Configurações gerais

### Rotas da API

#### Públicas (sem autenticação)
```
GET /api/settings/public
```
Retorna todas as configurações públicas para o frontend

#### Administrativas (requer autenticação + is_admin)
```
GET /api/settings
GET /api/settings/group/{group}
PUT /api/settings/{key}
POST /api/settings/batch
POST /api/settings/upload-image
```

### Exemplo de Uso da API

```javascript
// Buscar configurações públicas
fetch('http://localhost:8000/api/settings/public')
  .then(res => res.json())
  .then(data => console.log(data));

// Atualizar configuração (Admin)
fetch('http://localhost:8000/api/settings/primary_color', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ value: '#FF5733' })
});

// Upload de imagem (Admin)
const formData = new FormData();
formData.append('image', file);
formData.append('key', 'logo_url');

fetch('http://localhost:8000/api/settings/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

## 🎨 Frontend (React)

### ThemeContext

O `ThemeContext` é responsável por:
1. Carregar configurações da API
2. Aplicar cores via CSS variables
3. Aplicar fontes dinamicamente
4. Atualizar imagens (logo, favicon)
5. Gerenciar título e meta tags

```javascript
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { settings, getLogoUrl, refreshTheme } = useTheme();
  
  return (
    <img src={getLogoUrl()} alt={settings.site_name} />
  );
}
```

### CSS Variables Dinâmicas

As seguintes variáveis CSS são definidas em `:root` e podem ser sobrescritas:

```css
:root {
  --color-primary: #E55F52;
  --color-secondary: #4A9FD8;
  --color-background: #0a1628;
  --color-text: #e6eef8;
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Orbitron', sans-serif;
}
```

Use-as em seus componentes:

```css
.my-button {
  background: var(--color-primary);
  color: var(--color-text);
  font-family: var(--font-primary);
}
```

## 📍 Como Usar

### Para Administradores

1. **Acesse o painel de configurações:**
   ```
   http://localhost:3000/dashboard-admin/configuracoes
   ```

2. **Navegue pelas abas:**
   - **Tema e Cores**: Personalize cores
   - **Aparência**: Faça upload de imagens
   - **Geral**: Configure nome e descrição

3. **Faça suas alterações**

4. **Clique em "Salvar Configurações"**

5. **As alterações serão aplicadas automaticamente em toda a aplicação**

### Para Desenvolvedores

#### Adicionar Nova Configuração

1. **No Backend** (`api/database/seeders/DatabaseSeeder.php`):
```php
DB::table('settings')->insert([
    'key' => 'minha_nova_config',
    'value' => 'valor_padrao',
    'type' => 'string',
    'group' => 'general',
    'description' => 'Descrição da configuração',
    'created_at' => now(),
    'updated_at' => now()
]);
```

2. **Execute o seeder:**
```bash
docker-compose exec app php artisan db:seed
```

3. **A configuração estará disponível automaticamente na interface**

#### Usar Configuração no Frontend

```javascript
const { settings } = useTheme();
console.log(settings.minha_nova_config);
```

## 🔐 Segurança

- ✅ Apenas administradores podem modificar configurações
- ✅ Validação de tipos de arquivo no upload
- ✅ Limite de tamanho de 2MB para imagens
- ✅ Sanitização de valores antes de salvar
- ✅ Rotas protegidas com middleware `admin`

## 📦 Arquivos Criados/Modificados

### Backend
- `api/database/migrations/2024_12_18_000003_create_settings_table.php`
- `api/app/Models/Setting.php`
- `api/app/Http/Controllers/Api/SettingsController.php`
- `api/app/Http/Middleware/AdminMiddleware.php`
- `api/routes/api.php`
- `api/bootstrap/app.php`
- `api/public/uploads/` (diretório)

### Frontend
- `src/contexts/ThemeContext.js`
- `src/pages/Configuracoes.js`
- `src/pages/Configuracoes.css`
- `src/App.js` (modificado)
- `src/App.css` (modificado)
- `src/components/Header.js` (modificado)
- `src/components/Footer.js` (modificado)
- `src/components/AdminLayout.js` (modificado)
- `src/components/UserLayout.js` (modificado)

## 🚀 Próximos Passos (Sugestões)

1. **Adicionar mais configurações:**
   - Redes sociais
   - Informações de contato
   - Configurações de email
   - Textos personalizáveis

2. **Melhorias de UX:**
   - Preview ao vivo das alterações
   - Histórico de alterações
   - Importar/Exportar configurações
   - Temas pré-definidos

3. **Integrações:**
   - Google Analytics ID
   - Facebook Pixel
   - Configurações de pagamento
   - API keys de terceiros

## ❓ Troubleshooting

### As cores não estão mudando
- Verifique se o `ThemeProvider` está envolvendo toda a aplicação
- Confirme que os CSS variables estão sendo usados nos estilos
- Limpe o cache do navegador (Ctrl+Shift+R)

### Erro ao fazer upload de imagem
- Verifique se o diretório `api/public/uploads/` tem permissão de escrita
- Confirme que o arquivo não excede 2MB
- Verifique se o formato é suportado (jpeg, png, jpg, gif, svg)

### Logo não aparece
- Verifique se a URL da imagem está correta
- Confirme que o arquivo foi salvo em `api/public/uploads/`
- Verifique se o caminho completo está acessível

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação da API: `api/README.md`
- Logs do Laravel: `api/storage/logs/`
- Console do navegador para erros do frontend

---

**Desenvolvido para VibeGet** | Sistema de Configurações v1.0
