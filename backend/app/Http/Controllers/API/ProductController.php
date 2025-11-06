<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Lấy danh sách sản phẩm với bộ lọc
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Lọc theo danh mục
        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Lọc theo giá
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Lọc theo sản phẩm nổi bật
        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        // Lọc theo sản phẩm mới
        if ($request->has('new') && $request->new) {
            $query->where('is_new', true);
        }

        // Lọc theo từ khóa tìm kiếm
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sắp xếp
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'popularity':
                    $query->orderBy('reviews_count', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Lấy sản phẩm với phân trang
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        // Không cần transform URL nữa, để nguyên path (Cloudinary hoặc storage)
        return response()->json($products);
    }

    /**
     * Lấy thông tin chi tiết sản phẩm
     */
    public function show(Product $product)
    {
        $product->load('category', 'images');
        
        // Lấy sản phẩm liên quan (cùng danh mục)
        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->inRandomOrder()
            ->take(4)
            ->get();

        return response()->json([
            'product' => $product,
            'related_products' => $relatedProducts
        ]);
    }
}
