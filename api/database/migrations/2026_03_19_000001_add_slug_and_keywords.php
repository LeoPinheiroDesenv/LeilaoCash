<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // Products: slug + meta_keywords
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
            $table->string('meta_keywords', 500)->nullable()->after('specifications');
        });

        // Categories: meta_keywords
        Schema::table('categories', function (Blueprint $table) {
            $table->string('meta_keywords', 500)->nullable()->after('description');
        });

        // Brands: slug + meta_keywords
        Schema::table('brands', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
            $table->string('meta_keywords', 500)->nullable()->after('slug');
        });

        // Auctions: meta_keywords
        Schema::table('auctions', function (Blueprint $table) {
            $table->string('meta_keywords', 500)->nullable()->after('description');
        });

        // Gerar slugs para produtos existentes
        $products = \App\Models\Product::withTrashed()->get();
        foreach ($products as $product) {
            $base = Str::slug($product->name);
            $slug = $base;
            $i = 1;
            while (\App\Models\Product::withTrashed()->where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $base . '-' . $i++;
            }
            $product->slug = $slug;
            $product->saveQuietly();
        }

        // Gerar slugs para marcas existentes
        $brands = \App\Models\Brand::all();
        foreach ($brands as $brand) {
            $base = Str::slug($brand->name);
            $slug = $base;
            $i = 1;
            while (\App\Models\Brand::where('slug', $slug)->where('id', '!=', $brand->id)->exists()) {
                $slug = $base . '-' . $i++;
            }
            $brand->slug = $slug;
            $brand->saveQuietly();
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['slug', 'meta_keywords']);
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('meta_keywords');
        });
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn(['slug', 'meta_keywords']);
        });
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropColumn('meta_keywords');
        });
    }
};
