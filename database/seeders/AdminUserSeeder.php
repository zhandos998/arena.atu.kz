<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrNew(['email' => 'admin@atu.kz']);

        $admin->forceFill([
            'name' => 'Администратор АТУ',
            'email_verified_at' => now(),
            'password' => 'password', // password
            'is_admin' => true,
        ])->save();
    }
}
