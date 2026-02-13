<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    // Retorna todas as traduções formatadas para o i18next (formato aninhado ou plano)
    public function index(Request $request)
    {
        $translations = Translation::all();
        $lang = $request->query('lng', 'pt'); // pt, en, es

        $formatted = [];

        // Se o i18next pedir um idioma específico, retornamos apenas ele
        // O i18next-http-backend geralmente pede ?lng=pt&ns=translation

        foreach ($translations as $t) {
            // Estrutura: group.key = valor
            // Ex: header.home = "Início"

            $value = match($lang) {
                'en' => $t->text_en,
                'es' => $t->text_es,
                default => $t->text_pt
            };

            // Fallback para PT se estiver vazio
            if (empty($value)) {
                $value = $t->text_pt;
            }

            if (!isset($formatted[$t->group])) {
                $formatted[$t->group] = [];
            }

            $formatted[$t->group][$t->key] = $value;
        }

        return response()->json($formatted);
    }

    // Retorna lista completa para o admin (com todos os idiomas)
    public function adminIndex()
    {
        return response()->json([
            'success' => true,
            'data' => Translation::orderBy('group')->orderBy('key')->get()
        ]);
    }

    // Atualiza uma tradução
    public function update(Request $request, $id)
    {
        $translation = Translation::findOrFail($id);

        $translation->update($request->only([
            'text_pt',
            'text_en',
            'text_es'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Tradução atualizada com sucesso',
            'data' => $translation
        ]);
    }

    // Cria uma nova chave de tradução (útil para devs/admin)
    public function store(Request $request)
    {
        $request->validate([
            'group' => 'required|string',
            'key' => 'required|string',
            'text_pt' => 'required|string',
        ]);

        $translation = Translation::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Chave criada com sucesso',
            'data' => $translation
        ]);
    }
}
