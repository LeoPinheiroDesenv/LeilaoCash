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
            'text_ver_todos' => ['value' => 'Ver Todos', 'desc' => 'Botão Ver Todos'],
            'text_comprar_creditos' => ['value' => 'Comprar Créditos', 'desc' => 'Botão Comprar Créditos'],
            'text_dar_lance' => ['value' => 'Dar Lance', 'desc' => 'Botão Dar Lance'],
            'text_salvar' => ['value' => 'Salvar', 'desc' => 'Botão Salvar'],
            'text_cancelar' => ['value' => 'Cancelar', 'desc' => 'Botão Cancelar'],
            'text_criar' => ['value' => 'Criar', 'desc' => 'Botão Criar'],
            'text_atualizar' => ['value' => 'Atualizar', 'desc' => 'Botão Atualizar'],
            'text_deletar' => ['value' => 'Deletar', 'desc' => 'Botão Deletar'],
            'text_editar' => ['value' => 'Editar', 'desc' => 'Botão Editar'],
            'text_voltar' => ['value' => 'Voltar', 'desc' => 'Botão Voltar'],
            'text_carregando' => ['value' => 'Carregando...', 'desc' => 'Mensagem de Carregamento'],
            'text_erro_carregar' => ['value' => 'Erro ao carregar', 'desc' => 'Mensagem de Erro'],
            'text_tentar_novamente' => ['value' => 'Tentar Novamente', 'desc' => 'Botão Tentar Novamente'],

            // Header
            'text_header_leiloes' => ['value' => 'Leilões', 'desc' => 'Menu Leilões'],
            'text_header_como_funciona' => ['value' => 'Como Funciona', 'desc' => 'Menu Como Funciona'],
            'text_header_suba_de_nivel' => ['value' => 'Suba de Nível', 'desc' => 'Menu Suba de Nível'],
            'text_header_login' => ['value' => 'Entrar', 'desc' => 'Botão Login'],
            'text_header_cadastro' => ['value' => 'Cadastre-se Grátis', 'desc' => 'Botão Cadastro'],
            'text_header_home' => ['value' => 'Início', 'desc' => 'Menu Início'],
            'text_header_highlights' => ['value' => 'Destaques', 'desc' => 'Menu Destaques'],
            'text_header_ending_soon' => ['value' => 'Encerrando', 'desc' => 'Menu Encerrando'],

            // Hero (Home)
            'text_hero_cashback_banner' => ['value' => 'Até 10% de Cashback em cada lance', 'desc' => 'Banner de Cashback (Topo)'],
            'text_hero_title' => ['value' => 'Leilões Online com Cashback Real', 'desc' => 'Título Principal da Home'],
            'text_hero_subtitle' => ['value' => 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!', 'desc' => 'Subtítulo da Home'],
            'text_hero_search_placeholder' => ['value' => 'Buscar produtos em leilão...', 'desc' => 'Placeholder da Busca'],
            'text_hero_tag' => ['value' => '#LeilõesDeCentavos', 'desc' => 'Tag do Hero'],
            'text_hero_title_highlight' => ['value' => 'até 90% de desconto!', 'desc' => 'Destaque do Título'],

            // Seções da Home
            'text_section_destaques_title' => ['value' => 'Em Destaque', 'desc' => 'Título Seção Destaques'],
            'text_section_destaques_subtitle' => ['value' => 'Os leilões mais disputados', 'desc' => 'Subtítulo Seção Destaques'],
            'icon_section_destaques' => ['value' => '⭐', 'desc' => 'Ícone Seção Destaques'],
            'text_section_quentes_title' => ['value' => 'Ofertas Quentes', 'desc' => 'Título Seção Quentes'],
            'text_section_quentes_subtitle' => ['value' => 'Preços irresistíveis', 'desc' => 'Subtítulo Seção Quentes'],
            'icon_section_quentes' => ['value' => '🔥', 'desc' => 'Ícone Seção Quentes'],
            'text_section_encerrando_title' => ['value' => 'Encerrando em Breve', 'desc' => 'Título Seção Encerrando'],
            'text_section_encerrando_subtitle' => ['value' => 'Última chance!', 'desc' => 'Subtítulo Seção Encerrando'],
            'icon_section_encerrando' => ['value' => '⏰', 'desc' => 'Ícone Seção Encerrando'],

            // Why Choose Us
            'text_why_title' => ['value' => 'Por que comprar na VibeGet?', 'desc' => 'Título Seção Por Que Escolher'],
            'text_why_card_1_title' => ['value' => 'Uma Nova Forma de Adquirir', 'desc' => 'Título Card 1'],
            'text_why_card_1_desc' => ['value' => 'Ao invés de comprar de forma convencional, você participa de uma Vibe interativa onde o Get que você está disposto a investir é o que define sua chance de ganhar. Isso transforma cada Vibe em uma experiência emocionante!', 'desc' => 'Descrição Card 1'],
            'text_why_card_2_title' => ['value' => 'Cash Back Sempre ao Seu Lado', 'desc' => 'Título Card 2'],
            'text_why_card_2_desc' => ['value' => 'Não importa se você ganha ou perde a Vibe, você sempre ganha Cash back! Mesmo não sendo o Champion Get, você recebe 40% de volta do valor que investiu, para continuar participando de mais Vibes. Mais oportunidades, mais chances de ganhar!', 'desc' => 'Descrição Card 2'],
            'text_why_card_3_title' => ['value' => 'Produtos Cobiçados', 'desc' => 'Título Card 3'],
            'text_why_card_3_desc' => ['value' => 'Oferecemos uma ampla variedade de produtos que atendem aos mais diversos gostos. A cada Vibe, você tem a chance de adquirir itens que são realmente desejados por todos.', 'desc' => 'Descrição Card 3'],
            'text_why_card_4_title' => ['value' => 'Agilidade e Praticidade', 'desc' => 'Título Card 4'],
            'text_why_card_4_desc' => ['value' => 'Nosso cadastro é rápido e gratuito, e a recarga de crédito pode ser feita de forma simples por Pix ou Cartão de Crédito. Tudo é feito para ser rápido, seguro e sem complicação, permitindo que você participe de Vibes sem perder tempo.', 'desc' => 'Descrição Card 4'],

            // Footer
            'text_footer_sobre' => ['value' => 'Sobre Nós', 'desc' => 'Título Sobre Nós (Footer)'],
            'text_footer_sobre_desc' => ['value' => 'A maior plataforma de leilões com cashback do Brasil. Produtos novos, lacrados e com garantia.', 'desc' => 'Descrição Sobre Nós (Footer)'],
            'text_footer_links_uteis' => ['value' => 'Links Úteis', 'desc' => 'Título Links Úteis (Footer)'],
            'text_footer_contato' => ['value' => 'Contato', 'desc' => 'Título Contato (Footer)'],
            'text_footer_copyright' => ['value' => '© ' . date('Y') . ' LeilaoCash. Todos os direitos reservados.', 'desc' => 'Copyright (Footer)'],
            'text_footer_quick_links' => ['value' => 'Links Rápidos', 'desc' => 'Título Links Rápidos (Footer)'],
            'text_footer_legal' => ['value' => 'Legal', 'desc' => 'Título Legal (Footer)'],
            'text_cta_title' => ['value' => 'Pronto para começar?', 'desc' => 'Título CTA Footer'],
            'text_cta_subtitle' => ['value' => 'Crie sua conta agora e comece a dar lances para ganhar produtos incríveis com cashback.', 'desc' => 'Subtítulo CTA Footer'],

            // Página de Contato (defaults adicionados)
            'page_contact_text' => ['value' => '<h2>Fale Conosco</h2><p>Tem alguma dúvida ou sugestão? Entre em contato através do formulário abaixo. Faremos o possível para responder sua mensagem o mais breve possível.</p>', 'desc' => 'Texto customizável na página de contato (acima do formulário)'],
            'text_header_contact_title' => ['value' => 'Fale Conosco', 'desc' => 'Título principal da página de contato'],
            'text_header_contact_subtitle' => ['value' => 'Estamos aqui para ajudar e tirar suas dúvidas', 'desc' => 'Subtítulo na página de contato'],
            'text_contact_form_title' => ['value' => 'Envie sua mensagem', 'desc' => 'Título do formulário na página de contato'],
            'text_contact_name' => ['value' => 'Nome *', 'desc' => 'Label do campo Nome'],
            'text_contact_name_placeholder' => ['value' => 'Seu nome completo', 'desc' => 'Placeholder do campo Nome'],
            'text_contact_email' => ['value' => 'E-mail *', 'desc' => 'Label do campo E-mail'],
            'text_contact_email_placeholder' => ['value' => 'seu@email.com', 'desc' => 'Placeholder do campo E-mail'],
            'text_contact_subject' => ['value' => 'Assunto', 'desc' => 'Label do campo Assunto'],
            'text_contact_subject_placeholder' => ['value' => 'Qual é o assunto da sua mensagem?', 'desc' => 'Placeholder do campo Assunto'],
            'text_contact_message' => ['value' => 'Mensagem *', 'desc' => 'Label do campo Mensagem'],
            'text_contact_message_placeholder' => ['value' => 'Escreva sua mensagem aqui...', 'desc' => 'Placeholder do campo Mensagem'],
            'text_contact_send' => ['value' => 'Enviar Mensagem', 'desc' => 'Texto do botão enviar na página de contato'],
            'text_contact_sending' => ['value' => 'Enviando...', 'desc' => 'Texto do botão enquanto envia'],
            'text_contact_success' => ['value' => 'Mensagem enviada com sucesso! Obrigado.', 'desc' => 'Mensagem de sucesso após envio do formulário'],
            'text_contact_error_name' => ['value' => 'Por favor informe seu nome.', 'desc' => 'Erro: nome vazio'],
            'text_contact_error_email' => ['value' => 'Por favor informe um e-mail válido.', 'desc' => 'Erro: e-mail inválido'],
            'text_contact_error_subject' => ['value' => 'Por favor informe o assunto.', 'desc' => 'Erro: assunto vazio'],
            'text_contact_error_message' => ['value' => 'Por favor escreva sua mensagem.', 'desc' => 'Erro: mensagem vazia'],
            'text_contact_error_generic' => ['value' => 'Erro ao enviar mensagem. Tente novamente.', 'desc' => 'Erro genérico ao enviar formulário'],
            'text_contact_info_title' => ['value' => 'Outras Formas de Contato', 'desc' => 'Título da caixa de informações de contato'],
            'text_contact_email_label' => ['value' => 'E-mail', 'desc' => 'Label E-mail na seção de contato'],
            'text_contact_email_value' => ['value' => 'contato@leilaocash.com', 'desc' => 'Endereço de e-mail exibido na seção de contato'],
            'text_contact_phone_label' => ['value' => 'Telefone', 'desc' => 'Label Telefone na seção de contato'],
            'text_contact_phone_value' => ['value' => '+55 (11) 3000-0000', 'desc' => 'Número de telefone exibido na seção de contato'],
            'text_contact_address_label' => ['value' => 'Endereço', 'desc' => 'Label Endereço na seção de contato'],
            'text_contact_address_value' => ['value' => 'São Paulo, SP - Brasil', 'desc' => 'Endereço exibido na seção de contato'],

            // Product Page
            'text_back' => ['value' => 'Voltar', 'desc' => 'Botão Voltar'],
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

        // Cores do Tema
        $colors = [
            // Header
            ['key' => 'color_header_bg', 'value' => 'rgba(7, 16, 38, 0.8)', 'desc' => 'Cor de fundo do cabeçalho'],
            ['key' => 'color_header_link', 'value' => '#9fb0c8', 'desc' => 'Cor dos links do menu'],
            ['key' => 'color_header_link_hover', 'value' => '#e6eef8', 'desc' => 'Cor dos links do menu ao passar o mouse'],

            // Hero
            ['key' => 'color_hero_bg', 'value' => '#07080d', 'desc' => 'Cor de fundo da seção Hero'],
            ['key' => 'color_hero_title', 'value' => '#ffffff', 'desc' => 'Cor do título principal'],
            ['key' => 'color_hero_subtitle', 'value' => '#8da4bf', 'desc' => 'Cor do subtítulo'],

            // Cards
            ['key' => 'color_card_bg', 'value' => '#0D1529', 'desc' => 'Cor de fundo dos cards de produto'],
            ['key' => 'color_card_border', 'value' => 'rgba(255, 255, 255, 0.1)', 'desc' => 'Cor da borda dos cards'],
            ['key' => 'color_card_title', 'value' => '#ffffff', 'desc' => 'Cor do título do produto no card'],
            ['key' => 'color_card_price', 'value' => '#584eff', 'desc' => 'Cor do preço atual no card'],

            // Footer
            ['key' => 'color_footer_bg', 'value' => '#061026', 'desc' => 'Cor de fundo do rodapé'],
            ['key' => 'color_footer_text', 'value' => '#9fb0c8', 'desc' => 'Cor do texto do rodapé'],
            ['key' => 'color_footer_title', 'value' => '#e6eef8', 'desc' => 'Cor dos títulos das colunas do rodapé'],
        ];

        foreach ($colors as $color) {
            Setting::updateOrCreate(
                ['key' => $color['key']],
                [
                    'value' => $color['value'],
                    'group' => 'theme',
                    'type' => 'color',
                    'description' => $color['desc']
                ]
            );
        }
    }
}
