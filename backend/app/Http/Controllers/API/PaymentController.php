<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // POST /api/payments/create-intent
    public function createIntent(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Lấy giỏ hàng của user và tính tổng từ DB để tránh bị sửa giá phía client
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['items' => []]
        );

        $items = $cart->items ?? [];
        if (empty($items)) {
            return response()->json(['message' => 'Giỏ hàng trống'], 400);
        }

    $subtotal = 0;
        foreach ($items as $item) {
            // Mỗi item phải có id (product_id), quantity
            $productId = $item['id'] ?? $item['product_id'] ?? null;
            $qty = (int)($item['quantity'] ?? 0);
            if (!$productId || $qty < 1) {
                return response()->json(['message' => 'Dữ liệu giỏ hàng không hợp lệ'], 400);
            }

            $product = Product::find($productId);
            if (!$product || !$product->in_stock) {
                return response()->json(['message' => 'Sản phẩm không khả dụng: ' . ($product ? $product->name : '#'.$productId)], 400);
            }
            $unit = (float) $product->price; // already stored as USD
            $subtotal += $unit * $qty;
        }

        $tax = 0.0;
        $shipping = 10.0; // giống logic trong OrderController
        $total = $subtotal + $tax + $shipping;

        // Stripe yêu cầu amount là integer (đơn vị nhỏ nhất)
    $currency = strtolower(env('STRIPE_CURRENCY', 'usd'));
    // Xác định currency không có phần thập phân (VD: vnd, jpy, krw)
    $zeroDecimal = in_array($currency, ['vnd','jpy','krw','clp','isk','twd','huf']);
    $amount = $zeroDecimal ? (int) round($total) : (int) round($total * 100);

        $secret = env('STRIPE_SECRET');
        if (!$secret) {
            return response()->json(['message' => 'Thiếu STRIPE_SECRET trong .env'], 500);
        }

        try {
            $stripe = new \Stripe\StripeClient($secret);
            $intent = $stripe->paymentIntents->create([
                'amount' => $amount,
                'currency' => $currency,
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => [
                    'user_id' => (string)$user->id,
                    'user_email' => (string)($user->email ?? ''),
                ],
            ]);

            return response()->json([
                'clientSecret' => $intent->client_secret,
                'amount' => $amount,
                'currency' => $currency,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Không tạo được PaymentIntent',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
