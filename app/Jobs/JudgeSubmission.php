<?php

namespace App\Jobs;

use App\Models\Submission;
use App\Services\Judge\Contracts\CodeRunner;
use App\Services\Judge\Data\CompilationResult;
use App\Services\Judge\OutputChecker;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class JudgeSubmission implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $timeout = 900;

    public function __construct(public Submission $submission)
    {
        $this->onQueue('judge');
    }

    public function handle(CodeRunner $runner, OutputChecker $checker): void
    {
        $submission = $this->submission->fresh(['problem.testCases']);

        if (! $submission || $submission->status === 'finished') {
            return;
        }

        $tests = $submission->problem->testCases->where('is_enabled', true)->values();
        $submission->results()->delete();
        $submission->update([
            'status' => 'running',
            'verdict' => null,
            'passed_tests' => 0,
            'total_tests' => $tests->count(),
            'score' => 0,
            'compiler_output' => null,
        ]);

        if ($tests->isEmpty()) {
            $this->finishWithError($submission, 'Для задачи не настроены активные тесты.');

            return;
        }

        $program = null;

        try {
            $program = $runner->compile($submission->language, $submission->source_code);

            if (! $program->successful) {
                $submission->update([
                    'status' => 'finished',
                    'verdict' => 'compilation_error',
                    'compiler_output' => $program->output,
                    'judged_at' => now(),
                ]);

                return;
            }

            $passed = 0;
            $passedPoints = 0;
            $totalPoints = max(1, (int) $tests->sum('points'));
            $maximumTime = 0;
            $finalVerdict = 'accepted';

            foreach ($tests as $index => $test) {
                $execution = $runner->execute(
                    $program,
                    $test->input,
                    $submission->problem->time_limit_ms,
                    $submission->problem->memory_limit_mb,
                );
                $maximumTime = max($maximumTime, $execution->executionTimeMs);

                if ($execution->timedOut) {
                    $verdict = 'time_limit';
                    $message = 'Превышен лимит времени.';
                } elseif ($execution->exitCode !== 0) {
                    $verdict = 'runtime_error';
                    $message = $execution->errorOutput ?: 'Программа завершилась с ошибкой.';
                } elseif (! $checker->matches($test->expected_output, $execution->output, $submission->problem->checker_type)) {
                    $verdict = 'wrong_answer';
                    $message = 'Вывод программы не совпал с ожидаемым ответом.';
                } else {
                    $verdict = 'accepted';
                    $message = null;
                    $passed++;
                    $passedPoints += $test->points;
                }

                if ($finalVerdict === 'accepted' && $verdict !== 'accepted') {
                    $finalVerdict = $verdict;
                }

                $submission->results()->create([
                    'problem_test_case_id' => $test->id,
                    'position' => $index + 1,
                    'verdict' => $verdict,
                    'execution_time_ms' => $execution->executionTimeMs,
                    'message' => $message,
                ]);

                if ($verdict !== 'accepted') {
                    break;
                }
            }

            $submission->update([
                'status' => 'finished',
                'verdict' => $finalVerdict,
                'passed_tests' => $passed,
                'score' => (int) floor($submission->problem->score * $passedPoints / $totalPoints),
                'execution_time_ms' => $maximumTime,
                'judged_at' => now(),
            ]);
        } catch (Throwable $exception) {
            report($exception);
            $this->finishWithError($submission, 'Сервис проверки временно недоступен.');
        } finally {
            if ($program instanceof CompilationResult) {
                $runner->cleanup($program);
            }
        }
    }

    public function failed(?Throwable $exception): void
    {
        $submission = $this->submission->fresh();

        if (! $submission || $submission->status === 'finished') {
            return;
        }

        $this->finishWithError(
            $submission,
            'Сервис проверки не смог обработать решение. Обратитесь к администратору.',
        );
    }

    private function finishWithError(Submission $submission, string $message): void
    {
        $submission->update([
            'status' => 'finished',
            'verdict' => 'system_error',
            'compiler_output' => $message,
            'judged_at' => now(),
        ]);
    }
}
