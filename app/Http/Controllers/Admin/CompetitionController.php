<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompetitionRequest;
use App\Http\Requests\Admin\UpdateCompetitionRequest;
use App\Models\Competition;
use App\Models\Problem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompetitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $competitions = Competition::query()
            ->select(['id', 'title', 'starts_at', 'ends_at', 'status', 'registration_type', 'allowed_languages'])
            ->withCount('problems')
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Competition $competition): array => [
                'id' => $competition->id,
                'title' => $competition->title,
                'starts_at' => $competition->starts_at->toIso8601String(),
                'ends_at' => $competition->ends_at->toIso8601String(),
                'status' => $competition->status,
                'status_label' => Competition::STATUSES[$competition->status],
                'registration_type' => $competition->registration_type,
                'registration_label' => Competition::REGISTRATION_TYPES[$competition->registration_type],
                'problems_count' => $competition->problems_count,
                'language_labels' => collect($competition->allowed_languages)
                    ->map(fn (string $language): string => Competition::LANGUAGES[$language])
                    ->values()
                    ->all(),
            ]);

        return Inertia::render('Admin/Competitions/Index', [
            'competitions' => $competitions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Competitions/Create', [
            'options' => [
                'statuses' => $this->options(['draft' => Competition::STATUSES['draft']]),
                'registrationTypes' => $this->options(Competition::REGISTRATION_TYPES),
                'languages' => $this->options(Competition::LANGUAGES),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompetitionRequest $request): RedirectResponse
    {
        $request->user()->createdCompetitions()->create([
            ...$request->validated(),
            'status' => 'draft',
        ]);

        return to_route('admin.competitions.index')
            ->with('success', 'Соревнование успешно создано.');
    }

    /**
     * Display the competition management page.
     */
    public function show(Competition $competition): Response
    {
        $competition->load([
            'problems' => fn ($query) => $query
                ->select(['id', 'competition_id', 'code', 'title', 'time_limit_ms', 'memory_limit_mb', 'score'])
                ->withCount('samples')
                ->orderBy('code'),
        ]);
        $registeredUsers = $competition->registeredUsers()
            ->select(['users.id', 'name', 'email'])
            ->orderBy('name')
            ->limit(50)
            ->get();

        return Inertia::render('Admin/Competitions/Show', [
            'competition' => [
                'id' => $competition->id,
                'title' => $competition->title,
                'description' => $competition->description,
                'rules' => $competition->rules,
                'starts_at' => $competition->starts_at->toIso8601String(),
                'ends_at' => $competition->ends_at->toIso8601String(),
                'status' => $competition->status,
                'status_label' => Competition::STATUSES[$competition->status],
                'registration_label' => Competition::REGISTRATION_TYPES[$competition->registration_type],
                'registration_type' => $competition->registration_type,
                'registered_users_count' => $competition->registeredUsers()->count(),
                'registered_users' => $registeredUsers->map(fn ($user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ])->all(),
                'language_labels' => collect($competition->allowed_languages)
                    ->map(fn (string $language): string => Competition::LANGUAGES[$language])
                    ->values()
                    ->all(),
                'problems' => $competition->problems->map(fn (Problem $problem): array => [
                    'id' => $problem->id,
                    'code' => $problem->code,
                    'title' => $problem->title,
                    'time_limit_ms' => $problem->time_limit_ms,
                    'memory_limit_mb' => $problem->memory_limit_mb,
                    'score' => $problem->score,
                    'samples_count' => $problem->samples_count,
                ])->values()->all(),
            ],
        ]);
    }

    public function edit(Competition $competition): Response
    {
        return Inertia::render('Admin/Competitions/Edit', [
            'competition' => [
                'id' => $competition->id,
                'title' => $competition->title,
                'description' => $competition->description,
                'rules' => $competition->rules,
                'starts_at' => $competition->starts_at->format('Y-m-d\TH:i'),
                'ends_at' => $competition->ends_at->format('Y-m-d\TH:i'),
                'status' => $competition->status,
                'registration_type' => $competition->registration_type,
                'allowed_languages' => $competition->allowed_languages,
            ],
            'options' => [
                'statuses' => $this->options(Competition::STATUSES),
                'registrationTypes' => $this->options(Competition::REGISTRATION_TYPES),
                'languages' => $this->options(Competition::LANGUAGES),
            ],
        ]);
    }

    public function update(UpdateCompetitionRequest $request, Competition $competition): RedirectResponse
    {
        $competition->update(collect($request->validated())->except('status')->all());

        return to_route('admin.competitions.show', $competition)
            ->with('success', 'Настройки соревнования обновлены.');
    }

    public function destroy(Competition $competition): RedirectResponse
    {
        abort_unless($competition->status === 'draft', 422, 'Удалить можно только черновик.');
        abort_if($competition->registeredUsers()->exists(), 422, 'Нельзя удалить соревнование с участниками.');

        $competition->delete();

        return to_route('admin.competitions.index')
            ->with('success', 'Черновик соревнования удалён.');
    }

    /**
     * Convert associative values into form options.
     *
     * @param  array<string, string>  $values
     * @return array<int, array{value: string, label: string}>
     */
    private function options(array $values): array
    {
        return collect($values)
            ->map(fn (string $label, string $value): array => compact('value', 'label'))
            ->values()
            ->all();
    }
}
