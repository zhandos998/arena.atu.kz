<?php

namespace Tests\Feature;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ParticipantDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_participant_without_a_registered_competition_sees_an_empty_dashboard(): void
    {
        $user = User::factory()->create();
        Competition::factory()->published()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Dashboard')
                ->where('competition', null)
                ->has('tasks', 0)
                ->has('leaderboard', 0)
                ->where('stats', null)
            );
    }

    public function test_dashboard_uses_real_problems_submissions_and_participants(): void
    {
        $startedAt = now()->subHours(2)->startOfMinute();
        $participant = User::factory()->create(['name' => 'Current Participant']);
        $rival = User::factory()->create(['name' => 'Real Rival']);
        $competition = Competition::factory()->published()->create([
            'title' => 'Real Competition',
            'starts_at' => $startedAt,
            'ends_at' => now()->addHours(2),
        ]);
        $competition->registeredUsers()->attach([$participant->id, $rival->id]);

        $solvedProblem = Problem::factory()->for($competition)->create([
            'code' => 'A',
            'title' => 'Real solved problem',
            'score' => 100,
        ]);
        $attemptedProblem = Problem::factory()->for($competition)->create([
            'code' => 'B',
            'title' => 'Real attempted problem',
            'score' => 200,
        ]);

        $this->submission($participant, $competition, $solvedProblem, 'accepted', 100, $startedAt->copy()->addMinutes(30));
        $this->submission($participant, $competition, $attemptedProblem, 'wrong_answer', 50, $startedAt->copy()->addMinutes(40));
        $this->submission($rival, $competition, $solvedProblem, 'accepted', 100, $startedAt->copy()->addMinutes(60));

        $this->actingAs($participant)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Dashboard')
                ->where('competition.id', $competition->id)
                ->where('competition.title', 'Real Competition')
                ->has('tasks', 2)
                ->where('tasks.0.title', 'Real solved problem')
                ->where('tasks.0.status', 'solved')
                ->where('tasks.0.attempts', 1)
                ->where('tasks.1.title', 'Real attempted problem')
                ->where('tasks.1.status', 'attempted')
                ->where('tasks.1.best_score', 50)
                ->where('stats.rank', 1)
                ->where('stats.solved', 1)
                ->where('stats.score', 150)
                ->where('stats.penalty_minutes', 30)
                ->has('leaderboard', 2)
                ->where('leaderboard.0.name', 'Current Participant')
                ->where('leaderboard.0.is_current', true)
                ->where('leaderboard.1.name', 'Real Rival')
            );
    }

    private function submission(
        User $user,
        Competition $competition,
        Problem $problem,
        string $verdict,
        int $score,
        mixed $createdAt,
    ): void {
        $submission = Submission::query()->create([
            'competition_id' => $competition->id,
            'problem_id' => $problem->id,
            'user_id' => $user->id,
            'language' => 'cpp',
            'source_code' => 'int main() {}',
            'status' => 'finished',
            'verdict' => $verdict,
            'score' => $score,
        ]);

        $submission->forceFill(['created_at' => $createdAt])->save();
    }
}
