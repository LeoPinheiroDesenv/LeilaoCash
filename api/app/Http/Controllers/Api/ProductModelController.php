<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductModelController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductModel::with('brand');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        $models = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $models
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $model = ProductModel::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Modelo criado com sucesso',
            'data' => $model->load('brand')
        ], 201);
    }

    public function show($id)
    {
        $model = ProductModel::with('brand')->find($id);

        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'Modelo não encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $model
        ]);
    }

    public function update(Request $request, $id)
    {
        $model = ProductModel::find($id);

        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'Modelo não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $model->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Modelo atualizado com sucesso',
            'data' => $model->load('brand')
        ]);
    }

    public function destroy($id)
    {
        $model = ProductModel::find($id);

        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'Modelo não encontrado'
            ], 404);
        }

        // Verificar se existem produtos associados
        if ($model->products()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Não é possível excluir este modelo pois ele possui produtos associados.'
            ], 422);
        }

        $model->delete();

        return response()->json([
            'success' => true,
            'message' => 'Modelo excluído com sucesso'
        ]);
    }
}
