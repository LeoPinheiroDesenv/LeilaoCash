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
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'active', 'paused', 'finished', 'cancelled'])->default('draft');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->decimal('starting_bid', 10, 2)->default(0);
            $table->decimal('current_bid', 10, 2)->default(0);
            $table->decimal('bid_increment', 10, 2)->default(1.00);
            $table->integer('min_bids')->default(0); // Número mínimo de lances
            $table->decimal('cashback_percentage', 5, 2)->default(0); // Porcentagem de cashback
            $table->foreignId('winner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auctions');
    }
};

