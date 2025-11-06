@extends('admin.layouts.app')

@section('title', 'Chi tiết sản phẩm')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Chi tiết sản phẩm</h2>
        <div>
            <a href="{{ route('admin.products.edit', $product->id) }}" class="btn btn-primary">
                <i class="fas fa-edit"></i> Chỉnh sửa
            </a>
            <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Quay lại
            </a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card mb-4">
                <div class="card-body">
                    <p><strong>Tên:</strong> {{ $product->name }}</p>
                    <p><strong>SKU:</strong> {{ $product->sku }}</p>
                    <p><strong>Danh mục:</strong> {{ $product->category->name ?? 'Không có' }}</p>
                    <p><strong>Giá:</strong> ${{ number_format($product->price, 2) }}</p>
                    <p><strong>Giá so sánh:</strong> {{ $product->compare_price ? '$'.number_format($product->compare_price,2) : 'Không có' }}</p>
                    <p><strong>Giảm giá:</strong> {{ $product->discount }}%</p>
                    <p><strong>Tồn kho:</strong> {{ $product->stock_quantity }}</p>
                    <p><strong>Trạng thái:</strong> {!! $product->in_stock ? '<span class="badge bg-success">Còn hàng</span>' : '<span class="badge bg-danger">Hết hàng</span>' !!}</p>
                    <p><strong>Mô tả:</strong></p>
                    <div>{!! nl2br(e($product->description)) !!}</div>
                    <p class="mt-3"><strong>Kích thước:</strong>
                        @if($product->sizes) @foreach($product->sizes as $s) <span class="badge bg-secondary me-1">{{ $s }}</span> @endforeach @else N/A @endif
                    </p>
                    <p><strong>Màu sắc:</strong>
                        @if($product->colors) @foreach($product->colors as $c) <span class="badge me-1" style="background: {{ strtolower($c) }};color:#fff">{{ $c }}</span> @endforeach @else N/A @endif
                    </p>
                    <p><strong>Tags:</strong>
                        @if($product->tags) @foreach($product->tags as $t) <span class="badge bg-info me-1">{{ $t }}</span> @endforeach @else N/A @endif
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card mb-4">
                <div class="card-body">
                    <h6>Hình ảnh chính</h6>
                    @if($product->main_image)
                        <img src="{{ $product->main_image }}" class="img-fluid img-thumbnail" onerror="this.src='/vite.svg'" />
                    @else
                        <p class="text-muted">Không có hình</p>
                    @endif>

                    @if($product->images->count())
                        <h6 class="mt-4">Hình ảnh bổ sung</h6>
                        <div class="row g-2">
                            @foreach($product->images as $img)
                                <div class="col-6">
                                    <img src="{{ asset('storage/' . $img->image_path) }}" class="img-fluid img-thumbnail" />
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection