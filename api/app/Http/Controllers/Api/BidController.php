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
        $request->validate([
            'amount' => 'required|numeric|min:0.01'
        ]);

        $amount = (float) $request->amount;

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

            // Verificar saldo do usuário
            // O custo do lance pode ser o valor total do lance ou um valor fixo (custo do bid)
            // Neste modelo, assumindo que o usuário paga o valor do lance (modelo tradicional)
            // Se for leilão de centavos, a lógica seria diferente (deduzir 1 crédito e aumentar o valor em X centavos)

            // Vamos assumir modelo tradicional onde o saldo deve cobrir o lance
            // Mas em leilões online, geralmente se usa "créditos" para dar lances.
            // Se for modelo de créditos: deduz 1 crédito (ou valor do lance) do saldo.

            // Vou implementar a lógica onde o valor do lance é debitado do saldo.
            // Se o usuário for superado, o valor deveria ser devolvido?
            // Em leilões tradicionais, sim. Em leilões de centavos, não (paga-se pelo direito de dar o lance).

            // Dado o contexto "LeilaoCash" e "Comprar Créditos", parece ser um modelo híbrido ou de centavos.
            // Mas o formulário pede "Valor do Lance". Então parece ser leilão tradicional.

            if ($user->balance < $amount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Saldo insuficiente para realizar este lance.'
                ], 400);
            }

            // Se houver um vencedor anterior, devolver o saldo para ele (modelo tradicional)
            if ($auction->winner_id) {
                $previousWinner = \App\Models\User::find($auction->winner_id);
                if ($previousWinner) {
                    $previousWinner->balance += $auction->current_bid;
                    $previousWinner->save();

                    // Registrar transação de estorno
                    Transaction::create([
                        'user_id' => $previousWinner->id,
                        'type' => 'refund',
                        'amount' => $auction->current_bid,
                        'status' => 'completed',
                        'description' => 'Estorno de lance superado no leilão #' . $auction->id,
                        'auction_id' => $auction->id
                    ]);
                }
            }

            // Debitar saldo do usuário atual
            $user->balance -= $amount;
            $user->save();

            // Registrar transação de débito
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'bid',
                'amount' => $amount,
                'status' => 'completed',
                'description' => 'Lance no leilão #' . $auction->id,
                'auction_id' => $auction->id
            ]);

            // Criar o lance
            $bid = Bid::create([
                'user_id' => $user->id,
                'auction_id' => $auction->id,
                'product_id' => $auction->product_id,
                'amount' => $amount,
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

            // Prorrogação automática (opcional - ex: se faltar menos de 30s, adiciona 30s)
            // if ($auction->end_date && now()->diffInSeconds($auction->end_date) < 30) {
            //     $auction->end_date = $auction->end_date->addSeconds(30);
            // }

            $auction->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lance realizado com sucesso!',
                'data' => [
                    'bid' => $bid,
                    'auction' => $auction,
                    'new_balance' => $user->balance
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
