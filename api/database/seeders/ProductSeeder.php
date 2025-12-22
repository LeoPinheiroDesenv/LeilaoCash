<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $products = [
            // Smartphones
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'description' => 'O mais recente iPhone da Apple, com o chip A17 Bionic, sistema de câmera Pro e uma tela Super Retina XDR com ProMotion.',
                'category' => 'smartphones',
                'category_id' => $categories['smartphones']->id ?? null,
                'price' => 9999.00,
                'brand' => 'Apple',
                'model' => 'iPhone 15 Pro Max',
                'is_active' => true,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Experimente o poder da Galaxy AI. O S24 Ultra vem com a S Pen integrada e uma câmera de 200MP para fotos incríveis.',
                'category' => 'smartphones',
                'category_id' => $categories['smartphones']->id ?? null,
                'price' => 8999.00,
                'brand' => 'Samsung',
                'model' => 'Galaxy S24 Ultra',
                'is_active' => true,
            ],
            [
                'name' => 'Xiaomi 14 Pro',
                'description' => 'Smartphone premium com processador Snapdragon 8 Gen 3 e câmera Leica de 50MP.',
                'category' => 'smartphones',
                'category_id' => $categories['smartphones']->id ?? null,
                'price' => 5999.00,
                'brand' => 'Xiaomi',
                'model' => '14 Pro',
                'is_active' => true,
            ],
            [
                'name' => 'Google Pixel 8 Pro',
                'description' => 'O melhor do Android com inteligência artificial integrada e câmera profissional.',
                'category' => 'smartphones',
                'category_id' => $categories['smartphones']->id ?? null,
                'price' => 6999.00,
                'brand' => 'Google',
                'model' => 'Pixel 8 Pro',
                'is_active' => true,
            ],
            [
                'name' => 'OnePlus 12',
                'description' => 'Performance extrema com Snapdragon 8 Gen 3 e carregamento rápido de 100W.',
                'category' => 'smartphones',
                'category_id' => $categories['smartphones']->id ?? null,
                'price' => 5499.00,
                'brand' => 'OnePlus',
                'model' => '12',
                'is_active' => true,
            ],

            // Notebooks
            [
                'name' => 'MacBook Pro M3 14"',
                'description' => 'O MacBook Pro com chip M3 oferece desempenho incrível para tarefas profissionais. Possui tela Liquid Retina XDR e bateria para o dia todo.',
                'category' => 'notebooks',
                'category_id' => $categories['notebooks']->id ?? null,
                'price' => 16999.00,
                'brand' => 'Apple',
                'model' => 'MacBook Pro M3',
                'is_active' => true,
            ],
            [
                'name' => 'Dell XPS 15',
                'description' => 'Notebook premium com tela OLED 4K, processador Intel Core i9 e placa de vídeo dedicada.',
                'category' => 'notebooks',
                'category_id' => $categories['notebooks']->id ?? null,
                'price' => 12999.00,
                'brand' => 'Dell',
                'model' => 'XPS 15',
                'is_active' => true,
            ],
            [
                'name' => 'Lenovo ThinkPad X1 Carbon',
                'description' => 'Ultrabook empresarial com tela 14" 4K, processador Intel Core i7 e 32GB de RAM.',
                'category' => 'notebooks',
                'category_id' => $categories['notebooks']->id ?? null,
                'price' => 11999.00,
                'brand' => 'Lenovo',
                'model' => 'ThinkPad X1 Carbon',
                'is_active' => true,
            ],
            [
                'name' => 'ASUS ROG Zephyrus G16',
                'description' => 'Notebook gamer com RTX 4070, processador Intel Core i9 e tela 16" 165Hz.',
                'category' => 'notebooks',
                'category_id' => $categories['notebooks']->id ?? null,
                'price' => 14999.00,
                'brand' => 'ASUS',
                'model' => 'ROG Zephyrus G16',
                'is_active' => true,
            ],
            [
                'name' => 'HP Spectre x360',
                'description' => 'Notebook 2-em-1 com tela touch OLED 4K, processador Intel Core i7 e design premium.',
                'category' => 'notebooks',
                'category_id' => $categories['notebooks']->id ?? null,
                'price' => 10999.00,
                'brand' => 'HP',
                'model' => 'Spectre x360',
                'is_active' => true,
            ],

            // Games
            [
                'name' => 'PlayStation 5 Digital',
                'description' => 'Console de videogame da nova geração com SSD ultrarrápido e gráficos em 4K.',
                'category' => 'games',
                'category_id' => $categories['games']->id ?? null,
                'price' => 3999.00,
                'brand' => 'Sony',
                'model' => 'PlayStation 5',
                'is_active' => true,
            ],
            [
                'name' => 'Xbox Series X',
                'description' => 'O console mais poderoso da Microsoft com suporte a 4K 120fps e ray tracing.',
                'category' => 'games',
                'category_id' => $categories['games']->id ?? null,
                'price' => 4499.00,
                'brand' => 'Microsoft',
                'model' => 'Xbox Series X',
                'is_active' => true,
            ],
            [
                'name' => 'Nintendo Switch OLED',
                'description' => 'Console híbrido com tela OLED de 7 polegadas e bateria melhorada.',
                'category' => 'games',
                'category_id' => $categories['games']->id ?? null,
                'price' => 2499.00,
                'brand' => 'Nintendo',
                'model' => 'Switch OLED',
                'is_active' => true,
            ],
            [
                'name' => 'Steam Deck',
                'description' => 'Handheld gaming PC com AMD Zen 2 e GPU RDNA 2 para jogar seus jogos Steam em qualquer lugar.',
                'category' => 'games',
                'category_id' => $categories['games']->id ?? null,
                'price' => 3299.00,
                'brand' => 'Valve',
                'model' => 'Steam Deck',
                'is_active' => true,
            ],
            [
                'name' => 'Meta Quest 3',
                'description' => 'Headset de realidade virtual com processador Snapdragon XR2 Gen 2 e visão mista.',
                'category' => 'games',
                'category_id' => $categories['games']->id ?? null,
                'price' => 3499.00,
                'brand' => 'Meta',
                'model' => 'Quest 3',
                'is_active' => true,
            ],

            // Áudio
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Fones de ouvido com cancelamento de ruído líder de classe e som de alta qualidade.',
                'category' => 'audio',
                'category_id' => $categories['audio']->id ?? null,
                'price' => 2499.00,
                'brand' => 'Sony',
                'model' => 'WH-1000XM5',
                'is_active' => true,
            ],
            [
                'name' => 'Apple AirPods Pro 2',
                'description' => 'Fones de ouvido com cancelamento de ruído ativo e áudio espacial personalizado.',
                'category' => 'audio',
                'category_id' => $categories['audio']->id ?? null,
                'price' => 1999.00,
                'brand' => 'Apple',
                'model' => 'AirPods Pro 2',
                'is_active' => true,
            ],
            [
                'name' => 'Bose QuietComfort Ultra',
                'description' => 'Fones de ouvido premium com cancelamento de ruído adaptativo e som imersivo.',
                'category' => 'audio',
                'category_id' => $categories['audio']->id ?? null,
                'price' => 2299.00,
                'brand' => 'Bose',
                'model' => 'QuietComfort Ultra',
                'is_active' => true,
            ],
            [
                'name' => 'JBL Flip 6',
                'description' => 'Caixa de som Bluetooth portátil com som potente e à prova d\'água.',
                'category' => 'audio',
                'category_id' => $categories['audio']->id ?? null,
                'price' => 899.00,
                'brand' => 'JBL',
                'model' => 'Flip 6',
                'is_active' => true,
            ],
            [
                'name' => 'Sonos Era 300',
                'description' => 'Caixa de som inteligente com som espacial Dolby Atmos e assistente de voz integrado.',
                'category' => 'audio',
                'category_id' => $categories['audio']->id ?? null,
                'price' => 3999.00,
                'brand' => 'Sonos',
                'model' => 'Era 300',
                'is_active' => true,
            ],

            // Wearables
            [
                'name' => 'Apple Watch Ultra 2',
                'description' => 'O Apple Watch mais robusto e capaz de todos. Projetado para aventuras ao ar livre e treinos intensos.',
                'category' => 'wearables',
                'category_id' => $categories['wearables']->id ?? null,
                'price' => 9499.00,
                'brand' => 'Apple',
                'model' => 'Watch Ultra 2',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}

