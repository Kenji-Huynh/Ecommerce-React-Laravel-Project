<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users_count' => User::count(),
            'products_count' => Product::count(),
            'orders_count' => Order::count(),
            // Doanh thu dựa trên các đơn đã thanh toán
            'revenue' => (float) Order::where('payment_status', 'paid')->sum('total')
        ];
        
        $latest_orders = Order::with('user')->latest()->take(5)->get();
        
        return view('admin.dashboard', compact('stats', 'latest_orders'));
    }
}