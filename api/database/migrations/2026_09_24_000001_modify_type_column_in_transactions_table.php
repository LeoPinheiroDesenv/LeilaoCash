<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Altera a coluna 'type' de ENUM para STRING, pois o código já usa valores
            // (getcoin_purchase, getcoin_sale, bid_getcoin_purchase) fora do ENUM original,
            // causando "Data truncated for column 'type'" ao inserir.
            $table->string('type', 50)->default('bid_purchase')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $allowed = ['bid_purchase', 'cashback', 'withdrawal', 'deposit', 'refund'];
            $default = 'bid_purchase';

            DB::statement("ALTER TABLE transactions MODIFY COLUMN type ENUM('" . implode("','", $allowed) . "') NOT NULL DEFAULT '{$default}'");
        });
    }
};
