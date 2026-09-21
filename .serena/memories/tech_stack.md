# Tech stack

## Backend (`api/`)
- PHP ^8.2, Laravel ^11, Laravel Sanctum ^4 (auth via token, SPA/API).
- MySQL 8 (container `vibeget_db`, db name `vibeget_db`, user `vibeget_user`).
- Sem Redis/queue dedicada: `QUEUE_CONNECTION=database`, `CACHE_STORE=database`, `SESSION_DRIVER=database`.
- Sem serviço de scheduler/cron no `docker-compose.yml` — ver `mem:backend/dominio_leiloes` sobre o impacto disso no fechamento de leilões.
- Pint (`laravel/pint`) para lint PHP; PHPUnit ^11 presente mas só com os testes de exemplo padrão do Laravel (nenhum teste de domínio escrito).

## Frontend (raiz do repo, não em subpasta `frontend/`)
- Create React App (`react-scripts` ^5) + React 18, sem TypeScript.
- Roteamento: `react-router-dom` v7, todas as rotas centralizadas em `src/App.js`.
- UI: Bootstrap 5, `@phosphor-icons/react`, `react-icons`, `apexcharts` (gráficos do dashboard admin), CKEditor 5 (editor rico), `animate.css`.
- i18n: `i18next` + `react-i18next` (`src/i18n/locales`).
- Dois arquivos de env distintos consumidos via `env-cmd`: `.env.local` (dev) e `.env.producao` (build de produção) — variável chave: `REACT_APP_API_URL`.

## Docker local
- Único compose real do projeto: `api/docker-compose.yml` (nome do compose project: `api`).
- Serviços: `app` (PHP-FPM, container `vibeget_api`), `nginx` (container `vibeget_nginx`, porta `8000:80`), `db` (MySQL, container `vibeget_db`, porta `3306`), `phpmyadmin` (container `vibeget_phpmyadmin`, porta `8080:80`).
- Rede: `vibeget_network`. Volume nomeado `dbdata` para o MySQL (única persistência real do compose).
