<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Inserir configurações de texto
        DB::table('settings')->insert([
            // Páginas
            ['key' => 'page_como_funciona', 'value' => '<h2>Como Funciona o VibeGet</h2><p>Conteúdo padrão da página Como Funciona...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Como Funciona', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_categorias', 'value' => '<h2>Categorias</h2><p>Conteúdo padrão da página Categorias...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Categorias', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_termos', 'value' => '<h2>Termos de Uso</h2><p>Conteúdo padrão dos Termos de Uso...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Termos', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_faq', 'value' => '<h2>Perguntas Frequentes</h2><p>Conteúdo padrão do FAQ...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página FAQ', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_privacidade', 'value' => '<h2>Política de Privacidade</h2><p>Conteúdo padrão da Política de Privacidade...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Privacidade', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_regras', 'value' => '<h2>Regras do Leilão</h2><p>Conteúdo padrão das Regras...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Regras', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_contato', 'value' => '<h2>Entre em Contato</h2><p>Conteúdo padrão da página Contato...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Contato', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'page_suba_de_nivel', 'value' => '<h2>Suba de Nível e Ganhe Mais!</h2><p>Participe das Vibes e conquiste prêmios especiais!</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da página Suba de Nível', 'created_at' => now(), 'updated_at' => now()],
            
            // Seção Home
            ['key' => 'home_hero_title', 'value' => 'Leilões Online com Cashback', 'type' => 'string', 'group' => 'content', 'description' => 'Título principal da home', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'home_hero_subtitle', 'value' => 'Dispute produtos incríveis e ganhe dinheiro de volta em cada lance!', 'type' => 'string', 'group' => 'content', 'description' => 'Subtítulo da home', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'home_hero_description', 'value' => '<p>A cada lance que você faz, você ganha cashback. Mesmo se não ganhar o leilão, você ainda sai no lucro!</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Descrição da primeira seção da home', 'created_at' => now(), 'updated_at' => now()],
            
            // Por que comprar
            ['key' => 'why_choose_content', 'value' => '<h3>Uma Nova Forma de Adquirir</h3><p>Ao invés de comprar de forma convencional, você participa de uma Vibe interativa...</p>', 'type' => 'html', 'group' => 'content', 'description' => 'Conteúdo da seção Por que comprar', 'created_at' => now(), 'updated_at' => now()],
            
            // Redes Sociais
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/vibeget', 'type' => 'string', 'group' => 'social', 'description' => 'Link do Facebook', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/vibeget', 'type' => 'string', 'group' => 'social', 'description' => 'Link do Instagram', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/vibeget', 'type' => 'string', 'group' => 'social', 'description' => 'Link do Twitter/X', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/vibeget', 'type' => 'string', 'group' => 'social', 'description' => 'Link do LinkedIn', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->whereIn('group', ['content', 'social'])->delete();
    }
};

