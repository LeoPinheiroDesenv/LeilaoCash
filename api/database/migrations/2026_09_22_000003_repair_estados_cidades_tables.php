<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Corrige drift observado em produção: as migrations que criam `estados`/`cidades`
 * já estavam marcadas como executadas na tabela `migrations`, mas as tabelas nunca
 * chegaram a existir (Laravel decide "pendente" pelo nome do arquivo, não verifica
 * se o efeito da migration realmente existe no schema). Como essas duas migrations
 * originais não seriam mais reexecutadas, esta migration (nome novo, portanto
 * pendente de verdade) recria as tabelas só se ainda não existirem.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('estados')) {
            Schema::create('estados', function (Blueprint $table) {
                $table->unsignedInteger('id')->primary(); // código IBGE do estado
                $table->string('nome');
                $table->char('sigla', 2)->unique();
            });
        }

        if (!Schema::hasTable('cidades')) {
            Schema::create('cidades', function (Blueprint $table) {
                $table->unsignedInteger('id')->primary(); // código IBGE do município
                $table->unsignedInteger('estado_id');
                $table->string('nome');

                $table->foreign('estado_id')->references('id')->on('estados');
                $table->index('nome');
            });
        }
    }

    public function down(): void
    {
        // Intencionalmente vazio: o down() das migrations originais
        // (create_estados_table/create_cidades_table) já cobre o drop.
    }
};
