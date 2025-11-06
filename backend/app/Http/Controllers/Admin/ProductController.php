<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Hiển thị danh sách sản phẩm
     */
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    /**
     * Hiển thị form tạo sản phẩm mới
     */
    public function create()
    {
        $categories = Category::pluck('name', 'id'); // tránh where is_active
        return view('admin.products.create', compact('categories'));
    }

    /**
     * Lưu sản phẩm mới vào database
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'main_image' => ['required', 'url', 'regex:/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i'],
            'additional_images' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|max:50|unique:products',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
        ]);

        $mainImagePath = $request->main_image; // Lưu trực tiếp URL
        $tags = $request->filled('tags') ? array_map('trim', explode(',', $request->tags)) : null;

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'discount' => $request->compare_price && $request->compare_price > 0
                ? round((($request->compare_price - $request->price) / $request->compare_price) * 100)
                : 0,
            'sku' => $request->sku ?: 'PW-' . rand(10000, 99999),
            'main_image' => $mainImagePath,
            'stock_quantity' => $request->stock_quantity,
            'is_featured' => $request->boolean('is_featured'),
            'is_new' => $request->boolean('is_new'),
            'in_stock' => $request->boolean('in_stock', true),
            'sizes' => $request->sizes,
            'colors' => $request->colors,
            'tags' => $tags,
        ]);

        // Xử lý link hình ảnh bổ sung (mỗi dòng là một link)
        if ($request->filled('additional_images')) {
            $imageLinks = array_filter(array_map('trim', explode("\n", $request->additional_images)));
            foreach ($imageLinks as $imageUrl) {
                if (filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imageUrl,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Tạo sản phẩm thành công.');
    }

    /**
     * Hiển thị chi tiết sản phẩm
     */
    public function show(Product $product)
    {
        $product->load('category', 'images');
        return view('admin.products.show', compact('product'));
    }

    /**
     * Hiển thị form chỉnh sửa sản phẩm
     */
    public function edit(Product $product)
    {
        $categories = Category::pluck('name', 'id');
        $product->load('images');
        return view('admin.products.edit', compact('product', 'categories'));
    }

    /**
     * Cập nhật sản phẩm trong database
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'main_image' => ['nullable', 'url', 'regex:/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i'],
            'additional_images' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|max:50|unique:products,sku,' . $product->id,
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
        ]);

        // Cập nhật main_image nếu có URL mới
        if ($request->filled('main_image')) {
            $product->main_image = $request->main_image;
        }

        $tags = $request->filled('tags') ? array_map('trim', explode(',', $request->tags)) : null;

        $product->fill([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'discount' => $request->compare_price && $request->compare_price > 0
                ? round((($request->compare_price - $request->price) / $request->compare_price) * 100)
                : 0,
            'sku' => $request->sku ?: $product->sku,
            'stock_quantity' => $request->stock_quantity,
            'is_featured' => $request->boolean('is_featured'),
            'is_new' => $request->boolean('is_new'),
            'in_stock' => $request->boolean('in_stock'),
            'sizes' => $request->sizes,
            'colors' => $request->colors,
            'tags' => $tags,
        ])->save();

        // Xử lý link hình ảnh bổ sung (mỗi dòng là một link)
        if ($request->filled('additional_images')) {
            $imageLinks = array_filter(array_map('trim', explode("\n", $request->additional_images)));
            foreach ($imageLinks as $imageUrl) {
                if (filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imageUrl,
                    ]);
                }
            }
        }

        if ($request->filled('delete_images')) {
            foreach ($request->delete_images as $imageId) {
                $img = ProductImage::find($imageId);
                if ($img) {
                    Storage::disk('cloudinary')->delete($img->image_path);
                    $img->delete();
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Cập nhật sản phẩm thành công.');
    }

    /**
     * Xóa sản phẩm khỏi database
     */
    public function destroy(Product $product)
    {
        // Không cần xóa file vì chỉ lưu URL
        // Chỉ xóa record trong database
        foreach ($product->images as $img) {
            $img->delete();
        }
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Đã xóa sản phẩm.');
    }
}
