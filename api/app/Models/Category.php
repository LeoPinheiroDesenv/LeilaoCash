<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'name_en',
        'name_es',
        'slug',
        'description',
        'meta_keywords',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = static::uniqueSlug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = static::uniqueSlug($category->name, $category->id);
            }
        });

        // Libera o slug ao excluir (soft delete), pois a constraint unique de `slug`
        // ignora o `deleted_at` e bloqueava a criação de uma nova categoria com o mesmo nome.
        // Mesmo sufixo usado pela migration 2026_09_29_000001 nas categorias já excluídas.
        static::deleting(function ($category) {
            if (!$category->isForceDeleting()) {
                $freedSlug = $category->slug . '-deleted-' . $category->id;
                \Illuminate\Support\Facades\DB::table('categories')
                    ->where('id', $category->id)
                    ->update(['slug' => $freedSlug]);
                $category->slug = $freedSlug;
            }
        });
    }

    /**
     * Gera um slug a partir do nome que ainda não esteja em uso (inclusive por
     * categorias excluídas, já que o índice unique do banco não ignora deleted_at).
     */
    public static function uniqueSlug(string $name, $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'categoria';
        $slug = $base;
        $suffix = 2;

        while (static::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }

    /**
     * Relacionamento com produtos
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

