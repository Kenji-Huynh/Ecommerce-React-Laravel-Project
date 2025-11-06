<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'compare_price',
        'discount', 'sku', 'is_new', 'is_featured', 'in_stock',
        'stock_quantity', 'main_image', 'category_id',
        'sizes', 'colors', 'tags', 'material', 'origin', 'rating', 'reviews_count'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'is_new' => 'boolean',
        'is_featured' => 'boolean',
        'in_stock' => 'boolean',
        'sizes' => 'array',
        'colors' => 'array',
        'tags' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}