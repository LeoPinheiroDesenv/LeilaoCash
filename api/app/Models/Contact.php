<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'status',
        'ip_address',
        'user_agent',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Scope para filtrar por status
     */
    public function scopeByStatus($query, $status)
    {
        if ($status) {
            return $query->where('status', $status);
        }
        return $query;
    }

    /**
     * Scope para filtrar por e-mail
     */
    public function scopeByEmail($query, $email)
    {
        if ($email) {
            return $query->where('email', 'like', "%{$email}%");
        }
        return $query;
    }

    /**
     * Obter contatos recentes
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Marcar como respondido
     */
    public function markAsReplied()
    {
        return $this->update(['status' => 'respondido']);
    }

    /**
     * Marcar como arquivado
     */
    public function markAsArchived()
    {
        return $this->update(['status' => 'arquivado']);
    }
}
