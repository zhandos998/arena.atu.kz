<?php

namespace Tests\Feature\Database\Seeders;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_or_updates_one_administrator(): void
    {
        User::factory()->create([
            'email' => 'admin@atu.kz',
            'is_admin' => false,
        ]);

        $this->seed(AdminUserSeeder::class);
        $this->seed(AdminUserSeeder::class);

        $admin = User::query()->where('email', 'admin@atu.kz')->sole();

        $this->assertSame(1, User::query()->where('email', 'admin@atu.kz')->count());
        $this->assertSame('Администратор АТУ', $admin->name);
        $this->assertTrue($admin->isAdmin());
        $this->assertTrue(Hash::check('ATU#Arena92!Code', $admin->password));
        $this->assertNotNull($admin->email_verified_at);
    }
}
