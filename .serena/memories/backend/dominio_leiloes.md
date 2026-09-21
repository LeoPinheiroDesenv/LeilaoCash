# Modelo de negócio: leilões, saldo e Getcoin

O leilão do VibeGet **não** é do tipo "leilão de centavos" (ficha fixa, incremento de centavo por lance, saldo pré-pago consumido a cada clique). É um modelo "tradicional" — literalmente comentado assim no código-fonte (`BidController::store`):
- Um lance só é aceito se `amount > current_bid` (ou `starting_bid` se ainda não houve lance).
- O saldo do usuário (`User->balance`) é debitado no **valor total do lance** (não uma ficha fixa).
- Quando um lance é superado, o saldo do lance anterior é **integralmente estornado** ao usuário superado (`Transaction` tipo `refund`).
- Tudo dentro de uma transação DB com `lockForUpdate()` no `Auction` para evitar corrida entre lances simultâneos.
- Ao dar lance: cria `Transaction` tipo `bid_purchase`, cria `Bid` com `is_winning=true`, marca os demais bids do leilão como `is_winning=false`, atualiza `current_bid`/`winner_id`/`bids_count` no `Auction`.

Fechamento de leilão (`CloseExpiredVibes`): dispara por prazo (`end_date` vencido) OU por `bids_count >= min_bids` (só depois de 1 dia do `start_date`). Tem `creditLosers` — perdedores recebem algum crédito ao encerrar (checar corpo do método antes de mexer em regras de crédito).

## Nível de fidelidade "Viber"
`User::recalculateViberLevel()` calcula `viber_level` a partir de `auctions_won`:
`>=15 diamond, >=13 platinum, >=10 gold, >=5 silver, >=1 bronze, senão inscrito`.

## Getcoin (moeda virtual, marketplace P2P)
`GetcoinController` / model `GetcoinOffer`: usuários criam ofertas de venda (`createOffer`), outros compram (`buyOffer`), o dono pode cancelar (`cancelOffer`), há listagem própria (`myOffers`) e compra direto da plataforma (`buyFromVibeget`). Rota pública de leitura: `getcoin/info`, `getcoin/offers`.

## Pagamentos
`PaymentController` (PIX e cartão) integra Mercado Pago; confirmação assíncrona via `WebhookController::handleMercadoPago` (rota pública `/webhooks/mercadopago`, sem auth — validar assinatura/origem se for mexer aqui).

## Gap operacional: fechamento automático depende de cron externo
`Schedule::command('vibes:close-expired')` só executa de fato se algo rodar `php artisan schedule:run` periodicamente. **Nem o `api/docker-compose.yml` local nem o `deploy.sh` de produção configuram esse cron.** Se leilões pararem de fechar sozinhos, suspeitar primeiro de cron ausente/quebrado no painel da hospedagem (Hostinger) antes de investigar a lógica do comando. Localmente, testar fechamento com `docker compose exec app php artisan vibes:close-expired`.
