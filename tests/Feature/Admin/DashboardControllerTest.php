<?php

namespace Tests\Feature\Admin;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.dashboard'));

        $response->assertRedirect(route('login'));
    }

    public function test_regular_user_is_forbidden_from_admin_dashboard(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertForbidden();
    }

    public function test_administrator_can_view_admin_dashboard(): void
    {
        User::factory()->create();
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        Competition::factory()->for($admin, 'creator')->create();
        Problem::factory()->count(3)->for($competition)->create();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Dashboard')
            ->where('stats.participants', 1)
            ->where('stats.competitions', 2)
            ->where('stats.problems', 3)
            ->where('stats.submissions', 0)
        );
    }
}
