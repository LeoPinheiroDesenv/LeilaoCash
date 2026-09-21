# Backend (api/) — estrutura

Todos os endpoints em `app/Http/Controllers/Api/*Controller.php` (namespace `App\Http\Controllers\Api`), roteados em `routes/api.php`. Models em `app/Models/*.php`.

Controllers principais: `AuctionController`, `BidController`, `BrandController`, `CategoryController`, `ContactController`, `FavoriteController`, `GetcoinController`, `LogController`, `PageController`, `PaymentController`, `ProductController`, `ProductModelController`, `ReportController`, `SettingsController`, `SetupController`, `TransactionController`, `TranslationController`, `UserController`, `WebhookController`, `AuthController`.

Models principais: `Auction`, `Bid`, `Brand`, `Category`, `Contact`, `Favorite`, `GetcoinOffer`, `Page`, `Product`, `ProductModel`, `Setting`, `Transaction`, `Translation`, `User`.

## Rotas (`routes/api.php`)
- Rotas públicas (sem middleware): `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/webhooks/mercadopago` (Mercado Pago), `/categories/public`, `/products/public*`, `/auctions/public*`, `/auctions/home`, `/settings/public*`, `/contacts`, `/pages/public*`, `/translations/public`.
- Grupo autenticado: `middleware(['debug.auth', 'auth:sanctum'])` — inclui `auth/me`, `user/*` (perfil, saldo, lances, transações), `payments/*` (PIX e cartão via Mercado Pago), `auctions/{id}/bids` (dar lance), `getcoin/*` (marketplace P2P), `favorites/*`.
- Sub-grupo admin: `middleware('admin')` dentro do grupo autenticado — `settings/*`, `translations/*` (admin), `users/*` (CRUD), `categories/*`, `brands/*` e demais CRUDs administrativos.
- Middlewares customizados relevantes: `debug.auth` (provavelmente logging/depuração de auth) e `admin` (checagem de papel).

## Console
- `app/Console/Commands/CloseExpiredVibes.php` (assinatura `vibes:close-expired`): fecha leilões (`Auction`) com `status=active` e `end_date` vencido, OU que atingiram `min_bids` (após pelo menos 1 dia desde `start_date`). Métodos internos: `closeVibe`, `creditLosers` (perdedores recebem algum crédito de volta ao fechar).
- Agendado em `routes/console.php`: `Schedule::command('vibes:close-expired')->everyFiveMinutes()`.
- Ver `mem:backend/dominio_leiloes` para o modelo de negócio de lance/leilão e o gap de cron em produção/local.

Deploy real de produção não usa este `api/` isolado com CI — ver `mem:infra_deploy`.
