<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\Product;
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
        return $this->listAuctions($request, false);
    }

    /**
     * Listar Vibes no site: sem o maior Get nem quem está na frente enquanto a
     * Vibe não encerra, e do vencedor só o nome (nunca e-mail ou outros dados)
     */
    public function publicIndex(Request $request)
    {
        return $this->listAuctions($request, true);
    }

    private function listAuctions(Request $request, bool $public)
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
                $public ? 'winner:id,name' : 'winner:id,name,email'
            ]);

            // Paginação
            $perPage = $request->get('per_page', 15);
            $auctions = $query->orderBy('created_at', 'desc')->paginate($perPage);

            if ($public) {
                $auctions->getCollection()->each->hideDisputeData();
            }

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

            foreach ([$featured, $hot, $ending] as $vibes) {
                $vibes->each->hideDisputeData();
            }

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
     * Obter uma Vibe para o site (mesmo sigilo de publicIndex)
     */
    public function publicShow($id)
    {
        try {
            $auction = Auction::with([
                'products.categoryModel',
                'products.brandModel',
                'products.productModel',
                'winner:id,name'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $auction->hideDisputeData()
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
                    'bid_increment' => $request->bid_increment ?? Auction::DEFAULT_BID_INCREMENT,
                    'min_bids' => $request->min_bids ?? 0,
                    'cashback_percentage' => $request->cashback_percentage ?? Auction::DEFAULT_CASHBACK_PERCENTAGE,
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

            // Encerrada e cancelada já tiveram o GetCoin creditado: uma não vira a outra
            $finalStatuses = ['finished', 'cancelled'];
            if (in_array($auction->status, $finalStatuses) && in_array($request->status, $finalStatuses) && $request->status !== $auction->status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Uma Vibe encerrada não pode ser cancelada, nem uma cancelada pode ser encerrada.',
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

            // Mudar o status para Finalizado ou Cancelado passa pelas regras de Auction::close
            // (vencedor + Cashback aos perdedores) e Auction::cancel (Gets devolvidos em
            // GetCoin): não basta gravar o status
            $closing = $request->status === 'finished' && $auction->status !== 'finished';
            $cancelling = $request->status === 'cancelled' && $auction->status !== 'cancelled';

            // Atualizar outros campos
            $updateData = $request->except($closing || $cancelling ? ['product_ids', 'status'] : ['product_ids']);
            if (!\Schema::hasColumn('auctions', 'meta_keywords')) {
                unset($updateData['meta_keywords']);
            }
            // Colunas NOT NULL: campo apagado no formulário volta ao padrão em vez de dar erro de SQL
            $defaults = ['cashback_percentage' => Auction::DEFAULT_CASHBACK_PERCENTAGE, 'bid_increment' => Auction::DEFAULT_BID_INCREMENT];
            foreach ($defaults as $field => $default) {
                if (array_key_exists($field, $updateData) && $updateData[$field] === null) {
                    $updateData[$field] = $default;
                }
            }
            $auction->update($updateData);

            if ($closing) {
                $auction->close();
            } elseif ($cancelling) {
                $auction->cancel();
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

            // Encerra só esta Vibe, mesmo antes da data de fim, pela regra única
            if (!$auction->close()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esta Vibe já foi encerrada.'
                ], 422);
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
