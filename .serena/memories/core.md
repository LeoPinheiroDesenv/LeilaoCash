# VibeGet (repo local: LeilaoCash) — mapa do projeto

Monorepo: SPA React na raiz + API Laravel em `api/`. Nome do produto e do domínio de produção é **VibeGet** (`vibeget.net`) — a pasta local chama-se `LeilaoCash` por herança histórica; `package.json`, `api/composer.json`, containers Docker e o vocabulário do próprio código usam "VibeGet"/"vibeget". `README.md` da raiz documenta apenas o scaffold inicial genérico e está obsoleto — não usar como fonte de setup.

Domínio: plataforma de leilões. Vocabulário do produto: "Vibe" = leilão (`Auction`), "Get" = lance (`Bid`), "Viber" = nível de fidelidade do usuário. Ver `mem:backend/dominio_leiloes` para o modelo de negócio.

Referências:
- `mem:tech_stack` — linguagens, frameworks, versões.
- `mem:backend/core` — estrutura da API Laravel (controllers/models/rotas).
- `mem:backend/dominio_leiloes` — modelo de negócio de lance/leilão, Viber, Getcoin.
- `mem:frontend/core` — estrutura da SPA React.
- `mem:suggested_commands` — comandos de dev (docker, artisan, npm).
- `mem:infra_deploy` — como o deploy real acontece (manual, sem CI/CD) e hospedagem.
- `mem:task_completion` — o que rodar (e o que NÃO existe) para validar uma tarefa concluída.
- `mem:backend/ambiente_local_migrations` — drift de migrations no banco local (reconciliado 2026-09-21), o que fazer se `migrate:status` voltar a mostrar "Pending".
