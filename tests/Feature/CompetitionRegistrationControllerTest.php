<?php

namespace Tests\Feature;

use App\Models\Competition;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompetitionRegistrationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_participant_can_register_for_open_published_competition(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create();

        $this->actingAs($user)
            ->post(route('competitions.registration.store', $competition))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('competition_user', [
            'competition_id' => $competition->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_registration_is_idempotent(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create();

        $this->actingAs($user)->post(route('competitions.registration.store', $competition));
        $this->actingAs($user)->post(route('competitions.registration.store', $competition));

        $this->assertDatabaseCount('competition_user', 1);
    }

    public function test_participant_cannot_register_for_closed_competition(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create(['registration_type' => 'closed']);

        $this->actingAs($user)
            ->post(route('competitions.registration.store', $competition))
            ->assertUnprocessable();

        $this->assertDatabaseEmpty('competition_user');
    }

    public function test_participant_can_register_after_start_before_competition_ends(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create([
            'starts_at' => now()->subMinute(),
            'ends_at' => now()->addHour(),
        ]);

        $this->actingAs($user)
            ->post(route('competitions.registration.store', $competition))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('competition_user', [
            'competition_id' => $competition->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_participant_cannot_register_after_competition_ends(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create([
            'starts_at' => now()->subHours(2),
            'ends_at' => now()->subMinute(),
        ]);

        $this->actingAs($user)
            ->post(route('competitions.registration.store', $competition))
            ->assertUnprocessable();

        $this->assertDatabaseEmpty('competition_user');
    }

    public function test_participant_can_cancel_registration_before_start(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create();
        $competition->registeredUsers()->attach($user);

        $this->actingAs($user)
            ->delete(route('competitions.registration.destroy', $competition))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseEmpty('competition_user');
    }
}
