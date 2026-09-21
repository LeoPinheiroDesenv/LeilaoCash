<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'category_id',
        'price',
        'image_url',
        'images',
        'brand',
        'model',
        'brand_id',
        'product_model_id',
        'specifications',
        'meta_keywords',
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug) && \Schema::hasColumn('products', 'slug')) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });

        static::updating(function ($product) {
            if (\Schema::hasColumn('products', 'slug') && $product->isDirty('name') && !$product->isDirty('slug')) {
                $product->slug = static::generateUniqueSlug($product->name, $product->id);
            }
        });
    }

    public static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base = Str::slug($name);
        if (empty($base)) {
            $base = 'produto';
        }
        $slug = $base;
        $i = 1;
        $query = static::withTrashed()->where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        while ($query->exists()) {
            $slug = $base . '-' . $i++;
            $query = static::withTrashed()->where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }
        return $slug;
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
     * Relacionamento com marca
     */
    public function brandModel()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    /**
     * Relacionamento com modelo
     */
    public function productModel()
    {
        return $this->belongsTo(ProductModel::class, 'product_model_id');
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

    // Relacionamento com Categoria
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }


    // Relacionamento com Marca
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }



}
