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
        try {
            $query = Auction::query();

            // Filtros
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Incluir relacionamentos
            $query->with(['products', 'winner:id,name,email']);

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
     * Obter um leilão específico
     */
    public function show($id)
    {
        try {
            $auction = Auction::with(['products', 'winner'])->findOrFail($id);

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
                $auction = Auction::create([
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
                ]);

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

            // Atualizar outros campos
            $auction->update($request->except('product_ids'));

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
}

