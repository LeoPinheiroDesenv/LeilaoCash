<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Log;

class TestToken extends Command
{
    protected $signature = 'test:token {token}';
    protected $description = 'Testa se um token Sanctum é válido';

    public function handle()
    {
        $token = $this->argument('token');
        
        $this->info("Testando token: " . substr($token, 0, 20) . "...");
        
        try {
            $accessToken = PersonalAccessToken::findToken($token);
            
            if ($accessToken) {
                $this->info("✅ Token encontrado na base de dados!");
                $this->info("ID: " . $accessToken->id);
                $this->info("Nome: " . $accessToken->name);
                $this->info("Criado em: " . $accessToken->created_at);
                $this->info("Último uso: " . ($accessToken->last_used_at ?? 'Nunca'));
                $this->info("Expira em: " . ($accessToken->expires_at ?? 'Nunca'));
                
                $user = $accessToken->tokenable;
                if ($user) {
                    $this->info("Usuário: " . $user->email);
                    $this->info("Admin: " . ($user->is_admin ? 'Sim' : 'Não'));
                }
            } else {
                $this->error("❌ Token NÃO encontrado na base de dados!");
                $this->info("Verificando se há tokens na tabela...");
                
                $totalTokens = PersonalAccessToken::count();
                $this->info("Total de tokens na base: " . $totalTokens);
                
                if ($totalTokens > 0) {
                    $this->info("Últimos 5 tokens:");
                    $tokens = PersonalAccessToken::latest()->take(5)->get();
                    foreach ($tokens as $t) {
                        $this->line("  - ID: {$t->id}, Nome: {$t->name}, Token: " . substr($t->token, 0, 20) . "...");
                    }
                }
            }
        } catch (\Exception $e) {
            $this->error("Erro: " . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
        
        return 0;
    }
}

