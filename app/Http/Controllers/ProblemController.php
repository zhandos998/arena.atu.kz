<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\ProblemSample;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProblemController extends Controller
{
    public function show(Request $request, Competition $competition, Problem $problem): Response
    {
        $this->ensureParticipantAccess($request, $competition, $problem);
        $problem->load('samples');
        $competitionProblems = $competition->problems()
            ->select(['id', 'competition_id', 'code', 'title'])
            ->orderBy('code')
            ->get();
        $progressByProblem = $competition->submissions()
            ->whereBelongsTo($request->user())
            ->where('status', 'finished')
            ->select(['problem_id', 'verdict', 'score'])
            ->get()
            ->groupBy('problem_id');
        $totalScore = 0;

        $submissions = $problem->submissions()
            ->whereBelongsTo($request->user())
            ->with('results:id,submission_id,position,verdict')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Problems/Show', [
            'competition' => [
                'id' => $competition->id,
                'title' => $competition->title,
                'ends_at' => $competition->ends_at->toIso8601String(),
                'problems' => $competitionProblems->map(function (Problem $competitionProblem) use ($progressByProblem, &$totalScore): array {
                    $problemSubmissions = $progressByProblem->get($competitionProblem->id, collect());
                    $bestScore = (int) $problemSubmissions->max('score');
                    $isSolved = $problemSubmissions->contains('verdict', 'accepted');
                    $totalScore += $bestScore;

                    return [
                        'id' => $competitionProblem->id,
                        'code' => $competitionProblem->code,
                        'title' => $competitionProblem->title,
                        'progress' => $isSolved ? 'full' : ($bestScore > 0 ? 'partial' : 'none'),
                        'best_score' => $bestScore,
                    ];
                })->values()->all(),
                'total_score' => $totalScore,
                'allowed_languages' => collect($competition->allowed_languages)
                    ->map(fn (string $language): array => [
                        'value' => $language,
                        'label' => Competition::LANGUAGES[$language],
                    ])->values()->all(),
            ],
            'problem' => [
                'id' => $problem->id,
                'code' => $problem->code,
                'title' => $problem->title,
                'statement' => $problem->statement,
                'input_format' => $problem->input_format,
                'output_format' => $problem->output_format,
                'constraints' => $problem->constraints,
                'time_limit_ms' => $problem->time_limit_ms,
                'memory_limit_mb' => $problem->memory_limit_mb,
                'score' => $problem->score,
                'samples' => $problem->samples->map(fn (ProblemSample $sample): array => [
                    'id' => $sample->id,
                    'input' => $sample->input,
                    'output' => $sample->output,
                ])->values()->all(),
            ],
            'submissions' => $submissions->map(fn (Submission $submission): array => $this->submissionData($submission))->all(),
        ]);
    }

    private function ensureParticipantAccess(Request $request, Competition $competition, Problem $problem): void
    {
        abort_unless($competition->status === 'published', 404);
        abort_unless($problem->competition_id === $competition->id, 404);
        abort_unless($competition->starts_at->isPast(), 403, 'Соревнование ещё не началось.');
        abort_unless($competition->registeredUsers()->whereKey($request->user()->id)->exists(), 403);
    }

    /**
     * @return array<string, mixed>
     */
    private function submissionData(Submission $submission): array
    {
        $failedResult = $submission->results->firstWhere('verdict', '!=', 'accepted');

        return [
            'id' => $submission->id,
            'language' => $submission->language,
            'status' => $submission->status,
            'verdict' => $submission->verdict,
            'verdict_label' => $submission->verdict ? Submission::VERDICTS[$submission->verdict] : ($submission->status === 'running' ? 'Проверяется' : 'В очереди'),
            'passed_tests' => $submission->passed_tests,
            'tested_count' => $submission->results->count(),
            'failed_test' => $failedResult?->position,
            'score' => $submission->score,
            'created_at' => $submission->created_at->toIso8601String(),
        ];
    }
}
