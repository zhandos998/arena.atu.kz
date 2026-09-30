<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use Illuminate\Http\RedirectResponse;

class PublishedCompetitionController extends Controller
{
    public function store(Competition $competition): RedirectResponse
    {
        abort_unless($competition->status === 'draft', 422, 'Опубликовать можно только черновик.');
        abort_unless($competition->problems()->exists(), 422, 'Перед публикацией добавьте хотя бы одну задачу.');

        $competition->update(['status' => 'published']);

        return back()->with('success', 'Соревнование опубликовано и доступно участникам.');
    }

    public function destroy(Competition $competition): RedirectResponse
    {
        abort_unless($competition->status === 'published', 422);
        abort_if($competition->starts_at->isPast(), 422, 'Нельзя снять с публикации начавшееся соревнование.');

        $competition->update(['status' => 'draft']);

        return back()->with('success', 'Соревнование возвращено в черновик.');
    }
}
