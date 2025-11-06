@extends('admin.layouts.app')

@section('title', 'Chi tiết đơn hàng')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="mb-0">Đơn #{{ $order->order_number }}</h2>
    <div>
        <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary">
            <i class="fa fa-arrow-left me-1"></i> Quay lại
        </a>
    </div>
    </div>

@if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif
@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach($errors->all() as $e)
                <li>{{ $e }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="row g-4">
    <div class="col-lg-8">
        <div class="card">
            <div class="card-header">Sản phẩm</div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Sản phẩm</th>
                                <th class="text-end">Giá</th>
                                <th class="text-center">SL</th>
                                <th class="text-end">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->items as $item)
                                <tr>
                                    <td>{{ $item->product_name }}</td>
                                    <td class="text-end">${{ number_format($item->price, 2) }}</td>
                                    <td class="text-center">{{ $item->quantity }}</td>
                                    <td class="text-end">${{ number_format($item->price * $item->quantity, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer text-end">
                <div>Subtotal: <strong>${{ number_format($order->subtotal, 2) }}</strong></div>
                <div>Tax: <strong>${{ number_format($order->tax, 2) }}</strong></div>
                <div>Shipping: <strong>${{ number_format($order->shipping, 2) }}</strong></div>
                <div>Discount: <strong>-${{ number_format($order->discount, 2) }}</strong></div>
                <div class="fs-5">Tổng: <strong>${{ number_format($order->total, 2) }}</strong></div>
            </div>
        </div>
    </div>

    <div class="col-lg-4">
        <div class="card mb-4">
            <div class="card-header">Thông tin giao hàng</div>
            <div class="card-body">
                <div class="mb-2"><strong>{{ $order->shipping_name }}</strong></div>
                <div class="text-muted small">{{ $order->shipping_email }} • {{ $order->shipping_phone }}</div>
                <div class="mt-2">{{ $order->shipping_address }}, {{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_zipcode }}, {{ $order->shipping_country }}</div>
                @if($order->notes)
                    <div class="mt-2"><em>Ghi chú:</em> {{ $order->notes }}</div>
                @endif
            </div>
        </div>

        <div class="card">
            <div class="card-header">Cập nhật trạng thái</div>
            <div class="card-body">
                <form action="{{ route('admin.orders.update', $order->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label class="form-label">Trạng thái đơn</label>
                        <select class="form-select" name="status" required>
                            @foreach($orderStatuses as $value => $label)
                                <option value="{{ $value }}" {{ $order->status === $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Trạng thái thanh toán</label>
                        <select class="form-select" name="payment_status" required>
                            @foreach($paymentStatuses as $value => $label)
                                <option value="{{ $value }}" {{ $order->payment_status === $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                        <div class="form-text">Nếu chọn "Paid", hệ thống sẽ cộng tổng tiền vào doanh thu.</div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fa fa-save me-1"></i> Lưu thay đổi
                        </button>
                    </div>
                </form>
                <form class="mt-2" action="{{ route('admin.orders.destroy', $order->id) }}" method="POST" onsubmit="return confirm('Xóa đơn hàng này?')">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-outline-danger" type="submit">
                        <i class="fa fa-trash me-1"></i> Xóa đơn
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
