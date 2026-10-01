<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Categorias excluídas (soft delete) continuavam ocupando o slug no índice unique,
        // o que impedia criar de novo uma categoria com o mesmo nome. A partir de agora o
        // model libera o slug ao excluir; aqui liberamos os das categorias já excluídas.
        DB::table('categories')
            ->whereNotNull('deleted_at')
            ->where('slug', 'not like', '%-deleted-%')
            ->orderBy('id')
            ->get(['id', 'slug'])
            ->each(function ($category) {
                DB::table('categories')
                    ->where('id', $category->id)
                    ->update(['slug' => $category->slug . '-deleted-' . $category->id]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Sem reversão: devolver o slug original poderia colidir com categorias
        // ativas criadas depois com o mesmo nome.
    }
};
