<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use Illuminate\Http\RedirectResponse;

class ArchivedCompetitionController extends Controller
{
    public function store(Competition $competition): RedirectResponse
    {
        abort_if($competition->status === 'archived', 422);

        $competition->update(['status' => 'archived']);

        return back()->with('success', 'Соревнование перемещено в архив.');
    }

    public function destroy(Competition $competition): RedirectResponse
    {
        abort_unless($competition->status === 'archived', 422);

        $competition->update(['status' => 'draft']);

        return back()->with('success', 'Соревнование восстановлено как черновик.');
    }
}
