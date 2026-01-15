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

            // Filtros
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%")
                      ->orWhere('brand', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%")
                      ->orWhereHas('brandModel', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('productModel', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('categoryModel', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
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

    public function show($id)
    {
        try {
            $product = Product::with([
                'auction.bids' => function($query) {
                    $query->latest()->limit(10)->with('user:id,name');
                },
                'auction.winner:id,name',
                'categoryModel',
                'brandModel',
                'productModel'
            ])->findOrFail($id);

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

            if (isset($data['is_active'])) {
                $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true;
            }

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = 'product_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $data['image_url'] = 'https://api.vibeget.net/uploads/products/' . $imageName;
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
                        $uploadedImages[] = 'https://api.vibeget.net/uploads/products/' . $imageName;
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
                $data['image_url'] = 'https://api.vibeget.net/uploads/products/' . $imageName;
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
                        $uploadedImages[] = 'https://api.vibeget.net/uploads/products/' . $imageName;
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
