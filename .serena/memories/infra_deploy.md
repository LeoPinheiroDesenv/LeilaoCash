# Infraestrutura e deploy

Produção: hospedagem compartilhada Hostinger, domínio `vibeget.net`. **Não há CI/CD.** Deploy é 100% manual via `./deploy.sh` (raiz do repo):
1. `npm run build` local (usa `.env.producao`).
2. `rsync` de `build/` → `domains/vibeget.net/public_html/` via SSH (`u542134834@82.25.73.168:65002`).
3. `rsync` de `api/` → `.../public_html/api/`, excluindo `vendor/` e todos os `.env*`.
4. Roda via SSH remoto as migrations pendentes uma a uma (`php artisan migrate --path=database/migrations/<nome>.php --force`).
5. Roda via SSH remoto uma lista fixa de seeders considerados seguros/idempotentes: `TranslationSeeder`, `TextSettingsSeeder`, `LevelRulesSeeder` (`--force`).

Se um novo seeder for criado e precisar rodar em produção a cada deploy, ele só deve entrar na lista `SAFE_SEEDERS` do `deploy.sh` se usar `updateOrCreate`/`updateOrInsert` (idempotente) — caso contrário duplicará dados a cada deploy.

Esta conta tem ferramentas MCP `hostinger-hosting`, `hostinger-agency-hosting`, `hostinger-domains`, `hostinger-dns`, `hostinger-vps`, `hostinger-reach`, `hostinger-billing` disponíveis — preferir essas ferramentas a SSH manual para investigar cron jobs, PHP version, banco remoto, SSL, DNS etc. em produção (ver gap de cron em `mem:backend/dominio_leiloes`).
