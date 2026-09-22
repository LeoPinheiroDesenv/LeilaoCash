<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'welcome_bonus_enabled', 'value' => 'true', 'type' => 'string', 'group' => 'payment', 'description' => 'Ativar GetCoin de boas-vindas no cadastro'],
            ['key' => 'welcome_bonus_getcoin', 'value' => '10', 'type' => 'string', 'group' => 'payment', 'description' => 'Quantidade de GetCoin dada de bônus ao se cadastrar'],
        ];

        foreach ($settings as $setting) {
            if (!DB::table('settings')->where('key', $setting['key'])->exists()) {
                DB::table('settings')->insert(array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['welcome_bonus_enabled', 'welcome_bonus_getcoin'])->delete();
    }
};
