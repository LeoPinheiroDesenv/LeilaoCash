# O que rodar ao concluir uma tarefa

Não há suíte de testes de domínio confiável neste projeto:
- `api/tests/` só tem os testes de exemplo padrão do Laravel (`Feature/ExampleTest.php`, `Unit/ExampleTest.php`) — nenhuma cobertura real de leilões/lances/pagamentos/Getcoin.
- Frontend não tem nenhum arquivo `*.test.js`/`*.spec.js`.

Ou seja: rodar `php artisan test` ou `npm test` **não** valida a lógica de negócio alterada. Para validar uma tarefa:
1. `docker compose exec app ./vendor/bin/pint` no backend (lint/estilo) se PHP foi tocado.
2. Testar manualmente o fluxo via container Docker local (subir com `/subir-docker`, bater na API em `http://localhost:8000` e/ou rodar o frontend com `npm start` apontando `REACT_APP_API_URL` para ele).
3. Para mudanças em lance/leilão/pagamento/Getcoin, testar o cenário fim-a-fim manualmente (ex.: dar lance, verificar débito/estorno de saldo) — ver `mem:backend/dominio_leiloes` para os invariantes que não podem quebrar (lance > current_bid, estorno integral ao ser superado, lock da transação).
4. Se a mudança afeta o fechamento de leilão, testar rodando manualmente `php artisan vibes:close-expired` dentro do container, já que não há scheduler ativo localmente.
