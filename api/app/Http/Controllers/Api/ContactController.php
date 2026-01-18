<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Armazenar nova mensagem de contato
     * POST /api/contacts
     */
    public function store(Request $request)
    {
        // Validação
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ], [
            'name.required' => 'O nome é obrigatório.',
            'name.string' => 'O nome deve ser um texto.',
            'name.max' => 'O nome não pode exceder 255 caracteres.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'O e-mail deve ser válido.',
            'email.max' => 'O e-mail não pode exceder 255 caracteres.',
            'subject.required' => 'O assunto é obrigatório.',
            'subject.string' => 'O assunto deve ser um texto.',
            'subject.max' => 'O assunto não pode exceder 255 caracteres.',
            'message.required' => 'A mensagem é obrigatória.',
            'message.string' => 'A mensagem deve ser um texto.',
            'message.max' => 'A mensagem não pode exceder 5000 caracteres.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Criar contato
            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'subject' => $request->subject,
                'message' => $request->message,
                'status' => 'novo',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Log
            Log::info('Nova mensagem de contato recebida', [
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'ip' => $contact->ip_address,
            ]);

            // Aqui você pode enviar e-mail de notificação para admin
            // Mail::to(config('mail.admin_email'))->send(new NewContactMail($contact));

            return response()->json([
                'success' => true,
                'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
                'data' => $contact
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erro ao salvar mensagem de contato', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao salvar mensagem. Tente novamente mais tarde.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar todas as mensagens de contato (apenas para admin)
     * GET /api/contacts
     */
    public function index(Request $request)
    {
        try {
            $query = Contact::recent();

            // Filtrar por status
            if ($request->has('status')) {
                $query->byStatus($request->status);
            }

            // Filtrar por e-mail
            if ($request->has('email')) {
                $query->byEmail($request->email);
            }

            // Paginação
            $perPage = $request->get('per_page', 15);
            $contacts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $contacts->items(),
                'pagination' => [
                    'total' => $contacts->total(),
                    'per_page' => $contacts->perPage(),
                    'current_page' => $contacts->currentPage(),
                    'last_page' => $contacts->lastPage(),
                    'from' => $contacts->firstItem(),
                    'to' => $contacts->lastItem(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erro ao listar contatos', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar contatos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter detalhes de um contato específico
     * GET /api/contacts/{id}
     */
    public function show($id)
    {
        try {
            $contact = Contact::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $contact
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contato não encontrado'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar contato', [
                'error' => $e->getMessage(),
                'id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar contato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar status de um contato
     * PUT /api/contacts/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $contact = Contact::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:novo,respondido,arquivado',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $contact->update([
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status atualizado com sucesso',
                'data' => $contact
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contato não encontrado'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao atualizar contato', [
                'error' => $e->getMessage(),
                'id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar contato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deletar um contato
     * DELETE /api/contacts/{id}
     */
    public function destroy($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contato deletado com sucesso'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contato não encontrado'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao deletar contato', [
                'error' => $e->getMessage(),
                'id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar contato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de contatos
     * GET /api/contacts/stats
     */
    public function stats()
    {
        try {
            $stats = [
                'total' => Contact::count(),
                'novo' => Contact::where('status', 'novo')->count(),
                'respondido' => Contact::where('status', 'respondido')->count(),
                'arquivado' => Contact::where('status', 'arquivado')->count(),
                'today' => Contact::where('created_at', '>=', now()->startOfDay())->count(),
                'this_week' => Contact::where('created_at', '>=', now()->startOfWeek())->count(),
                'this_month' => Contact::where('created_at', '>=', now()->startOfMonth())->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Erro ao obter estatísticas', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter estatísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
