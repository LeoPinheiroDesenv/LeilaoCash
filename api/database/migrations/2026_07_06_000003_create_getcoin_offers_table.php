<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('getcoin_offers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('seller_id');
            $table->unsignedBigInteger('buyer_id')->nullable();
            $table->decimal('amount', 10, 2); // Quantidade de GetCoins à venda
            $table->decimal('price_per_unit', 10, 2); // Preço por GetCoin em R$
            $table->decimal('total_price', 10, 2); // amount * price_per_unit
            $table->enum('status', ['active', 'sold', 'cancelled'])->default('active');
            $table->timestamp('sold_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('seller_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('buyer_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('getcoin_offers');
    }
};
