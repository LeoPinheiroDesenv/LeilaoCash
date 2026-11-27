<?php

use Database\Seeders\TranslationSeeder;
use Illuminate\Database\Migrations\Migration;

/**
 * Ajustes de 16/nov/26: aplica em produção os textos novos de Como Funciona,
 * FAQ e Suba de Nível ("adquirir" no lugar de "arrematar", Cashback -> GetCoin,
 * Get mínimo, sem "(lances)" e os 5 níveis de Vibers).
 *
 * O TranslationSeeder agora só cria chaves que faltam, então mudanças em textos
 * existentes precisam passar por uma migration como esta (roda uma vez só).
 */
return new class extends Migration
{
    public function up(): void
    {
        TranslationSeeder::applyKeys([
            'how_it_works.content',
            'faq.content',
            'level_up.content',
        ]);
    }

    public function down(): void
    {
        // Textos antigos não são restaurados.
    }
};
