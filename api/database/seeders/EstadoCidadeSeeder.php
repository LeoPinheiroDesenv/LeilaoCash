<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EstadoCidadeSeeder extends Seeder
{
    /**
     * Importa estados e municípios do dump do IBGE (database/seeders/data/brasil.sql).
     *
     * O dump cria e popula as tabelas `uf`/`municipio` originais; usamos elas só
     * como staging (via DB::unprepared, que deixa o próprio MySQL parsear o dump)
     * e copiamos os dados para `estados`/`cidades`, descartando o staging em seguida.
     */
    public function run(): void
    {
        if (DB::table('estados')->exists()) {
            $this->command?->info('estados/cidades já importados, pulando.');
            return;
        }

        $sqlPath = database_path('seeders/data/brasil.sql');
        if (!file_exists($sqlPath)) {
            $this->command?->warn("Arquivo não encontrado: {$sqlPath}");
            return;
        }

        DB::unprepared(file_get_contents($sqlPath));

        DB::statement('INSERT INTO estados (id, nome, sigla) SELECT id, nome, sigla FROM uf');
        DB::statement('INSERT INTO cidades (id, estado_id, nome) SELECT id, ufid, nome FROM municipio');

        Schema::dropIfExists('municipio');
        Schema::dropIfExists('uf');

        $this->command?->info('estados/cidades importados: ' . DB::table('estados')->count() . ' estados, ' . DB::table('cidades')->count() . ' municípios.');
    }
}
