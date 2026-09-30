<?php

namespace Tests\Feature;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompetitionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_participant_competitions(): void
    {
        $this->get(route('competitions.index'))->assertRedirect(route('login'));
    }

    public function test_participant_sees_only_published_competitions(): void
    {
        $user = User::factory()->create();
        Competition::factory()->create(['title' => 'Черновик']);
        Competition::factory()->published()->create(['title' => 'Открытый турнир']);

        $this->actingAs($user)
            ->get(route('competitions.index'))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Competitions/Index')
                ->has('competitions.data', 1)
                ->where('competitions.data.0.title', 'Открытый турнир')
            );
    }

    public function test_draft_competition_is_hidden_from_participants(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->create();

        $this->actingAs($user)
            ->get(route('competitions.show', $competition))
            ->assertNotFound();
    }

    public function test_registered_participant_sees_problems_after_start(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create([
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHours(2),
            'rules' => 'Не использовать чужой код.',
        ]);
        Problem::factory()->for($competition)->create(['title' => 'Конечные автоматы']);
        $competition->registeredUsers()->attach($user);

        $this->actingAs($user)
            ->get(route('competitions.show', $competition))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Competitions/Show')
                ->where('competition.is_registered', true)
                ->where('competition.has_started', true)
                ->where('competition.rules', 'Не использовать чужой код.')
                ->has('competition.problems', 1)
                ->where('competition.problems.0.title', 'Конечные автоматы')
            );
    }

    public function test_problems_are_hidden_before_start(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create();
        Problem::factory()->for($competition)->create();
        $competition->registeredUsers()->attach($user);

        $this->actingAs($user)
            ->get(route('competitions.show', $competition))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->where('competition.is_registered', true)
                ->where('competition.has_started', false)
                ->has('competition.problems', 0)
            );
    }

    public function test_open_competition_allows_registration_while_it_is_running(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create([
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHour(),
            'registration_type' => 'open',
        ]);

        $this->actingAs($user)
            ->get(route('competitions.show', $competition))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->where('competition.can_register', true)
                ->where('competition.is_registered', false)
                ->where('competition.has_started', true)
                ->where('competition.has_ended', false)
            );
    }
}
