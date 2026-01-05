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
            $table->string('external_id')->nullable()->after('id');
            $table->string('payment_method')->nullable()->after('type');
            $table->text('qr_code')->nullable()->after('description');
            $table->text('qr_code_base64')->nullable()->after('qr_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['external_id', 'payment_method', 'qr_code', 'qr_code_base64']);
        });
    }
};
