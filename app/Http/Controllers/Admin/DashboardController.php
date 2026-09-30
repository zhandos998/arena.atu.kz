<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use App\Models\Problem;
use App\Models\Submission;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'participants' => User::query()->where('is_admin', false)->count(),
                'competitions' => Competition::query()->count(),
                'problems' => Problem::query()->count(),
                'submissions' => Submission::query()->count(),
            ],
        ]);
    }
}
