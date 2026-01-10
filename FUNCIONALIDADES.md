# Documentação de Funcionalidades - LeilaoCash / VibeGet

Este documento descreve as funcionalidades implementadas na plataforma de leilões online.

## 1. Módulo de Autenticação e Usuários

### Funcionalidades
*   **Cadastro de Usuários:** Registro de novos usuários com validação de dados (Nome, E-mail, CPF, Telefone, Senha).
*   **Login:** Autenticação segura via token (JWT/Sanctum).
*   **Recuperação de Senha:** Fluxo completo com solicitação via e-mail, geração de token seguro e redefinição de senha.
*   **Perfil do Usuário:** Visualização e edição de dados cadastrais.
*   **Gestão de Sessão:** Logout do dispositivo atual ou de todos os dispositivos conectados.
*   **Controle de Acesso (ACL):** Distinção entre usuários comuns e administradores, com rotas e menus protegidos.

## 2. Módulo de Produtos e Catálogo

### Funcionalidades
*   **Gestão de Categorias:** Cadastro, edição e exclusão de categorias de produtos.
*   **Gestão de Marcas e Modelos:** Cadastro estruturado de marcas e modelos para padronização.
*   **Gestão de Produtos:**
    *   Cadastro completo com descrição, especificações técnicas e preço base.
    *   Upload de múltiplas imagens (galeria).
    *   Associação com categoria, marca e modelo.
*   **Listagem Pública:** Exibição de produtos disponíveis para leilão com filtros por categoria e busca textual.

## 3. Módulo de Leilões

### Funcionalidades
*   **Criação de Leilões:** Definição de produto, data de início/fim, lance inicial, incremento mínimo e regras de cashback.
*   **Status do Leilão:** Controle de estados (Rascunho, Agendado, Ativo, Pausado, Finalizado, Cancelado).
*   **Sala de Leilão (Página do Produto):**
    *   Cronômetro regressivo em tempo real.
    *   Exibição do lance atual e do vencedor temporário.
    *   Atualização automática de dados (polling) para acompanhar lances de outros usuários.
*   **Sistema de Lances:**
    *   Validação de saldo disponível.
    *   Validação de valor do lance (maior que o atual + incremento).
    *   Débito automático do saldo do usuário.
    *   Estorno automático do saldo para o usuário que foi superado (se aplicável ao modelo de negócio).
    *   Registro histórico de todos os lances.

## 4. Módulo Financeiro

### Funcionalidades
*   **Carteira Digital:** Controle de saldo de créditos e saldo de cashback para cada usuário.
*   **Compra de Créditos:**
    *   **Pix:** Geração automática de QR Code e código "Copia e Cola" via integração com Mercado Pago. Atualização automática do status via polling e webhook.
    *   **Cartão de Crédito:** Processamento de pagamentos via cartão (integração Mercado Pago).
*   **Cashback:** Cálculo e crédito automático de cashback baseado nas regras do leilão.
*   **Histórico de Transações:** Extrato detalhado de todas as movimentações (depósitos, lances, estornos, cashback).

## 5. Painel Administrativo

### Funcionalidades
*   **Dashboard:** Visão geral com métricas principais (usuários, leilões ativos, receita).
*   **Gestão de Conteúdo (CMS):**
    *   Edição de textos de todas as páginas institucionais (Home, FAQ, Termos, etc.).
    *   Personalização de tema (cores, fontes, logo, favicon).
*   **Configurações do Sistema:** Gerenciamento de chaves de API (Mercado Pago) e parâmetros globais.
*   **Relatórios:**
    *   Relatório geral de desempenho.
    *   Relatório financeiro (receita, cashback).
    *   Relatório de usuários.
*   **Logs de Sistema:** Visualização de logs de erro e atividades para auditoria.

## 6. Integrações

### Mercado Pago
*   Geração de pagamentos Pix.
*   Processamento de cartões de crédito.
*   Webhooks para confirmação automática de pagamentos.

## 7. Aspectos Técnicos

*   **Frontend:** React.js (SPA), Context API para gerenciamento de estado global (Auth, Theme), CSS responsivo.
*   **Backend:** Laravel (API REST), MySQL, Sanctum para autenticação.
*   **Segurança:** Proteção contra CSRF, validação de dados, sanitização de inputs, proteção de rotas sensíveis.
