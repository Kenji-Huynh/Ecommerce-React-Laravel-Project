@extends('admin.layouts.app')

@section('title', 'Thêm sản phẩm mới')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Thêm sản phẩm mới</h2>
        <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Quay lại
        </a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="row">
                    <div class="col-md-8">
                        <div class="mb-3">
                            <label for="name" class="form-label">Tên sản phẩm <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}" required>
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Mô tả</label>
                            <textarea class="form-control" id="description" name="description" rows="5">{{ old('description') }}</textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="price" class="form-label">Giá <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input type="number" class="form-control" id="price" name="price" value="{{ old('price') }}" min="0" step="0.01" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="compare_price" class="form-label">Giá so sánh</label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input type="number" class="form-control" id="compare_price" name="compare_price" value="{{ old('compare_price') }}" min="0" step="0.01">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="sku" class="form-label">SKU</label>
                                    <input type="text" class="form-control" id="sku" name="sku" value="{{ old('sku') }}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="stock_quantity" class="form-label">Số lượng <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="stock_quantity" name="stock_quantity" value="{{ old('stock_quantity', 0) }}" min="0" required>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="category_id" class="form-label">Danh mục <span class="text-danger">*</span></label>
                            <select class="form-select" id="category_id" name="category_id" required>
                                <option value="">-- Chọn danh mục --</option>
                                @foreach($categories as $id => $name)
                                    <option value="{{ $id }}" {{ old('category_id') == $id ? 'selected' : '' }}>{{ $name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="main_image" class="form-label">Link hình ảnh chính <span class="text-danger">*</span></label>
                            <input type="url" class="form-control" id="main_image" name="main_image" placeholder="https://example.com/image.jpg" required>
                            <small class="text-muted">Hỗ trợ: .jpg, .png, .webp, .avif, .gif, .svg</small>
                        </div>

                        <div class="mb-3">
                            <label for="additional_images" class="form-label">Link hình ảnh bổ sung</label>
                            <textarea class="form-control" id="additional_images" name="additional_images" rows="3" placeholder="Nhập các link ảnh, mỗi link một dòng&#10;https://example.com/image1.jpg&#10;https://example.com/image2.avif"></textarea>
                            <small class="text-muted">Nhập mỗi link ảnh trên một dòng</small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Kích thước</label>
                            <div class="d-flex flex-wrap gap-2">
                                @foreach(['S', 'M', 'L', 'XL', 'XXL'] as $size)
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="sizes[]" value="{{ $size }}" id="size-{{ $size }}">
                                        <label class="form-check-label" for="size-{{ $size }}">{{ $size }}</label>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Màu sắc</label>
                            <div class="d-flex flex-wrap gap-2">
                                @foreach(['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Purple', 'Pink', 'Gray'] as $color)
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="colors[]" value="{{ $color }}" id="color-{{ $color }}">
                                        <label class="form-check-label" for="color-{{ $color }}">{{ $color }}</label>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Thông tin thêm</label>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="is_featured" name="is_featured" value="1" {{ old('is_featured') ? 'checked' : '' }}>
                                <label class="form-check-label" for="is_featured">Sản phẩm nổi bật</label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="is_new" name="is_new" value="1" {{ old('is_new') ? 'checked' : '' }}>
                                <label class="form-check-label" for="is_new">Sản phẩm mới</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="in_stock" name="in_stock" value="1" {{ old('in_stock', '1') ? 'checked' : '' }}>
                                <label class="form-check-label" for="in_stock">Còn hàng</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="tags" class="form-label">Tags</label>
                    <input type="text" class="form-control" id="tags" name="tags" value="{{ old('tags') }}" placeholder="Nhập các tag cách nhau bởi dấu phẩy">
                </div>

                <div class="mb-3">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Lưu sản phẩm
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection