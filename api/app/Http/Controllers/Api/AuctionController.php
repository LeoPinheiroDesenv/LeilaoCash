<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\Product;
use App\Models\User;
use App\Models\Bid;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AuctionController extends Controller
{
    /**
     * Listar todos os leilões
     */
    public function index(Request $request)
    {
        try {
            $query = Auction::query();

            // Filtros
            if ($request->has('search') && !empty(trim($request->search))) {
                $search = trim($request->search);
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhereHas('products', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%")
                            // Buscar nos campos diretos (compatibilidade)
                            ->orWhere('brand', 'like', "%{$search}%")
                            ->orWhere('model', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%")
                            // Buscar nos relacionamentos
                            ->orWhereHas('categoryModel', function($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            })
                            ->orWhereHas('brandModel', function($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            })
                            ->orWhereHas('productModel', function($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            });
                      });
                });
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('category_id') && !empty($request->category_id)) {
                $categoryId = $request->category_id;
                $query->whereHas('products', function($q) use ($categoryId) {
                    if (is_numeric($categoryId)) {
                        $q->where('category_id', $categoryId);
                    } else {
                        $q->where('category', $categoryId);
                    }
                });
            }

            // Incluir relacionamentos necessários para a busca
            $query->with([
                'products.categoryModel',
                'products.brandModel',
                'products.productModel',
                'winner:id,name,email'
            ]);

            // Paginação
            $perPage = $request->get('per_page', 15);
            $auctions = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $auctions
            ]);
        } catch (\Exception $e) {
            Log::error('[AuctionController] Erro ao listar leilões', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar leilões',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter dados para a home page
     */
    public function home()
    {
        try {

            // Destaques: Leilões ativos com mais lances
            $featured = Auction::where('status', 'active')
                ->with(['products.categoryModel', 'winner:id,name'])
                ->orderBy('bids_count', 'desc')
                ->take(4)
                ->get();

            // Ofertas Quentes: Leilões ativos mais recentes (ou outra lógica de "quente")
            $hot = Auction::where('status', 'active')
                ->with(['products.categoryModel', 'winner:id,name'])
                ->orderBy('created_at', 'desc')
                ->take(4)
                ->get();

            // Encerrando: Leilões ativos com menor tempo restante
            $ending = Auction::where('status', 'active')
                ->where('end_date', '>', now())
                ->with(['products.categoryModel', 'winner:id,name'])
                ->orderBy('end_date', 'asc')
                ->take(4)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'featured' => $featured,
                    'hot' => $hot,
                    'ending' => $ending
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('[AuctionController] Erro ao carregar home', [
                'error' => $e->getMessage()
            ]);
            return response()->json(['success' => false, 'message' => 'Erro ao carregar dados'], 500);
        }
    }

    /**
     * Obter um leilão específico
     */
    public function show($id)
    {
        try {
            $auction = Auction::with([
                'products.categoryModel',
                'products.brandModel',
                'products.productModel',
                'winner'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $auction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Leilão não encontrado'
            ], 404);
        }
    }

    /**
     * Criar novo leilão
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:draft,scheduled,active,paused,finished,cancelled',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'starting_bid' => 'required|numeric|min:0',
                'bid_increment' => 'nullable|numeric|min:0.01',
                'min_bids' => 'nullable|integer|min:0',
                'cashback_percentage' => 'nullable|numeric|min:0|max:100',
                'product_ids' => 'required|array|min:1',
                'product_ids.*' => 'exists:products,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validar que todos os produtos estão disponíveis (sem leilão)
            $productIds = $request->product_ids;
            $productsInAuction = Product::whereIn('id', $productIds)
                ->whereNotNull('auction_id')
                ->pluck('id')
                ->toArray();

            if (!empty($productsInAuction)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alguns produtos já estão em outro leilão',
                    'errors' => [
                        'product_ids' => ['Os seguintes produtos já estão em um leilão: ' . implode(', ', $productsInAuction)]
                    ]
                ], 422);
            }

            DB::beginTransaction();

            try {
                // Criar leilão
                $auctionData = [
                    'title' => $request->title,
                    'description' => $request->description,
                    'status' => $request->status ?? 'draft',
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'starting_bid' => $request->starting_bid,
                    'current_bid' => $request->starting_bid,
                    'bid_increment' => $request->bid_increment ?? 1.00,
                    'min_bids' => $request->min_bids ?? 0,
                    'cashback_percentage' => $request->cashback_percentage ?? 0,
                ];

                if (\Schema::hasColumn('auctions', 'meta_keywords') && $request->has('meta_keywords')) {
                    $auctionData['meta_keywords'] = $request->meta_keywords;
                }

                $auction = Auction::create($auctionData);

                // Associar produtos ao leilão
                Product::whereIn('id', $productIds)->update([
                    'auction_id' => $auction->id
                ]);

                DB::commit();

                Log::info('[AuctionController] Leilão criado', [
                    'auction_id' => $auction->id,
                    'title' => $auction->title,
                    'products_count' => count($productIds),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Leilão criado com sucesso',
                    'data' => $auction->fresh()->load(['products', 'winner'])
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('[AuctionController] Erro ao criar leilão', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar leilão',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar leilão
     */
    public function update(Request $request, $id)
    {
        try {
            $auction = Auction::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:draft,scheduled,active,paused,finished,cancelled',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'starting_bid' => 'sometimes|required|numeric|min:0',
                'bid_increment' => 'nullable|numeric|min:0.01',
                'min_bids' => 'nullable|integer|min:0',
                'cashback_percentage' => 'nullable|numeric|min:0|max:100',
                'product_ids' => 'sometimes|array|min:1',
                'product_ids.*' => 'exists:products,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Se está atualizando produtos
            if ($request->has('product_ids')) {
                $productIds = $request->product_ids;

                // Verificar se algum produto já está em outro leilão
                $productsInOtherAuction = Product::whereIn('id', $productIds)
                    ->whereNotNull('auction_id')
                    ->where('auction_id', '!=', $id)
                    ->pluck('id')
                    ->toArray();

                if (!empty($productsInOtherAuction)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Alguns produtos já estão em outro leilão',
                        'errors' => [
                            'product_ids' => ['Os seguintes produtos já estão em outro leilão: ' . implode(', ', $productsInOtherAuction)]
                        ]
                    ], 422);
                }

                DB::beginTransaction();

                try {
                    // Remover produtos antigos do leilão
                    Product::where('auction_id', $id)->update(['auction_id' => null]);

                    // Adicionar novos produtos
                    Product::whereIn('id', $productIds)->update(['auction_id' => $id]);

                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            }

            // Verificar se o status mudou para 'finished'
            $oldStatus = $auction->status;
            $newStatus = $request->status;

            // Atualizar outros campos
            $updateData = $request->except('product_ids');
            if (!\Schema::hasColumn('auctions', 'meta_keywords')) {
                unset($updateData['meta_keywords']);
            }
            $auction->update($updateData);

            // Se o leilão foi finalizado e tem um vencedor, incrementar vitórias do usuário
            if ($oldStatus !== 'finished' && $newStatus === 'finished' && $auction->winner_id) {
                $winner = User::find($auction->winner_id);
                if ($winner) {
                    $winner->increment('auctions_won');
                    Log::info('[AuctionController] Incrementado vitórias do usuário', [
                        'user_id' => $winner->id,
                        'auction_id' => $auction->id,
                        'new_total' => $winner->auctions_won
                    ]);
                }

                // Distribuir Cashback para os participantes não vencedores
                $this->distributeCashback($auction);
            }

            Log::info('[AuctionController] Leilão atualizado', [
                'auction_id' => $auction->id,
                'title' => $auction->title,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Leilão atualizado com sucesso',
                'data' => $auction->fresh()->load(['products', 'winner'])
            ]);
        } catch (\Exception $e) {
            Log::error('[AuctionController] Erro ao atualizar leilão', [
                'auction_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar leilão',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar leilão
     */
    public function destroy($id)
    {
        try {
            $auction = Auction::findOrFail($id);

            // Não permitir deletar leilões ativos
            if (in_array($auction->status, ['active', 'scheduled'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível deletar um leilão ativo ou agendado',
                ], 422);
            }

            DB::beginTransaction();

            try {
                // Remover produtos do leilão
                Product::where('auction_id', $id)->update(['auction_id' => null]);

                // Deletar leilão
                $auction->delete();

                DB::commit();

                Log::info('[AuctionController] Leilão deletado', [
                    'auction_id' => $id,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Leilão deletado com sucesso'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('[AuctionController] Erro ao deletar leilão', [
                'auction_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar leilão',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Distribui cashback para os participantes do leilão (exceto o vencedor)
     */
    private function distributeCashback(Auction $auction)
    {
        try {
            // Buscar todos os usuários que deram lances neste leilão
            $bidders = Bid::where('auction_id', $auction->id)
                        ->select('user_id')
                        ->distinct()
                        ->pluck('user_id');

            foreach ($bidders as $userId) {
                // Pular o vencedor (geralmente não recebe cashback dos lances, pois ganhou o produto)
                if ($userId == $auction->winner_id) {
                    continue;
                }

                $user = User::find($userId);
                if (!$user) continue;

                // Calcular total gasto pelo usuário neste leilão
                $totalSpent = Bid::where('auction_id', $auction->id)
                                ->where('user_id', $userId)
                                ->sum('amount');

                if ($totalSpent > 0) {
                    $percentage = $this->calculateCashbackPercentage($user->auctions_won ?? 0);
                    $cashbackAmount = $totalSpent * ($percentage / 100);

                    // Creditar cashback
                    $user->cashback_balance = ($user->cashback_balance ?? 0) + $cashbackAmount;
                    $user->save();

                    // Registrar transação
                    Transaction::create([
                        'user_id' => $user->id,
                        'type' => 'cashback',
                        'amount' => $cashbackAmount,
                        'status' => 'completed',
                        'description' => "Cashback de {$percentage}% referente ao leilão #{$auction->id} (Nível: " . $this->getLevelName($user->auctions_won ?? 0) . ")",
                        'auction_id' => $auction->id
                    ]);

                    Log::info("[AuctionController] Cashback creditado", [
                        'user_id' => $user->id,
                        'auction_id' => $auction->id,
                        'amount' => $cashbackAmount,
                        'percentage' => $percentage,
                        'level' => $this->getLevelName($user->auctions_won ?? 0)
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('[AuctionController] Erro ao distribuir cashback', [
                'auction_id' => $auction->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Calcula a porcentagem de cashback baseada no número de vitórias
     */
    private function calculateCashbackPercentage($wins)
    {
        if ($wins >= 14) return 60; // Platina (14+)
        if ($wins >= 12) return 50; // Diamante (12-13)
        if ($wins >= 5)  return 45; // Prata (5-8) e Ouro (9-11)
        return 40;                  // Base/Bronze (0-4)
    }

    /**
     * Retorna o nome do nível baseado nas vitórias
     */
    private function getLevelName($wins)
    {
        if ($wins >= 15) return 'Diamond';
        if ($wins >= 13) return 'Platinum';
        if ($wins >= 10) return 'Gold';
        if ($wins >= 5)  return 'Silver';
        if ($wins >= 1)  return 'Bronze';
        return 'Inscrito';
    }

    /**
     * Atualizar dados de pós-venda de uma Vibe encerrada
     */
    public function updatePostSale(Request $request, $id)
    {
        try {
            $auction = Auction::findOrFail($id);

            if ($auction->status !== 'finished') {
                return response()->json([
                    'success' => false,
                    'message' => 'Apenas Vibes encerradas podem ter dados de pós-venda.'
                ], 422);
            }

            $fillable = [
                'post_sale_status', 'winner_choice', 'shipping_address',
                'shipping_supplier', 'shipping_date', 'shipping_cost',
                'shipping_tracking', 'post_sale_notes'
            ];

            foreach ($fillable as $field) {
                if ($request->has($field) && \Schema::hasColumn('auctions', $field)) {
                    $auction->$field = $request->input($field);
                }
            }

            $auction->save();

            return response()->json([
                'success' => true,
                'message' => 'Dados de pós-venda atualizados.',
                'data' => $auction->load('winner', 'products')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar pós-venda.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Encerrar Vibe manualmente (admin)
     */
    public function closeVibe($id)
    {
        try {
            $auction = Auction::findOrFail($id);

            if ($auction->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Apenas Vibes ativas podem ser encerradas.'
                ], 422);
            }

            // Usar o mesmo comando
            \Artisan::call('vibes:close-expired', [], new \Symfony\Component\Console\Output\NullOutput());

            // Se o comando não encerrou (porque não expirou), forçar
            $auction->refresh();
            if ($auction->status === 'active') {
                // Forçar encerramento
                $championBid = Bid::where('auction_id', $auction->id)
                    ->orderByDesc('amount')
                    ->first();

                $totalGets = Bid::where('auction_id', $auction->id)->sum('amount');

                $auction->status = 'finished';
                if (\Schema::hasColumn('auctions', 'closed_at')) {
                    $auction->closed_at = now();
                    $auction->total_gets_amount = $totalGets;
                }

                if ($championBid) {
                    $auction->winner_id = $championBid->user_id;
                    $auction->current_bid = $championBid->amount;
                    if (\Schema::hasColumn('auctions', 'champion_get_amount')) {
                        $auction->champion_get_amount = $championBid->amount;
                    }
                    if (\Schema::hasColumn('auctions', 'post_sale_status')) {
                        $auction->post_sale_status = 'pending_contact';
                    }

                    Bid::where('auction_id', $auction->id)->update(['is_winning' => false]);
                    $championBid->is_winning = true;
                    $championBid->save();

                    $winner = User::find($championBid->user_id);
                    if ($winner) {
                        $winner->auctions_won = ($winner->auctions_won ?? 0) + 1;
                        $winner->save();
                        if (method_exists($winner, 'recalculateViberLevel')) {
                            $winner->recalculateViberLevel();
                        }
                    }
                }

                $auction->save();

                // Creditar perdedores
                $losingBids = Bid::where('auction_id', $auction->id)
                    ->where('is_winning', false)
                    ->get();

                foreach ($losingBids as $bid) {
                    $user = User::find($bid->user_id);
                    if (!$user) continue;
                    $cashbackAmount = round($bid->amount * 0.40, 2);
                    if ($cashbackAmount > 0) {
                        $user->cashback_balance += $cashbackAmount;
                        $user->save();
                        Transaction::create([
                            'user_id' => $user->id,
                            'type' => 'cashback',
                            'amount' => $cashbackAmount,
                            'status' => 'completed',
                            'description' => "GetCoin: 40% de retorno na Vibe \"{$auction->title}\"",
                            'auction_id' => $auction->id,
                        ]);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Vibe encerrada com sucesso.',
                'data' => $auction->load('winner', 'products')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao encerrar Vibe.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
