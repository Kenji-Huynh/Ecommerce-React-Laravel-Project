@extends('admin.layouts.app')

@section('title', 'Quản lý sản phẩm')

@section('content')
<div class="container-fluid">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="mb-1"><i class="fas fa-box me-2"></i>Danh sách sản phẩm</h2>
            <p class="text-muted mb-0">Quản lý tất cả sản phẩm của cửa hàng</p>
        </div>
        <a href="{{ route('admin.products.create') }}" class="btn btn-primary btn-lg">
            <i class="fas fa-plus me-2"></i>Thêm sản phẩm mới
        </a>
    </div>

    <!-- Alert Success -->
    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <!-- Products Card -->
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="mb-0">
                        <i class="fas fa-list me-2 text-primary"></i>
                        Tổng số: <span class="badge bg-primary">{{ $products->total() }}</span> sản phẩm
                    </h5>
                </div>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="text-center" style="width: 60px;">ID</th>
                            <th class="text-center" style="width: 80px;">Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th class="text-end">Giá</th>
                            <th class="text-center">Kho</th>
                            <th class="text-center">Trạng thái</th>
                            <th class="text-center" style="width: 150px;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($products as $product)
                            <tr>
                                <td class="text-center fw-bold">#{{ $product->id }}</td>
                                <td class="text-center">
                                    @if ($product->main_image)
                                        <img src="{{ $product->main_image }}" 
                                             alt="{{ $product->name }}" 
                                             class="rounded shadow-sm"
                                             width="60" 
                                             height="60" 
                                             style="object-fit: cover;" 
                                             onerror="this.src='/vite.svg'">
                                    @else
                                        <div class="bg-light rounded d-flex align-items-center justify-content-center" 
                                             style="width: 60px; height: 60px;">
                                            <i class="fas fa-image text-muted"></i>
                                        </div>
                                    @endif
                                </td>
                                <td>
                                    <strong>{{ $product->name }}</strong>
                                    @if($product->description)
                                        <br><small class="text-muted">{{ Str::limit($product->description, 50) }}</small>
                                    @endif
                                </td>
                                <td>
                                    <span class="badge bg-info">
                                        {{ $product->category->name ?? 'Không có' }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <strong class="text-success">${{ number_format($product->price, 2) }}</strong>
                                </td>
                                <td class="text-center">
                                    @if($product->stock_quantity > 10)
                                        <span class="badge bg-success">{{ $product->stock_quantity }}</span>
                                    @elseif($product->stock_quantity > 0)
                                        <span class="badge bg-warning text-dark">{{ $product->stock_quantity }}</span>
                                    @else
                                        <span class="badge bg-danger">0</span>
                                    @endif
                                </td>
                                <td class="text-center">
                                    @if ($product->in_stock)
                                        <span class="badge bg-success">
                                            <i class="fas fa-check-circle me-1"></i>Còn hàng
                                        </span>
                                    @else
                                        <span class="badge bg-danger">
                                            <i class="fas fa-times-circle me-1"></i>Hết hàng
                                        </span>
                                    @endif
                                </td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <a href="{{ route('admin.products.show', $product->id) }}" 
                                           class="btn btn-sm btn-info" 
                                           title="Xem chi tiết">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="{{ route('admin.products.edit', $product->id) }}" 
                                           class="btn btn-sm btn-primary"
                                           title="Chỉnh sửa">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <form action="{{ route('admin.products.destroy', $product->id) }}" 
                                              method="POST" 
                                              class="d-inline" 
                                              onsubmit="return confirm('Bạn có chắc muốn xóa sản phẩm này?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" 
                                                    class="btn btn-sm btn-danger"
                                                    title="Xóa">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="text-center py-5">
                                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <p class="text-muted mb-0">Chưa có sản phẩm nào</p>
                                    <a href="{{ route('admin.products.create') }}" class="btn btn-primary mt-3">
                                        <i class="fas fa-plus me-2"></i>Thêm sản phẩm đầu tiên
                                    </a>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Pagination -->
        @if($products->hasPages())
        <div class="card-footer bg-white border-top">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-muted small">
                    Hiển thị <strong>{{ $products->firstItem() }}</strong> 
                    đến <strong>{{ $products->lastItem() }}</strong> 
                    trong tổng số <strong>{{ $products->total() }}</strong> sản phẩm
                </div>
                <div>
                    {{ $products->links() }}
                </div>
            </div>
        </div>
        @endif
    </div>
</div>
@endsection