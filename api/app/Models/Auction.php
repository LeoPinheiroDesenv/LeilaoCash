<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Auction extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Percentual da parte paga em R$ de cada Get perdedor que volta como GetCoin
     * no encerramento da Vibe.
     */
    public const LOSER_GETCOIN_RATE = 0.40;

    protected $fillable = [
        'title',
        'description',
        'meta_keywords',
        'status',
        'start_date',
        'end_date',
        'closed_at',
        'starting_bid',
        'current_bid',
        'bid_increment',
        'min_bids',
        'bids_count',
        'cashback_percentage',
        'winner_id',
        'product_id',
        'champion_get_amount',
        'total_gets_amount',
        'post_sale_status',
        'winner_choice',
        'shipping_address',
        'shipping_supplier',
        'shipping_date',
        'shipping_cost',
        'shipping_tracking',
        'post_sale_notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'starting_bid' => 'decimal:2',
            'current_bid' => 'decimal:2',
            'bid_increment' => 'decimal:2',
            'cashback_percentage' => 'decimal:2',
            'bids_count' => 'integer',
        ];
    }

    /**
     * Relacionamento com produtos
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Relacionamento com o produto principal (se houver)
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relacionamento com vencedor
     */
    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    /**
     * Relacionamento com lances
     */
    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Encerra a Vibe. É a única regra de encerramento, usada pelo comando
     * vibes:close-expired, pelo botão "Encerrar Vibe" e pela troca de status para
     * Finalizado no admin:
     * - o maior Get é o Champion Get e o dono dele vence (vitória + nível Viber);
     * - cada um dos outros Gets, inclusive os menores do próprio vencedor, recebe
     *   40% em GetCoin da parte paga em R$ (o GetCoin usado no Get não entra).
     *
     * Retorna false, sem alterar nada, se a Vibe já estava finalizada ou cancelada:
     * assim o cron e o admin encerrando ao mesmo tempo não creditam duas vezes.
     */
    public function close(): bool
    {
        $closed = DB::transaction(function () {
            $vibe = static::whereKey($this->id)->lockForUpdate()->first();
            if (!$vibe || in_array($vibe->status, ['finished', 'cancelled'])) {
                return null;
            }

            $championBid = Bid::where('auction_id', $vibe->id)
                ->orderByDesc('amount')
                ->first();

            $vibe->status = 'finished';
            $vibe->closed_at = now();
            $vibe->total_gets_amount = Bid::where('auction_id', $vibe->id)->sum('amount');

            if ($championBid) {
                $vibe->winner_id = $championBid->user_id;
                $vibe->current_bid = $championBid->amount;
                $vibe->champion_get_amount = $championBid->amount;
                $vibe->post_sale_status = 'pending_contact';

                // Só query builder aqui: um save() em $championBid depois de um update em
                // massa vira no-op (o objeto em memória já tem is_winning=true e o Eloquent
                // não o vê como alterado), e o vencedor ficava marcado como perdedor.
                Bid::where('auction_id', $vibe->id)->where('id', '!=', $championBid->id)->update(['is_winning' => false]);
                Bid::where('id', $championBid->id)->update(['is_winning' => true]);

                $winner = User::find($championBid->user_id);
                if ($winner) {
                    // Não usar increment(): auctions_won é NULL para quem nunca venceu, e NULL + 1 = NULL no SQL
                    $winner->auctions_won = (int) $winner->auctions_won + 1;
                    $winner->save();
                    $winner->recalculateViberLevel();
                    Log::info("[CloseVibe] Vibe #{$vibe->id}: vencedor #{$winner->id} com Get de R$ {$championBid->amount}");
                }
            }

            $vibe->save();
            $vibe->creditLosers();

            return $vibe;
        });

        if (!$closed) {
            return false;
        }

        $this->setRawAttributes($closed->getAttributes(), true);
        Log::info("[CloseVibe] Vibe #{$this->id} encerrada. Total de Gets: R$ {$this->total_gets_amount}");

        return true;
    }

    /**
     * Credita em GetCoin 40% da parte paga em R$ de cada Get que não venceu.
     *
     * É a ÚNICA compensação de um Get perdedor: o BidController não estorna o Get
     * quando ele é superado (o Get é consumido). Não reintroduzir estorno no
     * BidController, senão o perdedor recebe 100% em R$ + estes 40% em GetCoin.
     */
    private function creditLosers(): void
    {
        $losingBids = Bid::where('auction_id', $this->id)
            ->where('is_winning', false)
            ->get();

        foreach ($losingBids as $bid) {
            $cashBase = $bid->cash_amount ?? $bid->amount;
            $getcoin = round($cashBase * self::LOSER_GETCOIN_RATE, 2);
            // increment atômico: não perde um gasto de GetCoin feito ao mesmo tempo
            if ($getcoin <= 0 || User::whereKey($bid->user_id)->increment('cashback_balance', $getcoin) === 0) {
                continue;
            }

            Transaction::create([
                'user_id' => $bid->user_id,
                'type' => 'cashback',
                'amount' => $getcoin,
                'status' => 'completed',
                'description' => "GetCoin: 40% de retorno na Vibe \"{$this->title}\"",
                'auction_id' => $this->id,
            ]);
        }
    }

    /**
     * Sigilo da disputa (regra do dono do produto): enquanto a Vibe não encerra,
     * ninguém sabe qual é o maior Get nem quem está na frente. Usar antes de
     * enviar a Vibe em rotas públicas; o admin continua vendo tudo.
     */
    public function hideDisputeData(): static
    {
        if ($this->status !== 'finished') {
            $this->makeHidden(['current_bid', 'winner_id', 'champion_get_amount', 'total_gets_amount']);
            $this->unsetRelation('winner');
            if ($this->relationLoaded('bids')) {
                $this->setRelation('bids', collect());
            }
        }

        return $this;
    }
}
