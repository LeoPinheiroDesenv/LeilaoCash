<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            if (!Schema::hasColumn('bids', 'cash_amount')) {
                $table->decimal('cash_amount', 10, 2)->nullable()->after('amount');
            }
            if (!Schema::hasColumn('bids', 'getcoin_amount')) {
                $table->decimal('getcoin_amount', 10, 2)->nullable()->after('cash_amount');
            }
        });

        // Gets antigos: 100% pago em dinheiro (não existia mistura com GetCoin ainda)
        DB::table('bids')->whereNull('cash_amount')->update([
            'cash_amount' => DB::raw('amount'),
            'getcoin_amount' => 0,
        ]);
    }

    public function down(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            $table->dropColumn(['cash_amount', 'getcoin_amount']);
        });
    }
};
