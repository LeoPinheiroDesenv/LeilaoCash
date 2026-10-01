<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;

class CloseExpiredVibes extends Command
{
    protected $signature = 'vibes:close-expired';
    protected $description = 'Encerra automaticamente Vibes cujo prazo expirou ou atingiram o mínimo de Gets';

    public function handle()
    {
        $now = now();

        // Buscar Vibes ativas com prazo expirado
        $expiredVibes = Auction::where('status', 'active')
            ->where('end_date', '<=', $now)
            ->get();

        // Buscar Vibes ativas que atingiram o mínimo de Gets
        $minBidsVibes = Auction::where('status', 'active')
            ->where('min_bids', '>', 0)
            ->whereColumn('bids_count', '>=', 'min_bids')
            ->where(function ($q) use ($now) {
                // Só encerra por min_bids se já passou pelo menos 1 dia
                $q->where('start_date', '<=', $now->copy()->subDay());
            })
            ->get();

        $allVibes = $expiredVibes->merge($minBidsVibes)->unique('id');

        if ($allVibes->isEmpty()) {
            $this->info('Nenhuma Vibe para encerrar.');
            return 0;
        }

        // A regra de encerramento (Champion Get, 40% de GetCoin aos perdedores) fica
        // em Auction::close(), a mesma usada pelo admin
        $closed = $allVibes->filter(fn (Auction $vibe) => $vibe->close())->count();

        $this->info("Encerradas {$closed} Vibe(s).");
        return 0;
    }
}
