<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_en')->nullable();
            $table->string('title_es')->nullable();
            $table->string('slug')->unique();
            $table->longText('content_pt')->nullable();
            $table->longText('content_en')->nullable();
            $table->longText('content_es')->nullable();
            $table->enum('section', ['quick_links', 'legal'])->default('quick_links');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
