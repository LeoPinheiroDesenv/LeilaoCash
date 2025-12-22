<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// IMPORTANTE: Rota catch-all para requisições OPTIONS (preflight)
// DEVE ser a primeira rota para capturar todas as requisições OPTIONS
// O middleware HandleCorsWithErrors vai tratar e retornar os headers CORS
Route::options('/{any}', function (Request $request) {
    // Esta rota será interceptada pelo middleware HandleCorsWithErrors
    // que retornará 204 com headers CORS antes de chegar aqui
    return response('', 204);
})->where('any', '.*')->fallback();

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'VibeGet API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Public routes - Categories and Products (for homepage)
Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
Route::get('/products/public', [\App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/public/{id}', [\App\Http\Controllers\Api\ProductController::class, 'show']);
Route::get('/auctions/public', [\App\Http\Controllers\Api\AuctionController::class, 'index']);
Route::get('/auctions/public/{id}', [\App\Http\Controllers\Api\AuctionController::class, 'show']);

// Protected routes
Route::middleware(['debug.auth', 'auth:sanctum'])->group(function () {
    // Auth routes


    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
    });

    // User routes
    Route::prefix('user')->group(function () {
        Route::get('/', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => $request->user()
            ]);
        });
        
        Route::get('/balance', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => [
                    'balance' => $request->user()->balance,
                    'cashback_balance' => $request->user()->cashback_balance,
                ]
            ]);
        });

        // User's own bids
        Route::get('/bids', function (Request $request) {
            $query = \App\Models\Bid::with([
                'auction:id,title,status,current_bid,starting_bid,end_date',
                'auction.products:id,name,image_url,auction_id',
                'product:id,name,image_url'
            ])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc');
            
            $perPage = $request->get('per_page', 15);
            $bids = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $bids
            ]);
        });

        // User's own transactions
        Route::get('/transactions', function (Request $request) {
            $query = \App\Models\Transaction::with(['user:id,name,email'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc');
            
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }
            
            $perPage = $request->get('per_page', 15);
            $transactions = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $transactions
            ]);
        });
    });

    // Admin only routes
    Route::middleware('admin')->group(function () {
        // Settings public (apenas admin)
        Route::get('/settings/public', [\App\Http\Controllers\Api\SettingsController::class, 'getPublic']);
        
        // Settings management
        Route::prefix('settings')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\SettingsController::class, 'index']);
            Route::get('/group/{group}', [\App\Http\Controllers\Api\SettingsController::class, 'getByGroup']);
            Route::put('/{key}', [\App\Http\Controllers\Api\SettingsController::class, 'update']);
            Route::post('/batch', [\App\Http\Controllers\Api\SettingsController::class, 'updateBatch']);
            Route::post('/upload-image', [\App\Http\Controllers\Api\SettingsController::class, 'uploadImage']);
        });

        // User management
        Route::prefix('users')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\UserController::class, 'index']);
            Route::get('/screens', [\App\Http\Controllers\Api\UserController::class, 'getAvailableScreens']);
            Route::post('/', [\App\Http\Controllers\Api\UserController::class, 'store']);
            Route::get('/{id}', [\App\Http\Controllers\Api\UserController::class, 'show']);
            Route::put('/{id}', [\App\Http\Controllers\Api\UserController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);
        });

        // Category management
        Route::prefix('categories')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Api\CategoryController::class, 'store']);
            Route::get('/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'show']);
            Route::put('/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'destroy']);
        });

        // Product management
        Route::prefix('products')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\ProductController::class, 'index']);
            Route::get('/available', [\App\Http\Controllers\Api\ProductController::class, 'available']);
            Route::post('/', [\App\Http\Controllers\Api\ProductController::class, 'store']);
            Route::get('/{id}', [\App\Http\Controllers\Api\ProductController::class, 'show']);
            Route::put('/{id}', [\App\Http\Controllers\Api\ProductController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Api\ProductController::class, 'destroy']);
        });

        // Auction management
        Route::prefix('auctions')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\AuctionController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Api\AuctionController::class, 'store']);
            Route::get('/{id}', [\App\Http\Controllers\Api\AuctionController::class, 'show']);
            Route::put('/{id}', [\App\Http\Controllers\Api\AuctionController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Api\AuctionController::class, 'destroy']);
        });

        // Bid management
        Route::prefix('bids')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\BidController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\BidController::class, 'stats']);
        });

        // Transaction management
        Route::prefix('transactions')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\TransactionController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\TransactionController::class, 'stats']);
        });

        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('/general', [\App\Http\Controllers\Api\ReportController::class, 'general']);
            Route::get('/today', [\App\Http\Controllers\Api\ReportController::class, 'today']);
            Route::get('/cashback-by-user', [\App\Http\Controllers\Api\ReportController::class, 'cashbackByUser']);
        });

        // Favorites
        Route::prefix('favorites')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\FavoriteController::class, 'index']);
            Route::post('/{productId}/toggle', [\App\Http\Controllers\Api\FavoriteController::class, 'toggle']);
            Route::get('/{productId}/check', [\App\Http\Controllers\Api\FavoriteController::class, 'check']);
        });
    });
});

