<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProblemRequest;
use App\Http\Requests\Admin\UpdateProblemRequest;
use App\Models\Competition;
use App\Models\Problem;
use App\Models\ProblemSample;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProblemController extends Controller
{
    public function index(Request $request): Response
    {
        $competitionId = $request->integer('competition');
        $problems = Problem::query()
            ->select(['id', 'competition_id', 'code', 'title', 'time_limit_ms', 'memory_limit_mb', 'score', 'created_at'])
            ->with('competition:id,title,status')
            ->withCount('samples')
            ->when($competitionId > 0, fn ($query) => $query->where('competition_id', $competitionId))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Problem $problem): array => [
                'id' => $problem->id,
                'competition_id' => $problem->competition_id,
                'competition_title' => $problem->competition->title,
                'competition_status' => $problem->competition->status,
                'code' => $problem->code,
                'title' => $problem->title,
                'time_limit_ms' => $problem->time_limit_ms,
                'memory_limit_mb' => $problem->memory_limit_mb,
                'score' => $problem->score,
                'samples_count' => $problem->samples_count,
            ]);
        $competitions = Competition::query()
            ->select(['id', 'title'])
            ->withCount('problems')
            ->orderBy('title')
            ->get()
            ->map(fn (Competition $competition): array => [
                'id' => $competition->id,
                'title' => $competition->title,
                'problems_count' => $competition->problems_count,
            ]);

        return Inertia::render('Admin/Problems/Index', [
            'problems' => $problems,
            'competitions' => $competitions,
            'filters' => [
                'competition' => $competitionId > 0 ? $competitionId : null,
            ],
            'stats' => [
                'total' => Problem::query()->count(),
                'with_samples' => Problem::query()->has('samples')->count(),
                'competitions' => Competition::query()->has('problems')->count(),
            ],
        ]);
    }

    public function create(Competition $competition): Response
    {
        return Inertia::render('Admin/Problems/Create', [
            'competition' => $this->competitionData($competition),
        ]);
    }

    public function store(StoreProblemRequest $request, Competition $competition): RedirectResponse
    {
        $data = $request->validated();
        $samples = Arr::pull($data, 'samples');

        $problem = DB::transaction(function () use ($competition, $data, $samples): Problem {
            $problem = $competition->problems()->create($data);
            $this->replaceSamples($problem, $samples);

            return $problem;
        });

        return to_route('admin.competitions.problems.show', [$competition, $problem])
            ->with('success', 'Задача и примеры успешно добавлены.');
    }

    public function show(Competition $competition, Problem $problem): Response
    {
        $problem->load('samples')->loadCount('testCases');

        return Inertia::render('Admin/Problems/Show', [
            'competition' => $this->competitionData($competition),
            'problem' => $this->problemData($problem),
        ]);
    }

    public function edit(Competition $competition, Problem $problem): Response
    {
        $problem->load('samples');

        return Inertia::render('Admin/Problems/Edit', [
            'competition' => $this->competitionData($competition),
            'problem' => $this->problemData($problem),
        ]);
    }

    public function update(UpdateProblemRequest $request, Competition $competition, Problem $problem): RedirectResponse
    {
        $data = $request->validated();
        $samples = Arr::pull($data, 'samples');

        DB::transaction(function () use ($problem, $data, $samples): void {
            $problem->update($data);
            $this->replaceSamples($problem, $samples);
        });

        return to_route('admin.competitions.problems.show', [$competition, $problem])
            ->with('success', 'Изменения задачи сохранены.');
    }

    /**
     * @param  array<int, array{input: string, output: string}>  $samples
     */
    private function replaceSamples(Problem $problem, array $samples): void
    {
        $problem->samples()->delete();
        $problem->samples()->createMany(
            collect($samples)
                ->map(fn (array $sample, int $index): array => [
                    ...$sample,
                    'position' => $index + 1,
                ])
                ->all(),
        );
    }

    /**
     * @return array{id: int, title: string}
     */
    private function competitionData(Competition $competition): array
    {
        return [
            'id' => $competition->id,
            'title' => $competition->title,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function problemData(Problem $problem): array
    {
        return [
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
            'checker_type' => $problem->checker_type,
            'reference_language' => $problem->reference_language,
            'has_reference_solution' => filled($problem->reference_solution),
            'test_cases_count' => $problem->test_cases_count ?? $problem->testCases()->count(),
            'samples' => $problem->samples->map(fn (ProblemSample $sample): array => [
                'id' => $sample->id,
                'input' => $sample->input,
                'output' => $sample->output,
            ])->values()->all(),
        ];
    }
}
