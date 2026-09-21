<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GetcoinOffer;
use App\Models\Transaction;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class GetcoinController extends Controller
{
    /**
     * Comprar GetCoin da VibeGet (preço fixo configurável)
     */
    public function buyFromVibeget(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        $amount = (float) $request->amount;
        $pricePerUnit = (float) Setting::getValue('getcoin_price', '0.50');
        $totalCost = round($amount * $pricePerUnit, 2);

        if ($user->balance < $totalCost) {
            return response()->json([
                'success' => false,
                'message' => "Saldo insuficiente. Necessário R$ {$totalCost}, disponível R$ {$user->balance}."
            ], 422);
        }

        // Debitar saldo e creditar GetCoin
        $user->balance -= $totalCost;
        $user->cashback_balance += $amount;
        $user->save();

        // Registrar transação
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'getcoin_purchase',
            'amount' => $totalCost,
            'status' => 'completed',
            'description' => "Compra de {$amount} GetCoin(s) da VibeGet a R$ {$pricePerUnit}/un",
        ]);

        return response()->json([
            'success' => true,
            'message' => "{$amount} GetCoin(s) adicionado(s) ao seu saldo!",
            'data' => [
                'getcoin_added' => $amount,
                'cost' => $totalCost,
                'new_balance' => $user->balance,
                'new_getcoin_balance' => $user->cashback_balance,
            ]
        ]);
    }

    /**
     * Listar ofertas ativas de GetCoin de outros Vibers
     */
    public function listOffers(Request $request)
    {
        $query = GetcoinOffer::with('seller:id,name,viber_level')
            ->where('status', 'active');

        // Não mostrar ofertas do próprio usuário
        if ($request->user()) {
            $query->where('seller_id', '!=', $request->user()->id);
        }

        $offers = $query->orderBy('price_per_unit', 'asc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $offers
        ]);
    }

    /**
     * Criar oferta de venda de GetCoin (apenas Bronze+)
     */
    public function createOffer(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'price_per_unit' => 'required|numeric|min:0.01',
        ]);

        $user = $request->user();

        // Verificar se é Bronze+ (pode vender)
        $allowedLevels = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
        $userLevel = Schema::hasColumn('users', 'viber_level') ? ($user->viber_level ?? 'inscrito') : 'inscrito';

        if (!in_array($userLevel, $allowedLevels)) {
            return response()->json([
                'success' => false,
                'message' => 'Apenas Vibers nível Bronze ou superior podem vender GetCoin.'
            ], 403);
        }

        $amount = (float) $request->amount;

        if ($user->cashback_balance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo de GetCoin insuficiente.'
            ], 422);
        }

        $pricePerUnit = (float) $request->price_per_unit;
        $totalPrice = round($amount * $pricePerUnit, 2);

        // Reservar o GetCoin (debitar do saldo durante a oferta)
        $user->cashback_balance -= $amount;
        $user->save();

        $offer = GetcoinOffer::create([
            'seller_id' => $user->id,
            'amount' => $amount,
            'price_per_unit' => $pricePerUnit,
            'total_price' => $totalPrice,
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Oferta criada com sucesso!',
            'data' => $offer
        ]);
    }

    /**
     * Comprar GetCoin de outro Viber
     */
    public function buyOffer(Request $request, $offerId)
    {
        $user = $request->user();
        $offer = GetcoinOffer::where('id', $offerId)->where('status', 'active')->first();

        if (!$offer) {
            return response()->json([
                'success' => false,
                'message' => 'Oferta não encontrada ou já vendida.'
            ], 404);
        }

        if ($offer->seller_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Você não pode comprar sua própria oferta.'
            ], 422);
        }

        if ($user->balance < $offer->total_price) {
            return response()->json([
                'success' => false,
                'message' => "Saldo insuficiente. Necessário R$ {$offer->total_price}."
            ], 422);
        }

        // Debitar comprador
        $user->balance -= $offer->total_price;
        $user->cashback_balance += $offer->amount;
        $user->save();

        // Creditar vendedor
        $seller = User::find($offer->seller_id);
        if ($seller) {
            $seller->balance += $offer->total_price;
            $seller->save();
        }

        // Atualizar oferta
        $offer->buyer_id = $user->id;
        $offer->status = 'sold';
        $offer->sold_at = now();
        $offer->save();

        // Transações
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'getcoin_purchase',
            'amount' => $offer->total_price,
            'status' => 'completed',
            'description' => "Compra de {$offer->amount} GetCoin(s) do Viber #{$offer->seller_id}",
        ]);

        Transaction::create([
            'user_id' => $offer->seller_id,
            'type' => 'getcoin_sale',
            'amount' => $offer->total_price,
            'status' => 'completed',
            'description' => "Venda de {$offer->amount} GetCoin(s) para Viber #{$user->id}",
        ]);

        return response()->json([
            'success' => true,
            'message' => "{$offer->amount} GetCoin(s) adquirido(s) com sucesso!",
            'data' => [
                'getcoin_added' => $offer->amount,
                'cost' => $offer->total_price,
                'new_balance' => $user->balance,
                'new_getcoin_balance' => $user->cashback_balance,
            ]
        ]);
    }

    /**
     * Cancelar oferta própria (devolver GetCoin)
     */
    public function cancelOffer(Request $request, $offerId)
    {
        $user = $request->user();
        $offer = GetcoinOffer::where('id', $offerId)
            ->where('seller_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$offer) {
            return response()->json([
                'success' => false,
                'message' => 'Oferta não encontrada.'
            ], 404);
        }

        // Devolver GetCoin ao vendedor
        $user->cashback_balance += $offer->amount;
        $user->save();

        $offer->status = 'cancelled';
        $offer->save();

        return response()->json([
            'success' => true,
            'message' => 'Oferta cancelada. GetCoin devolvido ao seu saldo.'
        ]);
    }

    /**
     * Minhas ofertas (vendedor)
     */
    public function myOffers(Request $request)
    {
        $offers = GetcoinOffer::with('buyer:id,name')
            ->where('seller_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $offers
        ]);
    }

    /**
     * Info do marketplace (preço VibeGet, cotação)
     */
    public function info()
    {
        $pricePerUnit = Setting::getValue('getcoin_price', '0.50');
        $activeOffers = GetcoinOffer::where('status', 'active')->count();
        $avgPrice = GetcoinOffer::where('status', 'active')->avg('price_per_unit');

        return response()->json([
            'success' => true,
            'data' => [
                'vibeget_price' => (float) $pricePerUnit,
                'active_offers' => $activeOffers,
                'avg_viber_price' => $avgPrice ? round($avgPrice, 2) : null,
            ]
        ]);
    }
}
