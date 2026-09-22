<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estados', function (Blueprint $table) {
            $table->unsignedInteger('id')->primary(); // código IBGE do estado
            $table->string('nome');
            $table->char('sigla', 2)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estados');
    }
};
