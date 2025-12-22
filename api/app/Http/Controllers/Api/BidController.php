<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    /**
     * Listar todos os lances
     */
    public function index(Request $request)
    {
        try {
            $query = Bid::with(['user:id,name,email', 'auction:id,title,status', 'product:id,name']);

            // Filtros
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('auction_id')) {
                $query->where('auction_id', $request->auction_id);
            }

            if ($request->has('product_id')) {
                $query->where('product_id', $request->product_id);
            }

            if ($request->has('is_winning')) {
                $query->where('is_winning', $request->is_winning === 'true');
            }

            // Ordenação
            $orderBy = $request->get('order_by', 'created_at');
            $orderDir = $request->get('order_dir', 'desc');
            $query->orderBy($orderBy, $orderDir);

            // Paginação
            $perPage = $request->get('per_page', 15);
            $bids = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $bids
            ]);
        } catch (\Exception $e) {
            Log::error('[BidController] Erro ao listar lances', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar lances',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de lances
     */
    public function stats()
    {
        try {
            $stats = [
                'total_bids' => Bid::count(),
                'total_today' => Bid::whereDate('created_at', today())->count(),
                'total_amount' => Bid::sum('amount'),
                'total_today_amount' => Bid::whereDate('created_at', today())->sum('amount'),
                'winning_bids' => Bid::where('is_winning', true)->count(),
                'top_users' => Bid::select('user_id', DB::raw('count(*) as total_bids'), DB::raw('sum(amount) as total_amount'))
                    ->with('user:id,name,email')
                    ->groupBy('user_id')
                    ->orderBy('total_bids', 'desc')
                    ->limit(10)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('[BidController] Erro ao obter estatísticas', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter estatísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
