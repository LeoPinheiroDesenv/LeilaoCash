# Guia de Níveis e Cashback - VibeGet

Este documento descreve como o sistema de níveis e cashback está implementado no VibeGet, como as regras são aplicadas e como alterá-las.

## 1. Funcionamento do Sistema

O sistema de níveis é baseado no número de "Vibes" (leilões) vencidas pelo usuário. Esse valor é armazenado na coluna `auctions_won` da tabela `users`.

### Níveis e Requisitos

| Nível | Vitórias Necessárias | Cashback | Benefícios Adicionais |
| :--- | :--- | :--- | :--- |
| **Inscrito** | 0 - 4 | 40% | Nível inicial. |
| **Bronze** | 1 - 4 | 40% | Primeira vitória. |
| **Prata** | 5 - 8 | 45% | Concorrer a prêmios, benefícios exclusivos. |
| **Ouro** | 9 - 11 | 45% | Comercializar Cashback, visibilidade, prioridade em sugestões. |
| **Diamante** | 12 - 13 | 50% | Maior visibilidade. |
| **Platina** | 14+ | 60% | Suporte prioritário, voz ativa em decisões de produtos. |

## 2. Implementação Técnica

### Backend (API)

A lógica central reside no arquivo `api/app/Http/Controllers/Api/AuctionController.php`.

*   **Incremento de Vitórias:** Quando um leilão é marcado como `finished`, o método `update` incrementa `auctions_won` do vencedor.
*   **Cálculo de Cashback:** O método `calculateCashbackPercentage($wins)` retorna a porcentagem baseada nas vitórias.
*   **Nome do Nível:** O método `getLevelName($wins)` retorna a string com o nome do nível.

### Frontend (React)

O progresso do usuário é exibido no Dashboard e em páginas informativas.

*   **Página "Suba de Nível":** Localizada em `src/pages/SubaDeNivel.js`, ela renderiza conteúdo dinâmico vindo da tabela `settings` (chave `page_suba_de_nivel`).
*   **Dashboard do Usuário:** Localizado em `src/pages/DashboardUsuario.js`, contém a função `getUserLevel(wins)` que deve estar em sincronia com o backend para exibir o ícone, cor e progresso correto para o próximo nível.

## 3. Como Alterar as Regras

### Alterar Porcentagens ou Limites de Vitórias

1.  **No Backend:**
    Edite o arquivo `api/app/Http/Controllers/Api/AuctionController.php`:
    *   Modifique `calculateCashbackPercentage` para novas porcentagens.
    *   Modifique `getLevelName` para novos nomes ou faixas de vitórias.

2.  **No Frontend:**
    Edite o arquivo `src/pages/DashboardUsuario.js`:
    *   Modifique a função `getUserLevel` para refletir as mesmas faixas de vitórias e nomes definidos no backend.

3.  **Na Documentação Pública (Página Suba de Nível):**
    O conteúdo da página pode ser editado via Painel Administrativo em "Configurações de Texto" -> "Página Suba de Nível" ou rodando o seeder atualizado:
    ```bash
    docker exec vibeget_api php artisan db:seed --class=LevelRulesSeeder --force
    ```

## 4. Verificação

Para verificar o nível de um usuário via banco de dados:
```sql
SELECT name, auctions_won FROM users WHERE id = {USER_ID};
```

Para simular vitórias para um usuário (ex: id 1):
```sql
UPDATE users SET auctions_won = 14 WHERE id = 1;
```
