<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Translation;

class TranslationSeeder extends Seeder
{
    public function run(): void
    {
        $translations = [
            // Header
            ['group' => 'header', 'key' => 'home', 'text_pt' => 'Início', 'text_en' => 'Home', 'text_es' => 'Inicio'],
            ['group' => 'header', 'key' => 'highlights', 'text_pt' => 'Destaques', 'text_en' => 'Highlights', 'text_es' => 'Destacados'],
            ['group' => 'header', 'key' => 'ending_soon', 'text_pt' => 'Encerrando', 'text_en' => 'Ending Soon', 'text_es' => 'Terminando'],
            ['group' => 'header', 'key' => 'auctions', 'text_pt' => 'Leilões', 'text_en' => 'Auctions', 'text_es' => 'Subastas'],
            ['group' => 'header', 'key' => 'how_it_works', 'text_pt' => 'Como Funciona', 'text_en' => 'How it Works', 'text_es' => 'Cómo Funciona'],
            ['group' => 'header', 'key' => 'upgrade_level', 'text_pt' => 'Suba de Nível', 'text_en' => 'Level Up', 'text_es' => 'Sube de Nivel'],
            ['group' => 'header', 'key' => 'contact', 'text_pt' => 'Fale Conosco', 'text_en' => 'Contact Us', 'text_es' => 'Contáctanos'],
            ['group' => 'header', 'key' => 'login', 'text_pt' => 'Entrar', 'text_en' => 'Login', 'text_es' => 'Entrar'],
            ['group' => 'header', 'key' => 'register', 'text_pt' => 'Cadastrar', 'text_en' => 'Register', 'text_es' => 'Registrarse'],
            ['group' => 'header', 'key' => 'my_dashboard', 'text_pt' => 'Meu Painel', 'text_en' => 'My Dashboard', 'text_es' => 'Mi Panel'],
            ['group' => 'header', 'key' => 'my_favorites', 'text_pt' => 'Meus Favoritos', 'text_en' => 'My Favorites', 'text_es' => 'Mis Favoritos'],

            // Hero
            ['group' => 'hero', 'key' => 'cashback_banner', 'text_pt' => 'Até 10% de Cashback em cada lance', 'text_en' => 'Up to 10% Cashback on every bid', 'text_es' => 'Hasta 10% de Cashback en cada puja'],
            ['group' => 'hero', 'key' => 'title', 'text_pt' => 'Leilões Online com', 'text_en' => 'Online Auctions with', 'text_es' => 'Subastas Online con'],
            ['group' => 'hero', 'key' => 'title_highlight', 'text_pt' => 'Cashback Real', 'text_en' => 'Real Cashback', 'text_es' => 'Cashback Real'],
            ['group' => 'hero', 'key' => 'subtitle', 'text_pt' => 'Participe dos melhores leilões de eletrônicos e ganhe cashback em cada lance. Economize até 90% em produtos premium!', 'text_en' => 'Participate in the best electronics auctions and earn cashback on every bid. Save up to 90% on premium products!', 'text_es' => 'Participa en las mejores subastas de electrónica y gana cashback en cada puja. ¡Ahorra hasta un 90% en productos premium!'],
            ['group' => 'hero', 'key' => 'search_placeholder', 'text_pt' => 'Buscar produtos em leilão...', 'text_en' => 'Search auction products...', 'text_es' => 'Buscar productos en subasta...'],
            ['group' => 'hero', 'key' => 'stat_users', 'text_pt' => 'Usuários', 'text_en' => 'Users', 'text_es' => 'Usuarios'],
            ['group' => 'hero', 'key' => 'stat_cashback', 'text_pt' => 'Em Cashback', 'text_en' => 'In Cashback', 'text_es' => 'En Cashback'],
            ['group' => 'hero', 'key' => 'stat_auctions', 'text_pt' => 'Leilões', 'text_en' => 'Auctions', 'text_es' => 'Subastas'],

            // Common
            ['group' => 'common', 'key' => 'loading', 'text_pt' => 'Carregando...', 'text_en' => 'Loading...', 'text_es' => 'Cargando...'],
            ['group' => 'common', 'key' => 'error', 'text_pt' => 'Ocorreu um erro', 'text_en' => 'An error occurred', 'text_es' => 'Ocurrió un error'],
            ['group' => 'common', 'key' => 'success', 'text_pt' => 'Sucesso', 'text_en' => 'Success', 'text_es' => 'Éxito'],
            ['group' => 'common', 'key' => 'save', 'text_pt' => 'Salvar', 'text_en' => 'Save', 'text_es' => 'Guardar'],
            ['group' => 'common', 'key' => 'cancel', 'text_pt' => 'Cancelar', 'text_en' => 'Cancel', 'text_es' => 'Cancelar'],
            ['group' => 'common', 'key' => 'back', 'text_pt' => 'Voltar', 'text_en' => 'Back', 'text_es' => 'Volver'],
            ['group' => 'common', 'key' => 'see_all', 'text_pt' => 'Ver todos', 'text_en' => 'See all', 'text_es' => 'Ver todos'],

            // Home Sections
            ['group' => 'home', 'key' => 'featured_title', 'text_pt' => 'Em Destaque', 'text_en' => 'Featured', 'text_es' => 'Destacados'],
            ['group' => 'home', 'key' => 'featured_subtitle', 'text_pt' => 'Os leilões mais disputados do momento', 'text_en' => 'The most disputed auctions right now', 'text_es' => 'Las subastas más disputadas del momento'],
            ['group' => 'home', 'key' => 'hot_title', 'text_pt' => 'Ofertas Quentes', 'text_en' => 'Hot Deals', 'text_es' => 'Ofertas Calientes'],
            ['group' => 'home', 'key' => 'hot_subtitle', 'text_pt' => 'Oportunidades imperdíveis com muito cashback', 'text_en' => 'Unmissable opportunities with lots of cashback', 'text_es' => 'Oportunidades imperdibles con mucho cashback'],
            ['group' => 'home', 'key' => 'ending_title', 'text_pt' => 'Encerrando em Breve', 'text_en' => 'Ending Soon', 'text_es' => 'Terminando Pronto'],
            ['group' => 'home', 'key' => 'ending_subtitle', 'text_pt' => 'Última chance para dar seu lance', 'text_en' => 'Last chance to place your bid', 'text_es' => 'Última oportunidad para pujar'],
            ['group' => 'home', 'key' => 'cta_title', 'text_pt' => 'Pronto para começar a ganhar?', 'text_en' => 'Ready to start winning?', 'text_es' => '¿Listo para empezar a ganar?'],
            ['group' => 'home', 'key' => 'cta_subtitle', 'text_pt' => 'Cadastre-se agora e receba bônus de boas-vindas!', 'text_en' => 'Register now and get a welcome bonus!', 'text_es' => '¡Regístrate ahora y recibe un bono de bienvenida!'],

            // Why Choose Us
            ['group' => 'why_choose_us', 'key' => 'title', 'text_pt' => 'Por que escolher a VibeGet?', 'text_en' => 'Why choose VibeGet?', 'text_es' => '¿Por qué elegir VibeGet?'],
            ['group' => 'why_choose_us', 'key' => 'card_1_title', 'text_pt' => 'Cashback Garantido', 'text_en' => 'Guaranteed Cashback', 'text_es' => 'Cashback Garantizado'],
            ['group' => 'why_choose_us', 'key' => 'card_1_desc', 'text_pt' => 'Receba parte do valor de volta em cada lance, ganhando ou não.', 'text_en' => 'Get part of the value back on every bid, win or lose.', 'text_es' => 'Recibe parte del valor de vuelta en cada puja, ganes o pierdas.'],
            ['group' => 'why_choose_us', 'key' => 'card_2_title', 'text_pt' => 'Produtos Premium', 'text_en' => 'Premium Products', 'text_es' => 'Productos Premium'],
            ['group' => 'why_choose_us', 'key' => 'card_2_desc', 'text_pt' => 'Apenas produtos novos, originais e com garantia de fábrica.', 'text_en' => 'Only new, original products with factory warranty.', 'text_es' => 'Solo productos nuevos, originales y con garantía de fábrica.'],
            ['group' => 'why_choose_us', 'key' => 'card_3_title', 'text_pt' => 'Entrega Rápida', 'text_en' => 'Fast Delivery', 'text_es' => 'Entrega Rápida'],
            ['group' => 'why_choose_us', 'key' => 'card_3_desc', 'text_pt' => 'Enviamos para todo o Brasil com rastreamento em tempo real.', 'text_en' => 'We ship all over Brazil with real-time tracking.', 'text_es' => 'Enviamos a todo Brasil con seguimiento en tiempo real.'],
            ['group' => 'why_choose_us', 'key' => 'card_4_title', 'text_pt' => 'Suporte 24/7', 'text_en' => '24/7 Support', 'text_es' => 'Soporte 24/7'],
            ['group' => 'why_choose_us', 'key' => 'card_4_desc', 'text_pt' => 'Nossa equipe está sempre pronta para ajudar você.', 'text_en' => 'Our team is always ready to help you.', 'text_es' => 'Nuestro equipo siempre está listo para ayudarte.'],

            // Products
            ['group' => 'products', 'key' => 'current_bid', 'text_pt' => 'Lance atual', 'text_en' => 'Current bid', 'text_es' => 'Puja actual'],
            ['group' => 'products', 'key' => 'market_price', 'text_pt' => 'Valor de mercado', 'text_en' => 'Market price', 'text_es' => 'Valor de mercado'],
            ['group' => 'products', 'key' => 'place_bid', 'text_pt' => 'Dar Lance', 'text_en' => 'Place Bid', 'text_es' => 'Pujar'],
            ['group' => 'products', 'key' => 'bidding', 'text_pt' => 'Enviando...', 'text_en' => 'Sending...', 'text_es' => 'Enviando...'],
            ['group' => 'products', 'key' => 'time_remaining', 'text_pt' => 'Tempo restante', 'text_en' => 'Time remaining', 'text_es' => 'Tiempo restante'],
            ['group' => 'products', 'key' => 'bid_history', 'text_pt' => 'Histórico de Lances', 'text_en' => 'Bid History', 'text_es' => 'Historial de Pujas'],
            ['group' => 'products', 'key' => 'description', 'text_pt' => 'Descrição', 'text_en' => 'Description', 'text_es' => 'Descripción'],
            ['group' => 'products', 'key' => 'specifications', 'text_pt' => 'Especificações', 'text_en' => 'Specifications', 'text_es' => 'Especificaciones'],
            ['group' => 'products', 'key' => 'secure_purchase', 'text_pt' => 'Compra Segura', 'text_en' => 'Secure Purchase', 'text_es' => 'Compra Segura'],
            ['group' => 'products', 'key' => 'free_shipping', 'text_pt' => 'Entrega Grátis', 'text_en' => 'Free Shipping', 'text_es' => 'Envío Gratis'],
            ['group' => 'products', 'key' => 'warranty', 'text_pt' => '12 meses de garantia', 'text_en' => '12 months warranty', 'text_es' => '12 meses de garantía'],

            // Pages
            ['group' => 'how_it_works', 'key' => 'content', 'text_pt' => '<h1>Como Funciona</h1><p>Conteúdo da página como funciona...</p>', 'text_en' => '<h1>How it Works</h1><p>Content of how it works page...</p>', 'text_es' => '<h1>Cómo Funciona</h1><p>Contenido de la página cómo funciona...</p>'],
            ['group' => 'contact', 'key' => 'content', 'text_pt' => '<h1>Fale Conosco</h1><p>Entre em contato conosco...</p>', 'text_en' => '<h1>Contact Us</h1><p>Get in touch with us...</p>', 'text_es' => '<h1>Contáctanos</h1><p>Ponte en contacto con nosotros...</p>'],
            ['group' => 'terms', 'key' => 'content', 'text_pt' => '<h1>Termos de Uso</h1><p>Termos de uso...</p>', 'text_en' => '<h1>Terms of Use</h1><p>Terms of use...</p>', 'text_es' => '<h1>Términos de Uso</h1><p>Términos de uso...</p>'],
            ['group' => 'privacy', 'key' => 'content', 'text_pt' => '<h1>Política de Privacidade</h1><p>Política de privacidade...</p>', 'text_en' => '<h1>Privacy Policy</h1><p>Privacy policy...</p>', 'text_es' => '<h1>Política de Privacidad</h1><p>Política de privacidad...</p>'],
            ['group' => 'rules', 'key' => 'content', 'text_pt' => '<h1>Regras</h1><p>Regras do leilão...</p>', 'text_en' => '<h1>Rules</h1><p>Auction rules...</p>', 'text_es' => '<h1>Reglas</h1><p>Reglas de la subasta...</p>'],
            ['group' => 'faq', 'key' => 'content', 'text_pt' => '<h1>FAQ</h1><p>Perguntas frequentes...</p>', 'text_en' => '<h1>FAQ</h1><p>Frequently asked questions...</p>', 'text_es' => '<h1>FAQ</h1><p>Preguntas frecuentes...</p>'],
        ];

        foreach ($translations as $t) {
            Translation::updateOrCreate(
                ['group' => $t['group'], 'key' => $t['key']],
                $t
            );
        }
    }
}
