<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            if (!Schema::hasColumn('auctions', 'closed_at')) {
                $table->timestamp('closed_at')->nullable()->after('end_date');
            }
            if (!Schema::hasColumn('auctions', 'champion_get_amount')) {
                $table->decimal('champion_get_amount', 10, 2)->nullable()->after('winner_id');
            }
            if (!Schema::hasColumn('auctions', 'total_gets_amount')) {
                $table->decimal('total_gets_amount', 10, 2)->nullable()->after('champion_get_amount');
            }
            // Pós-venda
            if (!Schema::hasColumn('auctions', 'post_sale_status')) {
                $table->string('post_sale_status')->nullable()->after('total_gets_amount');
                // pending_contact, contacted, product_chosen, shipped, delivered
            }
            if (!Schema::hasColumn('auctions', 'winner_choice')) {
                $table->text('winner_choice')->nullable()->after('post_sale_status');
                // JSON: cor, tamanho, observações
            }
            if (!Schema::hasColumn('auctions', 'shipping_address')) {
                $table->text('shipping_address')->nullable()->after('winner_choice');
            }
            if (!Schema::hasColumn('auctions', 'shipping_supplier')) {
                $table->string('shipping_supplier')->nullable()->after('shipping_address');
            }
            if (!Schema::hasColumn('auctions', 'shipping_date')) {
                $table->date('shipping_date')->nullable()->after('shipping_supplier');
            }
            if (!Schema::hasColumn('auctions', 'shipping_cost')) {
                $table->decimal('shipping_cost', 10, 2)->nullable()->after('shipping_date');
            }
            if (!Schema::hasColumn('auctions', 'shipping_tracking')) {
                $table->string('shipping_tracking')->nullable()->after('shipping_cost');
            }
            if (!Schema::hasColumn('auctions', 'post_sale_notes')) {
                $table->text('post_sale_notes')->nullable()->after('shipping_tracking');
            }
        });
    }

    public function down(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            $columns = [
                'closed_at', 'champion_get_amount', 'total_gets_amount',
                'post_sale_status', 'winner_choice', 'shipping_address',
                'shipping_supplier', 'shipping_date', 'shipping_cost',
                'shipping_tracking', 'post_sale_notes'
            ];
            foreach ($columns as $col) {
                if (Schema::hasColumn('auctions', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
