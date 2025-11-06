@extends('admin.layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Dashboard</h1>
    </div>
    
    <!-- Stats Cards -->
    <div class="row">
        <div class="col-md-3 mb-4">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title">Người dùng</h6>
                            <h2 class="mb-0">{{ $stats['users_count'] }}</h2>
                        </div>
                        <i class="fas fa-users fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-3 mb-4">
            <div class="card text-white bg-success">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title">Sản phẩm</h6>
                            <h2 class="mb-0">{{ $stats['products_count'] }}</h2>
                        </div>
                        <i class="fas fa-box fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-3 mb-4">
            <div class="card text-white bg-warning">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title">Đơn hàng</h6>
                            <h2 class="mb-0">{{ $stats['orders_count'] }}</h2>
                        </div>
                        <i class="fas fa-shopping-cart fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-3 mb-4">
            <div class="card text-white bg-info">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title">Doanh thu</h6>
                            <h2 class="mb-0">${{ number_format($stats['revenue'], 2) }}</h2>
                        </div>
                        <i class="fas fa-dollar-sign fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Latest Orders -->
    <div class="card mb-4">
        <div class="card-header">
            <i class="fas fa-table me-1"></i>
            Đơn hàng gần đây
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($latest_orders as $order)
                        <tr>
                            <td>{{ $order->order_number }}</td>
                            <td>{{ $order->user->name ?? $order->shipping_name }}</td>
                            <td>${{ number_format($order->total, 2) }}</td>
                            <td>
                                @if($order->status == 'pending')
                                <span class="badge bg-warning">Chờ xử lý</span>
                                @elseif($order->status == 'processing')
                                <span class="badge bg-info">Đang xử lý</span>
                                @elseif($order->status == 'shipped')
                                <span class="badge bg-primary">Đã gửi</span>
                                @elseif($order->status == 'delivered')
                                <span class="badge bg-success">Đã giao</span>
                                @elseif($order->status == 'canceled')
                                <span class="badge bg-danger">Đã hủy</span>
                                @endif
                            </td>
                            <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
                            <td>
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="btn btn-sm btn-info">
                                    <i class="fas fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection