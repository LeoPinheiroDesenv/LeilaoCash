<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'cpf',
        'phone',
        'birth_date',
        'address',
        'city',
        'state',
        'zip_code',
        'balance',
        'cashback_balance',
        'is_admin',
        'is_active',
        'user_type',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birth_date' => 'date',
            'balance' => 'decimal:2',
            'cashback_balance' => 'decimal:2',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
            'permissions' => 'array',
        ];
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
