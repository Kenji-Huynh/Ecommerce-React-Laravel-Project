<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // GET /api/cart
    public function show(Request $request)
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['items' => []]
        );

        return response()->json([
            'items' => $cart->items ?? [],
            'updated_at' => $cart->updated_at,
        ]);
    }

    // POST /api/cart
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
        ]);

        $user = $request->user();
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['items' => []]
        );

        // Optionally validate each item structure
        // e.g., id, name, price, quantity
        $cart->items = $data['items'];
        $cart->save();

        return response()->json([
            'message' => 'Cart saved',
            'items' => $cart->items,
        ]);
    }

    // DELETE /api/cart
    public function destroy(Request $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();
        if ($cart) {
            $cart->items = [];
            $cart->save();
        }
        return response()->json(['message' => 'Cart cleared']);
    }
}
