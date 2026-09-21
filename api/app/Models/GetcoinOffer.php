<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GetcoinOffer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'buyer_id',
        'amount',
        'price_per_unit',
        'total_price',
        'status',
        'sold_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'price_per_unit' => 'decimal:2',
        'total_price' => 'decimal:2',
        'sold_at' => 'datetime',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
