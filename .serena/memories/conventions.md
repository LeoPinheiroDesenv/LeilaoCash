# Convenções específicas do projeto

- Vocabulário de domínio ≠ nomes de classe: no código/BD é `Auction`/`Bid` (inglês), mas produto/comandos/rotas usam "Vibe" (leilão) e "Get" (lance) — ex. comando `vibes:close-expired`. Ao procurar algo relacionado a "Vibe" ou "Get" no contexto de negócio, procurar por `Auction`/`Bid` no código.
- Todos os controllers de API ficam sob `app/Http/Controllers/Api/`, namespace `App\Http\Controllers\Api`, independente de serem admin ou público — a separação público/autenticado/admin é feita só pelos grupos de middleware em `routes/api.php`, não por pastas diferentes.
- Middlewares customizados do projeto: `debug.auth` (aplicado junto com `auth:sanctum` em todas as rotas autenticadas) e `admin` (gate de rotas administrativas) — verificar `app/Http/Middleware/` ao mexer em autorização.
- `README.md` da raiz está desatualizado (documenta apenas o scaffold inicial) — não usar como referência de arquitetura ou setup atual; ver `mem:core`.
- Deploy/infra real do produto não segue o que está documentado publicamente em lugar nenhum do repo — está todo em `mem:infra_deploy`.
