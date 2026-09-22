<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cidade;
use App\Models\Estado;

class LocationController extends Controller
{
    /**
     * Lista todos os estados (UFs), ordenados por nome.
     */
    public function estados()
    {
        return response()->json([
            'success' => true,
            'data' => Estado::orderBy('nome')->get(['id', 'nome', 'sigla']),
        ]);
    }

    /**
     * Lista os municípios de um estado, identificado pela sigla (ex: SP).
     */
    public function cidades(string $siglaOuId)
    {
        $estado = is_numeric($siglaOuId)
            ? Estado::find($siglaOuId)
            : Estado::whereRaw('UPPER(sigla) = ?', [strtoupper($siglaOuId)])->first();

        if (!$estado) {
            return response()->json([
                'success' => false,
                'message' => 'Estado não encontrado.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => Cidade::where('estado_id', $estado->id)->orderBy('nome')->get(['id', 'nome']),
        ]);
    }
}
