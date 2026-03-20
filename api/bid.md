--- /dev/null
+++ /home/leonidas/Documentos/projetos/LeilaoCash/api/docs/CASHBACK_RULES.md
@@ -0,0 +1,52 @@
+# Regras de Cashback e Níveis de Usuário
+
+Este documento descreve a lógica aplicada para o cálculo de Cashback e progressão de níveis dos usuários na plataforma LeilãoCash.
+
+## Regras de Negócio
+
+O sistema de níveis é baseado no número de leilões vencidos (`auctions_won`) pelo usuário. O nível do usuário determina a porcentagem de cashback que ele recebe sobre o valor gasto em lances nos leilões que **não** venceu.
+
+### Níveis e Porcentagens
+
+| Nível | Vitórias Necessárias | Porcentagem de Cashback | Benefícios Adicionais |
+| :--- | :---: | :---: | :--- |
+| **Inscrito** | 0 | 40% | Acesso às Vibes abertas. |
+| **Bronze** | 1 | 40% | Participação ativa. |
+| **Prata** | 5 | 45% | Aumento de Cashback. Concorre a prêmios. |
+| **Ouro** | 9 | 45% | Comercialização de Cashback. Prioridade em sugestões. |
+| **Diamante** | 12 | 50% | Aumento de Cashback. Maior visibilidade. |
+| **Platina** | 14+ | 60% | Cashback máximo. Suporte prioritário. |
+
+### Funcionamento Técnico
+
+A lógica é aplicada automaticamente quando um leilão é finalizado (status alterado para `finished`).
+
+1.  **Gatilho**: O método `update` no `AuctionController` detecta a mudança de status para `finished`.
+2.  **Distribuição**: O método `distributeCashback` é chamado.
+3.  **Cálculo**:
+    *   O sistema identifica todos os usuários que deram lances no leilão, excluindo o vencedor.
+    *   Para cada usuário, soma-se o valor total gasto em lances naquele leilão.
+    *   O sistema verifica o número de vitórias (`auctions_won`) do usuário para determinar a porcentagem de cashback (método `calculateCashbackPercentage`).
+    *   O valor do cashback é calculado: `Total Gasto * (Porcentagem / 100)`.
+4.  **Crédito**: O valor é adicionado ao `cashback_balance` do usuário.
+5.  **Registro**: Uma transação do tipo `cashback` é criada para histórico.
+
+## Como Alterar as Regras
+
+Para modificar as porcentagens ou os requisitos de níveis, edite o arquivo:
+
+`api/app/Http/Controllers/Api/AuctionController.php`
+
+### Alterar Porcentagens e Requisitos
+
+Localize o método `calculateCashbackPercentage`:
+
+```php
+private function calculateCashbackPercentage($wins)
+{
+    if ($wins >= 14) return 60; // Platina
+    if ($wins >= 12) return 50; // Diamante
+    if ($wins >= 5) return 45;  // Prata e Ouro
+    return 40;                  // Base/Bronze
+}
+```
+
+Altere os valores de retorno (porcentagem) ou as condições (número de vitórias) conforme necessário.
