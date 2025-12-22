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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['bid_purchase', 'cashback', 'withdrawal', 'deposit', 'refund'])->default('bid_purchase');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->text('description')->nullable();
            $table->foreignId('bid_id')->nullable()->constrained('bids')->onDelete('set null');
            $table->foreignId('auction_id')->nullable()->constrained('auctions')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'created_at']);
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
