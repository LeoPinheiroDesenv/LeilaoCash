<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Adicionar ou remover favorito
     */
    public function toggle(Request $request, $productId)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário não autenticado'
                ], 401);
            }

            $favorite = Favorite::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($favorite) {
                // Remover favorito
                $favorite->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Produto removido dos favoritos',
                    'data' => ['is_favorite' => false]
                ]);
            } else {
                // Adicionar favorito
                $favorite = Favorite::create([
                    'user_id' => $user->id,
                    'product_id' => $productId
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Produto adicionado aos favoritos',
                    'data' => ['is_favorite' => true]
                ]);
            }
        } catch (\Exception $e) {
            Log::error('[FavoriteController] Erro ao alternar favorito', [
                'error' => $e->getMessage(),
                'product_id' => $productId
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar favorito',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar se produto está favoritado
     */
    public function check(Request $request, $productId)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => true,
                    'data' => ['is_favorite' => false]
                ]);
            }

            $isFavorite = Favorite::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->exists();

            return response()->json([
                'success' => true,
                'data' => ['is_favorite' => $isFavorite]
            ]);
        } catch (\Exception $e) {
            Log::error('[FavoriteController] Erro ao verificar favorito', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao verificar favorito',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar favoritos do usuário
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário não autenticado'
                ], 401);
            }

            $favorites = Favorite::where('user_id', $user->id)
                ->with('product')
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $favorites
            ]);
        } catch (\Exception $e) {
            Log::error('[FavoriteController] Erro ao listar favoritos', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar favoritos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
