<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Listar todas as transações
     */
    public function index(Request $request)
    {
        try {
            $query = Transaction::with(['user:id,name,email', 'bid:id,amount', 'auction:id,title']);

            // Filtros
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Ordenação
            $orderBy = $request->get('order_by', 'created_at');
            $orderDir = $request->get('order_dir', 'desc');
            $query->orderBy($orderBy, $orderDir);

            // Paginação
            $perPage = $request->get('per_page', 15);
            $transactions = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $transactions
            ]);
        } catch (\Exception $e) {
            Log::error('[TransactionController] Erro ao listar transações', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar transações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de transações
     */
    public function stats()
    {
        try {
            $stats = [
                'total_transactions' => Transaction::count(),
                'total_today' => Transaction::whereDate('created_at', today())->count(),
                'total_amount' => Transaction::where('status', 'completed')->sum('amount'),
                'total_today_amount' => Transaction::whereDate('created_at', today())
                    ->where('status', 'completed')
                    ->sum('amount'),
                'by_type' => Transaction::select('type', DB::raw('count(*) as total'), DB::raw('sum(amount) as total_amount'))
                    ->where('status', 'completed')
                    ->groupBy('type')
                    ->get(),
                'by_status' => Transaction::select('status', DB::raw('count(*) as total'))
                    ->groupBy('status')
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('[TransactionController] Erro ao obter estatísticas', [
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
