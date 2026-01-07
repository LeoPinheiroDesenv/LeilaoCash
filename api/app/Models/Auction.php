<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Auction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'start_date',
        'end_date',
        'starting_bid',
        'current_bid',
        'bid_increment',
        'min_bids',
        'bids_count',
        'cashback_percentage',
        'winner_id',
        'product_id', // Adicionado product_id que estava faltando no fillable
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'starting_bid' => 'decimal:2',
            'current_bid' => 'decimal:2',
            'bid_increment' => 'decimal:2',
            'cashback_percentage' => 'decimal:2',
            'bids_count' => 'integer',
        ];
    }

    /**
     * Relacionamento com produtos
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Relacionamento com o produto principal (se houver)
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relacionamento com vencedor
     */
    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    /**
     * Relacionamento com lances
     */
    public function bids()
    {
        return $this->hasMany(Bid::class);
    }
}
