<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@leilaocash.com',
            'password' => Hash::make('password'),
            'cpf' => '000.000.000-00',
            'phone' => '(00) 00000-0000',
            'birth_date' => '1990-01-01',
            'address' => 'Rua Admin',
            'city' => 'Admin City',
            'state' => 'AD',
            'zip_code' => '00000-000',
            'is_admin' => true,
            'is_active' => true,
            'user_type' => 'admin',
        ]);
    }
}
