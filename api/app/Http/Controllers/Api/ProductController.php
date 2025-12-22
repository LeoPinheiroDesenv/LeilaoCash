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
    /**
     * Listar todos os produtos
     */
    public function index(Request $request)
    {
        try {
            $query = Product::query();

            // Filtros
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
                });
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active === 'true');
            }

            // Produtos disponíveis (sem leilão)
            if ($request->has('available') && $request->available === 'true') {
                $query->whereNull('auction_id');
            }

            // Incluir relacionamentos
            $query->with(['auction:id,title,status', 'categoryModel:id,name,slug']);

            // Paginação
            $perPage = $request->get('per_page', 15);
            $products = $query->orderBy('created_at', 'desc')->paginate($perPage);

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

    /**
     * Obter um produto específico
     */
    public function show($id)
    {
        try {
            $product = Product::with('auction')->findOrFail($id);

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
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:100',
                'category_id' => 'nullable|exists:categories,id',
                'price' => 'required|numeric|min:0',
                'image_url' => 'nullable|url|max:500',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
                'additional_images' => 'nullable|array|max:5',
                'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'images' => 'nullable|array',
                'images.*' => 'url|max:500',
                'brand' => 'nullable|string|max:100',
                'model' => 'nullable|string|max:100',
                'specifications' => 'nullable|array',
                'is_active' => ['nullable', function ($attribute, $value, $fail) {
                    if (!in_array($value, [true, false, 'true', 'false', '1', '0', 1, 0, 'on', 'off'], true)) {
                        $fail('O campo :attribute deve ser um valor booleano.');
                    }
                }],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['image', 'additional_images']);

            // Converter is_active para boolean
            if (isset($data['is_active'])) {
                $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true;
            }

            // Upload de imagem principal
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = 'product_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $data['image_url'] = '/uploads/products/' . $imageName;
            }

            // Upload de imagens adicionais (até 5)
            $uploadedImages = [];
            if ($request->hasFile('additional_images')) {
                $additionalImages = $request->file('additional_images');
                // Se for um único arquivo, converter para array
                if (!is_array($additionalImages)) {
                    $additionalImages = [$additionalImages];
                }
                foreach ($additionalImages as $index => $img) {
                    if ($index >= 5) break; // Limitar a 5 imagens
                    if ($img && $img->isValid()) {
                        $imageName = 'product_' . time() . '_' . uniqid() . '_' . $index . '.' . $img->getClientOriginalExtension();
                        $img->move(public_path('uploads/products'), $imageName);
                        $uploadedImages[] = '/uploads/products/' . $imageName;
                    }
                }
            }

            // Combinar imagens enviadas via URL com imagens enviadas via upload
            $allImages = [];
            if (!empty($uploadedImages)) {
                $allImages = array_merge($allImages, $uploadedImages);
            }
            if (!empty($data['images']) && is_array($data['images'])) {
                $allImages = array_merge($allImages, array_filter($data['images']));
            }
            if (!empty($allImages)) {
                $data['images'] = array_slice($allImages, 0, 5); // Garantir máximo de 5
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
        try {
            $product = Product::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:100',
                'category_id' => 'nullable|exists:categories,id',
                'price' => 'sometimes|required|numeric|min:0',
                'image_url' => 'nullable|url|max:500',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
                'additional_images' => 'nullable|array|max:5',
                'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'images' => 'nullable|array',
                'images.*' => 'url|max:500',
                'brand' => 'nullable|string|max:100',
                'model' => 'nullable|string|max:100',
                'specifications' => 'nullable|array',
                'is_active' => ['nullable', function ($attribute, $value, $fail) {
                    if (!in_array($value, [true, false, 'true', 'false', '1', '0', 1, 0, 'on', 'off'], true)) {
                        $fail('O campo :attribute deve ser um valor booleano.');
                    }
                }],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['image', 'additional_images']);

            // Converter is_active para boolean
            if (isset($data['is_active'])) {
                $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $product->is_active;
            }

            // Upload de imagem principal
            if ($request->hasFile('image')) {
                // Deletar imagem antiga se existir
                if ($product->image_url && file_exists(public_path($product->image_url))) {
                    unlink(public_path($product->image_url));
                }

                $image = $request->file('image');
                $imageName = 'product_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $data['image_url'] = '/uploads/products/' . $imageName;
            }

            // Upload de imagens adicionais (até 5)
            $uploadedImages = [];
            if ($request->hasFile('additional_images')) {
                $additionalImages = $request->file('additional_images');
                // Se for um único arquivo, converter para array
                if (!is_array($additionalImages)) {
                    $additionalImages = [$additionalImages];
                }
                foreach ($additionalImages as $index => $img) {
                    if ($index >= 5) break; // Limitar a 5 imagens
                    if ($img && $img->isValid()) {
                        $imageName = 'product_' . time() . '_' . uniqid() . '_' . $index . '.' . $img->getClientOriginalExtension();
                        $img->move(public_path('uploads/products'), $imageName);
                        $uploadedImages[] = '/uploads/products/' . $imageName;
                    }
                }
            }

            // Combinar imagens existentes com novas
            $allImages = [];
            // Manter imagens existentes que não foram removidas
            if (!empty($product->images) && is_array($product->images)) {
                $allImages = $product->images;
            }
            // Adicionar novas imagens enviadas via upload
            if (!empty($uploadedImages)) {
                $allImages = array_merge($allImages, $uploadedImages);
            }
            // Adicionar imagens enviadas via URL
            if (!empty($data['images']) && is_array($data['images'])) {
                $allImages = array_merge($allImages, array_filter($data['images']));
            }
            // Limitar a 5 imagens e remover duplicatas
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

            // Verificar se o produto está em um leilão ativo
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

