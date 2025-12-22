<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'category',
        'category_id',
        'price',
        'image_url',
        'images',
        'brand',
        'model',
        'specifications',
        'is_active',
        'auction_id',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'images' => 'array',
            'specifications' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relacionamento com leilão
     */
    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Relacionamento com categoria
     */
    public function categoryModel()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relacionamento com favoritos
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Verificar se o produto está disponível para leilão
     */
    public function isAvailableForAuction(): bool
    {
        return $this->is_active && $this->auction_id === null;
    }
}

