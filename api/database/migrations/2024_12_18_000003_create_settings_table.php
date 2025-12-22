<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, image, color
            $table->string('group')->default('general'); // general, theme, appearance
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Inserir configurações padrão
        DB::table('settings')->insert([
            // Cores
            ['key' => 'primary_color', 'value' => '#E55F52', 'type' => 'color', 'group' => 'theme', 'description' => 'Cor primária do sistema', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'secondary_color', 'value' => '#4A9FD8', 'type' => 'color', 'group' => 'theme', 'description' => 'Cor secundária do sistema', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'background_color', 'value' => '#0a1628', 'type' => 'color', 'group' => 'theme', 'description' => 'Cor de fundo principal', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'text_color', 'value' => '#e6eef8', 'type' => 'color', 'group' => 'theme', 'description' => 'Cor do texto principal', 'created_at' => now(), 'updated_at' => now()],
            
            // Fontes
            ['key' => 'font_primary', 'value' => 'Inter', 'type' => 'font', 'group' => 'theme', 'description' => 'Fonte primária', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'font_secondary', 'value' => 'Orbitron', 'type' => 'font', 'group' => 'theme', 'description' => 'Fonte secundária (títulos)', 'created_at' => now(), 'updated_at' => now()],
            
            // Imagens
            ['key' => 'logo_url', 'value' => '/logo-vibeget.png', 'type' => 'image', 'group' => 'appearance', 'description' => 'Logo principal do sistema', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'favicon_url', 'value' => '/favicon.ico', 'type' => 'image', 'group' => 'appearance', 'description' => 'Favicon do site', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'background_image', 'value' => null, 'type' => 'image', 'group' => 'appearance', 'description' => 'Imagem de fundo (opcional)', 'created_at' => now(), 'updated_at' => now()],
            
            // Geral
            ['key' => 'site_name', 'value' => 'VibeGet', 'type' => 'string', 'group' => 'general', 'description' => 'Nome do site', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'site_description', 'value' => 'Leilões Online com Cashback', 'type' => 'string', 'group' => 'general', 'description' => 'Descrição do site', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};

