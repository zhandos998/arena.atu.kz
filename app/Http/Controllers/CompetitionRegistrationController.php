<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CompetitionRegistrationController extends Controller
{
    public function store(Request $request, Competition $competition): RedirectResponse
    {
        abort_unless($competition->status === 'published', 404);
        abort_unless($competition->registration_type === 'open', 422, 'Регистрация на это соревнование закрыта.');
        abort_if($competition->ends_at->isPast(), 422, 'Регистрация завершена: соревнование уже закончилось.');

        $competition->registeredUsers()->syncWithoutDetaching([$request->user()->id]);

        return back()->with('success', 'Вы зарегистрированы на соревнование.');
    }

    public function destroy(Request $request, Competition $competition): RedirectResponse
    {
        abort_unless($competition->status === 'published', 404);
        abort_if($competition->starts_at->isPast(), 422, 'После начала соревнования отменить регистрацию нельзя.');

        $competition->registeredUsers()->detach($request->user()->id);

        return back()->with('success', 'Регистрация отменена.');
    }
}
