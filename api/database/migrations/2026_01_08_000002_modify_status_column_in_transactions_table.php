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
        Schema::table('transactions', function (Blueprint $table) {
            // Altera a coluna 'status' de ENUM para STRING
            // O default('pending') garante que a coluna continue tendo um valor padrão
            $table->string('status', 50)->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Reverter para o ENUM original pode causar perda de dados se novos status foram salvos.
            // É mais seguro manter como string, mas se for necessário reverter:
            $allowed = ['pending', 'completed', 'failed', 'cancelled'];
            $default = 'pending';

            // Constrói a query bruta para reverter, pois o Doctrine pode ter problemas
            DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM('" . implode("','", $allowed) . "') NOT NULL DEFAULT '{$default}'");
        });
    }
};
