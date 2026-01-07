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

            // Header
            'text_header_leiloes' => 'Leilões',
            'text_header_como_funciona' => 'Como Funciona',
            'text_header_suba_de_nivel' => 'Suba de Nível',
            'text_header_login' => 'Entrar',
            'text_header_cadastro' => 'Cadastre-se Grátis',

            // Hero
            'text_hero_cashback_banner' => 'Até 10% de Cashback em cada lance',
            'text_hero_title' => 'Leilões Online com Cashback Real',
            'text_hero_subtitle' => 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!',
            'text_hero_search_placeholder' => 'Buscar produtos em leilão...',

            // Seções da Home
            'text_section_destaques_title' => 'Em Destaque',
            'text_section_destaques_subtitle' => 'Os leilões mais disputados',
            'text_section_quentes_title' => 'Ofertas Quentes',
            'text_section_quentes_subtitle' => 'Preços irresistíveis',
            'text_section_encerrando_title' => 'Encerrando em Breve',
            'text_section_encerrando_subtitle' => 'Última chance!',

            // Footer
            'text_footer_sobre' => 'Sobre Nós',
            'text_footer_sobre_desc' => 'A maior plataforma de leilões com cashback do Brasil. Produtos novos, lacrados e com garantia.',
            'text_footer_links_uteis' => 'Links Úteis',
            'text_footer_contato' => 'Contato',
            'text_footer_copyright' => '© ' . date('Y') . ' LeilaoCash. Todos os direitos reservados.',
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
