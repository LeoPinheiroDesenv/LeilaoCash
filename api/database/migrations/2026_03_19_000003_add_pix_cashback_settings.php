<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!DB::table('settings')->where('key', 'pix_cashback_enabled')->exists()) {
            DB::table('settings')->insert([
                'key' => 'pix_cashback_enabled',
                'value' => 'true',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Ativar Getcoin de cashback em recargas via Pix',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (!DB::table('settings')->where('key', 'pix_cashback_percentage')->exists()) {
            DB::table('settings')->insert([
                'key' => 'pix_cashback_percentage',
                'value' => '10',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Percentual de Getcoin por recarga Pix (10 a 15%)',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['pix_cashback_enabled', 'pix_cashback_percentage'])->delete();
    }
};
