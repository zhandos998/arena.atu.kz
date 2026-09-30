<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use App\Models\Problem;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CompetitionController extends Controller
{
    public function index(): Response
    {
        $registeredCompetitionIds = Auth::user()
            ->registeredCompetitions()
            ->pluck('competitions.id');

        $competitions = Competition::query()
            ->where('status', 'published')
            ->select(['id', 'title', 'description', 'starts_at', 'ends_at', 'registration_type', 'allowed_languages'])
            ->withCount(['problems', 'registeredUsers'])
            ->orderBy('starts_at')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Competition $competition): array => [
                'id' => $competition->id,
                'title' => $competition->title,
                'description' => $competition->description,
                'starts_at' => $competition->starts_at->toIso8601String(),
                'ends_at' => $competition->ends_at->toIso8601String(),
                'registration_type' => $competition->registration_type,
                'registration_label' => Competition::REGISTRATION_TYPES[$competition->registration_type],
                'language_labels' => collect($competition->allowed_languages)
                    ->map(fn (string $language): string => Competition::LANGUAGES[$language])
                    ->values()
                    ->all(),
                'problems_count' => $competition->problems_count,
                'registered_users_count' => $competition->registered_users_count,
                'is_registered' => $registeredCompetitionIds->contains($competition->id),
            ]);

        return Inertia::render('Competitions/Index', [
            'competitions' => $competitions,
        ]);
    }

    public function show(Competition $competition): Response
    {
        abort_unless($competition->status === 'published', 404);

        $isRegistered = $competition->registeredUsers()
            ->whereKey(Auth::id())
            ->exists();
        $hasStarted = $competition->starts_at->isPast();
        $hasEnded = $competition->ends_at->isPast();

        $problems = collect();

        if ($isRegistered && $hasStarted) {
            $problems = $competition->problems()
                ->select(['id', 'competition_id', 'code', 'title', 'time_limit_ms', 'memory_limit_mb', 'score'])
                ->orderBy('code')
                ->get();
        }

        return Inertia::render('Competitions/Show', [
            'competition' => [
                'id' => $competition->id,
                'title' => $competition->title,
                'description' => $competition->description,
                'rules' => $competition->rules,
                'starts_at' => $competition->starts_at->toIso8601String(),
                'ends_at' => $competition->ends_at->toIso8601String(),
                'registration_type' => $competition->registration_type,
                'registration_label' => Competition::REGISTRATION_TYPES[$competition->registration_type],
                'language_labels' => collect($competition->allowed_languages)
                    ->map(fn (string $language): string => Competition::LANGUAGES[$language])
                    ->values()
                    ->all(),
                'registered_users_count' => $competition->registeredUsers()->count(),
                'is_registered' => $isRegistered,
                'can_register' => ! $isRegistered
                    && $competition->registration_type === 'open'
                    && ! $hasEnded,
                'can_unregister' => $isRegistered && ! $hasStarted,
                'has_started' => $hasStarted,
                'has_ended' => $hasEnded,
                'problems' => $problems->map(fn (Problem $problem): array => [
                    'id' => $problem->id,
                    'code' => $problem->code,
                    'title' => $problem->title,
                    'time_limit_ms' => $problem->time_limit_ms,
                    'memory_limit_mb' => $problem->memory_limit_mb,
                    'score' => $problem->score,
                ])->values()->all(),
            ],
        ]);
    }
}
