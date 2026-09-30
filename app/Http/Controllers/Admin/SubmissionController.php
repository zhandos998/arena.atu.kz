<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'verdict' => ['nullable', Rule::in(array_keys(Submission::VERDICTS))],
        ]);

        $submissions = Submission::query()
            ->select(['id', 'competition_id', 'problem_id', 'user_id', 'language', 'status', 'verdict', 'passed_tests', 'total_tests', 'score', 'execution_time_ms', 'created_at'])
            ->with([
                'competition:id,title',
                'problem:id,code,title',
                'user:id,name,email',
            ])
            ->when($filters['verdict'] ?? null, fn ($query, string $verdict) => $query->where('verdict', $verdict))
            ->latest()
            ->paginate(30)
            ->withQueryString()
            ->through(fn (Submission $submission): array => [
                'id' => $submission->id,
                'competition' => $submission->competition,
                'problem' => $submission->problem,
                'user' => $submission->user,
                'language' => $submission->language,
                'status' => $submission->status,
                'verdict' => $submission->verdict,
                'verdict_label' => $submission->verdict ? Submission::VERDICTS[$submission->verdict] : ($submission->status === 'running' ? 'Проверяется' : 'В очереди'),
                'passed_tests' => $submission->passed_tests,
                'total_tests' => $submission->total_tests,
                'score' => $submission->score,
                'execution_time_ms' => $submission->execution_time_ms,
                'created_at' => $submission->created_at->toIso8601String(),
            ]);

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $submissions,
            'filters' => $filters,
            'verdicts' => collect(Submission::VERDICTS)
                ->map(fn (string $label, string $value): array => compact('value', 'label'))
                ->values()
                ->all(),
            'stats' => [
                'total' => Submission::query()->count(),
                'queued' => Submission::query()->whereIn('status', ['queued', 'running'])->count(),
                'accepted' => Submission::query()->where('verdict', 'accepted')->count(),
            ],
        ]);
    }
}
