<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Auction;
use App\Models\Product;
use Carbon\Carbon;

class AuctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar produtos disponíveis (sem leilão)
        $availableProducts = Product::whereNull('auction_id')
            ->where('is_active', true)
            ->get();

        if ($availableProducts->count() < 3) {
            $this->command->warn('Não há produtos suficientes para criar leilões. Execute o ProductSeeder primeiro.');
            return;
        }

        // Leilão 1 - Ativo
        $auction1 = Auction::create([
            'title' => 'Leilão de Smartphones Premium',
            'description' => 'Os melhores smartphones do mercado em um leilão especial!',
            'status' => 'active',
            'start_date' => Carbon::now()->subDays(2),
            'end_date' => Carbon::now()->addDays(5),
            'starting_bid' => 1000.00,
            'current_bid' => 4523.00,
            'bid_increment' => 50.00,
            'min_bids' => 10,
            'cashback_percentage' => 5.0,
        ]);

        // Associar produtos ao leilão 1 (smartphones)
        $smartphones = $availableProducts->where('category', 'smartphones')->take(3);
        foreach ($smartphones as $product) {
            $product->update(['auction_id' => $auction1->id]);
        }

        // Leilão 2 - Agendado
        $auction2 = Auction::create([
            'title' => 'Leilão de Notebooks e Tecnologia',
            'description' => 'Notebooks de última geração e equipamentos de tecnologia em leilão!',
            'status' => 'scheduled',
            'start_date' => Carbon::now()->addDays(3),
            'end_date' => Carbon::now()->addDays(10),
            'starting_bid' => 2000.00,
            'current_bid' => 2000.00,
            'bid_increment' => 100.00,
            'min_bids' => 5,
            'cashback_percentage' => 7.0,
        ]);

        // Associar produtos ao leilão 2 (notebooks)
        $notebooks = $availableProducts->where('category', 'notebooks')->take(3);
        foreach ($notebooks as $product) {
            $product->update(['auction_id' => $auction2->id]);
        }

        // Leilão 3 - Rascunho
        $auction3 = Auction::create([
            'title' => 'Leilão de Games e Entretenimento',
            'description' => 'Consoles, acessórios e equipamentos de áudio para gamers!',
            'status' => 'draft',
            'start_date' => null,
            'end_date' => null,
            'starting_bid' => 500.00,
            'current_bid' => 500.00,
            'bid_increment' => 25.00,
            'min_bids' => 3,
            'cashback_percentage' => 4.0,
        ]);

        // Associar produtos ao leilão 3 (games e áudio)
        $games = $availableProducts->whereIn('category', ['games', 'audio'])->take(4);
        foreach ($games as $product) {
            $product->update(['auction_id' => $auction3->id]);
        }
    }
}

