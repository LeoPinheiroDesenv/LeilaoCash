<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Auction;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    /**
     * Listar todos os lances
     */
    public function index(Request $request)
    {
        try {
            $query = Bid::with(['user:id,name,email', 'auction:id,title,status', 'product:id,name']);

            // Por padrão, só mostrar Gets de Vibes encerradas (regra de negócio)
            // Admin pode filtrar por auction_id específica para ver de uma Vibe encerrada
            $query->whereHas('auction', function ($q) {
                $q->where('status', 'finished');
            });

            // Filtros
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('auction_id')) {
                $query->where('auction_id', $request->auction_id);
            }

            if ($request->has('product_id')) {
                $query->where('product_id', $request->product_id);
            }

            if ($request->has('is_winning')) {
                $query->where('is_winning', $request->is_winning === 'true');
            }

            // Ordenação
            $orderBy = $request->get('order_by', 'created_at');
            $orderDir = $request->get('order_dir', 'desc');
            $query->orderBy($orderBy, $orderDir);

            // Paginação
            $perPage = $request->get('per_page', 15);
            $bids = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $bids
            ]);
        } catch (\Exception $e) {
            Log::error('[BidController] Erro ao listar lances', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar lances',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Realizar um lance em um leilão
     */
    public function store(Request $request, $auctionId)
    {
        $user = $request->user();

        // Validação
        // 'amount' é o valor TOTAL do Get. 'getcoin_amount' (opcional) é a parte
        // desse total paga com GetCoin (cashback_balance); o restante é pago em
        // dinheiro (cash_amount). Regra de negócio: GetCoin usado não pode passar
        // do valor pago em dinheiro no mesmo Get.
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'getcoin_amount' => 'nullable|numeric|min:0',
        ]);

        $amount = (float) $request->amount;
        $getcoinAmount = (float) ($request->getcoin_amount ?? 0);
        $cashAmount = $amount - $getcoinAmount;

        if ($getcoinAmount > $cashAmount) {
            return response()->json([
                'success' => false,
                'message' => 'O valor em GetCoin não pode ser maior que o valor pago em dinheiro no mesmo Get.'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Buscar leilão com lock para evitar concorrência
            $auction = Auction::where('id', $auctionId)->lockForUpdate()->first();

            if (!$auction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leilão não encontrado.'
                ], 404);
            }

            // Verificar status do leilão
            if ($auction->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Este leilão não está ativo.'
                ], 400);
            }

            // Verificar data de término
            if ($auction->end_date && now()->greaterThan($auction->end_date)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este leilão já encerrou.'
                ], 400);
            }

            // Verificar se o lance é maior que o atual
            $currentBid = (float) ($auction->current_bid ?? $auction->starting_bid);
            if ($amount <= $currentBid) {
                return response()->json([
                    'success' => false,
                    'message' => 'O valor do lance deve ser maior que o lance atual (R$ ' . number_format($currentBid, 2, ',', '.') . ').'
                ], 400);
            }

            // Verificar saldo do usuário (dinheiro e, se usado, GetCoin)
            if ($user->balance < $cashAmount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Saldo insuficiente para realizar este lance.'
                ], 400);
            }
            if ($getcoinAmount > 0 && $user->cashback_balance < $getcoinAmount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Saldo de GetCoin insuficiente para realizar este lance.'
                ], 400);
            }

            // O Get é consumido ao ser superado (sem estorno intermediário).
            // A compensação de 40% ao usuário superado só ocorre no fechamento da Vibe,
            // calculada sobre a parte paga em dinheiro (cash_amount), não sobre o GetCoin usado
            // (ver CloseExpiredVibes::creditLosers).

            // Debitar saldo do usuário atual
            $user->balance -= $cashAmount;
            if ($getcoinAmount > 0) {
                $user->cashback_balance -= $getcoinAmount;
            }
            $user->save();

            // Registrar transação de débito em dinheiro
            if ($cashAmount > 0) {
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'bid_purchase', // Corrigido de 'bid' para 'bid_purchase'
                    'amount' => $cashAmount,
                    'status' => 'completed',
                    'description' => 'Lance no leilão #' . $auction->id,
                    'auction_id' => $auction->id
                ]);
            }

            // Registrar transação de débito em GetCoin, se usado
            if ($getcoinAmount > 0) {
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'bid_getcoin_purchase',
                    'amount' => $getcoinAmount,
                    'status' => 'completed',
                    'description' => 'GetCoin usado no lance do leilão #' . $auction->id,
                    'auction_id' => $auction->id
                ]);
            }

            // Criar o lance
            $bid = Bid::create([
                'user_id' => $user->id,
                'auction_id' => $auction->id,
                'product_id' => $auction->product_id,
                'amount' => $amount,
                'cash_amount' => $cashAmount,
                'getcoin_amount' => $getcoinAmount,
                'is_winning' => true, // Temporariamente vencedor
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Atualizar lances anteriores deste leilão para não vencedores
            Bid::where('auction_id', $auction->id)
                ->where('id', '!=', $bid->id)
                ->update(['is_winning' => false]);

            // Atualizar leilão
            $auction->current_bid = $amount;
            $auction->winner_id = $user->id;
            $auction->bids_count = ($auction->bids_count ?? 0) + 1;

            $auction->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lance realizado com sucesso!',
                'data' => [
                    'bid' => $bid,
                    'auction' => $auction,
                    'new_balance' => $user->balance,
                    'new_cashback_balance' => $user->cashback_balance
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('[BidController] Erro ao realizar lance', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar lance. Tente novamente.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de lances
     */
    public function stats()
    {
        try {
            $stats = [
                'total_bids' => Bid::count(),
                'total_today' => Bid::whereDate('created_at', today())->count(),
                'total_amount' => Bid::sum('amount'),
                'total_today_amount' => Bid::whereDate('created_at', today())->sum('amount'),
                'winning_bids' => Bid::where('is_winning', true)->count(),
                'top_users' => Bid::select('user_id', DB::raw('count(*) as total_bids'), DB::raw('sum(amount) as total_amount'))
                    ->with('user:id,name,email')
                    ->groupBy('user_id')
                    ->orderBy('total_bids', 'desc')
                    ->limit(10)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('[BidController] Erro ao obter estatísticas', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter estatísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
