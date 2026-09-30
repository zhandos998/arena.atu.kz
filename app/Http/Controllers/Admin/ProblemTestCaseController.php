<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProblemTestCasesRequest;
use App\Models\Competition;
use App\Models\Problem;
use App\Models\ProblemTestCase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProblemTestCaseController extends Controller
{
    public function index(Competition $competition, Problem $problem): Response
    {
        $this->ensureProblemBelongsToCompetition($competition, $problem);
        $problem->load('testCases');

        return Inertia::render('Admin/Problems/Tests/Index', [
            'competition' => [
                'id' => $competition->id,
                'title' => $competition->title,
            ],
            'problem' => [
                'id' => $problem->id,
                'code' => $problem->code,
                'title' => $problem->title,
                'checker_type' => $problem->checker_type,
                'reference_language' => $problem->reference_language,
                'reference_solution' => $problem->reference_solution,
                'tests' => $problem->testCases->map(fn (ProblemTestCase $test): array => [
                    'id' => $test->id,
                    'input' => $test->input,
                    'expected_output' => $test->expected_output,
                    'points' => $test->points,
                    'is_enabled' => $test->is_enabled,
                ])->values()->all(),
            ],
            'options' => [
                'languages' => collect(Competition::LANGUAGES)
                    ->map(fn (string $label, string $value): array => compact('value', 'label'))
                    ->values()
                    ->all(),
            ],
        ]);
    }

    public function update(
        UpdateProblemTestCasesRequest $request,
        Competition $competition,
        Problem $problem,
    ): RedirectResponse {
        $this->ensureProblemBelongsToCompetition($competition, $problem);
        $tests = collect($request->validated('tests'));

        DB::transaction(function () use ($problem, $tests): void {
            $retainedIds = $tests->pluck('id')->filter()->values();

            $problem->testCases()
                ->when($retainedIds->isNotEmpty(), fn ($query) => $query->whereNotIn('id', $retainedIds))
                ->when($retainedIds->isEmpty(), fn ($query) => $query)
                ->delete();

            $problem->testCases()->update(['position' => DB::raw('position + 1000')]);

            $tests->each(function (array $data, int $index) use ($problem): void {
                $attributes = [
                    'position' => $index + 1,
                    'input' => $data['input'],
                    'expected_output' => $data['expected_output'],
                    'points' => $data['points'],
                    'is_enabled' => $data['is_enabled'],
                ];

                if (! empty($data['id'])) {
                    $problem->testCases()->whereKey($data['id'])->update($attributes);

                    return;
                }

                $problem->testCases()->create($attributes);
            });
        });

        return back()->with('success', 'Скрытые тесты сохранены.');
    }

    private function ensureProblemBelongsToCompetition(Competition $competition, Problem $problem): void
    {
        abort_unless($problem->competition_id === $competition->id, 404);
    }
}
