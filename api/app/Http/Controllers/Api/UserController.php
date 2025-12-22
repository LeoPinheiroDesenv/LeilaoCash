<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Listar todos os usuários
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Filtros
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($request->has('user_type')) {
                $query->where('user_type', $request->user_type);
            }

            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active === 'true');
            }

            // Paginação
            $perPage = $request->get('per_page', 15);
            $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('[UserController] Erro ao listar usuários', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar usuários',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter um usuário específico
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuário não encontrado'
            ], 404);
        }
    }

    /**
     * Criar novo usuário
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'cpf' => 'nullable|string|max:14|unique:users',
                'phone' => 'nullable|string|max:20',
                'birth_date' => 'nullable|date',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:2',
                'zip_code' => 'nullable|string|max:10',
                'user_type' => 'required|in:principal,secondary,common',
                'permissions' => 'nullable|array',
                'permissions.*' => 'string',
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validar permissões apenas para admins secundários
            if ($request->user_type === 'secondary' && empty($request->permissions)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Administradores secundários devem ter pelo menos uma permissão',
                    'errors' => ['permissions' => ['Selecione pelo menos uma tela permitida']]
                ], 422);
            }

            // Não permitir criar admin principal (apenas um pode existir)
            if ($request->user_type === 'principal') {
                $existingPrincipal = User::where('user_type', 'principal')->first();
                if ($existingPrincipal) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Já existe um administrador principal. Não é possível criar outro.',
                    ], 422);
                }
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'cpf' => $request->cpf,
                'phone' => $request->phone,
                'birth_date' => $request->birth_date,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip_code' => $request->zip_code,
                'user_type' => $request->user_type,
                'is_admin' => in_array($request->user_type, ['principal', 'secondary']),
                'permissions' => $request->user_type === 'secondary' ? $request->permissions : null,
                'is_active' => $request->get('is_active', true),
            ]);

            Log::info('[UserController] Usuário criado', [
                'user_id' => $user->id,
                'email' => $user->email,
                'user_type' => $user->user_type,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuário criado com sucesso',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            Log::error('[UserController] Erro ao criar usuário', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar usuário
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
                'password' => 'sometimes|string|min:8',
                'cpf' => ['nullable', 'string', 'max:14', Rule::unique('users')->ignore($id)],
                'phone' => 'nullable|string|max:20',
                'birth_date' => 'nullable|date',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:2',
                'zip_code' => 'nullable|string|max:10',
                'user_type' => 'sometimes|required|in:principal,secondary,common',
                'permissions' => 'nullable|array',
                'permissions.*' => 'string',
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validar permissões apenas para admins secundários
            if ($request->has('user_type') && $request->user_type === 'secondary') {
                $permissions = $request->permissions ?? $user->permissions ?? [];
                if (empty($permissions)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Administradores secundários devem ter pelo menos uma permissão',
                        'errors' => ['permissions' => ['Selecione pelo menos uma tela permitida']]
                    ], 422);
                }
            }

            // Não permitir alterar admin principal para outro tipo se for o único
            if ($request->has('user_type') && $user->user_type === 'principal' && $request->user_type !== 'principal') {
                $otherPrincipals = User::where('user_type', 'principal')->where('id', '!=', $id)->count();
                if ($otherPrincipals === 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível alterar o tipo do último administrador principal',
                    ], 422);
                }
            }

            // Não permitir criar outro admin principal
            if ($request->has('user_type') && $request->user_type === 'principal' && $user->user_type !== 'principal') {
                $existingPrincipal = User::where('user_type', 'principal')->where('id', '!=', $id)->first();
                if ($existingPrincipal) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Já existe um administrador principal. Não é possível alterar este usuário para principal.',
                    ], 422);
                }
            }

            $updateData = $request->only([
                'name', 'email', 'cpf', 'phone', 'birth_date',
                'address', 'city', 'state', 'zip_code', 'is_active'
            ]);

            if ($request->has('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            if ($request->has('user_type')) {
                $updateData['user_type'] = $request->user_type;
                $updateData['is_admin'] = in_array($request->user_type, ['principal', 'secondary']);
            }

            if ($request->has('permissions')) {
                $updateData['permissions'] = $request->user_type === 'secondary' ? $request->permissions : null;
            } elseif ($request->has('user_type') && $request->user_type === 'secondary' && $user->user_type !== 'secondary') {
                // Se está mudando para secondary e não tem permissões, usar as do request ou array vazio
                $updateData['permissions'] = $request->permissions ?? [];
            }

            $user->update($updateData);

            Log::info('[UserController] Usuário atualizado', [
                'user_id' => $user->id,
                'email' => $user->email,
                'user_type' => $user->user_type,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuário atualizado com sucesso',
                'data' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('[UserController] Erro ao atualizar usuário', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar usuário
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Não permitir deletar o último admin principal
            if ($user->user_type === 'principal') {
                $otherPrincipals = User::where('user_type', 'principal')->where('id', '!=', $id)->count();
                if ($otherPrincipals === 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível deletar o último administrador principal',
                    ], 422);
                }
            }

            $user->delete();

            Log::info('[UserController] Usuário deletado', [
                'user_id' => $id,
                'email' => $user->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuário deletado com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error('[UserController] Erro ao deletar usuário', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter lista de telas disponíveis para permissões
     */
    public function getAvailableScreens()
    {
        $screens = [
            'dashboard' => 'Dashboard',
            'usuarios' => 'Usuários',
            'produtos' => 'Produtos',
            'leiloes' => 'Leilões',
            'lances' => 'Lances',
            'cashback' => 'Cashback',
            'transacoes' => 'Transações',
            'relatorios' => 'Relatórios',
            'configuracoes' => 'Configurações',
        ];

        return response()->json([
            'success' => true,
            'data' => $screens
        ]);
    }
}

