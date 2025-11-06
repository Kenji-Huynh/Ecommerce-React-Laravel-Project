<?php
// Tạo API cho đơn hàng
// c:\xampp\htdocs\ecommerce\backend\app\Http\Controllers\API\OrderController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Revenue;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng của người dùng hiện tại
     */
    public function userOrders(Request $request)
    {
        $orders = $request->user()->orders()
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return response()->json($orders);
    }
    
    /**
     * Xem chi tiết đơn hàng
     */
    public function show(Request $request, Order $order)
    {
        // Kiểm tra quyền - chỉ người dùng tạo đơn hàng hoặc admin mới xem được
        if ($request->user()->id !== $order->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $order->load('items.product');
        return response()->json($order);
    }
    
    /**
     * Tạo đơn hàng mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
            'shipping_name' => 'required|string|max:255',
            'shipping_email' => 'required|email|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'nullable|string|max:100',
            'shipping_zipcode' => 'nullable|string|max:20',
            'shipping_country' => 'required|string|max:100',
            'payment_method' => 'required|in:cod,card,paypal',
            'notes' => 'nullable|string'
        ]);
        
        // Tính toán tổng tiền và kiểm tra sản phẩm
    $subtotal = 0;
        $items = [];
        
        foreach ($request->items as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            if (!$product || !$product->in_stock) {
                return response()->json([
                    'message' => 'Product not available: ' . ($product ? $product->name : 'Unknown')
                ], 400);
            }
            
            $price = (float) $product->price; // treat as USD
            $quantity = $item['quantity'];
            $subtotal += $price * $quantity;
            
            $items[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $price,
                'quantity' => $quantity,
                'size' => $item['size'] ?? null,
                'color' => $item['color'] ?? null
            ];
        }
        
        // Tax (nếu cần)
        $tax = 0; // Hoặc tính theo % của subtotal
        
        // Shipping fee (có thể tính dựa trên địa chỉ, trọng lượng, v.v.)
        $shipping = 10; // Phí vận chuyển mặc định
        
        // Tổng cộng
        $total = $subtotal + $tax + $shipping;
        
        // Tạo đơn hàng
        $order = Order::create([
            'user_id' => $request->user() ? $request->user()->id : null,
            'order_number' => 'ORD-' . Str::upper(Str::random(8)),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'payment_method' => $request->payment_method,
            // Nếu thanh toán bằng thẻ (Stripe) và đã xác nhận ở client → đánh dấu đã thanh toán
            'payment_status' => $request->payment_method === 'card' ? 'paid' : 'pending',
            'shipping_name' => $request->shipping_name,
            'shipping_email' => $request->shipping_email,
            'shipping_phone' => $request->shipping_phone,
            'shipping_address' => $request->shipping_address,
            'shipping_city' => $request->shipping_city,
            'shipping_state' => $request->shipping_state,
            'shipping_zipcode' => $request->shipping_zipcode,
            'shipping_country' => $request->shipping_country,
            'notes' => $request->notes
        ]);

        // Nếu đã thanh toán (card), cộng vào doanh thu hôm nay
        if ($order->payment_status === 'paid') {
            Revenue::addAmount(Carbon::today(), (float) $order->total);
        }
        
        // Lưu các mục đơn hàng
        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'product_name' => $item['product_name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'size' => $item['size'],
                'color' => $item['color']
            ]);
            
            // Cập nhật số lượng sản phẩm
            $product = \App\Models\Product::find($item['product_id']);
            $product->stock_quantity -= $item['quantity'];
            if ($product->stock_quantity <= 0) {
                $product->in_stock = false;
            }
            $product->save();
        }
        
        $order->load('items');
        return response()->json($order, 201);
    }
}
