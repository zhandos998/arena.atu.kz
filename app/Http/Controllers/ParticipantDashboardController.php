<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $competition = $request->user()
            ->registeredCompetitions()
            ->where('status', 'published')
            ->with(['problems' => fn ($query) => $query
                ->select(['id', 'competition_id', 'code', 'title', 'score'])
                ->orderBy('code')])
            ->get()
            ->sortBy(fn (Competition $item): array => [
                $item->starts_at->isPast() && $item->ends_at->isFuture() ? 0 : ($item->starts_at->isFuture() ? 1 : 2),
                abs(now()->diffInSeconds($item->starts_at)),
            ])
            ->first();

        if (! $competition) {
            return Inertia::render('Dashboard', [
                'competition' => null,
                'tasks' => [],
                'leaderboard' => [],
                'stats' => null,
            ]);
        }

        $userSubmissions = Submission::query()
            ->whereBelongsTo($competition)
            ->whereBelongsTo($request->user())
            ->get()
            ->groupBy('problem_id');
        $ranking = $this->ranking($competition, $request->user());
        $currentRow = $ranking->firstWhere('is_current', true);
        $visibleRanking = $ranking->take(5);

        if ($currentRow && ! $visibleRanking->contains('user_id', $request->user()->id)) {
            $visibleRanking = $visibleRanking->push($currentRow);
        }

        $tasks = $competition->starts_at->isPast()
            ? $competition->problems->map(function (Problem $problem) use ($userSubmissions): array {
                $submissions = $userSubmissions->get($problem->id, collect());
                $accepted = $submissions->contains('verdict', 'accepted');

                return [
                    'id' => $problem->id,
                    'code' => $problem->code,
                    'title' => $problem->title,
                    'score' => $problem->score,
                    'status' => $accepted ? 'solved' : ($submissions->isNotEmpty() ? 'attempted' : 'new'),
                    'attempts' => $submissions->count(),
                    'best_score' => (int) $submissions->max('score'),
                ];
            })->values()->all()
            : [];

        return Inertia::render('Dashboard', [
            'competition' => [
                'id' => $competition->id,
                'title' => $competition->title,
                'starts_at' => $competition->starts_at->toIso8601String(),
                'ends_at' => $competition->ends_at->toIso8601String(),
                'has_started' => $competition->starts_at->isPast(),
                'has_ended' => $competition->ends_at->isPast(),
                'problems_count' => $competition->problems->count(),
            ],
            'tasks' => $tasks,
            'leaderboard' => $visibleRanking->values()->all(),
            'stats' => [
                'rank' => $currentRow['rank'] ?? null,
                'solved' => $currentRow['solved'] ?? 0,
                'score' => $currentRow['score'] ?? 0,
                'penalty_minutes' => $currentRow['penalty_minutes'] ?? 0,
            ],
        ]);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function ranking(Competition $competition, User $currentUser): Collection
    {
        $users = $competition->registeredUsers()
            ->select(['users.id', 'name'])
            ->get();
        $submissions = $competition->submissions()
            ->where('status', 'finished')
            ->select(['user_id', 'problem_id', 'verdict', 'score', 'created_at'])
            ->orderBy('created_at')
            ->get()
            ->groupBy('user_id');

        return $users->map(function (User $user) use ($competition, $submissions, $currentUser): array {
            $userSubmissions = $submissions->get($user->id, collect());
            $byProblem = $userSubmissions->groupBy('problem_id');
            $solved = 0;
            $score = 0;
            $penalty = 0;

            foreach ($byProblem as $attempts) {
                $score += (int) $attempts->max('score');
                $accepted = $attempts->firstWhere('verdict', 'accepted');

                if (! $accepted) {
                    continue;
                }

                $solved++;
                $wrongAttempts = $attempts
                    ->where('created_at', '<', $accepted->created_at)
                    ->where('verdict', '!=', 'accepted')
                    ->count();
                $penalty += max(0, (int) $competition->starts_at->diffInMinutes($accepted->created_at, false));
                $penalty += $wrongAttempts * 20;
            }

            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'solved' => $solved,
                'score' => $score,
                'penalty_minutes' => $penalty,
                'is_current' => $user->id === $currentUser->id,
            ];
        })->sortBy([
            ['score', 'desc'],
            ['solved', 'desc'],
            ['penalty_minutes', 'asc'],
            ['name', 'asc'],
        ])->values()->map(fn (array $row, int $index): array => [
            ...$row,
            'rank' => $index + 1,
        ]);
    }
}
