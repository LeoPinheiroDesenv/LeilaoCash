<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Auction;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Bid;
use Illuminate\Support\Facades\Hash;

class SimulationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // === NÍVEIS E USUÁRIOS ===
        // Vamos criar usuários para simular diferentes níveis de engajamento,
        // representados pelo número de leilões que eles ganharam.

        $this->command->info('Criando usuários com diferentes níveis...');

        // Nível 1: Novatos (0 leilões ganhos)
        User::factory()->count(10)->create([
            'password' => Hash::make('password'),
            'auctions_won' => 0,
            'balance' => fake()->randomFloat(2, 50, 200),
        ]);

        // Nível 2: Intermediários (1 a 5 leilões ganhos)
        $intermediateUsers = User::factory()->count(5)->create([
            'password' => Hash::make('password'),
            'balance' => fake()->randomFloat(2, 200, 1000),
        ]);
        foreach ($intermediateUsers as $user) {
            $user->update(['auctions_won' => fake()->numberBetween(1, 5)]);
        }

        // Nível 3: Veteranos (6 a 15 leilões ganhos)
        $veteranUsers = User::factory()->count(3)->create([
            'password' => Hash::make('password'),
            'balance' => fake()->randomFloat(2, 1000, 5000),
        ]);
        foreach ($veteranUsers as $user) {
            $user->update(['auctions_won' => fake()->numberBetween(6, 15)]);
        }

        $this->command->info('Usuários criados.');

        // === COMPRAS ===
        // Vamos simular compras de pacotes de lances (transações).
        $this->command->info('Simulando compras de pacotes de lances...');
        $allUsers = User::all();
        foreach ($allUsers as $user) {
            // Cada usuário faz entre 1 e 5 compras
            $numberOfPurchases = fake()->numberBetween(1, 5);
            for ($i = 0; $i < $numberOfPurchases; $i++) {
                Transaction::create([
                    'user_id' => $user->id,
                    'amount' => fake()->randomElement([20.00, 50.00, 100.00, 200.00]),
                    'type' => 'credit',
                    'description' => 'Compra de pacote de lances',
                    'status' => 'completed',
                    'payment_method' => 'credit_card',
                    'payment_id' => 'fake_pi_' . uniqid(),
                    'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
                ]);
            }
        }
        $this->command->info('Compras simuladas.');


        // === VITÓRIAS EM LEILÕES ===
        // Vamos criar leilões e simular vitórias para os usuários que já definimos como ganhadores.
        $this->command->info('Simulando vitórias em leilões...');
        $winningUsers = User::where('auctions_won', '>', 0)->get();
        $products = Product::where('status', 'available')->get();

        if ($products->count() === 0) {
            $this->command->warn('Nenhum produto "available" encontrado. Crie produtos primeiro para simular vitórias.');
            return;
        }

        foreach ($winningUsers as $winner) {
            // Para cada leilão que o usuário "ganhou", criamos um registro de leilão finalizado
            for ($i = 0; $i < $winner->auctions_won; $i++) {
                $product = $products->random();
                $product->update(['status' => 'sold']); // Marca o produto como vendido

                $auction = Auction::create([
                    'product_id' => $product->id,
                    'start_date' => now()->subDays(fake()->numberBetween(10, 30)),
                    'end_date' => now()->subDays(fake()->numberBetween(1, 9)),
                    'starting_bid' => 0.01,
                    'current_bid' => fake()->randomFloat(2, 50, 500),
                    'status' => 'finished',
                    'winner_id' => $winner->id,
                ]);

                // Adiciona alguns lances no leilão para mais realismo
                // Um lance do vencedor e outros de usuários aleatórios
                Bid::create([
                    'auction_id' => $auction->id,
                    'user_id' => $winner->id,
                    'amount' => $auction->final_price, // O lance final do vencedor
                    'created_at' => $auction->end_time,
                ]);

                $otherBidders = $allUsers->where('id', '!=', $winner->id)->random(fake()->numberBetween(1, 5));
                foreach($otherBidders as $bidder) {
                     Bid::create([
                        'auction_id' => $auction->id,
                        'user_id' => $bidder->id,
                        'amount' => fake()->randomFloat(2, 1, $auction->final_price - 0.5),
                        'created_at' => fake()->dateTimeBetween($auction->start_time, $auction->end_time),
                    ]);
                }
            }
        }
        $this->command->info('Vitórias em leilões simuladas.');

    }
}
