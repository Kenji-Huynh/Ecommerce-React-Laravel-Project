@extends('admin.layouts.app')

@section('title', 'Kho ảnh')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Kho ảnh</h2>
        <a href="{{ route('admin.products.index') }}" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Quay lại sản phẩm</a>
    </div>

    @if (session('success')) <div class="alert alert-success">{{ session('success') }}</div> @endif
    @if ($errors->any()) <div class="alert alert-danger"><ul class="mb-0">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div> @endif

    <div class="card mb-3">
        <div class="card-body">
            <form action="{{ route('admin.media.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="d-flex gap-2">
                    <input type="file" class="form-control" name="files[]" accept="image/*" multiple required>
                    <button class="btn btn-primary"><i class="fas fa-upload"></i> Tải ảnh</button>
                </div>
            </form>
        </div>
    </div>

    <div class="row g-3">
        @foreach($items as $m)
        <div class="col-6 col-sm-4 col-md-3 col-lg-2">
            <div class="border rounded p-1 h-100 d-flex flex-column">
                <img src="{{ asset('storage/' . $m->file_path) }}" class="img-fluid" style="aspect-ratio:1/1;object-fit:cover">
                <small class="text-truncate mt-2">{{ $m->file_name }}</small>
                <form action="{{ route('admin.media.destroy', $m->id) }}" method="POST" class="mt-2">
                    @csrf @method('DELETE')
                    <button class="btn btn-sm btn-outline-danger w-100" onclick="return confirm('Xóa ảnh này?')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </form>
            </div>
        </div>
        @endforeach
    </div>

    <div class="mt-// filepath: c:\xampp\htdocs\ecommerce\backend\resources\views\admin\media\index.blade.php
@extends('admin.layouts.app')

@section('title', 'Kho ảnh')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Kho ảnh</h2>
        <a href="{{ route('admin.products.index') }}" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Quay lại sản phẩm</a>
    </div>

    @if (session('success')) <div class="alert alert-success">{{ session('success') }}</div> @endif
    @if ($errors->any()) <div class="alert alert-danger"><ul class="mb-0">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div> @endif

    <div class="card mb-3">
        <div class="card-body">
            <form action="{{ route('admin.media.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="d-flex gap-2">
                    <input type="file" class="form-control" name="files[]" accept="image/*" multiple required>
                    <button class="btn btn-primary"><i class="fas fa-upload"></i> Tải ảnh</button>
                </div>
            </form>
        </div>
    </div>

    <div class="row g-3">
        @foreach($items as $m)
        <div class="col-6 col-sm-4 col-md-3 col-lg-2">
            <div class="border rounded p-1 h-100 d-flex flex-column">
                <img src="{{ asset('storage/' . $m->file_path) }}" class="img-fluid" style="aspect-ratio:1/1;object-fit:cover">
                <small class="text-truncate mt-2">{{ $m->file_name }}</small>
                <form action="{{ route('admin.media.destroy', $m->id) }}" method="POST" class="mt-2">
                    @csrf @method('DELETE')
                    <button class="btn btn-sm btn-outline-danger w-100" onclick="return confirm('Xóa ảnh này?')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </form>
            </div>
        </div>
        @endforeach
    </div>

    <div class="mt-