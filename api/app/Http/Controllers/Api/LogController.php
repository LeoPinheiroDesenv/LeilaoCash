<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class LogController extends Controller
{
    /**
     * Obter logs da aplicação
     */
    public function index(Request $request)
    {
        try {
            $logPath = storage_path('logs/laravel.log');

            if (!File::exists($logPath)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Arquivo de log não encontrado.'
                ]);
            }

            // Ler o conteúdo do arquivo
            $content = File::get($logPath);

            // Separar as linhas (os logs do Laravel costumam começar com [data])
            $lines = explode("\n", $content);
            $logs = [];

            // Processar as linhas para extrair informações (reverso para ver os mais recentes primeiro)
            $currentLog = null;

            foreach (array_reverse($lines) as $line) {
                if (empty(trim($line))) continue;

                // Tentar identificar o início de uma entrada de log: [YYYY-MM-DD HH:MM:SS]
                if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.*)/', $line, $matches)) {
                    if ($currentLog) {
                        $logs[] = $currentLog;
                    }

                    $currentLog = [
                        'timestamp' => $matches[1],
                        'environment' => $matches[2],
                        'level' => $matches[3],
                        'message' => $matches[4],
                        'full_text' => $line
                    ];
                } else {
                    // Se não for o início, é continuação (stack trace ou JSON extra)
                    if ($currentLog) {
                        $currentLog['message'] .= "\n" . $line;
                        $currentLog['full_text'] .= "\n" . $line;
                    }
                }
            }

            if ($currentLog) {
                $logs[] = $currentLog;
            }

            // Paginação simples manual
            $perPage = (int) $request->get('per_page', 50);
            $page = (int) $request->get('page', 1);
            $offset = ($page - 1) * $perPage;

            $paginatedLogs = array_slice($logs, $offset, $perPage);

            return response()->json([
                'success' => true,
                'data' => $paginatedLogs,
                'meta' => [
                    'total' => count($logs),
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil(count($logs) / $perPage)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('[LogController] Erro ao ler logs', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Limpar logs
     */
    public function clear()
    {
        try {
            $logPath = storage_path('logs/laravel.log');
            if (File::exists($logPath)) {
                File::put($logPath, '');
            }

            return response()->json([
                'success' => true,
                'message' => 'Logs limpos com sucesso.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao limpar logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
