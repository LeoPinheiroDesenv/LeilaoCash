<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Smartphones',
                'slug' => 'smartphones',
                'description' => 'Celulares e smartphones das melhores marcas',
                'icon' => '📱',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Notebooks',
                'slug' => 'notebooks',
                'description' => 'Laptops e notebooks para trabalho e entretenimento',
                'icon' => '💻',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Games',
                'slug' => 'games',
                'description' => 'Consoles, jogos e acessórios para gamers',
                'icon' => '🎮',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Áudio',
                'slug' => 'audio',
                'description' => 'Fones de ouvido, caixas de som e equipamentos de áudio',
                'icon' => '🎧',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Wearables',
                'slug' => 'wearables',
                'description' => 'Smartwatches, relógios inteligentes e dispositivos vestíveis',
                'icon' => '⌚',
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

