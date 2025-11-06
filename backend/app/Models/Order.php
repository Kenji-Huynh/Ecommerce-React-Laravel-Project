<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'status', 'subtotal', 'tax', 'shipping',
        'discount', 'total', 'payment_method', 'payment_status',
        'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address',
        'shipping_city', 'shipping_state', 'shipping_zipcode', 'shipping_country',
        'notes'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}