<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Revenue extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'amount',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public $timestamps = false;

    public static function addAmount($date, float $amount): void
    {
        $date = $date instanceof Carbon ? $date->toDateString() : (string) $date;
        $row = static::firstOrCreate(['date' => $date], ['amount' => 0]);
        $row->amount = (float) $row->amount + max(0, $amount);
        $row->save();
    }

    public static function subtractAmount($date, float $amount): void
    {
        $date = $date instanceof Carbon ? $date->toDateString() : (string) $date;
        $row = static::firstOrCreate(['date' => $date], ['amount' => 0]);
        $row->amount = max(0, (float) $row->amount - max(0, $amount));
        $row->save();
    }
}
