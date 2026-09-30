<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompetitionParticipantRequest;
use App\Models\Competition;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class CompetitionParticipantController extends Controller
{
    public function store(StoreCompetitionParticipantRequest $request, Competition $competition): RedirectResponse
    {
        $user = User::query()
            ->where('email', $request->validated('email'))
            ->firstOrFail();

        $competition->registeredUsers()->syncWithoutDetaching([$user->id]);

        return back()->with('success', 'Участник добавлен в соревнование.');
    }

    public function destroy(Competition $competition, User $user): RedirectResponse
    {
        $competition->registeredUsers()->detach($user->id);

        return back()->with('success', 'Участник удалён из соревнования.');
    }
}
