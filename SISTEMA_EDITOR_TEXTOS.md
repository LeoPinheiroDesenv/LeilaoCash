# 📝 Sistema de Edição de Textos - VibeGet

## 🎯 Visão Geral

Sistema completo de edição de conteúdo textual utilizando **ReactQuill** (Quill.js) - um editor WYSIWYG leve, rápido e poderoso, com tema escuro personalizado.

---

## 🔄 Migração Realizada

### ❌ Removido
- **CKEditor5** (mais pesado, requer licença)
- `@ckeditor/ckeditor5-react`
- `ckeditor5`

### ✅ Implementado
- **ReactQuill** (leve, open-source, sem licença)
- `react-quill-new ^3.3.2`
- `highlight.js ^11.9.0`

---

## 📦 Pacotes Instalados

```json
{
  "dependencies": {
    "react-quill-new": "^3.3.2",
    "highlight.js": "^11.9.0"
  }
}
```

---

## 🏗️ Arquitetura do Sistema

### 1️⃣ **Componente TextEditor**
**Arquivo:** `src/components/TextEditor.js`

```javascript
import ReactQuill from 'react-quill-new';

const TextEditor = ({ value, onChange, placeholder }) => {
  // Configuração completa da toolbar
  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      // ... mais opções
    ]
  };
  
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
    />
  );
};
```

**Props:**
- `value` (string): Conteúdo HTML do editor
- `onChange` (function): Callback quando o conteúdo muda
- `placeholder` (string): Texto placeholder

---

### 2️⃣ **Estilização Personalizada**
**Arquivo:** `src/components/TextEditor.css`

#### 🎨 Tema Escuro VibeGet
```css
.text-editor-wrapper {
  background: #1a1a2e;  /* Fundo escuro */
  border-radius: 12px;
  border: 1px solid #2d2d44;
}

.text-editor-wrapper .ql-toolbar {
  background: #16213e;  /* Toolbar escura */
}

.text-editor-wrapper .ql-editor {
  color: #e5e7eb;       /* Texto claro */
  min-height: 300px;
}
```

#### 🎯 Características
- ✅ Cores personalizadas do VibeGet
- ✅ Ícones e botões estilizados
- ✅ Tooltips e dropdowns escuros
- ✅ Scrollbar customizada
- ✅ Responsivo (desktop, tablet, mobile)

---

### 3️⃣ **Integração no Painel Admin**
**Arquivo:** `src/pages/ConfiguracoesTextos.js`

```javascript
import TextEditor from '../components/TextEditor';

const ConfiguracoesTextos = ({ settings, setSettings }) => {
  return (
    <TextEditor
      value={settings.page_termos || ''}
      onChange={(content) => setSettings({
        ...settings,
        page_termos: content
      })}
      placeholder="Digite os termos de uso..."
    />
  );
};
```

---

## 🛠️ Funcionalidades do Editor

### 📝 Formatação de Texto
| Recurso | Descrição |
|---------|-----------|
| **Fontes** | Múltiplas fontes disponíveis |
| **Tamanhos** | Vários tamanhos de texto |
| **Negrito** | Texto em negrito |
| **Itálico** | Texto em itálico |
| **Sublinhado** | Texto sublinhado |
| **Riscado** | Texto riscado |
| **Cores** | Cor de texto e fundo |
| **Sub/Sobrescrito** | X₂ e X² |

### 📐 Estrutura
| Recurso | Descrição |
|---------|-----------|
| **Títulos** | H1, H2, H3 |
| **Citações** | Blocos de citação |
| **Código** | Blocos de código |
| **Listas** | Ordenadas e bullet |
| **Indentação** | Aumentar/diminuir |
| **Alinhamento** | Esquerda, centro, direita |
| **Direção** | LTR, RTL |

### 🎬 Mídia
| Recurso | Descrição |
|---------|-----------|
| **Links** | Inserir hyperlinks |
| **Imagens** | Upload de imagens |
| **Vídeos** | Embed de vídeos |

---

## 🎯 Áreas de Conteúdo Editáveis

### 📄 **Páginas Institucionais** (8 páginas)
1. **Como Funciona** - `page_como_funciona`
2. **Categorias** - `page_categorias`
3. **Termos de Uso** - `page_termos`
4. **FAQ** - `page_faq`
5. **Política de Privacidade** - `page_privacidade`
6. **Regras** - `page_regras`
7. **Contato** - `page_contato`
8. **Suba de Nível** - `page_suba_nivel`

### 🏠 **Home / Hero** (2 seções)
1. **Hero Principal** - `home_hero_title`, `home_hero_subtitle`, `home_hero_description`
2. **Por Que Escolher** - `home_why_choose`

### 🌐 **Redes Sociais** (4 redes)
1. **Facebook** - `social_facebook`
2. **Instagram** - `social_instagram`
3. **Twitter/X** - `social_twitter`
4. **YouTube** - `social_youtube`

---

## 🚀 Como Usar

### 1️⃣ **Acessar o Editor**
```
http://localhost:3000/dashboard-admin/configuracoes
```

### 2️⃣ **Navegar até Textos**
- Clique na aba **"Textos"**
- Escolha a sub-aba desejada:
  - **Páginas**: Editar páginas institucionais
  - **Home**: Editar conteúdo da home
  - **Redes Sociais**: Editar links sociais

### 3️⃣ **Editar Conteúdo**
- Use a toolbar para formatar
- Digite ou cole conteúdo
- Visualize em tempo real

### 4️⃣ **Salvar**
- Clique em **"Salvar Configurações"**
- As alterações são enviadas para a API
- Conteúdo é atualizado em todas as páginas

---

## 💻 Uso em Componentes

### Exemplo: Página Dinâmica
```javascript
import DynamicPage from '../pages/DynamicPage';

const Termos = () => (
  <DynamicPage 
    contentKey="page_termos"
    defaultTitle="Termos de Uso"
  />
);
```

### Exemplo: Hero da Home
```javascript
import { useTheme } from '../contexts/ThemeContext';

const Hero = () => {
  const { settings } = useTheme();
  
  return (
    <div>
      <h1>{settings.home_hero_title}</h1>
      <p>{settings.home_hero_description}</p>
    </div>
  );
};
```

---

## 🔧 Configuração Avançada

### Personalizar Toolbar
**Arquivo:** `src/components/TextEditor.js`

```javascript
const modules = {
  toolbar: [
    ['bold', 'italic'],              // Básico
    [{ 'list': 'ordered'}],          // Lista numerada
    ['link', 'image'],               // Mídia
    ['clean']                        // Limpar formatação
  ]
};
```

### Altura Mínima
```css
.text-editor-wrapper .ql-editor {
  min-height: 400px; /* Ajuste conforme necessário */
}
```

---

## 📊 API Endpoints

### Buscar Configurações (Público)
```http
GET /api/settings/public
```

**Response:**
```json
{
  "page_termos": "<p>Conteúdo HTML...</p>",
  "home_hero_title": "Bem-vindo ao VibeGet!",
  "social_facebook": "https://facebook.com/..."
}
```

### Salvar Configurações (Admin)
```http
POST /api/settings/batch
Authorization: Bearer {token}

{
  "settings": [
    {
      "key": "page_termos",
      "value": "<p>Novo conteúdo...</p>",
      "group": "content"
    }
  ]
}
```

---

## 🎨 Personalização de Estilos

### Cores do Tema
```css
/* Fundo principal */
--bg-primary: #1a1a2e;

/* Fundo toolbar */
--bg-toolbar: #16213e;

/* Bordas */
--border-color: #2d2d44;

/* Texto claro */
--text-light: #e5e7eb;

/* Cor destaque */
--accent: #7c3aed;
```

### Responsividade
```css
/* Tablet */
@media (max-width: 768px) {
  .ql-editor {
    padding: 16px;
    min-height: 250px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .ql-editor {
    padding: 12px;
    min-height: 200px;
    font-size: 14px;
  }
}
```

---

## 🐛 Troubleshooting

### Problema: Editor não carrega
**Solução:**
```bash
cd /var/www/html/LeilaoCash
npm install react-quill-new
npm start
```

### Problema: Estilo quebrado
**Solução:**
```javascript
// Certifique-se de importar o CSS
import 'react-quill-new/dist/quill.snow.css';
import './TextEditor.css';
```

### Problema: Conteúdo não salva
**Verificar:**
1. Token de autenticação válido
2. Permissões de admin
3. Endpoint da API correto
4. Estrutura do payload

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Quill.js Docs](https://quilljs.com/docs/)
- [ReactQuill GitHub](https://github.com/zenoamaro/react-quill)

### Exemplos de Uso
- Ver `template/src/pages/TermsConditionPage.jsx`
- Ver `template/src/components/TermsConditionLayer.jsx`

---

## ✅ Checklist de Implementação

- [x] Remover CKEditor5
- [x] Instalar ReactQuill
- [x] Criar componente TextEditor
- [x] Estilizar com tema escuro
- [x] Integrar no painel admin
- [x] Configurar toolbar completa
- [x] Adicionar responsividade
- [x] Testar salvamento
- [x] Criar documentação

---

## 🎉 Conclusão

O novo sistema de edição com **ReactQuill** oferece:

✅ **Melhor Performance** - Mais leve e rápido  
✅ **Sem Licenças** - Totalmente open-source  
✅ **Interface Intuitiva** - Fácil de usar  
✅ **Totalmente Customizável** - Cores, toolbar, comportamento  
✅ **Responsivo** - Funciona em todos os dispositivos  

**Pronto para usar! 🚀**

---

**Desenvolvido com ❤️ para VibeGet**  
**Versão:** 2.0 (ReactQuill)  
**Data:** Dezembro 2024
