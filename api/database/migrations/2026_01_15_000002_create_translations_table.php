<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('general'); // ex: header, hero, common
            $table->string('key'); // ex: home, title
            $table->text('text_pt')->nullable();
            $table->text('text_en')->nullable();
            $table->text('text_es')->nullable();
            $table->timestamps();

            $table->unique(['group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
