# Modelo de negócio: leilões, saldo e Getcoin

O leilão do VibeGet é um **leilão de centavos**: um lance ("Get") só é aceito se `amount > current_bid` (ou `starting_bid`). O saldo do usuário (`User->balance`, dinheiro real) é debitado no valor total do Get, e **esse valor é consumido definitivamente** se o Get for superado — não há estorno intermediário (corrigido em 2026-09-21, ver histórico abaixo). A única compensação a quem perde um Get vem no fechamento da Vibe.

Fluxo de um Get (`BidController::store`): valida `amount > current_bid` e saldo suficiente, debita `balance`, cria `Transaction` tipo `bid_purchase`, cria `Bid` com `is_winning=true`, marca os demais bids do leilão como `is_winning=false`, atualiza `current_bid`/`winner_id`/`bids_count` no `Auction`. Tudo dentro de uma transação DB com `lockForUpdate()` no `Auction` para evitar corrida entre lances simultâneos.

Fechamento de leilão (`CloseExpiredVibes`): dispara por prazo (`end_date` vencido) OU por `bids_count >= min_bids` (só depois de 1 dia do `start_date`). `closeVibe` recalcula o "Champion Bid" (maior `amount` entre todos os bids da Vibe), marca-o como vencedor, atualiza `auctions_won`/`viber_level` do vencedor, e chama `creditLosers`: credita **40% do valor de cada `Bid` com `is_winning=false`** em `cashback_balance` (GetCoin) do respectivo apostador. Essa é a ÚNICA compensação a um Get perdedor — **não reintroduzir estorno em `BidController::store`**, ou volta o bug histórico (ver abaixo).

## Histórico: dois bugs corrigidos em 2026-09-21 (encontrados testando manualmente end-to-end)

**Bug 1 — reembolso duplo:** até então, `BidController::store` estornava 100% do valor em `balance` sempre que um lance era superado, durante a disputa (antes do fechamento). Somado aos 40% de `creditLosers` no fechamento, cada Get perdedor gerava 140% de retorno ao usuário — identificado cruzando o código com a copy oficial do site ("Ajustes jul26...pdf" / "COPYS PÁGINAS.docx", que prometem só 40% de volta). Corrigido removendo o bloco de estorno intermediário do `store`.

**Bug 2 — vencedor creditado como perdedor (Eloquent dirty-tracking stale):** em `closeVibe`, a sequência original era:
```php
$championBid = Bid::where(...)->orderByDesc('amount')->first(); // carrega com is_winning=true (valor real)
Bid::where('auction_id', $vibe->id)->update(['is_winning' => false]); // mass update via query builder — NÃO atualiza $championBid em memória
$championBid->is_winning = true; // atribui true a um objeto que EM MEMÓRIA já é true (stale) → Eloquent não marca como dirty
$championBid->save(); // getDirty() vazio → vira no-op, is_winning do campeão fica false no banco!
```
Resultado: o vencedor real da Vibe sempre ficava com `is_winning=false` no banco após o fechamento (pois todo Bid vencedor chega do `BidController` com `is_winning=true`, então a atribuição em `closeVibe` nunca "mudava" nada do ponto de vista do objeto em memória). Ele então entrava erroneamente na lista de `creditLosers` e ganhava 40% de cashback como se tivesse perdido — confirmado em teste manual (vencedor de um Get de R$10 recebeu R$4 de GetCoin indevidamente). Corrigido trocando por duas queries via query builder direto (sem depender de dirty-checking de um objeto Eloquent potencialmente stale):
```php
Bid::where('auction_id', $vibe->id)->where('id', '!=', $championBid->id)->update(['is_winning' => false]);
Bid::where('id', $championBid->id)->update(['is_winning' => true]);
```
**Lição geral (vale para qualquer parte do código):** nunca misturar um mass-update via query builder com um `save()` subsequente de um objeto Eloquent carregado ANTES desse update — o objeto fica com estado "stale" e o dirty-checking do Eloquent pode silenciosamente not fazer nada. Ou usar `refresh()` no objeto antes de reatribuir, ou fazer tudo via query builder.

Ambos os bugs foram encontrados rodando um teste manual completo end-to-end (registro de 2 usuários via API real, dois Gets reais via HTTP/Sanctum, fechamento via `php artisan vibes:close-expired`) — não são visíveis sem executar o fluxo real, já que não há testes automatizados cobrindo isso (ver `mem:task_completion`).

## Dois saldos distintos no `User`
- `balance`: R$ real, comprado via Pix/cartão (`PaymentController`/`WebhookController::handleMercadoPago`), debitado a cada Get. Rota pública de saque (`type=withdrawal` já previsto em `ReportController`) ainda não implementada em nenhum controller/rota.
- `cashback_balance`: GetCoin, moeda virtual bônus — não sacável, só usável dentro do site (comprar produtos/Gets, negociar no marketplace P2P). Fontes de crédito: 1º depósito (`WebhookController::applyFirstCreditBonus`, mesmo valor em GetCoin), % por nível Viber a cada recarga PIX (`applyLevelCashback`, setting `getcoin_pct_{nivel}`), bônus de indicação por nível do indicador (`applyReferralBonus`, setting `referral_getcoin_{nivel}`, só no 1º crédito do indicado), e os 40% de Gets perdedores (`creditLosers`).

## Nível de fidelidade "Viber"
`User::recalculateViberLevel()` calcula `viber_level` a partir de `auctions_won`:
`>=15 diamond, >=13 platinum, >=10 gold, >=5 silver, >=1 bronze, senão inscrito`.

## Getcoin (moeda virtual, marketplace P2P)
`GetcoinController` / model `GetcoinOffer`: usuários criam ofertas de venda (`createOffer`), outros compram (`buyOffer`), o dono pode cancelar (`cancelOffer`), há listagem própria (`myOffers`) e compra direto da plataforma (`buyFromVibeget`). Rota pública de leitura: `getcoin/info`, `getcoin/offers`.

## Pagamentos
`PaymentController` (PIX e cartão) integra Mercado Pago; confirmação assíncrona via `WebhookController::handleMercadoPago` (rota pública `/webhooks/mercadopago`, sem auth — validar assinatura/origem se for mexer aqui).

## Gap operacional: fechamento automático depende de cron externo
`Schedule::command('vibes:close-expired')` só executa de fato se algo rodar `php artisan schedule:run` periodicamente. **Nem o `api/docker-compose.yml` local nem o `deploy.sh` de produção configuram esse cron.** Se leilões pararem de fechar sozinhos, suspeitar primeiro de cron ausente/quebrado no painel da hospedagem (Hostinger) antes de investigar a lógica do comando. Localmente, testar fechamento com `docker compose exec app php artisan vibes:close-expired`. Confirmado em 2026-09-21: havia uma Vibe (`id=39`) parada em `status=active` com `end_date` vencido há tempo no banco local, evidência direta do gap.

## Divergências copy vs. código ainda não resolvidas (ver documentos de requisitos)
- Copy promete "Cashback de boas-vindas" ao se cadastrar; `AuthController::register` inicializa `balance` e `cashback_balance` em 0, sem bônus.
- Copy descreve poder misturar GetCoin + dinheiro no mesmo Get ("até o mesmo valor pago em R$"); `BidController::store` só aceita um único campo `amount` debitado de `balance` — não usa `cashback_balance` na hora de dar lance.
