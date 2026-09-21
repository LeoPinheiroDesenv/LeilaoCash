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
            ['group' => 'header', 'key' => 'auctions', 'text_pt' => 'Vibes', 'text_en' => 'Vibes', 'text_es' => 'Vibes'],
            ['group' => 'header', 'key' => 'how_it_works', 'text_pt' => 'Como Funciona', 'text_en' => 'How it Works', 'text_es' => 'Cómo Funciona'],
            ['group' => 'header', 'key' => 'upgrade_level', 'text_pt' => 'Suba de Nível', 'text_en' => 'Level Up', 'text_es' => 'Sube de Nivel'],
            ['group' => 'header', 'key' => 'contact', 'text_pt' => 'Fale Conosco', 'text_en' => 'Contact Us', 'text_es' => 'Contáctanos'],
            ['group' => 'header', 'key' => 'login', 'text_pt' => 'Entrar', 'text_en' => 'Login', 'text_es' => 'Entrar'],
            ['group' => 'header', 'key' => 'register', 'text_pt' => 'Cadastrar', 'text_en' => 'Register', 'text_es' => 'Registrarse'],
            ['group' => 'header', 'key' => 'my_dashboard', 'text_pt' => 'Meu Painel', 'text_en' => 'My Dashboard', 'text_es' => 'Mi Panel'],
            ['group' => 'header', 'key' => 'my_favorites', 'text_pt' => 'Meus Favoritos', 'text_en' => 'My Favorites', 'text_es' => 'Mis Favoritos'],

            // Hero
            ['group' => 'hero', 'key' => 'cashback_banner', 'text_pt' => 'Até 25% de GetCoin em cada Get', 'text_en' => 'Up to 25% GetCoin on every Get', 'text_es' => 'Hasta 25% de GetCoin en cada Get'],
            ['group' => 'hero', 'key' => 'title', 'text_pt' => 'Vibes Online com', 'text_en' => 'Online Vibes with', 'text_es' => 'Vibes Online con'],
            ['group' => 'hero', 'key' => 'title_highlight', 'text_pt' => 'GetCoin Real', 'text_en' => 'Real GetCoin', 'text_es' => 'GetCoin Real'],
            ['group' => 'hero', 'key' => 'subtitle', 'text_pt' => 'Participe das melhores Vibes de eletrônicos e ganhe GetCoin em cada Get. Economize até 90% em produtos premium!', 'text_en' => 'Join the best electronics Vibes and earn GetCoin on every Get. Save up to 90% on premium products!', 'text_es' => '¡Participa en las mejores Vibes de electrónica y gana GetCoin en cada Get. Ahorra hasta un 90% en productos premium!'],
            ['group' => 'hero', 'key' => 'search_placeholder', 'text_pt' => 'Buscar produtos em Vibe...', 'text_en' => 'Search Vibe products...', 'text_es' => 'Buscar productos en Vibe...'],
            ['group' => 'hero', 'key' => 'stat_users', 'text_pt' => 'Vibers', 'text_en' => 'Vibers', 'text_es' => 'Vibers'],
            ['group' => 'hero', 'key' => 'stat_cashback', 'text_pt' => 'Em GetCoin', 'text_en' => 'In GetCoin', 'text_es' => 'En GetCoin'],
            ['group' => 'hero', 'key' => 'stat_auctions', 'text_pt' => 'Vibes', 'text_en' => 'Vibes', 'text_es' => 'Vibes'],

            // Common
            ['group' => 'common', 'key' => 'loading', 'text_pt' => 'Carregando...', 'text_en' => 'Loading...', 'text_es' => 'Cargando...'],
            ['group' => 'common', 'key' => 'error', 'text_pt' => 'Ocorreu um erro', 'text_en' => 'An error occurred', 'text_es' => 'Ocurrió un error'],
            ['group' => 'common', 'key' => 'success', 'text_pt' => 'Sucesso', 'text_en' => 'Success', 'text_es' => 'Éxito'],
            ['group' => 'common', 'key' => 'save', 'text_pt' => 'Salvar', 'text_en' => 'Save', 'text_es' => 'Guardar'],
            ['group' => 'common', 'key' => 'cancel', 'text_pt' => 'Cancelar', 'text_en' => 'Cancel', 'text_es' => 'Cancelar'],
            ['group' => 'common', 'key' => 'back', 'text_pt' => 'Voltar', 'text_en' => 'Back', 'text_es' => 'Volver'],
            ['group' => 'common', 'key' => 'see_all', 'text_pt' => 'Ver todos', 'text_en' => 'See all', 'text_es' => 'Ver todos'],
            ['group' => 'common', 'key' => 'try_again', 'text_pt' => 'Tentar Novamente', 'text_en' => 'Try Again', 'text_es' => 'Intentar de Nuevo'],

            // Home Sections
            ['group' => 'home', 'key' => 'featured_title', 'text_pt' => 'Em Destaque', 'text_en' => 'Featured', 'text_es' => 'Destacados'],
            ['group' => 'home', 'key' => 'featured_subtitle', 'text_pt' => 'As Vibes mais disputadas do momento', 'text_en' => 'The most disputed Vibes right now', 'text_es' => 'Las Vibes más disputadas del momento'],
            ['group' => 'home', 'key' => 'hot_title', 'text_pt' => 'Ofertas Quentes', 'text_en' => 'Hot Deals', 'text_es' => 'Ofertas Calientes'],
            ['group' => 'home', 'key' => 'hot_subtitle', 'text_pt' => 'Oportunidades imperdíveis com muito GetCoin', 'text_en' => 'Unmissable opportunities with lots of GetCoin', 'text_es' => 'Oportunidades imperdibles con mucho GetCoin'],
            ['group' => 'home', 'key' => 'ending_title', 'text_pt' => 'Encerrando em Breve', 'text_en' => 'Ending Soon', 'text_es' => 'Terminando Pronto'],
            ['group' => 'home', 'key' => 'ending_subtitle', 'text_pt' => 'Última chance para dar seu Get', 'text_en' => 'Last chance to place your Get', 'text_es' => 'Última oportunidad para dar tu Get'],
            ['group' => 'home', 'key' => 'cta_title', 'text_pt' => 'Pronto para começar a ganhar?', 'text_en' => 'Ready to start winning?', 'text_es' => '¿Listo para empezar a ganar?'],
            ['group' => 'home', 'key' => 'cta_subtitle', 'text_pt' => 'Cadastre-se agora e receba bônus de boas-vindas!', 'text_en' => 'Register now and get a welcome bonus!', 'text_es' => '¡Regístrate ahora y recibe un bono de bienvenida!'],

            // Why Choose Us
            ['group' => 'why_choose_us', 'key' => 'title', 'text_pt' => 'Por que escolher a VibeGet?', 'text_en' => 'Why choose VibeGet?', 'text_es' => '¿Por qué elegir VibeGet?'],
            ['group' => 'why_choose_us', 'key' => 'card_1_title', 'text_pt' => 'GetCoin Garantido', 'text_en' => 'Guaranteed GetCoin', 'text_es' => 'GetCoin Garantizado'],
            ['group' => 'why_choose_us', 'key' => 'card_1_desc', 'text_pt' => 'Receba GetCoin em cada Get, ganhando ou não.', 'text_en' => 'Get GetCoin on every Get, win or lose.', 'text_es' => 'Recibe GetCoin en cada Get, ganes o pierdas.'],
            ['group' => 'why_choose_us', 'key' => 'card_2_title', 'text_pt' => 'Produtos Premium', 'text_en' => 'Premium Products', 'text_es' => 'Productos Premium'],
            ['group' => 'why_choose_us', 'key' => 'card_2_desc', 'text_pt' => 'Apenas produtos novos, originais e com garantia de fábrica.', 'text_en' => 'Only new, original products with factory warranty.', 'text_es' => 'Solo productos nuevos, originales y con garantía de fábrica.'],
            ['group' => 'why_choose_us', 'key' => 'card_3_title', 'text_pt' => 'Entrega Rápida', 'text_en' => 'Fast Delivery', 'text_es' => 'Entrega Rápida'],
            ['group' => 'why_choose_us', 'key' => 'card_3_desc', 'text_pt' => 'Enviamos para todo o Brasil com rastreamento em tempo real.', 'text_en' => 'We ship all over Brazil with real-time tracking.', 'text_es' => 'Enviamos a todo Brasil con seguimiento en tiempo real.'],
            ['group' => 'why_choose_us', 'key' => 'card_4_title', 'text_pt' => 'Suporte 24/7', 'text_en' => '24/7 Support', 'text_es' => 'Soporte 24/7'],
            ['group' => 'why_choose_us', 'key' => 'card_4_desc', 'text_pt' => 'Nossa equipe está sempre pronta para ajudar você.', 'text_en' => 'Our team is always ready to help you.', 'text_es' => 'Nuestro equipo siempre está listo para ayudarte.'],

            // Products
            ['group' => 'products', 'key' => 'current_bid', 'text_pt' => 'Get atual', 'text_en' => 'Current Get', 'text_es' => 'Get actual'],
            ['group' => 'products', 'key' => 'market_price', 'text_pt' => 'Valor de mercado', 'text_en' => 'Market price', 'text_es' => 'Valor de mercado'],
            ['group' => 'products', 'key' => 'place_bid', 'text_pt' => 'Dar Get', 'text_en' => 'Place Get', 'text_es' => 'Dar Get'],
            ['group' => 'products', 'key' => 'bidding', 'text_pt' => 'Enviando...', 'text_en' => 'Sending...', 'text_es' => 'Enviando...'],
            ['group' => 'products', 'key' => 'time_remaining', 'text_pt' => 'Tempo restante', 'text_en' => 'Time remaining', 'text_es' => 'Tiempo restante'],
            ['group' => 'products', 'key' => 'bids', 'text_pt' => 'gets', 'text_en' => 'gets', 'text_es' => 'gets'],
            ['group' => 'products', 'key' => 'view_auction', 'text_pt' => 'Ver Vibe', 'text_en' => 'View Vibe', 'text_es' => 'Ver Vibe'],
            ['group' => 'products', 'key' => 'bid_history', 'text_pt' => 'Histórico de Gets', 'text_en' => 'Get History', 'text_es' => 'Historial de Gets'],
            ['group' => 'products', 'key' => 'description', 'text_pt' => 'Descrição', 'text_en' => 'Description', 'text_es' => 'Descripción'],
            ['group' => 'products', 'key' => 'specifications', 'text_pt' => 'Especificações', 'text_en' => 'Specifications', 'text_es' => 'Especificaciones'],
            ['group' => 'products', 'key' => 'secure_purchase', 'text_pt' => 'Compra Segura', 'text_en' => 'Secure Purchase', 'text_es' => 'Compra Segura'],
            ['group' => 'products', 'key' => 'free_shipping', 'text_pt' => 'Entrega Grátis', 'text_en' => 'Free Shipping', 'text_es' => 'Envío Gratis'],
            ['group' => 'products', 'key' => 'warranty', 'text_pt' => '12 meses de garantia', 'text_en' => '12 months warranty', 'text_es' => '12 meses de garantía'],
            ['group' => 'products', 'key' => 'new_bid_notification', 'text_pt' => 'Novo Get! Valor atual:', 'text_en' => 'New Get! Current value:', 'text_es' => '¡Nuevo Get! Valor actual:'],
            ['group' => 'products', 'key' => 'not_found', 'text_pt' => 'Produto não encontrado', 'text_en' => 'Product not found', 'text_es' => 'Producto no encontrado'],
            ['group' => 'products', 'key' => 'load_error', 'text_pt' => 'Erro ao carregar produto', 'text_en' => 'Error loading product', 'text_es' => 'Error al cargar producto'],
            ['group' => 'products', 'key' => 'not_in_auction', 'text_pt' => 'Este produto não está em uma Vibe.', 'text_en' => 'This product is not in a Vibe.', 'text_es' => 'Este producto no está en una Vibe.'],
            ['group' => 'products', 'key' => 'bid_success', 'text_pt' => 'Get realizado com sucesso!', 'text_en' => 'Get placed successfully!', 'text_es' => '¡Get realizado con éxito!'],
            ['group' => 'products', 'key' => 'bid_error_generic', 'text_pt' => 'Erro ao realizar Get.', 'text_en' => 'Error placing Get.', 'text_es' => 'Error al realizar Get.'],
            ['group' => 'products', 'key' => 'bid_error_balance', 'text_pt' => 'Erro ao processar Get. Verifique seu saldo.', 'text_en' => 'Error processing Get. Check your balance.', 'text_es' => 'Error al procesar Get. Verifica tu saldo.'],
            ['group' => 'products', 'key' => 'loading_product', 'text_pt' => 'Carregando produto...', 'text_en' => 'Loading product...', 'text_es' => 'Cargando producto...'],
            ['group' => 'products', 'key' => 'not_found_subtitle', 'text_pt' => 'O produto que você está procurando não existe.', 'text_en' => 'The product you are looking for does not exist.', 'text_es' => 'El producto que buscas no existe.'],
            ['group' => 'products', 'key' => 'back_to_home', 'text_pt' => 'Voltar para a página inicial', 'text_en' => 'Back to home page', 'text_es' => 'Volver a la página inicial'],
            ['group' => 'products', 'key' => 'back', 'text_pt' => 'Voltar', 'text_en' => 'Back', 'text_es' => 'Volver'],
            ['group' => 'products', 'key' => 'cashback', 'text_pt' => 'Cashback', 'text_en' => 'Cashback', 'text_es' => 'Cashback'],
            ['group' => 'products', 'key' => 'previous_image', 'text_pt' => 'Imagem anterior', 'text_en' => 'Previous image', 'text_es' => 'Imagen anterior'],
            ['group' => 'products', 'key' => 'next_image', 'text_pt' => 'Próxima imagem', 'text_en' => 'Next image', 'text_es' => 'Siguiente imagen'],
            ['group' => 'products', 'key' => 'image', 'text_pt' => 'Imagem', 'text_en' => 'Image', 'text_es' => 'Imagen'],
            ['group' => 'products', 'key' => 'no_bids_yet', 'text_pt' => 'Nenhum Get realizado ainda.', 'text_en' => 'No Gets placed yet.', 'text_es' => 'Aún no se han realizado Gets.'],
            ['group' => 'products', 'key' => 'active', 'text_pt' => 'Ativo', 'text_en' => 'Active', 'text_es' => 'Activo'],
            ['group' => 'products', 'key' => 'inactive', 'text_pt' => 'Inativo', 'text_en' => 'Inactive', 'text_es' => 'Inactivo'],
            ['group' => 'products', 'key' => 'visits', 'text_pt' => 'Visitas', 'text_en' => 'Visits', 'text_es' => 'Visitas'],
            ['group' => 'products', 'key' => 'category', 'text_pt' => 'Categoria', 'text_en' => 'Category', 'text_es' => 'Categoría'],
            ['group' => 'products', 'key' => 'information', 'text_pt' => 'Informações', 'text_en' => 'Information', 'text_es' => 'Información'],
            ['group' => 'products', 'key' => 'brand', 'text_pt' => 'Marca', 'text_en' => 'Brand', 'text_es' => 'Marca'],
            ['group' => 'products', 'key' => 'model', 'text_pt' => 'Modelo', 'text_en' => 'Model', 'text_es' => 'Modelo'],
            ['group' => 'products', 'key' => 'auction', 'text_pt' => 'Vibe', 'text_en' => 'Vibe', 'text_es' => 'Vibe'],
            ['group' => 'products', 'key' => 'status', 'text_pt' => 'Status', 'text_en' => 'Status', 'text_es' => 'Estado'],
            ['group' => 'products', 'key' => 'scheduled', 'text_pt' => 'Agendado', 'text_en' => 'Scheduled', 'text_es' => 'Programado'],
            ['group' => 'products', 'key' => 'finished', 'text_pt' => 'Encerrado', 'text_en' => 'Finished', 'text_es' => 'Finalizado'],
            ['group' => 'products', 'key' => 'starting_bid', 'text_pt' => 'Get Inicial', 'text_en' => 'Starting Get', 'text_es' => 'Get Inicial'],
            ['group' => 'products', 'key' => 'product_price', 'text_pt' => 'Preço do produto', 'text_en' => 'Product price', 'text_es' => 'Precio del producto'],
            ['group' => 'products', 'key' => 'current_leader', 'text_pt' => 'Líder atual', 'text_en' => 'Current leader', 'text_es' => 'Líder actual'],
            ['group' => 'products', 'key' => 'no_leader', 'text_pt' => 'Sem líder', 'text_en' => 'No leader', 'text_es' => 'Sin líder'],
            ['group' => 'products', 'key' => 'min_bid', 'text_pt' => 'Get mínimo', 'text_en' => 'Minimum Get', 'text_es' => 'Get mínimo'],
            ['group' => 'products', 'key' => 'increment', 'text_pt' => 'Incremento', 'text_en' => 'Increment', 'text_es' => 'Incremento'],
            ['group' => 'products', 'key' => 'favorite', 'text_pt' => 'Favoritar', 'text_en' => 'Favorite', 'text_es' => 'Favorito'],
            ['group' => 'products', 'key' => 'remove_favorite', 'text_pt' => 'Remover dos favoritos', 'text_en' => 'Remove from favorites', 'text_es' => 'Quitar de favoritos'],
            ['group' => 'products', 'key' => 'add_favorite', 'text_pt' => 'Adicionar aos favoritos', 'text_en' => 'Add to favorites', 'text_es' => 'Añadir a favoritos'],
            ['group' => 'products', 'key' => 'share', 'text_pt' => 'Compartilhar', 'text_en' => 'Share', 'text_es' => 'Compartir'],
            ['group' => 'products', 'key' => 'share_product_title', 'text_pt' => 'Compartilhar produto', 'text_en' => 'Share product', 'text_es' => 'Compartir producto'],
            ['group' => 'products', 'key' => 'share_product_text', 'text_pt' => 'Confira este produto:', 'text_en' => 'Check out this product:', 'text_es' => 'Mira este producto:'],
            ['group' => 'products', 'key' => 'link_copied', 'text_pt' => 'Link copiado para a área de transferência!', 'text_en' => 'Link copied to clipboard!', 'text_es' => '¡Enlace copiado al portapapeles!'],
            ['group' => 'products', 'key' => 'share_error', 'text_pt' => 'Erro ao compartilhar. Tente copiar o link manualmente.', 'text_en' => 'Error sharing. Try copying the link manually.', 'text_es' => 'Error al compartir. Intenta copiar el enlace manualmente.'],
            ['group' => 'products', 'key' => 'favorite_error', 'text_pt' => 'Erro ao favoritar produto. Tente novamente.', 'text_en' => 'Error favoriting product. Try again.', 'text_es' => 'Error al marcar como favorito. Inténtalo de nuevo.'],
            ['group' => 'products', 'key' => 'related_products', 'text_pt' => 'Produtos Relacionados', 'text_en' => 'Related Products', 'text_es' => 'Productos Relacionados'],
            ['group' => 'products', 'key' => 'auction_ended', 'text_pt' => 'Vibe encerrada', 'text_en' => 'Vibe ended', 'text_es' => 'Vibe finalizada'],
            ['group' => 'products', 'key' => 'bidding_closed', 'text_pt' => 'O prazo para Gets foi encerrado.', 'text_en' => 'The Get period has ended.', 'text_es' => 'El período de Gets ha finalizado.'],
            ['group' => 'products', 'key' => 'buy_credits', 'text_pt' => 'Comprar Créditos', 'text_en' => 'Buy Credits', 'text_es' => 'Comprar Créditos'],
            ['group' => 'products', 'key' => 'cashback', 'text_pt' => 'Cashback', 'text_en' => 'Cashback', 'text_es' => 'Cashback'],
            ['group' => 'products', 'key' => 'previous_image', 'text_pt' => 'Imagem anterior', 'text_en' => 'Previous image', 'text_es' => 'Imagen anterior'],
            ['group' => 'products', 'key' => 'next_image', 'text_pt' => 'Próxima imagem', 'text_en' => 'Next image', 'text_es' => 'Siguiente imagen'],
            ['group' => 'products', 'key' => 'image', 'text_pt' => 'Imagem', 'text_en' => 'Image', 'text_es' => 'Imagen'],
            ['group' => 'products', 'key' => 'no_bids_yet', 'text_pt' => 'Nenhum lance realizado ainda.', 'text_en' => 'No bids placed yet.', 'text_es' => 'Aún no hay pujas.'],
            ['group' => 'products', 'key' => 'active', 'text_pt' => 'Ativo', 'text_en' => 'Active', 'text_es' => 'Activo'],
            ['group' => 'products', 'key' => 'inactive', 'text_pt' => 'Inativo', 'text_en' => 'Inactive', 'text_es' => 'Inactivo'],
            ['group' => 'products', 'key' => 'visits', 'text_pt' => 'Visitas', 'text_en' => 'Visits', 'text_es' => 'Visitas'],
            ['group' => 'products', 'key' => 'category', 'text_pt' => 'Categoria', 'text_en' => 'Category', 'text_es' => 'Categoría'],
            ['group' => 'products', 'key' => 'information', 'text_pt' => 'Informações', 'text_en' => 'Information', 'text_es' => 'Información'],
            ['group' => 'products', 'key' => 'brand', 'text_pt' => 'Marca', 'text_en' => 'Brand', 'text_es' => 'Marca'],
            ['group' => 'products', 'key' => 'model', 'text_pt' => 'Modelo', 'text_en' => 'Model', 'text_es' => 'Modelo'],
            ['group' => 'products', 'key' => 'auction', 'text_pt' => 'Leilão', 'text_en' => 'Auction', 'text_es' => 'Subasta'],
            ['group' => 'products', 'key' => 'status', 'text_pt' => 'Status', 'text_en' => 'Status', 'text_es' => 'Estado'],
            ['group' => 'products', 'key' => 'scheduled', 'text_pt' => 'Agendado', 'text_en' => 'Scheduled', 'text_es' => 'Programado'],
            ['group' => 'products', 'key' => 'finished', 'text_pt' => 'Encerrado', 'text_en' => 'Finished', 'text_es' => 'Finalizado'],
            ['group' => 'products', 'key' => 'starting_bid', 'text_pt' => 'Lance Inicial', 'text_en' => 'Starting Bid', 'text_es' => 'Puja Inicial'],
            ['group' => 'products', 'key' => 'product_price', 'text_pt' => 'Preço do produto', 'text_en' => 'Product price', 'text_es' => 'Precio del producto'],
            ['group' => 'products', 'key' => 'no_leader', 'text_pt' => 'Nenhum', 'text_en' => 'None', 'text_es' => 'Ninguno'],
            ['group' => 'products', 'key' => 'current_leader', 'text_pt' => 'Líder atual', 'text_en' => 'Current leader', 'text_es' => 'Líder actual'],
            ['group' => 'products', 'key' => 'min_bid', 'text_pt' => 'Lance mínimo', 'text_en' => 'Minimum bid', 'text_es' => 'Puja mínima'],
            ['group' => 'products', 'key' => 'increment', 'text_pt' => 'Incremento', 'text_en' => 'Increment', 'text_es' => 'Incremento'],
            ['group' => 'products', 'key' => 'favorite', 'text_pt' => 'Favoritar', 'text_en' => 'Favorite', 'text_es' => 'Favorito'],
            ['group' => 'products', 'key' => 'remove_favorite', 'text_pt' => 'Remover dos favoritos', 'text_en' => 'Remove from favorites', 'text_es' => 'Quitar de favoritos'],
            ['group' => 'products', 'key' => 'add_favorite', 'text_pt' => 'Adicionar aos favoritos', 'text_en' => 'Add to favorites', 'text_es' => 'Añadir a favoritos'],
            ['group' => 'products', 'key' => 'share', 'text_pt' => 'Compartilhar', 'text_en' => 'Share', 'text_es' => 'Compartir'],
            ['group' => 'products', 'key' => 'share_product', 'text_pt' => 'Confira este produto:', 'text_en' => 'Check out this product:', 'text_es' => 'Mira este producto:'],
            ['group' => 'products', 'key' => 'link_copied', 'text_pt' => 'Link copiado para a área de transferência!', 'text_en' => 'Link copied to clipboard!', 'text_es' => '¡Enlace copiado al portapapeles!'],
            ['group' => 'products', 'key' => 'share_error', 'text_pt' => 'Erro ao compartilhar. Tente copiar o link manualmente.', 'text_en' => 'Error sharing. Try copying the link manually.', 'text_es' => 'Error al compartir. Intenta copiar el enlace manualmente.'],
            ['group' => 'products', 'key' => 'share_product_title', 'text_pt' => 'Compartilhar produto', 'text_en' => 'Share product', 'text_es' => 'Compartir producto'],
            ['group' => 'products', 'key' => 'buy_credits', 'text_pt' => 'Comprar Créditos', 'text_en' => 'Buy Credits', 'text_es' => 'Comprar Créditos'],
            ['group' => 'products', 'key' => 'favorite_error', 'text_pt' => 'Erro ao favoritar produto. Tente novamente.', 'text_en' => 'Error favoriting product. Try again.', 'text_es' => 'Error al marcar como favorito. Inténtalo de nuevo.'],

            // Contact
            ['group' => 'contact', 'key' => 'header_title', 'text_pt' => 'Fale Conosco', 'text_en' => 'Contact Us', 'text_es' => 'Contáctanos'],
            ['group' => 'contact', 'key' => 'header_subtitle', 'text_pt' => 'Estamos aqui para ajudar e tirar suas dúvidas', 'text_en' => 'We are here to help and answer your questions', 'text_es' => 'Estamos aquí para ayudar y responder tus preguntas'],
            ['group' => 'contact', 'key' => 'form_title', 'text_pt' => 'Envie sua mensagem', 'text_en' => 'Send your message', 'text_es' => 'Envía tu mensaje'],
            ['group' => 'contact', 'key' => 'name_label', 'text_pt' => 'Nome *', 'text_en' => 'Name *', 'text_es' => 'Nombre *'],
            ['group' => 'contact', 'key' => 'name_placeholder', 'text_pt' => 'Seu nome completo', 'text_en' => 'Your full name', 'text_es' => 'Tu nombre completo'],
            ['group' => 'contact', 'key' => 'email_label', 'text_pt' => 'E-mail *', 'text_en' => 'Email *', 'text_es' => 'Email *'],
            ['group' => 'contact', 'key' => 'email_placeholder', 'text_pt' => 'seu@email.com', 'text_en' => 'your@email.com', 'text_es' => 'tu@email.com'],
            ['group' => 'contact', 'key' => 'subject_label', 'text_pt' => 'Assunto', 'text_en' => 'Subject', 'text_es' => 'Asunto'],
            ['group' => 'contact', 'key' => 'subject_placeholder', 'text_pt' => 'Qual é o assunto da sua mensagem?', 'text_en' => 'What is the subject of your message?', 'text_es' => '¿Cuál es el asunto de tu mensaje?'],
            ['group' => 'contact', 'key' => 'message_label', 'text_pt' => 'Mensagem *', 'text_en' => 'Message *', 'text_es' => 'Mensaje *'],
            ['group' => 'contact', 'key' => 'message_placeholder', 'text_pt' => 'Escreva sua mensagem aqui...', 'text_en' => 'Write your message here...', 'text_es' => 'Escribe tu mensaje aquí...'],
            ['group' => 'contact', 'key' => 'send_button', 'text_pt' => 'Enviar Mensagem', 'text_en' => 'Send Message', 'text_es' => 'Enviar Mensaje'],
            ['group' => 'contact', 'key' => 'sending_button', 'text_pt' => 'Enviando...', 'text_en' => 'Sending...', 'text_es' => 'Enviando...'],
            ['group' => 'contact', 'key' => 'success_message', 'text_pt' => 'Mensagem enviada com sucesso! Obrigado.', 'text_en' => 'Message sent successfully! Thank you.', 'text_es' => '¡Mensaje enviado con éxito! Gracias.'],
            ['group' => 'contact', 'key' => 'info_title', 'text_pt' => 'Outras Formas de Contato', 'text_en' => 'Other Ways to Contact', 'text_es' => 'Otras Formas de Contacto'],
            ['group' => 'contact', 'key' => 'info_email_label', 'text_pt' => 'E-mail', 'text_en' => 'Email', 'text_es' => 'Email'],
            ['group' => 'contact', 'key' => 'info_phone_label', 'text_pt' => 'Telefone', 'text_en' => 'Phone', 'text_es' => 'Teléfono'],
            ['group' => 'contact', 'key' => 'info_address_label', 'text_pt' => 'Endereço', 'text_en' => 'Address', 'text_es' => 'Dirección'],
            ['group' => 'contact', 'key' => 'error_name', 'text_pt' => 'Por favor informe seu nome.', 'text_en' => 'Please enter your name.', 'text_es' => 'Por favor ingresa tu nombre.'],
            ['group' => 'contact', 'key' => 'error_email', 'text_pt' => 'Por favor informe um e-mail válido.', 'text_en' => 'Please enter a valid email.', 'text_es' => 'Por favor ingresa un email válido.'],
            ['group' => 'contact', 'key' => 'error_message', 'text_pt' => 'Por favor escreva sua mensagem.', 'text_en' => 'Please write your message.', 'text_es' => 'Por favor escribe tu mensaje.'],
            ['group' => 'contact', 'key' => 'error_generic', 'text_pt' => 'Erro ao enviar mensagem. Tente novamente.', 'text_en' => 'Error sending message. Please try again.', 'text_es' => 'Error al enviar mensaje. Inténtalo de nuevo.'],

            // Footer
            ['group' => 'footer', 'key' => 'description', 'text_pt' => 'A maior plataforma de Vibes com GetCoin do Brasil. Produtos novos, lacrados e com garantia.', 'text_en' => 'The largest GetCoin Vibe platform in Brazil. New, sealed products with warranty.', 'text_es' => 'La mayor plataforma de Vibes con GetCoin de Brasil. Productos nuevos, sellados y con garantía.'],
            ['group' => 'footer', 'key' => 'quick_links', 'text_pt' => 'Links Rápidos', 'text_en' => 'Quick Links', 'text_es' => 'Enlaces Rápidos'],
            ['group' => 'footer', 'key' => 'legal', 'text_pt' => 'Legal', 'text_en' => 'Legal', 'text_es' => 'Legal'],
            ['group' => 'footer', 'key' => 'contact', 'text_pt' => 'Contato', 'text_en' => 'Contact', 'text_es' => 'Contacto'],
            ['group' => 'footer', 'key' => 'auctions', 'text_pt' => 'Vibes', 'text_en' => 'Vibes', 'text_es' => 'Vibes'],
            ['group' => 'footer', 'key' => 'how_it_works', 'text_pt' => 'Como Funciona', 'text_en' => 'How it Works', 'text_es' => 'Cómo Funciona'],
            ['group' => 'footer', 'key' => 'faq', 'text_pt' => 'FAQ', 'text_en' => 'FAQ', 'text_es' => 'FAQ'],
            ['group' => 'footer', 'key' => 'terms', 'text_pt' => 'Termos de Uso', 'text_en' => 'Terms of Use', 'text_es' => 'Términos de Uso'],
            ['group' => 'footer', 'key' => 'privacy', 'text_pt' => 'Política de Privacidade', 'text_en' => 'Privacy Policy', 'text_es' => 'Política de Privacidad'],
            ['group' => 'footer', 'key' => 'rules', 'text_pt' => 'Regras', 'text_en' => 'Rules', 'text_es' => 'Reglas'],
            ['group' => 'footer', 'key' => 'copyright', 'text_pt' => 'Todos os direitos reservados.', 'text_en' => 'All rights reserved.', 'text_es' => 'Todos los derechos reservados.'],

            // Pages
            ['group' => 'how_it_works', 'key' => 'content', 'text_pt' => '<div class="page-content">
<h1>Bem-vindo à VibeGet!</h1>
<h2>A forma inteligente e instigante de adquirir produtos.</h2>
<p>Você acaba de descobrir uma plataforma diferente, cheia de vantagens e com segurança para você arrematar eletrônicos e produtos premium com até 90% de economia.</p>

<h2>Passo a Passo</h2>

<div class="step">
<h3>1. Cadastre-se e ganhe</h3>
<p>Faça seu cadastro gratuito e rápido. Ao entrar, você já ganha Cashback de boas-vindas para ajudar a compor a sua melhor estratégia.</p>
</div>

<div class="step">
<h3>2. Escolha sua Vibe</h3>
<p>Navegue pela nossa lista de produtos premium (smartphones, notebooks, etc.) e escolha a disputa (Vibe) que deseja participar.</p>
</div>

<div class="step">
<h3>3. Verifique o lance mínimo</h3>
<p>Cada produto possui um valor mínimo estipulado para o "Get" (o seu lance), que costuma ser pelo menos 200 vezes menor que o valor original do produto.</p>
</div>

<div class="step">
<h3>4. Monte sua estratégia (Use seu Cashback!)</h3>
<p>O grande diferencial da VibeGet é que você pode usar o seu saldo de Cashback para turbinar o seu Get! Você pode utilizar de Cashback até o mesmo valor que for pagar em dinheiro (R$).</p>
<p><strong>Exemplo:</strong> Se você der um Get de R$ 3,95 em dinheiro, pode adicionar mais R$ 3,95 do seu saldo de Cashback. Seu Get total na disputa será de R$ 7,90!</p>
</div>

<div class="step">
<h3>5. Faça o pagamento</h3>
<p>Pague a parte em dinheiro (R$) do seu GET de forma rápida via Pix ou Cartão.</p>
</div>

<div class="step">
<h3>6. Aguarde o resultado</h3>
<p>O prazo para o encerramento da Vibe é de 1 a 15 dias ou até atingir a quantidade mínima de lances. O vencedor é aquele que der o GET mais alto!</p>
</div>

<div class="step">
<h3>7. Receba em casa</h3>
<p>O vencedor (dono do Champion Get) é contatado por nossa equipe para combinar as especificações do produto e o envio rápido para todo o Brasil.</p>
</div>

<h2>E se eu não vencer a Vibe? (Cashback Garantido)</h2>
<p>Na VibeGet, você nunca sai de mãos vazias. Se o seu Get não for o vencedor, você recebe <strong>40% do valor pago em R$</strong> de volta como Cashback diretamente na sua conta, para utilizar nas próximas Vibes na plataforma!</p>

<h2>Por que escolher a VibeGet?</h2>
<ul>
<li><strong>Cashback Garantido:</strong> Receba parte do valor de volta, ganhando ou não.</li>
<li><strong>Produtos Premium:</strong> Apenas produtos novos, originais e com garantia de fábrica.</li>
<li><strong>Entrega Rápida:</strong> Enviamos para todo o Brasil com rastreamento.</li>
<li><strong>Suporte 24/7:</strong> Nossa equipe está sempre pronta para ajudar.</li>
</ul>
</div>', 'text_en' => '<div class="page-content">
<h1>Welcome to VibeGet!</h1>
<h2>The smart and exciting way to acquire products.</h2>
<p>You have just discovered a unique platform, full of advantages and security for you to win electronics and premium products with up to 90% savings.</p>

<h2>Step by Step</h2>

<div class="step">
<h3>1. Sign up and earn</h3>
<p>Create your free and quick account. Upon joining, you already earn a welcome Cashback bonus to help you build your best strategy.</p>
</div>

<div class="step">
<h3>2. Choose your Vibe</h3>
<p>Browse our list of premium products (smartphones, notebooks, etc.) and choose the contest (Vibe) you want to participate in.</p>
</div>

<div class="step">
<h3>3. Check the minimum bid</h3>
<p>Each product has a minimum value set for the "Get" (your bid), which is usually at least 200 times less than the original product value.</p>
</div>

<div class="step">
<h3>4. Build your strategy (Use your Cashback!)</h3>
<p>The great advantage of VibeGet is that you can use your Cashback balance to boost your Get! You can use Cashback up to the same amount you pay in cash (R$).</p>
<p><strong>Example:</strong> If you place a Get of R$ 3.95 in cash, you can add another R$ 3.95 from your Cashback balance. Your total Get in the contest will be R$ 7.90!</p>
</div>

<div class="step">
<h3>5. Make the payment</h3>
<p>Pay the cash portion (R$) of your GET quickly via Pix or Card.</p>
</div>

<div class="step">
<h3>6. Wait for the result</h3>
<p>The Vibe closing period is 1 to 15 days or until it reaches the minimum number of bids. The winner is the one with the highest GET!</p>
</div>

<div class="step">
<h3>7. Receive at home</h3>
<p>The winner (Champion Get owner) is contacted by our team to arrange product specifications and fast shipping across Brazil.</p>
</div>

<h2>What if I do not win the Vibe? (Guaranteed Cashback)</h2>
<p>At VibeGet, you never leave empty-handed. If your Get is not the winner, you receive <strong>40% of the amount paid in R$</strong> back as Cashback directly to your account, to use in the next Vibes on the platform!</p>

<h2>Why choose VibeGet?</h2>
<ul>
<li><strong>Guaranteed Cashback:</strong> Get part of your value back, win or lose.</li>
<li><strong>Premium Products:</strong> Only new, original products with factory warranty.</li>
<li><strong>Fast Delivery:</strong> We ship across Brazil with tracking.</li>
<li><strong>24/7 Support:</strong> Our team is always ready to help.</li>
</ul>
</div>', 'text_es' => '<div class="page-content">
<h1>¡Bienvenido a VibeGet!</h1>
<h2>La forma inteligente y emocionante de adquirir productos.</h2>
<p>Acabas de descubrir una plataforma diferente, llena de ventajas y seguridad para que consigas electrónicos y productos premium con hasta un 90% de ahorro.</p>

<h2>Paso a Paso</h2>

<div class="step">
<h3>1. Regístrate y gana</h3>
<p>Crea tu cuenta gratuita y rápida. Al ingresar, ya recibes un bono de Cashback de bienvenida para ayudarte a armar tu mejor estrategia.</p>
</div>

<div class="step">
<h3>2. Elige tu Vibe</h3>
<p>Navega por nuestra lista de productos premium (smartphones, notebooks, etc.) y elige la disputa (Vibe) en la que deseas participar.</p>
</div>

<div class="step">
<h3>3. Verifica el Get mínimo</h3>
<p>Cada producto tiene un valor mínimo estipulado para el "Get" (tu puja), que suele ser al menos 200 veces menor que el valor original del producto.</p>
</div>

<div class="step">
<h3>4. Arma tu estrategia (¡Usa tu Cashback!)</h3>
<p>El gran diferencial de VibeGet es que puedes usar tu saldo de Cashback para potenciar tu Get. Puedes usar Cashback hasta el mismo monto que pagues en efectivo (R$).</p>
<p><strong>Ejemplo:</strong> Si das un Get de R$ 3,95 en efectivo, puedes agregar otros R$ 3,95 de tu saldo de Cashback. ¡Tu Get total en la disputa será de R$ 7,90!</p>
</div>

<div class="step">
<h3>5. Realiza el pago</h3>
<p>Paga la parte en efectivo (R$) de tu GET de forma rápida vía Pix o Tarjeta.</p>
</div>

<div class="step">
<h3>6. Espera el resultado</h3>
<p>El plazo para el cierre de la Vibe es de 1 a 15 días o hasta alcanzar la cantidad mínima de Gets. ¡El ganador es quien dé el GET más alto!</p>
</div>

<div class="step">
<h3>7. Recibe en casa</h3>
<p>El ganador (dueño del Champion Get) es contactado por nuestro equipo para coordinar las especificaciones del producto y el envío rápido a todo Brasil.</p>
</div>

<h2>¿Y si no gano la Vibe? (Cashback Garantizado)</h2>
<p>En VibeGet, nunca te vas con las manos vacías. Si tu Get no es el ganador, recibes <strong>40% del valor pagado en R$</strong> como Cashback directamente en tu cuenta, ¡para usar en las próximas Vibes en la plataforma!</p>

<h2>¿Por qué elegir VibeGet?</h2>
<ul>
<li><strong>Cashback Garantizado:</strong> Recibe parte del valor de vuelta, ganes o pierdas.</li>
<li><strong>Productos Premium:</strong> Solo productos nuevos, originales y con garantía de fábrica.</li>
<li><strong>Entrega Rápida:</strong> Enviamos a todo Brasil con seguimiento.</li>
<li><strong>Soporte 24/7:</strong> Nuestro equipo siempre está listo para ayudarte.</li>
</ul>
</div>'],
            ['group' => 'contact', 'key' => 'content', 'text_pt' => '<h1>Fale Conosco</h1><p>Entre em contato conosco...</p>', 'text_en' => '<h1>Contact Us</h1><p>Get in touch with us...</p>', 'text_es' => '<h1>Contáctanos</h1><p>Ponte en contacto con nosotros...</p>'],
            ['group' => 'terms', 'key' => 'content', 'text_pt' => '<h1>Termos de Uso</h1><p>Termos de uso...</p>', 'text_en' => '<h1>Terms of Use</h1><p>Terms of use...</p>', 'text_es' => '<h1>Términos de Uso</h1><p>Términos de uso...</p>'],
            ['group' => 'privacy', 'key' => 'content', 'text_pt' => '<h1>Política de Privacidade</h1><p>Política de privacidade...</p>', 'text_en' => '<h1>Privacy Policy</h1><p>Privacy policy...</p>', 'text_es' => '<h1>Política de Privacidad</h1><p>Política de privacidad...</p>'],
            ['group' => 'rules', 'key' => 'content', 'text_pt' => '<h1>Regras</h1><p>Regras do leilão...</p>', 'text_en' => '<h1>Rules</h1><p>Auction rules...</p>', 'text_es' => '<h1>Reglas</h1><p>Reglas de la subasta...</p>'],
            ['group' => 'faq', 'key' => 'content', 'text_pt' => '<h1>Perguntas Frequentes</h1>
<h3>Menor de 18 anos pode fazer o cadastro?</h3>
<p>Para quem tem de 16 a 17 anos, <strong>sim</strong>, porém é necessário acrescentar um responsável maior de 18 anos (pai, mãe ou tutor). Para menores de 16 anos <strong>não é possível</strong>.</p>

<h3>O que é GetCoin?</h3>
<p>GetCoin é o saldo de cashback que você acumula na plataforma. Ele pode ser usado para turbinar seus Gets (lances) nas Vibes. <strong>GetCoin NÃO pode ser sacado</strong>, apenas utilizado dentro do website.</p>

<h3>Como funciona a indicação?</h3>
<p>Cada Viber possui um código de indicação. Quando alguém se cadastra usando seu código e faz o primeiro crédito, você ganha GetCoins automaticamente (a quantidade depende do seu nível).</p>

<h3>Como uso o GetCoin nos Gets?</h3>
<p>Ao dar um Get (lance), você pode utilizar GetCoin até o mesmo valor que pagar em dinheiro (R$). Exemplo: Get de R$ 3,95 em dinheiro + R$ 3,95 em GetCoin = Get total de R$ 7,90!</p>

<h3>O que acontece se eu não vencer a Vibe?</h3>
<p>Você recebe 40% do valor pago em R$ de volta como GetCoin na sua conta, para usar nas próximas Vibes.</p>

<h3>Posso ver os Gets dos outros participantes durante a Vibe?</h3>
<p>Não. Durante uma Vibe ativa, ninguém tem acesso aos valores individuais dos Gets. Essa informação só é revelada após o encerramento.</p>

<h3>Qual o valor mínimo do Get?</h3>
<p>O valor mínimo é aproximadamente 200 vezes menor que o valor do produto. Essa proporção pode variar de produto para produto.</p>

<h3>Posso vender GetCoin para outros Vibers?</h3>
<p>Sim, a partir do nível Bronze (venceu pelo menos 1 Vibe). A negociação é livre no Marketplace dentro do site.</p>', 'text_en' => '<h1>Frequently Asked Questions</h1>
<h3>Can minors register?</h3>
<p>For ages 16-17, <strong>yes</strong>, but a guardian over 18 (parent or tutor) is required. Under 16 is <strong>not allowed</strong>.</p>

<h3>What is GetCoin?</h3>
<p>GetCoin is the cashback balance you accumulate on the platform. It can be used to boost your Gets (bids) in Vibes. <strong>GetCoin CANNOT be withdrawn</strong>, only used within the website.</p>

<h3>How does the referral work?</h3>
<p>Each Viber has a referral code. When someone signs up with your code and makes their first deposit, you earn GetCoins automatically.</p>

<h3>What happens if I do not win the Vibe?</h3>
<p>You receive 40% of your R$ payment back as GetCoin to use in future Vibes.</p>', 'text_es' => '<h1>Preguntas Frecuentes</h1>
<h3>¿Pueden registrarse menores de edad?</h3>
<p>Para edades entre 16-17, <strong>sí</strong>, pero se requiere un responsable mayor de 18 años. Menores de 16 <strong>no pueden</strong>.</p>

<h3>¿Qué es GetCoin?</h3>
<p>GetCoin es el saldo de cashback que acumulas en la plataforma. Se puede usar para potenciar tus Gets en las Vibes. <strong>GetCoin NO se puede retirar</strong>, solo usar dentro del sitio.</p>

<h3>¿Qué pasa si no gano la Vibe?</h3>
<p>Recibes 40% del valor pagado en R$ como GetCoin para usar en las próximas Vibes.</p>'],
            ['group' => 'level_up', 'key' => 'content', 'text_pt' => '<div class="page-content">
<h1>Suba de Nível e torne-se um Viber Oficial!</h1>

<h2>Como funciona a evolução na plataforma</h2>

<div class="level-card">
<h3>Nível 1 — Iniciante (Explorador)</h3>
<p>Assim que você se cadastra na plataforma de forma gratuita, você recebe bônus de Cashback para iniciar sua jornada.</p>
<p>Neste nível, você pode participar de qualquer Vibe, acumular Cashback (seja pelas disputas não vencidas ou indicando amigos) e montar suas estratégias combinando R$ e saldo bônus.</p>
</div>

<div class="level-card">
<h3>Nível 2 — Viber (O Campeão)</h3>
<p><strong>Como alcançar:</strong> Para subir de nível e ganhar o status de Viber, você precisa arrematar o seu primeiro Champion Get (ou seja, vencer a sua primeira Vibe!).</p>
<p>Ser um Viber significa que você dominou a estratégia da plataforma, utilizou seu saldo de forma inteligente e superou as ofertas dos outros participantes para levar um produto premium para casa.</p>
</div>

<h2>Dicas para subir de nível mais rápido</h2>
<ol>
<li><strong>Acumule Cashback:</strong> Aproveite os 40% de retorno nas Vibes em que você não venceu.</li>
<li><strong>Dobre seu poder de fogo:</strong> Lembre-se que você pode igualar o valor do seu lance em dinheiro utilizando o seu Cashback. Isso aumenta drasticamente o valor do seu "Get" e suas chances de conseguir um "Champion Get".</li>
</ol>
</div>', 'text_en' => '<div class="page-content">
<h1>Level Up and become an Official Viber!</h1>

<h2>How the evolution works on the platform</h2>

<div class="level-card">
<h3>Level 1 — Beginner (Explorer)</h3>
<p>As soon as you sign up for free on the platform, you receive a Cashback bonus to start your journey.</p>
<p>At this level, you can participate in any Vibe, accumulate Cashback (from non-winning contests or by referring friends) and build your strategies combining R$ and bonus balance.</p>
</div>

<div class="level-card">
<h3>Level 2 — Viber (The Champion)</h3>
<p><strong>How to achieve:</strong> To level up and earn the Viber status, you need to win your first Champion Get (that is, win your first Vibe!).</p>
<p>Being a Viber means you have mastered the platform strategy, used your balance wisely and outbid other participants to take a premium product home.</p>
</div>

<h2>Tips to level up faster</h2>
<ol>
<li><strong>Accumulate Cashback:</strong> Take advantage of the 40% return on Vibes you did not win.</li>
<li><strong>Double your firepower:</strong> Remember you can match your cash bid amount using your Cashback. This drastically increases your "Get" value and your chances of achieving a "Champion Get".</li>
</ol>
</div>', 'text_es' => '<div class="page-content">
<h1>¡Sube de Nivel y conviértete en un Viber Oficial!</h1>

<h2>Cómo funciona la evolución en la plataforma</h2>

<div class="level-card">
<h3>Nivel 1 — Principiante (Explorador)</h3>
<p>Tan pronto como te registras gratuitamente en la plataforma, recibes un bono de Cashback para comenzar tu viaje.</p>
<p>En este nivel, puedes participar en cualquier Vibe, acumular Cashback (por disputas no ganadas o invitando amigos) y armar tus estrategias combinando R$ y saldo de bono.</p>
</div>

<div class="level-card">
<h3>Nivel 2 — Viber (El Campeón)</h3>
<p><strong>Cómo lograrlo:</strong> Para subir de nivel y ganar el estatus de Viber, necesitas obtener tu primer Champion Get (¡es decir, ganar tu primera Vibe!).</p>
<p>Ser un Viber significa que dominaste la estrategia de la plataforma, usaste tu saldo de forma inteligente y superaste las ofertas de otros participantes para llevarte un producto premium a casa.</p>
</div>

<h2>Consejos para subir de nivel más rápido</h2>
<ol>
<li><strong>Acumula Cashback:</strong> Aprovecha el 40% de retorno en las Vibes que no ganaste.</li>
<li><strong>Duplica tu poder:</strong> Recuerda que puedes igualar el valor de tu puja en efectivo usando tu Cashback. Esto aumenta drásticamente el valor de tu "Get" y tus chances de lograr un "Champion Get".</li>
</ol>
</div>'],

            // Auth (Login, Cadastro, Recuperar Senha, Redefinir Senha)
            ['group' => 'auth', 'key' => 'login_title', 'text_pt' => 'Bem-vindo de volta', 'text_en' => 'Welcome back', 'text_es' => 'Bienvenido de vuelta'],
            ['group' => 'auth', 'key' => 'login_subtitle', 'text_pt' => 'Entre na sua conta para continuar', 'text_en' => 'Sign in to your account to continue', 'text_es' => 'Inicia sesión en tu cuenta para continuar'],
            ['group' => 'auth', 'key' => 'email_label', 'text_pt' => 'Email', 'text_en' => 'Email', 'text_es' => 'Email'],
            ['group' => 'auth', 'key' => 'email_placeholder', 'text_pt' => 'seu@email.com', 'text_en' => 'your@email.com', 'text_es' => 'tu@email.com'],
            ['group' => 'auth', 'key' => 'password_label', 'text_pt' => 'Senha', 'text_en' => 'Password', 'text_es' => 'Contraseña'],
            ['group' => 'auth', 'key' => 'forgot_password_link', 'text_pt' => 'Esqueceu a senha?', 'text_en' => 'Forgot password?', 'text_es' => '¿Olvidaste tu contraseña?'],
            ['group' => 'auth', 'key' => 'logging_in', 'text_pt' => 'Entrando...', 'text_en' => 'Signing in...', 'text_es' => 'Entrando...'],
            ['group' => 'auth', 'key' => 'login_button', 'text_pt' => 'Entrar', 'text_en' => 'Sign In', 'text_es' => 'Entrar'],
            ['group' => 'auth', 'key' => 'no_account', 'text_pt' => 'Não tem uma conta?', 'text_en' => "Don't have an account?", 'text_es' => '¿No tienes una cuenta?'],
            ['group' => 'auth', 'key' => 'signup_free', 'text_pt' => 'Cadastre-se grátis', 'text_en' => 'Sign up for free', 'text_es' => 'Regístrate gratis'],
            ['group' => 'auth', 'key' => 'signup_title', 'text_pt' => 'Criar Conta', 'text_en' => 'Create Account', 'text_es' => 'Crear Cuenta'],
            ['group' => 'auth', 'key' => 'signup_subtitle', 'text_pt' => 'Junte-se a milhares de usuários', 'text_en' => 'Join thousands of users', 'text_es' => 'Únete a miles de usuarios'],
            ['group' => 'auth', 'key' => 'benefit_cashback', 'text_pt' => 'GetCoin em cada Get', 'text_en' => 'GetCoin on every Get', 'text_es' => 'GetCoin en cada Get'],
            ['group' => 'auth', 'key' => 'benefit_economy', 'text_pt' => 'Economize até 90%', 'text_en' => 'Save up to 90%', 'text_es' => 'Ahorra hasta un 90%'],
            ['group' => 'auth', 'key' => 'benefit_guarantee', 'text_pt' => 'Produtos garantidos', 'text_en' => 'Guaranteed products', 'text_es' => 'Productos garantizados'],
            ['group' => 'auth', 'key' => 'benefit_support', 'text_pt' => 'Suporte 24/7', 'text_en' => '24/7 Support', 'text_es' => 'Soporte 24/7'],
            ['group' => 'auth', 'key' => 'fullname_label', 'text_pt' => 'Nome completo', 'text_en' => 'Full name', 'text_es' => 'Nombre completo'],
            ['group' => 'auth', 'key' => 'fullname_placeholder', 'text_pt' => 'João Silva', 'text_en' => 'John Doe', 'text_es' => 'Juan García'],
            ['group' => 'auth', 'key' => 'phone_label', 'text_pt' => 'Telefone', 'text_en' => 'Phone', 'text_es' => 'Teléfono'],
            ['group' => 'auth', 'key' => 'cpf_label', 'text_pt' => 'CPF', 'text_en' => 'CPF', 'text_es' => 'CPF'],
            ['group' => 'auth', 'key' => 'confirm_password_label', 'text_pt' => 'Confirmar senha', 'text_en' => 'Confirm password', 'text_es' => 'Confirmar contraseña'],
            ['group' => 'auth', 'key' => 'accept_terms_prefix', 'text_pt' => 'Li e aceito os', 'text_en' => 'I have read and accept the', 'text_es' => 'He leído y acepto los'],
            ['group' => 'auth', 'key' => 'terms_of_use', 'text_pt' => 'Termos de Uso', 'text_en' => 'Terms of Use', 'text_es' => 'Términos de Uso'],
            ['group' => 'auth', 'key' => 'and', 'text_pt' => 'e', 'text_en' => 'and', 'text_es' => 'y'],
            ['group' => 'auth', 'key' => 'privacy_policy', 'text_pt' => 'Política de Privacidade', 'text_en' => 'Privacy Policy', 'text_es' => 'Política de Privacidad'],
            ['group' => 'auth', 'key' => 'creating_account', 'text_pt' => 'Criando conta...', 'text_en' => 'Creating account...', 'text_es' => 'Creando cuenta...'],
            ['group' => 'auth', 'key' => 'create_account_button', 'text_pt' => 'Criar Conta', 'text_en' => 'Create Account', 'text_es' => 'Crear Cuenta'],
            ['group' => 'auth', 'key' => 'already_have_account', 'text_pt' => 'Já tem uma conta?', 'text_en' => 'Already have an account?', 'text_es' => '¿Ya tienes una cuenta?'],
            ['group' => 'auth', 'key' => 'do_login', 'text_pt' => 'Fazer login', 'text_en' => 'Sign in', 'text_es' => 'Iniciar sesión'],
            ['group' => 'auth', 'key' => 'recover_password_title', 'text_pt' => 'Recuperar Senha', 'text_en' => 'Recover Password', 'text_es' => 'Recuperar Contraseña'],
            ['group' => 'auth', 'key' => 'recover_password_subtitle', 'text_pt' => 'Insira seu email para receber o link de redefinição.', 'text_en' => 'Enter your email to receive the reset link.', 'text_es' => 'Ingresa tu email para recibir el enlace de restablecimiento.'],
            ['group' => 'auth', 'key' => 'sending_link', 'text_pt' => 'Enviando link...', 'text_en' => 'Sending link...', 'text_es' => 'Enviando enlace...'],
            ['group' => 'auth', 'key' => 'send_link_button', 'text_pt' => 'Enviar Link', 'text_en' => 'Send Link', 'text_es' => 'Enviar Enlace'],
            ['group' => 'auth', 'key' => 'remembered_password', 'text_pt' => 'Lembrou a senha?', 'text_en' => 'Remembered your password?', 'text_es' => '¿Recordaste tu contraseña?'],
            ['group' => 'auth', 'key' => 'reset_password_title', 'text_pt' => 'Redefinir Senha', 'text_en' => 'Reset Password', 'text_es' => 'Restablecer Contraseña'],
            ['group' => 'auth', 'key' => 'reset_password_subtitle', 'text_pt' => 'Crie uma nova senha para sua conta.', 'text_en' => 'Create a new password for your account.', 'text_es' => 'Crea una nueva contraseña para tu cuenta.'],
            ['group' => 'auth', 'key' => 'new_password_label', 'text_pt' => 'Nova Senha', 'text_en' => 'New Password', 'text_es' => 'Nueva Contraseña'],
            ['group' => 'auth', 'key' => 'confirm_new_password_label', 'text_pt' => 'Confirmar Nova Senha', 'text_en' => 'Confirm New Password', 'text_es' => 'Confirmar Nueva Contraseña'],
            ['group' => 'auth', 'key' => 'redefining_password', 'text_pt' => 'Redefinindo...', 'text_en' => 'Resetting...', 'text_es' => 'Restableciendo...'],
            ['group' => 'auth', 'key' => 'redefine_password_button', 'text_pt' => 'Redefinir Senha', 'text_en' => 'Reset Password', 'text_es' => 'Restablecer Contraseña'],

            // Auctions (Public Auctions page)
            ['group' => 'auctions', 'key' => 'title', 'text_pt' => 'Todas as Vibes', 'text_en' => 'All Vibes', 'text_es' => 'Todas las Vibes'],
            ['group' => 'auctions', 'key' => 'subtitle', 'text_pt' => '', 'text_en' => '', 'text_es' => ''],
            ['group' => 'auctions', 'key' => 'all_categories', 'text_pt' => 'Todas as Categorias', 'text_en' => 'All Categories', 'text_es' => 'Todas las Categorías'],
            ['group' => 'auctions', 'key' => 'no_auctions', 'text_pt' => 'Nenhuma Vibe encontrada com os filtros selecionados.', 'text_en' => 'No Vibes found with the selected filters.', 'text_es' => 'No se encontraron Vibes con los filtros seleccionados.'],

            // Categories
            ['group' => 'categories', 'key' => 'all', 'text_pt' => 'Todos', 'text_en' => 'All', 'text_es' => 'Todos'],

            // Home (textos adicionais)
            ['group' => 'home', 'key' => 'results_for', 'text_pt' => 'Resultados para', 'text_en' => 'Results for', 'text_es' => 'Resultados para'],
            ['group' => 'home', 'key' => 'products_found', 'text_pt' => 'produto(s) encontrado(s)', 'text_en' => 'product(s) found', 'text_es' => 'producto(s) encontrado(s)'],
            ['group' => 'home', 'key' => 'no_auctions_category', 'text_pt' => 'Nenhuma Vibe ativa encontrada para esta categoria.', 'text_en' => 'No active Vibes found for this category.', 'text_es' => 'No se encontraron Vibes activas para esta categoría.'],
            ['group' => 'home', 'key' => 'no_auctions_now', 'text_pt' => 'Nenhuma Vibe ativa no momento.', 'text_en' => 'No active Vibes at the moment.', 'text_es' => 'No hay Vibes activas en este momento.'],
            ['group' => 'home', 'key' => 'come_back_soon', 'text_pt' => 'Volte em breve para ver novos produtos!', 'text_en' => 'Come back soon to see new products!', 'text_es' => '¡Vuelve pronto para ver nuevos productos!'],

            // Common (textos adicionais)
            ['group' => 'common', 'key' => 'loading_content', 'text_pt' => 'Carregando conteúdo...', 'text_en' => 'Loading content...', 'text_es' => 'Cargando contenido...'],
            ['group' => 'common', 'key' => 'no_content', 'text_pt' => 'Nenhum conteúdo disponível para esta página no momento.', 'text_en' => 'No content available for this page at the moment.', 'text_es' => 'No hay contenido disponible para esta página en este momento.'],
        ];

        foreach ($translations as $t) {
            Translation::updateOrCreate(
                ['group' => $t['group'], 'key' => $t['key']],
                $t
            );
        }
    }
}
