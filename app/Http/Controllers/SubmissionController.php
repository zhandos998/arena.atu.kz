<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubmissionRequest;
use App\Jobs\JudgeSubmission;
use App\Models\Competition;
use App\Models\Problem;
use App\Models\Submission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function store(
        StoreSubmissionRequest $request,
        Competition $competition,
        Problem $problem,
    ): RedirectResponse {
        $this->ensureCanSubmit($request, $competition, $problem);

        $submission = $request->user()->submissions()->create([
            ...$request->validated(),
            'competition_id' => $competition->id,
            'problem_id' => $problem->id,
            'status' => 'queued',
            'total_tests' => $problem->testCases()->where('is_enabled', true)->count(),
        ]);

        JudgeSubmission::dispatch($submission);

        return to_route('competitions.problems.show', [$competition, $problem])
            ->with('success', 'Решение отправлено и поставлено в очередь проверки.');
    }

    public function show(Request $request, Submission $submission): Response
    {
        abort_unless($submission->user_id === $request->user()->id || $request->user()->isAdmin(), 403);
        $submission->load(['competition:id,title', 'problem:id,code,title', 'results']);
        $failedResult = $submission->results->firstWhere('verdict', '!=', 'accepted');

        return Inertia::render('Submissions/Show', [
            'submission' => [
                'id' => $submission->id,
                'competition' => $submission->competition,
                'problem' => $submission->problem,
                'language' => $submission->language,
                'source_code' => $submission->source_code,
                'status' => $submission->status,
                'verdict' => $submission->verdict,
                'verdict_label' => $submission->verdict ? Submission::VERDICTS[$submission->verdict] : ($submission->status === 'running' ? 'Проверяется' : 'В очереди'),
                'passed_tests' => $submission->passed_tests,
                'tested_count' => $submission->results->count(),
                'failed_test' => $failedResult?->position,
                'score' => $submission->score,
                'execution_time_ms' => $submission->execution_time_ms,
                'compiler_output' => $submission->compiler_output,
                'created_at' => $submission->created_at->toIso8601String(),
                'results' => $submission->results->map(fn ($result): array => [
                    'position' => $result->position,
                    'verdict' => $result->verdict,
                    'verdict_label' => Submission::VERDICTS[$result->verdict] ?? $result->verdict,
                    'execution_time_ms' => $result->execution_time_ms,
                    'message' => $result->message,
                ])->all(),
            ],
        ]);
    }

    private function ensureCanSubmit(Request $request, Competition $competition, Problem $problem): void
    {
        abort_unless($competition->status === 'published', 404);
        abort_unless($problem->competition_id === $competition->id, 404);
        abort_unless($competition->starts_at->isPast(), 403, 'Соревнование ещё не началось.');
        abort_if($competition->ends_at->isPast(), 403, 'Соревнование уже завершено.');
        abort_unless($competition->registeredUsers()->whereKey($request->user()->id)->exists(), 403);
        abort_unless($problem->testCases()->where('is_enabled', true)->exists(), 422, 'Для задачи ещё не настроены тесты.');
    }
}
