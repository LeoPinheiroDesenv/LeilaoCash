<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * Listar páginas (admin)
     */
    public function index()
    {
        $pages = Page::orderBy('section')->orderBy('sort_order')->orderBy('title')->get();

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * Listar páginas ativas (público — para o footer)
     */
    public function publicIndex()
    {
        $pages = Page::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * Buscar página por slug (público)
     */
    public function showBySlug($slug)
    {
        $page = Page::where('slug', $slug)->where('is_active', true)->first();

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Página não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $page
        ]);
    }

    /**
     * Criar página
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'section' => 'required|in:quick_links,legal',
            'content_pt' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $page = Page::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Página criada com sucesso',
            'data' => $page
        ], 201);
    }

    /**
     * Atualizar página
     */
    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $id,
            'section' => 'sometimes|in:quick_links,legal',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $page->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Página atualizada com sucesso',
            'data' => $page->fresh()
        ]);
    }

    /**
     * Deletar página
     */
    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return response()->json([
            'success' => true,
            'message' => 'Página deletada com sucesso'
        ]);
    }
}
