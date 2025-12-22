<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index(Request $request)
    {
        try {
            // Log para debug
            Log::info('[SettingsController] index chamado', [
                'user_id' => $request->user()?->id,
                'user_email' => $request->user()?->email,
                'is_admin' => $request->user()?->is_admin,
                'url' => $request->fullUrl(),
            ]);
            
            $settings = Setting::all()->groupBy('group');
            
            Log::info('[SettingsController] Configurações retornadas com sucesso', [
                'settings_count' => $settings->count(),
                'groups' => $settings->keys()->toArray()
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            Log::error('[SettingsController] Erro ao buscar configurações', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar configurações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get settings by group
     */
    public function getByGroup($group)
    {
        try {
            $settings = Setting::getByGroup($group);
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar configurações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get public settings (for frontend)
     */
    public function getPublic(Request $request)
    {
        try {
            // Log para debug
            Log::info('[SettingsController] getPublic chamado', [
                'user_id' => $request->user()?->id,
                'user_email' => $request->user()?->email,
                'is_admin' => $request->user()?->is_admin,
                'url' => $request->fullUrl(),
            ]);
            
            $settings = Setting::getAllSettings();
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            Log::error('[SettingsController] Erro ao buscar configurações públicas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar configurações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a setting
     */
    public function update(Request $request, $key)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setting = Setting::where('key', $key)->first();
            
            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Configuração não encontrada'
                ], 404);
            }

            $setting->value = $request->value;
            $setting->save();

            return response()->json([
                'success' => true,
                'message' => 'Configuração atualizada com sucesso',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar configuração',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update multiple settings at once
     */
    public function updateBatch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            foreach ($request->settings as $key => $value) {
                Setting::where('key', $key)->update(['value' => $value]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Configurações atualizadas com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar configurações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload image
     */
    public function uploadImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'key' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads'), $imageName);
            
            $imageUrl = '/uploads/' . $imageName;

            // Update setting
            $setting = Setting::where('key', $request->key)->first();
            if ($setting) {
                // Delete old image if exists
                if ($setting->value && file_exists(public_path($setting->value))) {
                    unlink(public_path($setting->value));
                }
                
                $setting->value = $imageUrl;
                $setting->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Imagem enviada com sucesso',
                'data' => [
                    'url' => $imageUrl,
                    'setting' => $setting
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao enviar imagem',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

