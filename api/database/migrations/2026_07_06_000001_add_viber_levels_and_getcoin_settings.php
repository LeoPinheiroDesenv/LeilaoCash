<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Adicionar campos de nível/viber ao users
        if (!Schema::hasColumn('users', 'viber_level')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('viber_level')->default('inscrito')->after('auctions_won');
                $table->string('guardian_name')->nullable()->after('viber_level');
                $table->string('guardian_cpf')->nullable()->after('guardian_name');
                $table->string('referral_code')->nullable()->unique()->after('guardian_cpf');
                $table->unsignedBigInteger('referred_by')->nullable()->after('referral_code');
                $table->integer('referral_count')->default(0)->after('referred_by');
            });
        }

        // Settings para o sistema de GetCoin/Vibes
        $settings = [
            ['key' => 'min_credit_amount', 'value' => '20', 'type' => 'string', 'group' => 'payment', 'description' => 'Valor mínimo de recarga em R$ (reais)'],
            ['key' => 'getcoin_price', 'value' => '0.50', 'type' => 'string', 'group' => 'payment', 'description' => 'Preço de 1 GetCoin em R$ (compra da VibeGet)'],
            ['key' => 'first_credit_bonus_enabled', 'value' => 'true', 'type' => 'string', 'group' => 'payment', 'description' => '1º crédito ganha o mesmo valor em GetCoin'],
            ['key' => 'referral_getcoin_inscrito', 'value' => '50', 'type' => 'string', 'group' => 'payment', 'description' => 'GetCoins por indicação (nível Inscrito)'],
            ['key' => 'referral_getcoin_bronze', 'value' => '60', 'type' => 'string', 'group' => 'payment', 'description' => 'GetCoins por indicação (nível Bronze)'],
            ['key' => 'referral_getcoin_silver', 'value' => '70', 'type' => 'string', 'group' => 'payment', 'description' => 'GetCoins por indicação (nível Silver)'],
            ['key' => 'referral_getcoin_gold', 'value' => '80', 'type' => 'string', 'group' => 'payment', 'description' => 'GetCoins por indicação (nível Gold)'],
            ['key' => 'referral_getcoin_platinum', 'value' => '80', 'type' => 'string', 'group' => 'payment', 'description' => 'GetCoins por indicação (nível Platinum)'],
            ['key' => 'referral_getcoin_diamond', 'value' => '100', 'type' => 'string', 'group' => 'payment', 'description' => 'GetCoins por indicação (nível Diamond)'],
            ['key' => 'getcoin_pct_inscrito', 'value' => '5', 'type' => 'string', 'group' => 'payment', 'description' => '% GetCoin por Get (nível Inscrito)'],
            ['key' => 'getcoin_pct_bronze', 'value' => '10', 'type' => 'string', 'group' => 'payment', 'description' => '% GetCoin por Get (nível Bronze)'],
            ['key' => 'getcoin_pct_silver', 'value' => '15', 'type' => 'string', 'group' => 'payment', 'description' => '% GetCoin por Get (nível Silver)'],
            ['key' => 'getcoin_pct_gold', 'value' => '20', 'type' => 'string', 'group' => 'payment', 'description' => '% GetCoin por Get (nível Gold)'],
            ['key' => 'getcoin_pct_platinum', 'value' => '20', 'type' => 'string', 'group' => 'payment', 'description' => '% GetCoin por Get (nível Platinum)'],
            ['key' => 'getcoin_pct_diamond', 'value' => '25', 'type' => 'string', 'group' => 'payment', 'description' => '% GetCoin por Get (nível Diamond)'],
            ['key' => 'vibes_to_bronze', 'value' => '1', 'type' => 'string', 'group' => 'payment', 'description' => 'Vibes para Bronze'],
            ['key' => 'vibes_to_silver', 'value' => '5', 'type' => 'string', 'group' => 'payment', 'description' => 'Vibes para Silver'],
            ['key' => 'vibes_to_gold', 'value' => '10', 'type' => 'string', 'group' => 'payment', 'description' => 'Vibes para Gold'],
            ['key' => 'vibes_to_platinum', 'value' => '13', 'type' => 'string', 'group' => 'payment', 'description' => 'Vibes para Platinum'],
            ['key' => 'vibes_to_diamond', 'value' => '15', 'type' => 'string', 'group' => 'payment', 'description' => 'Vibes para Diamond'],
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
        Schema::table('users', function (Blueprint $table) {
            $columns = ['viber_level', 'guardian_name', 'guardian_cpf', 'referral_code', 'referred_by', 'referral_count'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        $keys = [
            'min_credit_amount', 'getcoin_price', 'first_credit_bonus_enabled',
            'referral_getcoin_inscrito', 'referral_getcoin_bronze', 'referral_getcoin_silver',
            'referral_getcoin_gold', 'referral_getcoin_platinum', 'referral_getcoin_diamond',
            'getcoin_pct_inscrito', 'getcoin_pct_bronze', 'getcoin_pct_silver',
            'getcoin_pct_gold', 'getcoin_pct_platinum', 'getcoin_pct_diamond',
            'vibes_to_bronze', 'vibes_to_silver', 'vibes_to_gold',
            'vibes_to_platinum', 'vibes_to_diamond',
        ];
        DB::table('settings')->whereIn('key', $keys)->delete();
    }
};
