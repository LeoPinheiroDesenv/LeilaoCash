<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Adicionar site_keywords se não existir
        if (!DB::table('settings')->where('key', 'site_keywords')->exists()) {
            DB::table('settings')->insert([
                'key' => 'site_keywords',
                'value' => 'leilão online, cashback, leilão com cashback, comprar barato, descontos, vibeget',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Palavras-chave do site (SEO)',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'site_keywords')->delete();
    }
};
