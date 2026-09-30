<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProblemJudgeSettingsRequest;
use App\Models\Competition;
use App\Models\Problem;
use Illuminate\Http\RedirectResponse;

class ProblemJudgeSettingsController extends Controller
{
    public function update(
        UpdateProblemJudgeSettingsRequest $request,
        Competition $competition,
        Problem $problem,
    ): RedirectResponse {
        abort_unless($problem->competition_id === $competition->id, 404);

        $problem->update($request->validated());

        return back()->with('success', 'Настройки проверки сохранены.');
    }
}
