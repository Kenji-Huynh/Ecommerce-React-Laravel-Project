@extends('admin.layouts.app')

@section('title', 'Quản lý người dùng')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-users me-2"></i>Danh sách người dùng</h2>
        <a href="{{ route('admin.users.create') }}" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>Thêm người dùng
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <div class="card shadow-sm">
        <div class="card-body">
            <!-- Search and Filter -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <form method="GET" action="{{ route('admin.users.index') }}">
                        <div class="input-group">
                            <input type="text" name="search" class="form-control" placeholder="Tìm kiếm theo tên hoặc email..." value="{{ request('search') }}">
                            <button class="btn btn-outline-secondary" type="submit">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div class="col-md-6 text-end">
                    <span class="text-muted">Tổng: <strong>{{ $users->total() }}</strong> người dùng</span>
                </div>
            </div>

            <!-- Users Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 5%">#</th>
                            <th style="width: 25%">Tên</th>
                            <th style="width: 25%">Email</th>
                            <th style="width: 15%">Vai trò</th>
                            <th style="width: 15%">Ngày tạo</th>
                            <th style="width: 15%" class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($users as $user)
                            <tr>
                                <td>{{ $users->firstItem() + $loop->index }}</td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-circle me-2">
                                            {{ strtoupper(substr($user->name, 0, 1)) }}
                                        </div>
                                        <strong>{{ $user->name }}</strong>
                                    </div>
                                </td>
                                <td>
                                    <i class="fas fa-envelope text-muted me-2"></i>
                                    {{ $user->email }}
                                </td>
                                <td>
                                    @if($user->role === 'admin')
                                        <span class="badge bg-danger">
                                            <i class="fas fa-crown me-1"></i>Admin
                                        </span>
                                    @else
                                        <span class="badge bg-secondary">
                                            <i class="fas fa-user me-1"></i>User
                                        </span>
                                    @endif
                                </td>
                                <td>
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>
                                        {{ $user->created_at->format('d/m/Y') }}
                                    </small>
                                </td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <a href="{{ route('admin.users.show', $user->id) }}" 
                                           class="btn btn-sm btn-info" 
                                           title="Xem chi tiết">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="{{ route('admin.users.edit', $user->id) }}" 
                                           class="btn btn-sm btn-warning" 
                                           title="Chỉnh sửa">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <form action="{{ route('admin.users.destroy', $user->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Bạn có chắc chắn muốn xóa người dùng này?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" 
                                                    class="btn btn-sm btn-danger" 
                                                    title="Xóa"
                                                    {{ $user->id === auth()->id() ? 'disabled' : '' }}>
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-4">
                                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <p class="text-muted">Không có người dùng nào</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($users->hasPages())
            <div class="mt-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                        Hiển thị <strong>{{ $users->firstItem() }}</strong> 
                        đến <strong>{{ $users->lastItem() }}</strong> 
                        trong tổng số <strong>{{ $users->total() }}</strong> người dùng
                    </div>
                    <div>
                        {{ $users->links() }}
                    </div>
                </div>
            </div>
            @endif
        </div>
    </div>
</div>

<style>
    .avatar-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
    }
    
    .table-hover tbody tr:hover {
        background-color: #f8f9fa;
        cursor: pointer;
    }
    
    .btn-group .btn {
        margin: 0 2px;
    }
</style>
@endsection
