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
            // Geral
            'text_ver_todos' => 'Ver Todos',
            'text_comprar_creditos' => 'Comprar Créditos',
            'text_dar_lance' => 'Dar Lance',
            'text_salvar' => 'Salvar',
            'text_cancelar' => 'Cancelar',
            'text_criar' => 'Criar',
            'text_atualizar' => 'Atualizar',
            'text_deletar' => 'Deletar',
            'text_editar' => 'Editar',
            'text_voltar' => 'Voltar',
            'text_carregando' => 'Carregando...',
            'text_erro_carregar' => 'Erro ao carregar',
            'text_tentar_novamente' => 'Tentar Novamente',

            // Header
            'text_header_leiloes' => 'Leilões',
            'text_header_como_funciona' => 'Como Funciona',
            'text_header_suba_de_nivel' => 'Suba de Nível',
            'text_header_login' => 'Entrar',
            'text_header_cadastro' => 'Cadastre-se Grátis',
            'text_header_home' => 'Início',
            'text_header_highlights' => 'Destaques',
            'text_header_ending_soon' => 'Encerrando',

            // Hero
            'text_hero_cashback_banner' => 'Até 10% de Cashback em cada lance',
            'text_hero_title' => 'Leilões Online com Cashback Real',
            'text_hero_subtitle' => 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!',
            'text_hero_search_placeholder' => 'Buscar produtos em leilão...',
            'text_hero_tag' => '#LeilõesDeCentavos',
            'text_hero_title_highlight' => 'até 90% de desconto!',

            // Seções da Home
            'text_section_destaques_title' => 'Em Destaque',
            'text_section_destaques_subtitle' => 'Os leilões mais disputados',
            'icon_section_destaques' => '⭐',
            'text_section_quentes_title' => 'Ofertas Quentes',
            'text_section_quentes_subtitle' => 'Preços irresistíveis',
            'icon_section_quentes' => '🔥',
            'text_section_encerrando_title' => 'Encerrando em Breve',
            'text_section_encerrando_subtitle' => 'Última chance!',
            'icon_section_encerrando' => '⏰',

            // Why Choose Us
            'text_why_title' => 'Por que comprar na VibeGet?',
            'text_why_card_1_title' => 'Uma Nova Forma de Adquirir',
            'text_why_card_1_desc' => 'Ao invés de comprar de forma convencional, você participa de uma Vibe interativa onde o Get que você está disposto a investir é o que define sua chance de ganhar. Isso transforma cada Vibe em uma experiência emocionante!',
            'text_why_card_2_title' => 'Cash Back Sempre ao Seu Lado',
            'text_why_card_2_desc' => 'Não importa se você ganha ou perde a Vibe, você sempre ganha Cash back! Mesmo não sendo o Champion Get, você recebe 40% de volta do valor que investiu, para continuar participando de mais Vibes. Mais oportunidades, mais chances de ganhar!',
            'text_why_card_3_title' => 'Produtos Cobiçados',
            'text_why_card_3_desc' => 'Oferecemos uma ampla variedade de produtos que atendem aos mais diversos gostos. A cada Vibe, você tem a chance de adquirir itens que são realmente desejados por todos.',
            'text_why_card_4_title' => 'Agilidade e Praticidade',
            'text_why_card_4_desc' => 'Nosso cadastro é rápido e gratuito, e a recarga de crédito pode ser feita de forma simples por Pix ou Cartão de Crédito. Tudo é feito para ser rápido, seguro e sem complicação, permitindo que você participe de Vibes sem perder tempo.',

            // Footer
            'text_footer_sobre' => 'Sobre Nós',
            'text_footer_sobre_desc' => 'A maior plataforma de leilões com cashback do Brasil. Produtos novos, lacrados e com garantia.',
            'text_footer_links_uteis' => 'Links Úteis',
            'text_footer_contato' => 'Contato',
            'text_footer_copyright' => '© ' . date('Y') . ' LeilaoCash. Todos os direitos reservados.',
            'text_footer_quick_links' => 'Links Rápidos',
            'text_footer_legal' => 'Legal',
            'text_cta_title' => 'Pronto para começar?',
            'text_cta_subtitle' => 'Crie sua conta agora e comece a dar lances para ganhar produtos incríveis com cashback.',

            // Product Page
            'text_back' => 'Voltar',
            'text_hot_deal' => 'Hot Deal',
            'text_cashback' => 'Cashback',
            'text_previous_image' => 'Imagem anterior',
            'text_next_image' => 'Próxima imagem',
            'text_image' => 'Imagem',
            'text_active' => 'Ativo',
            'text_inactive' => 'Inativo',
            'text_visits' => 'Visitas',
            'text_category' => 'Categoria',
            'text_information' => 'Informações',
            'text_brand' => 'Marca',
            'text_model' => 'Modelo',
            'text_auction' => 'Leilão',
            'text_status' => 'Status',
            'text_scheduled' => 'Agendado',
            'text_finished' => 'Encerrado',
            'text_starting_bid' => 'Lance Inicial',
            'text_time_remaining' => 'Tempo restante',
            'text_current_bid' => 'Lance atual',
            'text_product_price' => 'Valor de mercado',
            'text_current_leader' => 'Líder atual',
            'text_bids' => 'lances',
            'text_bidding' => 'Enviando...',
            'text_place_bid' => 'Dar Lance',
            'text_min_bid' => 'Lance mínimo',
            'text_increment' => 'Incremento',
            'text_favorite' => 'Favoritar',
            'text_remove_favorite' => 'Remover dos favoritos',
            'text_add_favorite' => 'Adicionar aos favoritos',
            'text_share' => 'Compartilhar',
            'text_share_product_title' => 'Compartilhar produto',
            'text_buy_credits' => 'Comprar Créditos',
            'text_secure_purchase' => 'Compra Segura',
            'text_free_shipping' => 'Entrega Grátis',
            'text_warranty' => '12 meses',
            'text_description' => 'Descrição',
            'text_specifications' => 'Especificações',
            'text_bid_history' => 'Histórico de Lances',
            'text_bid_history_soon' => 'Histórico de lances será implementado em breve.',
            'text_no_bids_yet' => 'Nenhum lance ainda. Seja o primeiro!',
            'text_no_leader' => 'Nenhum',
            'text_not_in_auction' => 'Este produto não está em leilão.',
            'text_bid_success' => 'Lance realizado com sucesso!',
            'text_bid_error_generic' => 'Erro ao realizar lance.',
            'text_bid_error_balance' => 'Erro ao processar lance. Verifique seu saldo.',
            'text_favorite_error' => 'Erro ao favoritar produto. Tente novamente.',
            'text_share_product' => 'Confira este produto:',
            'text_link_copied' => 'Link copiado para a área de transferência!',
            'text_share_error' => 'Erro ao compartilhar. Tente copiar o link manualmente.',
            'text_loading_product' => 'Carregando produto...',
            'text_product_not_found' => 'Produto não encontrado',
            'text_product_not_found_subtitle' => 'O produto que você está procurando não existe.',
            'text_back_to_home' => 'Voltar para a página inicial',
            'text_product_load_error' => 'Erro ao carregar produto',
            'text_new_bid_notification' => 'Novo lance! Valor atual:',
        ];

        foreach ($texts as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'group' => 'text',
                    'type' => 'string',
                    'description' => 'Texto da interface: ' . ucfirst(str_replace('_', ' ', str_replace('text_', '', $key)))
                ]
            );
        }
    }
}
