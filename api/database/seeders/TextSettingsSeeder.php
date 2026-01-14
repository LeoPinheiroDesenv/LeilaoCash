<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class TextSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $texts = [
            // Geral - Botões e Ações
            'text_ver_todos' => ['value' => 'Ver todos', 'desc' => '📍 Botão ao lado dos títulos das seções de produtos'],
            'text_ver_leilao' => ['value' => 'Ver Leilão', 'desc' => '📍 Botão nos cards de produtos na página inicial'],
            'text_comprar_creditos' => ['value' => 'Comprar Créditos', 'desc' => 'Botão para comprar créditos'],
            'text_dar_lance' => ['value' => 'Dar Lance', 'desc' => '📍 Botão principal na página do produto'],
            'text_salvar' => ['value' => 'Salvar', 'desc' => 'Botão Salvar (painel admin)'],
            'text_cancelar' => ['value' => 'Cancelar', 'desc' => 'Botão Cancelar (painel admin)'],
            'text_criar' => ['value' => 'Criar', 'desc' => 'Botão Criar (painel admin)'],
            'text_atualizar' => ['value' => 'Atualizar', 'desc' => 'Botão Atualizar (painel admin)'],
            'text_deletar' => ['value' => 'Deletar', 'desc' => 'Botão Deletar (painel admin)'],
            'text_editar' => ['value' => 'Editar', 'desc' => 'Botão Editar (painel admin)'],
            'text_voltar' => ['value' => 'Voltar', 'desc' => '📍 Botão Voltar em várias páginas'],
            'text_loading' => ['value' => 'Carregando...', 'desc' => '📍 Mensagem exibida durante carregamento'],
            'text_erro_carregar' => ['value' => 'Erro ao carregar', 'desc' => 'Mensagem de erro ao carregar'],
            'text_try_again' => ['value' => 'Tentar Novamente', 'desc' => '📍 Botão para tentar novamente em caso de erro'],

            // Header
            'text_header_home' => ['value' => 'Início', 'desc' => '📍 Link "Início" no menu de navegação superior'],
            'text_header_highlights' => ['value' => 'Destaques', 'desc' => '📍 Link "Destaques" no menu de navegação'],
            'text_header_ending_soon' => ['value' => 'Encerrando', 'desc' => '📍 Link "Encerrando" no menu de navegação'],
            'text_header_login' => ['value' => 'Entrar', 'desc' => '📍 Botão "Entrar" no canto superior direito'],
            'text_header_cadastro' => ['value' => 'Cadastrar', 'desc' => '📍 Botão "Cadastrar" no canto superior direito'],
            'text_header_search_placeholder' => ['value' => 'Buscar leilão...', 'desc' => '📍 Placeholder do campo de busca no header (quando não está na home)'],
            'text_header_leiloes' => ['value' => 'Leilões', 'desc' => 'Menu Leilões (mobile)'],
            'text_header_como_funciona' => ['value' => 'Como Funciona', 'desc' => '📍 Link "Como Funciona" no botão CTA'],
            'text_header_suba_de_nivel' => ['value' => 'Suba de Nível', 'desc' => 'Menu Suba de Nível'],
            'text_header_auctions' => ['value' => 'Leilões', 'desc' => 'Link Leilões no menu mobile'],

            // Hero (Home)
            'text_hero_cashback_banner' => ['value' => 'Até 10% de Cashback em cada lance', 'desc' => '📍 Banner verde no topo da página inicial com ícone de raio'],
            'text_hero_title' => ['value' => 'Leilões Online com', 'desc' => '📍 Primeira parte do título principal grande no centro da página inicial'],
            'text_hero_title_highlight' => ['value' => 'Cashback Real', 'desc' => '📍 Parte destacada do título (texto em gradiente colorido)'],
            'text_hero_subtitle' => ['value' => 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!', 'desc' => '📍 Subtítulo abaixo do título principal'],
            'text_hero_search_placeholder' => ['value' => 'Buscar produtos em leilão...', 'desc' => '📍 Texto dentro do campo de busca no Hero'],
            'text_hero_tag' => ['value' => '#LeilõesDeCentavos', 'desc' => 'Tag do Hero (não usado atualmente)'],
            'text_hero_stat_users' => ['value' => '15K+', 'desc' => '📍 Número de usuários nas estatísticas do Hero'],
            'text_hero_stat_users_label' => ['value' => 'Usuários', 'desc' => '📍 Label abaixo do número de usuários'],
            'text_hero_stat_cashback' => ['value' => 'R$2M+', 'desc' => '📍 Valor em cashback nas estatísticas do Hero'],
            'text_hero_stat_cashback_label' => ['value' => 'Em Cashback', 'desc' => '📍 Label abaixo do valor de cashback'],
            'text_hero_stat_auctions' => ['value' => '1.8K+', 'desc' => '📍 Número de leilões nas estatísticas do Hero'],
            'text_hero_stat_auctions_label' => ['value' => 'Leilões', 'desc' => '📍 Label abaixo do número de leilões'],

            // Seções da Home
            'text_section_destaques_title' => ['value' => 'Em Destaque', 'desc' => '📍 Título da primeira seção de produtos na página inicial'],
            'text_section_destaques_subtitle' => ['value' => 'Os leilões mais disputados', 'desc' => '📍 Subtítulo abaixo do título "Em Destaque"'],
            'icon_section_destaques' => ['value' => '⭐', 'desc' => '📍 Ícone ao lado do título "Em Destaque" (pode ser emoji ou código SVG)'],
            'text_section_quentes_title' => ['value' => 'Ofertas Quentes', 'desc' => '📍 Título da segunda seção de produtos na página inicial'],
            'text_section_quentes_subtitle' => ['value' => 'Preços irresistíveis', 'desc' => '📍 Subtítulo abaixo do título "Ofertas Quentes"'],
            'icon_section_quentes' => ['value' => '🔥', 'desc' => '📍 Ícone ao lado do título "Ofertas Quentes"'],
            'text_section_encerrando_title' => ['value' => 'Encerrando em Breve', 'desc' => '📍 Título da terceira seção de produtos na página inicial'],
            'text_section_encerrando_subtitle' => ['value' => 'Última chance!', 'desc' => '📍 Subtítulo abaixo do título "Encerrando em Breve"'],
            'icon_section_encerrando' => ['value' => '⏰', 'desc' => '📍 Ícone ao lado do título "Encerrando em Breve"'],

            // Why Choose Us
            'text_why_title' => ['value' => 'Por que comprar na LeilãoCash?', 'desc' => '📍 Título principal da seção "Por que comprar" no final da página inicial'],
            'text_why_card_1_title' => ['value' => 'Uma Nova Forma de Adquirir', 'desc' => '📍 Título do primeiro card na seção "Por que comprar"'],
            'text_why_card_1_desc' => ['value' => 'Ao invés de comprar de forma convencional, você participa de uma Vibe interativa onde o Get que você está disposto a investir é o que define sua chance de ganhar. Isso transforma cada Vibe em uma experiência emocionante!', 'desc' => '📍 Descrição do primeiro card'],
            'text_why_card_2_title' => ['value' => 'Cash Back Sempre ao Seu Lado', 'desc' => '📍 Título do segundo card na seção "Por que comprar"'],
            'text_why_card_2_desc' => ['value' => 'Não importa se você ganha ou perde a Vibe, você sempre ganha Cash back! Mesmo não sendo o Champion Get, você recebe 40% de volta do valor que investiu, para continuar participando de mais Vibes. Mais oportunidades, mais chances de ganhar!', 'desc' => '📍 Descrição do segundo card'],
            'text_why_card_3_title' => ['value' => 'Produtos Cobiçados', 'desc' => '📍 Título do terceiro card na seção "Por que comprar"'],
            'text_why_card_3_desc' => ['value' => 'Oferecemos uma ampla variedade de produtos que atendem aos mais diversos gostos. A cada Vibe, você tem a chance de adquirir itens que são realmente desejados por todos.', 'desc' => '📍 Descrição do terceiro card'],
            'text_why_card_4_title' => ['value' => 'Agilidade e Praticidade', 'desc' => '📍 Título do quarto card na seção "Por que comprar"'],
            'text_why_card_4_desc' => ['value' => 'Nosso cadastro é rápido e gratuito, e a recarga de crédito pode ser feita de forma simples por Pix ou Cartão de Crédito. Tudo é feito para ser rápido, seguro e sem complicação, permitindo que você participe de Vibes sem perder tempo.', 'desc' => '📍 Descrição do quarto card'],

            // Footer
            'text_footer_sobre' => ['value' => 'Sobre Nós', 'desc' => 'Título Sobre Nós (Footer) - não usado atualmente'],
            'text_footer_sobre_desc' => ['value' => 'A melhor plataforma de leilões online do Brasil. Ganhe cashback em cada lance!', 'desc' => '📍 Descrição da empresa na primeira coluna do rodapé'],
            'text_footer_links_uteis' => ['value' => 'Links Úteis', 'desc' => 'Título Links Úteis (Footer) - não usado atualmente'],
            'text_footer_contato' => ['value' => 'Contato', 'desc' => '📍 Título da coluna "Contato" no rodapé'],
            'text_footer_copyright' => ['value' => '© ' . date('Y') . ' LeilãoCash. Todos os direitos reservados.', 'desc' => '📍 Texto de copyright no final do rodapé'],
            'text_footer_quick_links' => ['value' => 'Links Rápidos', 'desc' => '📍 Título da coluna "Links Rápidos" no rodapé'],
            'text_footer_legal' => ['value' => 'Legal', 'desc' => '📍 Título da coluna "Legal" no rodapé'],
            'text_cta_title' => ['value' => 'Comece a ganhar Cashback agora!', 'desc' => '📍 Título da seção CTA antes do rodapé na página inicial'],
            'text_cta_subtitle' => ['value' => 'Cadastre-se gratuitamente e participe dos melhores leilões online do Brasil.', 'desc' => '📍 Subtítulo da seção CTA'],

            // Página de Leilões Públicos
            'text_auctions_title' => ['value' => 'Todos os Leilões', 'desc' => '📍 Título principal da página /leiloes'],
            'text_auctions_subtitle' => ['value' => 'Confira os leilões ativos e dê o seu lance!', 'desc' => '📍 Subtítulo da página /leiloes'],
            'text_all_categories' => ['value' => 'Todas as Categorias', 'desc' => '📍 Opção padrão no filtro de categorias'],
            'text_no_auctions' => ['value' => 'Nenhum leilão encontrado com os filtros selecionados.', 'desc' => '📍 Mensagem quando não há leilões'],
            
            // Product Page
            'text_back' => ['value' => 'Voltar', 'desc' => '📍 Botão Voltar na página do produto'],
            'text_hot_deal' => ['value' => 'Hot Deal', 'desc' => 'Badge Hot Deal'],
            'text_cashback' => ['value' => 'Cashback', 'desc' => 'Texto Cashback'],
            'text_previous_image' => ['value' => 'Imagem anterior', 'desc' => 'Alt Imagem Anterior'],
            'text_next_image' => ['value' => 'Próxima imagem', 'desc' => 'Alt Próxima Imagem'],
            'text_image' => ['value' => 'Imagem', 'desc' => 'Alt Imagem'],
            'text_active' => ['value' => 'Ativo', 'desc' => 'Status Ativo'],
            'text_inactive' => ['value' => 'Inativo', 'desc' => 'Status Inativo'],
            'text_visits' => ['value' => 'Visitas', 'desc' => 'Label Visitas'],
            'text_category' => ['value' => 'Categoria', 'desc' => 'Label Categoria'],
            'text_information' => ['value' => 'Informações', 'desc' => 'Título Informações'],
            'text_brand' => ['value' => 'Marca', 'desc' => 'Label Marca'],
            'text_model' => ['value' => 'Modelo', 'desc' => 'Label Modelo'],
            'text_auction' => ['value' => 'Leilão', 'desc' => 'Título Leilão'],
            'text_status' => ['value' => 'Status', 'desc' => 'Label Status'],
            'text_scheduled' => ['value' => 'Agendado', 'desc' => 'Status Agendado'],
            'text_finished' => ['value' => 'Encerrado', 'desc' => 'Status Encerrado'],
            'text_starting_bid' => ['value' => 'Lance Inicial', 'desc' => 'Label Lance Inicial'],
            'text_time_remaining' => ['value' => 'Tempo restante', 'desc' => 'Label Tempo Restante'],
            'text_current_bid' => ['value' => 'Lance atual', 'desc' => 'Label Lance Atual'],
            'text_product_price' => ['value' => 'Valor de mercado', 'desc' => 'Label Valor de Mercado'],
            'text_current_leader' => ['value' => 'Líder atual', 'desc' => 'Label Líder Atual'],
            'text_bids' => ['value' => 'lances', 'desc' => 'Sufixo Lances'],
            'text_bidding' => ['value' => 'Enviando...', 'desc' => 'Botão Enviando'],
            'text_place_bid' => ['value' => 'Dar Lance', 'desc' => 'Botão Dar Lance'],
            'text_min_bid' => ['value' => 'Lance mínimo', 'desc' => 'Label Lance Mínimo'],
            'text_increment' => ['value' => 'Incremento', 'desc' => 'Label Incremento'],
            'text_favorite' => ['value' => 'Favoritar', 'desc' => 'Botão Favoritar'],
            'text_remove_favorite' => ['value' => 'Remover dos favoritos', 'desc' => 'Tooltip Remover Favorito'],
            'text_add_favorite' => ['value' => 'Adicionar aos favoritos', 'desc' => 'Tooltip Adicionar Favorito'],
            'text_share' => ['value' => 'Compartilhar', 'desc' => 'Botão Compartilhar'],
            'text_share_product_title' => ['value' => 'Compartilhar produto', 'desc' => 'Tooltip Compartilhar'],
            'text_buy_credits' => ['value' => 'Comprar Créditos', 'desc' => 'Botão Comprar Créditos'],
            'text_secure_purchase' => ['value' => 'Compra Segura', 'desc' => 'Label Compra Segura'],
            'text_free_shipping' => ['value' => 'Entrega Grátis', 'desc' => 'Label Entrega Grátis'],
            'text_warranty' => ['value' => '12 meses', 'desc' => 'Label Garantia'],
            'text_description' => ['value' => 'Descrição', 'desc' => 'Título Descrição'],
            'text_specifications' => ['value' => 'Especificações', 'desc' => 'Título Especificações'],
            'text_bid_history' => ['value' => 'Histórico de Lances', 'desc' => 'Título Histórico'],
            'text_bid_history_soon' => ['value' => 'Histórico de lances será implementado em breve.', 'desc' => 'Mensagem Histórico Breve'],
            'text_no_bids_yet' => ['value' => 'Nenhum lance ainda. Seja o primeiro!', 'desc' => 'Mensagem Sem Lances'],
            'text_no_leader' => ['value' => 'Nenhum', 'desc' => 'Label Sem Líder'],
            'text_not_in_auction' => ['value' => 'Este produto não está em leilão.', 'desc' => 'Erro Produto Sem Leilão'],
            'text_bid_success' => ['value' => 'Lance realizado com sucesso!', 'desc' => 'Sucesso Lance'],
            'text_bid_error_generic' => ['value' => 'Erro ao realizar lance.', 'desc' => 'Erro Genérico Lance'],
            'text_bid_error_balance' => ['value' => 'Erro ao processar lance. Verifique seu saldo.', 'desc' => 'Erro Saldo Lance'],
            'text_favorite_error' => ['value' => 'Erro ao favoritar produto. Tente novamente.', 'desc' => 'Erro Favoritar'],
            'text_share_product' => ['value' => 'Confira este produto:', 'desc' => 'Texto Compartilhar'],
            'text_link_copied' => ['value' => 'Link copiado para a área de transferência!', 'desc' => 'Sucesso Copiar Link'],
            'text_share_error' => ['value' => 'Erro ao compartilhar. Tente copiar o link manualmente.', 'desc' => 'Erro Compartilhar'],
            'text_loading_product' => ['value' => 'Carregando produto...', 'desc' => 'Mensagem Carregando Produto'],
            'text_product_not_found' => ['value' => 'Produto não encontrado', 'desc' => 'Erro Produto Não Encontrado'],
            'text_product_not_found_subtitle' => ['value' => 'O produto que você está procurando não existe.', 'desc' => 'Subtítulo Produto Não Encontrado'],
            'text_back_to_home' => ['value' => 'Voltar para a página inicial', 'desc' => 'Botão Voltar Home'],
            'text_product_load_error' => ['value' => 'Erro ao carregar produto', 'desc' => 'Erro Carregar Produto'],
            'text_new_bid_notification' => ['value' => 'Novo lance! Valor atual:', 'desc' => 'Notificação Novo Lance'],
        ];

        foreach ($texts as $key => $data) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $data['value'],
                    'group' => 'text',
                    'type' => 'string',
                    'description' => $data['desc']
                ]
            );
        }
    }
}
