<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Problem;
use App\Models\ProblemTestCase;
use Inertia\Inertia;
use Inertia\Response;

class TestDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $problems = Problem::query()
            ->select(['id', 'competition_id', 'code', 'title', 'checker_type', 'reference_solution'])
            ->with('competition:id,title,status')
            ->withCount([
                'testCases',
                'testCases as active_test_cases_count' => fn ($query) => $query->where('is_enabled', true),
                'submissions',
            ])
            ->latest()
            ->paginate(20)
            ->through(fn (Problem $problem): array => [
                'id' => $problem->id,
                'competition_id' => $problem->competition_id,
                'competition_title' => $problem->competition->title,
                'competition_status' => $problem->competition->status,
                'code' => $problem->code,
                'title' => $problem->title,
                'checker_type' => $problem->checker_type,
                'has_reference_solution' => filled($problem->reference_solution),
                'test_cases_count' => $problem->test_cases_count,
                'active_test_cases_count' => $problem->active_test_cases_count,
                'submissions_count' => $problem->submissions_count,
            ]);

        return Inertia::render('Admin/Tests/Index', [
            'problems' => $problems,
            'stats' => [
                'tests' => ProblemTestCase::query()->count(),
                'active_tests' => ProblemTestCase::query()->where('is_enabled', true)->count(),
                'ready_problems' => Problem::query()->has('testCases')->count(),
                'problems_without_tests' => Problem::query()->doesntHave('testCases')->count(),
            ],
        ]);
    }
}
