<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CategoryController extends Controller
{
    private const VALIDATION_MESSAGES = [
        'name.required' => 'Informe o nome da categoria.',
        'name.unique' => 'Já existe uma categoria com esse nome.',
        'slug.unique' => 'Esse slug já está em uso por outra categoria.',
        'icon.max' => 'O ícone deve ter no máximo 50 caracteres.',
    ];

    /**
     * Campos da categoria vindos da requisição, limitados às colunas que existem
     * na tabela — evita erro de SQL se o banco estiver com migration pendente
     * (ex.: name_en/name_es/meta_keywords ainda não criadas em produção).
     */
    private function categoryData(Request $request): array
    {
        $columns = Schema::getColumnListing('categories');

        return collect($request->only((new Category)->getFillable()))
            ->only($columns)
            ->all();
    }

    /**
     * Listar todas as categorias
     */
    public function index(Request $request)
    {
        try {
            // products_count: só produtos com Vibe ativa (filtro público de categorias)
            // products_total_count: todos os produtos cadastrados (o que bloqueia a exclusão no admin)
            $query = Category::query()->withCount([
                'products' => function($q) {
                    $q->whereHas('auction', function($aq) {
                        $aq->where('status', 'active');
                    });
                },
                'products as products_total_count',
            ]);
            // Filtros
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active === 'true');
            }

            // Ordenar por sort_order e depois por nome
            $categories = $query->orderBy('sort_order', 'asc')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            Log::error('[CategoryController] Erro ao listar categorias', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar categorias',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter uma categoria específica
     */
    public function show($id)
    {
        try {
            $category = Category::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada'
            ], 404);
        }
    }

    /**
     * Criar nova categoria
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name,NULL,id,deleted_at,NULL',
                'slug' => 'nullable|string|max:255|unique:categories,slug,NULL,id,deleted_at,NULL',
                'description' => 'nullable|string',
                'icon' => 'nullable|string|max:50',
                'is_active' => 'boolean',
                'sort_order' => 'nullable|integer|min:0',
            ], self::VALIDATION_MESSAGES);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $category = Category::create($this->categoryData($request));

            Log::info('[CategoryController] Categoria criada', [
                'category_id' => $category->id,
                'name' => $category->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Categoria criada com sucesso',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            Log::error('[CategoryController] Erro ao criar categoria', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar categoria
     */
    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);

            // Só checa nome duplicado quando o nome muda, para não travar a edição
            // de categorias antigas que já tenham nomes repetidos
            $nameRule = 'sometimes|required|string|max:255';
            if ($request->has('name') && $request->name !== $category->name) {
                $nameRule .= '|unique:categories,name,' . $id . ',id,deleted_at,NULL';
            }

            $validator = Validator::make($request->all(), [
                'name' => $nameRule,
                'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id . ',id,deleted_at,NULL',
                'description' => 'nullable|string',
                'icon' => 'nullable|string|max:50',
                'is_active' => 'boolean',
                'sort_order' => 'nullable|integer|min:0',
            ], self::VALIDATION_MESSAGES);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $category->update($this->categoryData($request));

            Log::info('[CategoryController] Categoria atualizada', [
                'category_id' => $category->id,
                'name' => $category->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Categoria atualizada com sucesso',
                'data' => $category->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('[CategoryController] Erro ao atualizar categoria', [
                'category_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar categoria
     */
    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);

            // Verificar se há produtos usando esta categoria (inclusive produtos sem Vibe ativa)
            $productsCount = $category->products()->count();
            if ($productsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Não é possível excluir: a categoria possui {$productsCount} produto(s) cadastrado(s), mesmo que sem Vibe ativa. Mova esses produtos para outra categoria ou exclua-os antes.",
                ], 422);
            }

            $category->delete();

            Log::info('[CategoryController] Categoria deletada', [
                'category_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Categoria deletada com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error('[CategoryController] Erro ao deletar categoria', [
                'category_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

