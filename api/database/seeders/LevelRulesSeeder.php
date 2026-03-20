<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LevelRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $content = '
            <div class="levels-container">
                <h1>Suba de Nível e Ganhe Mais!</h1>
                <p>No VibeGet, quanto mais você participa e vence, mais benefícios você conquista. Confira as regras para subir de nível:</p>

                <div class="level-card plata">
                    <h3>Viber Nível Prata</h3>
                    <p><strong>Requisito:</strong> Ao conquistar 5 Vibes.</p>
                    <p>Agora, você tem mais oportunidades e seu Cash Back aumenta para <strong>45%</strong>. Você também começa a concorrer a prêmios e a participar de benefícios exclusivos.</p>
                </div>

                <div class="level-card ouro">
                    <h3>Viber Nível Ouro</h3>
                    <p><strong>Requisito:</strong> Ao vencer mais 4 Vibes (Total 9).</p>
                    <p>Neste nível, você pode comercializar seus Cash Back. Além disso, ganha mais visibilidade na plataforma e tem prioridade nas sugestões para melhorias.</p>
                </div>

                <div class="level-card diamante">
                    <h3>Viber Nível Diamante</h3>
                    <p><strong>Requisito:</strong> Com 3 vitórias adicionais (Total 12).</p>
                    <p>Agora, você fica mais visível. Seu Cash Back aumenta para <strong>50%</strong>.</p>
                </div>

                <div class="level-card platina">
                    <h3>Viber Nível Platina</h3>
                    <p><strong>Requisito:</strong> Ao alcançar 2 vitórias adicionais (Total 14).</p>
                    <p>O nível mais alto! Seu Cash Back aumenta para <strong>60%</strong> e você tem acesso a benefícios exclusivos. Além disso, você recebe suporte prioritário e tem voz ativa nas decisões sobre novos produtos na plataforma.</p>
                </div>
            </div>

            <style>
                .levels-container { padding: 20px; color: #fff; }
                .level-card {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-left: 5px solid #4A9FD8;
                }
                .level-card h3 { margin-top: 0; color: #4A9FD8; }
                .level-card.plata { border-left-color: #c0c0c0; }
                .level-card.ouro { border-left-color: #ffd700; }
                .level-card.diamante { border-left-color: #b9f2ff; }
                .level-card.platina { border-left-color: #e5e4e2; }
            </style>
        ';

        DB::table('settings')->updateOrInsert(
            ['key' => 'page_suba_de_nivel'],
            [
                'value' => $content,
                'type' => 'html',
                'group' => 'content',
                'description' => 'Conteúdo da página Suba de Nível atualizado com as novas regras',
                'updated_at' => now()
            ]
        );
    }
}
