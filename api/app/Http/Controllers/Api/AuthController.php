<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'cpf' => 'nullable|string|max:14|unique:users',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'cpf' => $request->cpf,
                'phone' => $request->phone,
                'birth_date' => $request->birth_date,
                'balance' => 0,
                'cashback_balance' => 0,
                'is_admin' => false,
                'is_active' => true,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Usuário registrado com sucesso',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao registrar usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciais inválidas'
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário inativo'
                ], 403);
            }

            // Criar token com nome único e sem expiração (ou com expiração longa)
            try {
                $token = $user->createToken('auth_token', ['*'])->plainTextToken;
            } catch (\Exception $tokenException) {
                Log::error('[AuthController] Erro ao criar token no login', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'error' => $tokenException->getMessage(),
                    'trace' => $tokenException->getTraceAsString()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Erro ao criar token de autenticação',
                    'error' => $tokenException->getMessage()
                ], 500);
            }
            
            // Log para debug
            Log::info('[AuthController] Token criado no login', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'is_admin' => $user->is_admin,
                'token_length' => strlen($token),
                'token_prefix' => substr($token, 0, 20) . '...',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Login realizado com sucesso',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('[AuthController] Erro no login', [
                'email' => $request->email ?? 'N/A',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erro ao realizar login',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        // Log detalhado do header Authorization
        $authHeader = $request->header('Authorization');
        $token = null;
        
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        
        Log::info('[AuthController] me chamado', [
            'has_auth_header' => !!$authHeader,
            'auth_header_prefix' => $authHeader ? substr($authHeader, 0, 30) . '...' : null,
            'has_token' => !!$token,
            'token_length' => $token ? strlen($token) : 0,
            'token_prefix' => $token ? substr($token, 0, 20) . '...' : null,
            'url' => $request->fullUrl(),
        ]);
        
        // Tentar validar token manualmente antes de usar $request->user()
        if ($token) {
            try {
                $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                
                Log::info('[AuthController] Token encontrado na base', [
                    'token_exists' => !!$accessToken,
                    'token_id' => $accessToken?->id,
                    'token_name' => $accessToken?->name,
                    'token_expires_at' => $accessToken?->expires_at?->toDateTimeString(),
                    'token_last_used_at' => $accessToken?->last_used_at?->toDateTimeString(),
                ]);
                
                if ($accessToken) {
                    $tokenUser = $accessToken->tokenable;
                    Log::info('[AuthController] Usuário do token', [
                        'user_id' => $tokenUser?->id,
                        'user_email' => $tokenUser?->email,
                        'user_is_admin' => $tokenUser?->is_admin,
                    ]);
                } else {
                    Log::warning('[AuthController] Token não encontrado na base de dados', [
                        'token_prefix' => substr($token, 0, 20) . '...',
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('[AuthController] Erro ao validar token manualmente', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
        
        $user = $request->user();
        
        Log::info('[AuthController] Usuário autenticado via $request->user()', [
            'has_user' => !!$user,
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'is_admin' => $user?->is_admin,
            'is_admin_type' => $user ? gettype($user->is_admin) : null,
        ]);
        
        if (!$user) {
            Log::warning('[AuthController] me: usuário não autenticado', [
                'has_token' => !!$token,
                'token_length' => $token ? strlen($token) : 0,
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Não autenticado. Token inválido ou ausente.',
                'error' => 'Unauthenticated'
            ], 401);
        }
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout de todos os dispositivos realizado com sucesso'
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'birth_date' => 'sometimes|date',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'state' => 'sometimes|string|max:2',
            'zip_code' => 'sometimes|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update($request->only([
                'name', 'phone', 'birth_date', 'address', 'city', 'state', 'zip_code'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Perfil atualizado com sucesso',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Senha atual incorreta'
            ], 401);
        }

        try {
            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Senha alterada com sucesso'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao alterar senha',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

