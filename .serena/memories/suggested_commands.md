# Comandos úteis

## Docker (backend local)
- Subir: `cd api && docker compose up -d` (ou skill `/subir-docker`).
- Executar artisan: `docker compose exec app php artisan <comando>` (ex.: `migrate`, `tinker`, `vibes:close-expired`).
- Lint PHP: `docker compose exec app ./vendor/bin/pint`.
- Testes (só exemplos padrão, sem cobertura real de domínio): `docker compose exec app php artisan test`.
- Containers: `vibeget_api` (PHP-FPM), `vibeget_nginx` (porta 8000), `vibeget_db` (MySQL 3306), `vibeget_phpmyadmin` (porta 8080).

## Frontend (raiz do repo)
- Dev: `npm start` (usa `.env.local` via `env-cmd`).
- Build de produção: `npm run build` (usa `.env.producao`) — é o que `deploy.sh` roda.
- Testes: `npm test` (react-scripts/jest) — não há arquivos `*.test.js` escritos no projeto.

## Deploy real
- `./deploy.sh` (ver `mem:infra_deploy`) — builda frontend, sincroniza via rsync/ssh para Hostinger, roda migrations e seeders seguros em produção.
