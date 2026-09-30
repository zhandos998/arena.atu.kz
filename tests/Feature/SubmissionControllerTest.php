<?php

namespace Tests\Feature;

use App\Jobs\JudgeSubmission;
use App\Models\Competition;
use App\Models\Problem;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SubmissionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_registered_participant_can_open_problem_and_submit_solution(): void
    {
        Queue::fake();
        [$user, $competition, $problem] = $this->startedCompetition();
        Problem::factory()->for($competition)->create([
            'code' => 'B',
            'title' => 'Second problem',
        ]);

        $this->actingAs($user)
            ->get(route('competitions.problems.show', [$competition, $problem]))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Problems/Show')
                ->where('problem.id', $problem->id)
                ->has('competition.problems', 2)
                ->where('competition.problems.0.code', 'A')
                ->where('competition.problems.1.code', 'B')
                ->has('competition.allowed_languages', 2)
                ->has('submissions', 0)
            );

        $this->actingAs($user)
            ->post(route('competitions.problems.submissions.store', [$competition, $problem]), [
                'language' => 'cpp',
                'source_code' => 'int main() { return 0; }',
            ])
            ->assertRedirect(route('competitions.problems.show', [$competition, $problem]));

        $this->assertDatabaseHas('submissions', [
            'competition_id' => $competition->id,
            'problem_id' => $problem->id,
            'user_id' => $user->id,
            'status' => 'queued',
            'total_tests' => 1,
        ]);
        Queue::assertPushed(JudgeSubmission::class);
    }

    public function test_unregistered_user_cannot_open_problem_or_submit(): void
    {
        Queue::fake();
        [$user, $competition, $problem] = $this->startedCompetition(register: false);

        $this->actingAs($user)
            ->get(route('competitions.problems.show', [$competition, $problem]))
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('competitions.problems.submissions.store', [$competition, $problem]), [
                'language' => 'cpp',
                'source_code' => 'int main() {}',
            ])
            ->assertForbidden();

        $this->assertDatabaseEmpty('submissions');
    }

    public function test_disallowed_language_is_rejected(): void
    {
        Queue::fake();
        [$user, $competition, $problem] = $this->startedCompetition();

        $this->actingAs($user)
            ->post(route('competitions.problems.submissions.store', [$competition, $problem]), [
                'language' => 'java',
                'source_code' => 'class Main {}',
            ])
            ->assertSessionHasErrors('language');

        $this->assertDatabaseEmpty('submissions');
    }

    public function test_go_solution_can_be_submitted_when_enabled_for_competition(): void
    {
        Queue::fake();
        [$user, $competition, $problem] = $this->startedCompetition();
        $competition->update(['allowed_languages' => ['cpp', 'python', 'go']]);

        $this->actingAs($user)
            ->post(route('competitions.problems.submissions.store', [$competition, $problem]), [
                'language' => 'go',
                'source_code' => 'package main; func main() {}',
            ])
            ->assertRedirect(route('competitions.problems.show', [$competition, $problem]));

        $this->assertDatabaseHas('submissions', [
            'competition_id' => $competition->id,
            'problem_id' => $problem->id,
            'user_id' => $user->id,
            'language' => 'go',
            'status' => 'queued',
        ]);
        Queue::assertPushed(JudgeSubmission::class);
    }

    public function test_submission_is_forbidden_after_competition_end(): void
    {
        Queue::fake();
        [$user, $competition, $problem] = $this->startedCompetition();
        $competition->update(['ends_at' => now()->subMinute()]);

        $this->actingAs($user)
            ->post(route('competitions.problems.submissions.store', [$competition, $problem]), [
                'language' => 'cpp',
                'source_code' => 'int main() {}',
            ])
            ->assertForbidden();
    }

    public function test_submission_summary_shows_failed_test_without_exposing_total_test_count(): void
    {
        [$user, $competition, $problem] = $this->startedCompetition();
        $submission = Submission::query()->create([
            'competition_id' => $competition->id,
            'problem_id' => $problem->id,
            'user_id' => $user->id,
            'language' => 'cpp',
            'source_code' => 'int main() {}',
            'status' => 'finished',
            'verdict' => 'wrong_answer',
            'passed_tests' => 1,
            'total_tests' => 10,
        ]);
        $submission->results()->createMany([
            ['position' => 1, 'verdict' => 'accepted'],
            ['position' => 2, 'verdict' => 'wrong_answer'],
        ]);

        $this->actingAs($user)
            ->get(route('competitions.problems.show', [$competition, $problem]))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->where('submissions.0.id', $submission->id)
                ->where('submissions.0.failed_test', 2)
                ->where('submissions.0.tested_count', 2)
                ->missing('submissions.0.total_tests')
            );
    }

    public function test_problem_navigation_contains_real_progress_and_total_score(): void
    {
        [$user, $competition, $firstProblem] = $this->startedCompetition();
        $secondProblem = Problem::factory()->for($competition)->create([
            'code' => 'B',
            'score' => 100,
        ]);
        Submission::query()->create([
            'competition_id' => $competition->id,
            'problem_id' => $firstProblem->id,
            'user_id' => $user->id,
            'language' => 'cpp',
            'source_code' => 'int main() {}',
            'status' => 'finished',
            'verdict' => 'accepted',
            'score' => 100,
        ]);
        Submission::query()->create([
            'competition_id' => $competition->id,
            'problem_id' => $secondProblem->id,
            'user_id' => $user->id,
            'language' => 'cpp',
            'source_code' => 'int main() {}',
            'status' => 'finished',
            'verdict' => 'wrong_answer',
            'score' => 30,
        ]);

        $this->actingAs($user)
            ->get(route('competitions.problems.show', [$competition, $firstProblem]))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->where('competition.problems.0.code', 'A')
                ->where('competition.problems.0.progress', 'full')
                ->where('competition.problems.0.best_score', 100)
                ->where('competition.problems.1.code', 'B')
                ->where('competition.problems.1.progress', 'partial')
                ->where('competition.problems.1.best_score', 30)
                ->where('competition.total_score', 130)
            );
    }

    /**
     * @return array{User, Competition, Problem}
     */
    private function startedCompetition(bool $register = true): array
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create([
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHours(2),
            'allowed_languages' => ['cpp', 'python'],
        ]);
        $problem = Problem::factory()->for($competition)->create(['code' => 'A']);
        $problem->testCases()->create([
            'position' => 1,
            'input' => '2 3',
            'expected_output' => '5',
            'points' => 1,
            'is_enabled' => true,
        ]);

        if ($register) {
            $competition->registeredUsers()->attach($user);
        }

        return [$user, $competition, $problem];
    }
}
