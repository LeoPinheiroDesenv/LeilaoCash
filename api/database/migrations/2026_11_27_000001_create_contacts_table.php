<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A tabela de mensagens do "Fale Conosco" nunca tinha sido criada: o formulário
 * chamava POST /api/contacts, o Laravel falhava ao gravar e nada aparecia em
 * "Mensagens de Contato" no painel.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('contacts')) {
            return;
        }

        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status', 20)->default('novo');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
