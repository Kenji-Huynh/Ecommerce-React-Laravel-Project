@extends('admin.layouts.app')

@section('title', 'Chỉnh sửa sản phẩm')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Chỉnh sửa sản phẩm</h2>
        <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Quay lại
        </a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $e)
                    <li>{{ $e }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="row">
                    <div class="col-md-8">
                        <div class="mb-3">
                            <label class="form-label">Tên sản phẩm</label>
                            <input type="text" class="form-control" name="name" value="{{ old('name', $product->name) }}" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" name="description" rows="5">{{ old('description', $product->description) }}</textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giá</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" class="form-control" name="price" value="{{ old('price', $product->price) }}" min="0" step="0.01" required>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giá so sánh</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" class="form-control" name="compare_price" value="{{ old('compare_price', $product->compare_price) }}" min="0" step="0.01">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">SKU</label>
                                <input type="text" class="form-control" name="sku" value="{{ old('sku', $product->sku) }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Số lượng</label>
                                <input type="number" class="form-control" name="stock_quantity" value="{{ old('stock_quantity', $product->stock_quantity) }}" min="0" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Danh mục</label>
                            <select class="form-select" name="category_id" required>
                                <option value="">-- Chọn danh mục --</option>
                                @foreach($categories as $id => $name)
                                    <option value="{{ $id }}" {{ old('category_id', $product->category_id) == $id ? 'selected' : '' }}>{{ $name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Link hình ảnh chính</label>
                            @if($product->main_image)
                                <div class="mb-2"><img src="{{ $product->main_image }}" class="img-thumbnail" style="max-height:150px" onerror="this.src='/vite.svg'"></div>
                            @endif
                            <input type="url" class="form-control" name="main_image" value="{{ $product->main_image }}" placeholder="https://example.com/image.jpg">
                            <small class="text-muted">Hỗ trợ: .jpg, .png, .webp, .avif, .gif, .svg</small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Thêm link hình ảnh bổ sung</label>
                            <textarea class="form-control" name="additional_images" rows="3" placeholder="Nhập các link ảnh, mỗi link một dòng&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
                            <small class="text-muted">Nhập mỗi link ảnh trên một dòng</small>
                        </div>

                        @if($product->images->count())
                            <div class="mb-3">
                                <label class="form-label">Hình ảnh bổ sung hiện tại</label>
                                <div class="row g-2">
                                    @foreach($product->images as $image)
                                        <div class="col-6">
                                            <div class="position-relative">
                                                <img src="{{ asset('storage/' . $image->image_path) }}" class="img-thumbnail" style="height:100px;object-fit:cover;">
                                                <div class="form-check position-absolute top-0 end-0 m-1 bg-white rounded-circle p-1">
                                                    <input class="form-check-input" type="checkbox" name="delete_images[]" value="{{ $image->id }}">
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                                <small class="text-muted">Đánh dấu hình muốn xóa</small>
                            </div>
                        @endif

                        <div class="mb-3">
                            <label class="form-label">Kích thước</label>
                            <div class="d-flex flex-wrap gap-2">
                                @foreach(['S','M','L','XL','XXL'] as $size)
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="sizes[]" value="{{ $size }}" {{ in_array($size, old('sizes', $product->sizes ?? [])) ? 'checked' : '' }}>
                                        <label class="form-check-label">{{ $size }}</label>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Màu sắc</label>
                            <div class="d-flex flex-wrap gap-2">
                                @foreach(['Black','White','Red','Blue','Green','Yellow','Brown','Purple','Pink','Gray'] as $color)
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="colors[]" value="{{ $color }}" {{ in_array($color, old('colors', $product->colors ?? [])) ? 'checked' : '' }}>
                                        <label class="form-check-label">{{ $color }}</label>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Thông tin thêm</label>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" name="is_featured" value="1" {{ old('is_featured', $product->is_featured) ? 'checked' : '' }}>
                                <label class="form-check-label">Sản phẩm nổi bật</label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" name="is_new" value="1" {{ old('is_new', $product->is_new) ? 'checked' : '' }}>
                                <label class="form-check-label">Sản phẩm mới</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="in_stock" value="1" {{ old('in_stock', $product->in_stock) ? 'checked' : '' }}>
                                <label class="form-check-label">Còn hàng</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Tags</label>
                    <input type="text" class="form-control" name="tags" value="{{ old('tags', $product->tags ? implode(', ', $product->tags) : '') }}" placeholder="tag1, tag2">
                </div>

                <button class="btn btn-primary"><i class="fas fa-save"></i> Cập nhật</button>
            </form>
        </div>
    </div>
</div>
@endsection