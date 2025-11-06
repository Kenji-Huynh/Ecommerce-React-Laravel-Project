<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/user/change-password', [AuthController::class, 'changePassword']);

// Public routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::get('/user/orders', [OrderController::class, 'userOrders']);

    // Cart routes
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart', [CartController::class, 'destroy']);

    // Payments
    Route::post('/payments/create-intent', [PaymentController::class, 'createIntent']);
});