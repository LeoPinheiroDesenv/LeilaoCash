# Frontend — estrutura

SPA React (Create React App) na **raiz do repositório** (não em subpasta `frontend/`). Pastas em `src/`: `assets/`, `components/`, `contexts/` (`AuthContext.js`, `ThemeContext.js`), `dev/`, `pages/`, `services/`, `utils/`, `i18n/`.

Todas as rotas centralizadas em `src/App.js` (uma única árvore de `<Route>`), dividida em dois grandes blocos:
- `/dashboard/*` — área administrativa protegida (usuários, categorias, marcas, modelos, produtos, leilões, lances, cashback, transações, relatórios, contatos, páginas, logs, configurações com sub-rotas layout/textos/traduções/sistema) e área do usuário logado (`minha-conta`, `meus-lances`, `meu-cashback`, `getcoin-marketplace`, `meus-favoritos`).
- Rotas públicas — home, `/leiloes`, `/produto/:slug`, páginas institucionais (`como-funciona`, `contato`, `faq`, `termos`, `privacidade`, `regras`, `manual`) e páginas customizáveis via CMS (`/p/:slug`, back por `PageController`/model `Page`).

`AuthContext` guarda sessão/token Sanctum; `ThemeContext` controla tema (claro/escuro).
