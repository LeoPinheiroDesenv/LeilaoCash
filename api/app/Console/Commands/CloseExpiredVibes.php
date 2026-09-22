<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

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

        foreach ($allVibes as $vibe) {
            $this->closeVibe($vibe);
        }

        $this->info("Encerradas {$allVibes->count()} Vibe(s).");
        return 0;
    }

    private function closeVibe(Auction $vibe)
    {
        Log::info("[CloseVibes] Encerrando Vibe #{$vibe->id}: {$vibe->title}");

        // Buscar o maior Get (Champion Get)
        $championBid = Bid::where('auction_id', $vibe->id)
            ->orderByDesc('amount')
            ->first();

        // Somatória total dos Gets
        $totalGets = Bid::where('auction_id', $vibe->id)->sum('amount');

        // Atualizar status da Vibe
        $vibe->status = 'finished';
        
        if (Schema::hasColumn('auctions', 'closed_at')) {
            $vibe->closed_at = now();
            $vibe->total_gets_amount = $totalGets;
        }

        if ($championBid) {
            $vibe->winner_id = $championBid->user_id;
            $vibe->current_bid = $championBid->amount;
            
            if (Schema::hasColumn('auctions', 'champion_get_amount')) {
                $vibe->champion_get_amount = $championBid->amount;
            }
            if (Schema::hasColumn('auctions', 'post_sale_status')) {
                $vibe->post_sale_status = 'pending_contact';
            }

            // Marcar o lance vencedor via query builder direto nas duas linhas.
            // NÃO usar $championBid->save() depois do update em massa acima: o
            // objeto $championBid foi carregado com is_winning=true (valor real
            // de quando o Get foi dado) e o update em massa não atualiza esse
            // objeto em memória, então atribuir is_winning=true de novo não fica
            // "dirty" para o Eloquent e o save() vira no-op — o campeão ficava
            // com is_winning=false no banco e era creditado como perdedor.
            Bid::where('auction_id', $vibe->id)->where('id', '!=', $championBid->id)->update(['is_winning' => false]);
            Bid::where('id', $championBid->id)->update(['is_winning' => true]);
            $championBid->is_winning = true;

            // Atualizar auctions_won e nível do vencedor
            $winner = User::find($championBid->user_id);
            if ($winner) {
                $winner->auctions_won = ($winner->auctions_won ?? 0) + 1;
                $winner->save();
                
                if (method_exists($winner, 'recalculateViberLevel')) {
                    $winner->recalculateViberLevel();
                }

                Log::info("[CloseVibes] Vencedor: #{$winner->id} ({$winner->name}) com Get de R$ {$championBid->amount}");
            }
        }

        $vibe->save();

        // Creditar cashback (40%) aos perdedores
        $this->creditLosers($vibe, $championBid);

        Log::info("[CloseVibes] Vibe #{$vibe->id} encerrada. Total Gets: R$ {$totalGets}");
    }

    /**
     * Credita 40% do valor pago em R$ aos participantes que não venceram.
     *
     * Esta é a ÚNICA compensação dada a um Get perdedor: o BidController não
     * estorna o valor do Get quando ele é superado (o Get é consumido). Não
     * reintroduzir estorno em BidController::store, ou o perdedor passa a
     * receber 100% de volta em `balance` + estes 40% em `cashback_balance`.
     */
    private function creditLosers(Auction $vibe, ?Bid $championBid)
    {
        $losingBids = Bid::where('auction_id', $vibe->id)
            ->where('is_winning', false)
            ->get();

        foreach ($losingBids as $bid) {
            $user = User::find($bid->user_id);
            if (!$user) continue;

            // 40% do valor do Get como cashback
            $cashbackAmount = round($bid->amount * 0.40, 2);

            if ($cashbackAmount > 0) {
                $user->cashback_balance += $cashbackAmount;
                $user->save();

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'cashback',
                    'amount' => $cashbackAmount,
                    'status' => 'completed',
                    'description' => "GetCoin: 40% de retorno na Vibe \"{$vibe->title}\"",
                    'auction_id' => $vibe->id,
                ]);
            }
        }
    }
}
