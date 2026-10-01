<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use Illuminate\Support\Facades\Log;

class ActivateScheduledVibes extends Command
{
    protected $signature = 'vibes:activate-scheduled';
    protected $description = 'Coloca no ar (Ativo) as Vibes agendadas cuja data de início chegou';

    public function handle()
    {
        // Uma Vibe que já passou da data de fim também é ativada: o vibes:close-expired
        // a encerra em seguida, pela regra normal de encerramento
        $vibeIds = Auction::where('status', 'scheduled')
            ->whereNotNull('start_date')
            ->where('start_date', '<=', now())
            ->pluck('id');

        if ($vibeIds->isEmpty()) {
            $this->info('Nenhuma Vibe agendada para ativar.');
            return 0;
        }

        // A condição de status se repete no update para não reativar uma Vibe que o
        // admin tenha mudado entre a busca e a gravação
        $activated = Auction::whereIn('id', $vibeIds)
            ->where('status', 'scheduled')
            ->update(['status' => 'active']);

        Log::info('[ActivateVibes] Vibes agendadas ativadas', ['ids' => $vibeIds->all()]);
        $this->info("Ativadas {$activated} Vibe(s).");
        return 0;
    }
}
