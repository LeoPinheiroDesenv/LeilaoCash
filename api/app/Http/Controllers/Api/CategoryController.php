<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Listar todas as categorias
     */
    public function index(Request $request)
    {
        try {
            $query = Category::query();

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
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:categories,slug',
                'description' => 'nullable|string',
                'icon' => 'nullable|string|max:50',
                'is_active' => 'boolean',
                'sort_order' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $category = Category::create($request->all());

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

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id,
                'description' => 'nullable|string',
                'icon' => 'nullable|string|max:50',
                'is_active' => 'boolean',
                'sort_order' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $category->update($request->all());

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

            // Verificar se há produtos usando esta categoria
            if ($category->products()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível deletar uma categoria que possui produtos associados',
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

