<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    // ... (index, show methods remain the same)
    public function index(Request $request)
    {
        try {
            $query = Product::query();

            // Lógica de Pesquisa Avançada (Keywords)
            if ($request->has('search') && !empty(trim($request->search))) {
                // Divide a pesquisa em palavras (ex: "iPhone 15" -> ["iPhone", "15"])
                $terms = explode(' ', trim($request->search));

                $query->where(function($q) use ($terms) {
                    foreach ($terms as $term) {
                        // Ignora termos vazios
                        if (empty($term)) continue;

                        $q->where(function($subQ) use ($term) {
                            $termLike = "%{$term}%";

                            // 1. Busca nos campos diretos do Produto
                            $subQ->where('name', 'like', $termLike)
                                ->orWhere('description', 'like', $termLike)

                                // Campos legados (texto direto)
                                ->orWhere('category', 'like', $termLike)
                                ->orWhere('brand', 'like', $termLike)
                                ->orWhere('model', 'like', $termLike)

                                // 2. Busca nos Relacionamentos (Tabelas: categories, brands, product_models)
                                // Requer que os métodos categoryModel, brandModel, productModel existam no Model Product
                                ->orWhereHas('categoryModel', function($relQ) use ($termLike) {
                                    $relQ->where('name', 'like', $termLike);
                                })
                                ->orWhereHas('brandModel', function($relQ) use ($termLike) {
                                    $relQ->where('name', 'like', $termLike);
                                })
                                ->orWhereHas('productModel', function($relQ) use ($termLike) {
                                    $relQ->where('name', 'like', $termLike);
                                });
                        });
                    }
                });
            }

            // Filtros adicionais
            if ($request->has('is_active')) {
                $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
            }

            // Carrega os relacionamentos para otimizar o retorno JSON
            $query->with(['categoryModel', 'brandModel', 'productModel']);

            // Ordenação
            $query->orderBy('created_at', 'desc');

            // Paginação
            $perPage = $request->input('per_page', 20);
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $products
            ]);

        } catch (\Exception $e) {
            Log::error('[ProductController] Erro ao listar produtos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar produtos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $query = Product::with([
                'auction.bids' => function($query) {
                    $query->latest()->limit(10)->with('user:id,name');
                },
                'auction.winner:id,name',
                'categoryModel',
                'brandModel',
                'productModel'
            ]);

            if (is_numeric($id)) {
                $product = $query->findOrFail($id);
            } else {
                $product = $query->where('slug', $id)->firstOrFail();
            }

            // Se a Vibe estiver ativa, ocultar Gets individuais (regra de negócio)
            // Ninguém vê valores individuais até a Vibe encerrar
            if ($product->auction && $product->auction->status === 'active') {
                $auction = $product->auction;
                // Remover bids individuais - manter apenas contagem e somatória
                $product->auction->setRelation('bids', collect([]));
                // Ocultar current_bid (maior Get) durante a Vibe ativa
                $product->auction->makeHidden(['current_bid']);
            }

            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado'
            ], 404);
        }
    }

    /**
     * Criar novo produto
     */
    public function store(Request $request)
    {

        $baseUrl = config('app.url');

        try {
            $rules = [
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'additional_images' => 'nullable|array|max:5',
                'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ];

            $messages = [
                'image.image' => 'O arquivo principal deve ser uma imagem.',
                'image.mimes' => 'A imagem principal deve ser do tipo: jpeg, png, jpg, gif, webp.',
                'image.max' => 'A imagem principal não pode ser maior que 5MB.',
                'additional_images.*.image' => 'O arquivo adicional deve ser uma imagem.',
                'additional_images.*.mimes' => 'As imagens adicionais devem ser do tipo: jpeg, png, jpg, gif, webp.',
                'additional_images.*.max' => 'Cada imagem adicional não pode ser maior que 5MB.',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['image', 'additional_images']);

            // Remove campos que podem não existir na tabela ainda
            if (!\Schema::hasColumn('products', 'slug')) {
                unset($data['slug']);
            }
            if (!\Schema::hasColumn('products', 'meta_keywords')) {
                unset($data['meta_keywords']);
            }

            if (isset($data['is_active'])) {
                $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true;
            }

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = 'product_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $data['image_url'] = $baseUrl.'/uploads/products/' . $imageName;
            }

            $uploadedImages = [];
            if ($request->hasFile('additional_images')) {
                $additionalImages = $request->file('additional_images');
                if (!is_array($additionalImages)) {
                    $additionalImages = [$additionalImages];
                }
                foreach ($additionalImages as $index => $img) {
                    if ($index >= 5) break;
                    if ($img && $img->isValid()) {
                        $imageName = 'product_' . time() . '_' . uniqid() . '_' . $index . '.' . $img->getClientOriginalExtension();
                        $img->move(public_path('uploads/products'), $imageName);
                        $uploadedImages[] = $baseUrl.'/uploads/products/' . $imageName;
                    }
                }
            }

            $allImages = [];
            if (!empty($uploadedImages)) {
                $allImages = array_merge($allImages, $uploadedImages);
            }
            if (!empty($data['images']) && is_array($data['images'])) {
                $allImages = array_merge($allImages, array_filter($data['images']));
            }
            if (!empty($allImages)) {
                $data['images'] = array_slice(array_unique($allImages), 0, 5);
            }

            $product = Product::create($data);

            Log::info('[ProductController] Produto criado', [
                'product_id' => $product->id,
                'name' => $product->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Produto criado com sucesso',
                'data' => $product->load(['auction', 'categoryModel'])
            ], 201);
        } catch (\Exception $e) {
            Log::error('[ProductController] Erro ao criar produto', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar produto
     */
    public function update(Request $request, $id)
    {

        $baseUrl = config('app.url');

        try {
            $product = Product::findOrFail($id);

            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'price' => 'sometimes|required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'additional_images' => 'nullable|array|max:5',
                'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ];

            $messages = [
                'image.image' => 'O arquivo principal deve ser uma imagem.',
                'image.mimes' => 'A imagem principal deve ser do tipo: jpeg, png, jpg, gif, webp.',
                'image.max' => 'A imagem principal não pode ser maior que 5MB.',
                'additional_images.*.image' => 'O arquivo adicional deve ser uma imagem.',
                'additional_images.*.mimes' => 'As imagens adicionais devem ser do tipo: jpeg, png, jpg, gif, webp.',
                'additional_images.*.max' => 'Cada imagem adicional não pode ser maior que 5MB.',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['image', 'additional_images']);

            // Remove campos que podem não existir na tabela ainda
            if (!\Schema::hasColumn('products', 'slug')) {
                unset($data['slug']);
            }
            if (!\Schema::hasColumn('products', 'meta_keywords')) {
                unset($data['meta_keywords']);
            }

            if (isset($data['is_active'])) {
                $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $product->is_active;
            }

            if ($request->hasFile('image')) {
                if ($product->image_url && file_exists(public_path($product->image_url))) {
                    unlink(public_path($product->image_url));
                }

                $image = $request->file('image');
                $imageName = 'product_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $data['image_url'] = $baseUrl.'/uploads/products/' . $imageName;
            }

            $uploadedImages = [];
            if ($request->hasFile('additional_images')) {
                $additionalImages = $request->file('additional_images');
                if (!is_array($additionalImages)) {
                    $additionalImages = [$additionalImages];
                }
                foreach ($additionalImages as $index => $img) {
                    if ($index >= 5) break;
                    if ($img && $img->isValid()) {
                        $imageName = 'product_' . time() . '_' . uniqid() . '_' . $index . '.' . $img->getClientOriginalExtension();
                        $img->move(public_path('uploads/products'), $imageName);
                        $uploadedImages[] = $baseUrl.'/uploads/products/' . $imageName;
                    }
                }
            }

            $allImages = [];
            if (!empty($product->images) && is_array($product->images)) {
                $allImages = $product->images;
            }
            if (!empty($uploadedImages)) {
                $allImages = array_merge($allImages, $uploadedImages);
            }
            if (!empty($data['images']) && is_array($data['images'])) {
                $allImages = array_merge($allImages, array_filter($data['images']));
            }
            if (!empty($allImages)) {
                $data['images'] = array_slice(array_unique($allImages), 0, 5);
            }

            $product->update($data);

            Log::info('[ProductController] Produto atualizado', [
                'product_id' => $product->id,
                'name' => $product->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Produto atualizado com sucesso',
                'data' => $product->fresh()->load(['auction', 'categoryModel'])
            ]);
        } catch (\Exception $e) {
            Log::error('[ProductController] Erro ao atualizar produto', [
                'product_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar produto
     */
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);

            if ($product->auction_id) {
                $auction = $product->auction;
                if ($auction && in_array($auction->status, ['scheduled', 'active'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível deletar um produto que está em um leilão ativo ou agendado',
                    ], 422);
                }
            }

            $product->delete();

            Log::info('[ProductController] Produto deletado', [
                'product_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Produto deletado com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error('[ProductController] Erro ao deletar produto', [
                'product_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Produtos relacionados (mesma categoria, com leilão ativo)
     */
    public function related($id)
    {
        try {
            $product = is_numeric($id)
                ? Product::findOrFail($id)
                : Product::where('slug', $id)->firstOrFail();

            $query = Product::where('id', '!=', $product->id)
                ->where('is_active', true)
                ->whereHas('auction', callback: fn($q) => $q->where('status', 'active'));

            // Prioriza mesma categoria
            if ($product->category_id) {
                $query->orderByRaw('CASE WHEN category_id = ? THEN 0 ELSE 1 END', [$product->category_id]);
            }

            $related = $query->with(['auction', 'categoryModel'])
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $related
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar produtos relacionados',
                'data' => []
            ], 500);
        }
    }

    /**
     * Obter produtos disponíveis (sem leilão)
     */
    public function available()
    {
        try {
            $products = Product::whereNull('auction_id')
                ->where('is_active', true)
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar produtos disponíveis',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
