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
        $settings = [
            [
                'key' => 'mercadopago_environment',
                'value' => 'sandbox',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Ambiente do Mercado Pago (sandbox/production)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'mercadopago_public_key',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Chave Pública do Mercado Pago',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'mercadopago_access_token',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Token de Acesso do Mercado Pago',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'mercadopago_client_id',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Client ID do Mercado Pago (Opcional)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'mercadopago_client_secret',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Client Secret do Mercado Pago (Opcional)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('group', 'payment')->delete();
    }
};
