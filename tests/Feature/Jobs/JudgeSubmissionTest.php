<?php

namespace Tests\Feature\Jobs;

use App\Jobs\JudgeSubmission;
use App\Models\Competition;
use App\Models\Problem;
use App\Models\Submission;
use App\Models\User;
use App\Services\Judge\Contracts\CodeRunner;
use App\Services\Judge\Data\CompilationResult;
use App\Services\Judge\Data\ExecutionResult;
use App\Services\Judge\OutputChecker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JudgeSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_runs_all_tests_and_awards_score(): void
    {
        $submission = $this->submissionWithTests();
        $program = new CompilationResult(true, '', 'temporary', 'fake-image', ['run']);
        $runner = new class($program) implements CodeRunner
        {
            private int $execution = 0;

            public function __construct(private readonly CompilationResult $program) {}

            public function compile(string $language, string $sourceCode): CompilationResult
            {
                return $this->program;
            }

            public function execute(CompilationResult $program, string $input, int $timeLimitMs, int $memoryLimitMb): ExecutionResult
            {
                $results = [
                    new ExecutionResult(0, "5\n", '', 12, false),
                    new ExecutionResult(0, "9\n", '', 15, false),
                ];

                return $results[$this->execution++];
            }

            public function cleanup(CompilationResult $program): void {}
        };
        $job = new JudgeSubmission($submission);
        $checker = new OutputChecker;
        $job->handle($runner, $checker);

        $submission->refresh();
        $this->assertSame('finished', $submission->status);
        $this->assertSame('accepted', $submission->verdict);
        $this->assertSame(2, $submission->passed_tests);
        $this->assertSame(100, $submission->score);
        $this->assertSame(15, $submission->execution_time_ms);
        $this->assertCount(2, $submission->results);
    }

    public function test_compilation_failure_is_saved_as_verdict(): void
    {
        $submission = $this->submissionWithTests();
        $program = new CompilationResult(false, 'syntax error', 'temporary', 'fake-image', []);
        $runner = new class($program) implements CodeRunner
        {
            public function __construct(private readonly CompilationResult $program) {}

            public function compile(string $language, string $sourceCode): CompilationResult
            {
                return $this->program;
            }

            public function execute(CompilationResult $program, string $input, int $timeLimitMs, int $memoryLimitMb): ExecutionResult
            {
                throw new \RuntimeException('Execute must not be called after compilation failure.');
            }

            public function cleanup(CompilationResult $program): void {}
        };

        (new JudgeSubmission($submission))->handle($runner, new OutputChecker);

        $submission->refresh();
        $this->assertSame('compilation_error', $submission->verdict);
        $this->assertSame('syntax error', $submission->compiler_output);
    }

    public function test_job_stops_after_the_first_failed_test(): void
    {
        $submission = $this->submissionWithTests();
        $submission->problem->testCases()->create([
            'position' => 3,
            'input' => '10 20',
            'expected_output' => '30',
            'points' => 1,
            'is_enabled' => true,
        ]);
        $program = new CompilationResult(true, '', 'temporary', 'fake-image', ['run']);
        $runner = new class($program) implements CodeRunner
        {
            public int $executions = 0;

            public function __construct(private readonly CompilationResult $program) {}

            public function compile(string $language, string $sourceCode): CompilationResult
            {
                return $this->program;
            }

            public function execute(CompilationResult $program, string $input, int $timeLimitMs, int $memoryLimitMb): ExecutionResult
            {
                $this->executions++;

                return match ($this->executions) {
                    1 => new ExecutionResult(0, "5\n", '', 12, false),
                    2 => new ExecutionResult(0, "8\n", '', 14, false),
                    default => throw new \RuntimeException('Tests after the first failure must not run.'),
                };
            }

            public function cleanup(CompilationResult $program): void {}
        };

        (new JudgeSubmission($submission))->handle($runner, new OutputChecker);

        $submission->refresh();
        $this->assertSame(2, $runner->executions);
        $this->assertSame('wrong_answer', $submission->verdict);
        $this->assertSame(1, $submission->passed_tests);
        $this->assertSame(33, $submission->score);
        $this->assertCount(2, $submission->results);
        $this->assertSame(2, $submission->results->last()->position);
    }

    public function test_terminal_queue_failure_does_not_leave_submission_queued(): void
    {
        $submission = $this->submissionWithTests();

        (new JudgeSubmission($submission))->failed(new \RuntimeException('Queue failure'));

        $submission->refresh();
        $this->assertSame('finished', $submission->status);
        $this->assertSame('system_error', $submission->verdict);
        $this->assertNotNull($submission->judged_at);
        $this->assertSame(
            'Сервис проверки не смог обработать решение. Обратитесь к администратору.',
            $submission->compiler_output,
        );
    }

    private function submissionWithTests(): Submission
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->published()->create();
        $problem = Problem::factory()->for($competition)->create([
            'score' => 100,
            'checker_type' => 'tokens',
        ]);
        $problem->testCases()->createMany([
            ['position' => 1, 'input' => '2 3', 'expected_output' => '5', 'points' => 1, 'is_enabled' => true],
            ['position' => 2, 'input' => '4 5', 'expected_output' => '9', 'points' => 1, 'is_enabled' => true],
        ]);

        return Submission::query()->create([
            'competition_id' => $competition->id,
            'problem_id' => $problem->id,
            'user_id' => $user->id,
            'language' => 'cpp',
            'source_code' => 'int main() {}',
            'status' => 'queued',
        ]);
    }
}
