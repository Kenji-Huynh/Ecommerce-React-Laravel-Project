<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

// Root: auto-detect session login and send to admin dashboard or admin login
Route::get('/', function () {
    if (auth()->check()) {
        // Nếu là admin -> vào dashboard, nếu không -> logout để tránh vòng lặp guest và vào trang login admin
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
    return redirect()->route('admin.login');
});

Route::prefix('admin')->name('admin.')->group(function () {
    // Các route không cần xác thực
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
        Route::post('/register', [AuthController::class, 'register']);
    });
    
    // Các route cần xác thực admin
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        
        // Các route quản lý sản phẩm
        Route::resource('products', AdminProductController::class);
        
        // Các route quản lý danh mục
        Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class);
        
        // Các route quản lý đơn hàng
        Route::resource('orders', App\Http\Controllers\Admin\OrderController::class);
        
        // Các route quản lý người dùng
        Route::resource('users', App\Http\Controllers\Admin\UserController::class);
    });
});