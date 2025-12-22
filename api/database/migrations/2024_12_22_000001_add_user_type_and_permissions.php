<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Tipo de usuário: 'principal' (admin principal), 'secondary' (admin secundário), 'common' (usuário comum)
            $table->enum('user_type', ['principal', 'secondary', 'common'])->default('common')->after('is_admin');
            
            // Permissões para admins secundários (JSON com lista de telas permitidas)
            $table->json('permissions')->nullable()->after('user_type');
        });

        // Atualizar usuários existentes que são admin para 'principal'
        DB::table('users')
            ->where('is_admin', true)
            ->update(['user_type' => 'principal']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['user_type', 'permissions']);
        });
    }
};

