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
        'auctions_won',
        'viber_level',
        'guardian_name',
        'guardian_cpf',
        'referral_code',
        'referred_by',
        'referral_count',
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
            'auctions_won' => 'integer',
            'referral_count' => 'integer',
        ];
    }

    /**
     * Calcula e atualiza o nível do Viber com base em vibes vencidas
     */
    public function recalculateViberLevel(): string
    {
        $won = (int) $this->auctions_won;
        $level = 'inscrito';

        if ($won >= 15) $level = 'diamond';
        elseif ($won >= 13) $level = 'platinum';
        elseif ($won >= 10) $level = 'gold';
        elseif ($won >= 5) $level = 'silver';
        elseif ($won >= 1) $level = 'bronze';

        if ($this->viber_level !== $level) {
            $this->viber_level = $level;
            $this->save();
        }

        return $level;
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
