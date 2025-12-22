<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Obter relatório geral
     */
    public function general(Request $request)
    {
        try {
            $dateFrom = $request->get('date_from', Carbon::now()->startOfMonth());
            $dateTo = $request->get('date_to', Carbon::now()->endOfMonth());

            $report = [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
                'total_auctions' => Auction::count(),
                'finished_auctions' => Auction::where('status', 'finished')->count(),
                'active_auctions' => Auction::where('status', 'active')->count(),
                'total_bids' => Bid::count(),
                'total_bids_period' => Bid::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
                'total_revenue' => Transaction::where('type', 'bid_purchase')
                    ->where('status', 'completed')
                    ->sum('amount'),
                'total_revenue_period' => Transaction::where('type', 'bid_purchase')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$dateFrom, $dateTo])
                    ->sum('amount'),
                'total_cashback' => Transaction::where('type', 'cashback')
                    ->where('status', 'completed')
                    ->sum('amount'),
                'total_cashback_period' => Transaction::where('type', 'cashback')
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$dateFrom, $dateTo])
                    ->sum('amount'),
                'pending_withdrawals' => Transaction::where('type', 'withdrawal')
                    ->where('status', 'pending')
                    ->count(),
                'pending_withdrawals_amount' => Transaction::where('type', 'withdrawal')
                    ->where('status', 'pending')
                    ->sum('amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $report
            ]);
        } catch (\Exception $e) {
            Log::error('[ReportController] Erro ao obter relatório geral', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter relatório',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter métricas de hoje
     */
    public function today()
    {
        try {
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();

            $metrics = [
                'bids_today' => Bid::whereDate('created_at', $today)->count(),
                'bids_yesterday' => Bid::whereDate('created_at', $yesterday)->count(),
                'new_users_today' => User::whereDate('created_at', $today)->count(),
                'new_users_yesterday' => User::whereDate('created_at', $yesterday)->count(),
                'pending_withdrawals' => Transaction::where('type', 'withdrawal')
                    ->where('status', 'pending')
                    ->count(),
                'revenue_today' => Transaction::where('type', 'bid_purchase')
                    ->where('status', 'completed')
                    ->whereDate('created_at', $today)
                    ->sum('amount'),
                'cashback_today' => Transaction::where('type', 'cashback')
                    ->where('status', 'completed')
                    ->whereDate('created_at', $today)
                    ->sum('amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            Log::error('[ReportController] Erro ao obter métricas de hoje', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter métricas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter cashback por usuário
     */
    public function cashbackByUser(Request $request)
    {
        try {
            $query = User::select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COALESCE(SUM(CASE WHEN transactions.type = "cashback" AND transactions.status = "completed" THEN transactions.amount ELSE 0 END), 0) as total_cashback'),
                DB::raw('COALESCE(SUM(CASE WHEN transactions.type = "withdrawal" AND transactions.status = "completed" THEN transactions.amount ELSE 0 END), 0) as total_withdrawn'),
                DB::raw('COALESCE(users.cashback_balance, 0) as current_balance')
            )
            ->leftJoin('transactions', 'users.id', '=', 'transactions.user_id')
            ->groupBy('users.id', 'users.name', 'users.email', 'users.cashback_balance');

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('users.name', 'like', "%{$search}%")
                      ->orWhere('users.email', 'like', "%{$search}%");
                });
            }

            $query->orderBy('total_cashback', 'desc');

            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('[ReportController] Erro ao obter cashback por usuário', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter cashback',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
