<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Revenue;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Order::with('user')
            ->latest()
            ->paginate(12);

        return view('admin.orders.index', compact('orders'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        abort(404);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        $orderStatuses = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'canceled' => 'Canceled',
        ];
        $paymentStatuses = [
            'pending' => 'Pending',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'refunded' => 'Refunded',
        ];

        return view('admin.orders.show', compact('order', 'orderStatuses', 'paymentStatuses'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return redirect()->route('admin.orders.show', $id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,canceled',
            'payment_status' => 'required|string|in:pending,paid,failed,refunded',
        ]);

        $oldPaymentStatus = $order->payment_status;

        $order->status = $validated['status'];
        $order->payment_status = $validated['payment_status'];
        $order->save();

        // Revenue adjustments
        if ($oldPaymentStatus !== 'paid' && $order->payment_status === 'paid') {
            Revenue::addAmount(Carbon::today(), (float) $order->total);
        } elseif ($oldPaymentStatus === 'paid' && $order->payment_status !== 'paid') {
            Revenue::subtractAmount(Carbon::today(), (float) $order->total);
        }

        return redirect()
            ->route('admin.orders.show', $order->id)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        // If order was paid, subtract its total from revenue
        if ($order->payment_status === 'paid') {
            Revenue::subtractAmount(Carbon::today(), (float) $order->total);
        }

        $order->delete();

        return redirect()
            ->route('admin.orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
