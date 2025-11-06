@extends('admin.layouts.app')

@section('title', 'Đơn hàng')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="mb-0">Quản lý đơn hàng</h2>
</div>

@if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif

<div class="card">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thanh toán</th>
                        <th>Ngày tạo</th>
                        <th class="text-end">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($orders as $order)
                        <tr>
                            <td>{{ $order->id }}</td>
                            <td><span class="badge bg-secondary">{{ $order->order_number }}</span></td>
                            <td>
                                @if($order->user)
                                    {{ $order->user->name }}<br>
                                    <small class="text-muted">{{ $order->user->email }}</small>
                                @else
                                    <em>Guest</em>
                                @endif
                            </td>
                            <td>${{ number_format($order->total, 2) }}</td>
                            <td>
                                <span class="badge bg-{{
                                    ['pending'=>'warning','processing'=>'info','shipped'=>'primary','delivered'=>'success','canceled'=>'dark'][$order->status] ?? 'secondary'
                                }}">{{ ucfirst($order->status) }}</span>
                            </td>
                            <td>
                                <span class="badge bg-{{ $order->payment_status === 'paid' ? 'success' : ($order->payment_status === 'pending' ? 'warning' : 'danger') }}">
                                    {{ ucfirst($order->payment_status) }}
                                </span>
                            </td>
                            <td>{{ $order->created_at->format('Y-m-d H:i') }}</td>
                            <td class="text-end">
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.orders.show', $order->id) }}" class="btn btn-sm btn-outline-primary" title="Xem/Sửa">
                                        <i class="fa fa-eye"></i>
                                    </a>
                                    <form action="{{ route('admin.orders.destroy', $order->id) }}" method="POST" onsubmit="return confirm('Xóa đơn hàng này?')">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-outline-danger" type="submit" title="Xóa">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="8" class="text-center p-4">Chưa có đơn hàng</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @if($orders->hasPages())
        <div class="card-footer">{{ $orders->links() }}</div>
    @endif
    </div>
</div>
@endsection
