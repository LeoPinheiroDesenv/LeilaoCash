<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cidades', function (Blueprint $table) {
            $table->unsignedInteger('id')->primary(); // código IBGE do município
            $table->unsignedInteger('estado_id');
            $table->string('nome');

            $table->foreign('estado_id')->references('id')->on('estados');
            $table->index('nome');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cidades');
    }
};
