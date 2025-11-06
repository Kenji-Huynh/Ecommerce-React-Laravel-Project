@extends('admin.layouts.app')

@section('title', 'Chi tiết người dùng')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-user me-2"></i>Chi tiết người dùng</h2>
        <div class="btn-group">
            <a href="{{ route('admin.users.edit', $user->id) }}" class="btn btn-warning">
                <i class="fas fa-edit me-2"></i>Chỉnh sửa
            </a>
            <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">
                <i class="fas fa-arrow-left me-2"></i>Quay lại
            </a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-4">
            <div class="card shadow-sm mb-4">
                <div class="card-body text-center">
                    <div class="avatar-large mx-auto mb-3">
                        {{ strtoupper(substr($user->name, 0, 2)) }}
                    </div>
                    <h4>{{ $user->name }}</h4>
                    <p class="text-muted">{{ $user->email }}</p>
                    
                    @if($user->role === 'admin')
                        <span class="badge bg-danger fs-6 px-3 py-2">
                            <i class="fas fa-crown me-1"></i>Admin
                        </span>
                    @else
                        <span class="badge bg-secondary fs-6 px-3 py-2">
                            <i class="fas fa-user me-1"></i>User
                        </span>
                    @endif
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>Thông tin tài khoản</h6>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <small class="text-muted d-block">ID</small>
                        <strong>#{{ $user->id }}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Ngày tạo</small>
                        <strong>{{ $user->created_at->format('d/m/Y H:i') }}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Cập nhật lần cuối</small>
                        <strong>{{ $user->updated_at->format('d/m/Y H:i') }}</strong>
                    </div>
                    @if($user->email_verified_at)
                        <div>
                            <small class="text-muted d-block">Email đã xác thực</small>
                            <span class="badge bg-success">
                                <i class="fas fa-check me-1"></i>Đã xác thực
                            </span>
                        </div>
                    @else
                        <div>
                            <small class="text-muted d-block">Email chưa xác thực</small>
                            <span class="badge bg-warning">
                                <i class="fas fa-times me-1"></i>Chưa xác thực
                            </span>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <!-- Statistics -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <i class="fas fa-shopping-bag fa-2x text-primary mb-2"></i>
                            <h3 class="mb-0">0</h3>
                            <small class="text-muted">Đơn hàng</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <i class="fas fa-dollar-sign fa-2x text-success mb-2"></i>
                            <h3 class="mb-0">$0</h3>
                            <small class="text-muted">Tổng chi tiêu</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <i class="fas fa-star fa-2x text-warning mb-2"></i>
                            <h3 class="mb-0">0</h3>
                            <small class="text-muted">Đánh giá</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="card shadow-sm">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>Đơn hàng gần đây</h6>
                    <a href="#" class="btn btn-sm btn-primary">Xem tất cả</a>
                </div>
                <div class="card-body">
                    <div class="text-center py-5">
                        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Chưa có đơn hàng nào</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .avatar-large {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 2.5rem;
    }
</style>
@endsection
