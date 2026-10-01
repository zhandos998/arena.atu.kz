<?php

use App\Http\Controllers\Admin\ArchivedCompetitionController;
use App\Http\Controllers\Admin\CompetitionController as AdminCompetitionController;
use App\Http\Controllers\Admin\CompetitionParticipantController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProblemController as AdminProblemController;
use App\Http\Controllers\Admin\ProblemImageController;
use App\Http\Controllers\Admin\ProblemJudgeSettingsController;
use App\Http\Controllers\Admin\ProblemTestCaseController;
use App\Http\Controllers\Admin\PublishedCompetitionController;
use App\Http\Controllers\Admin\SubmissionController as AdminSubmissionController;
use App\Http\Controllers\Admin\TestDashboardController;
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\CompetitionRegistrationController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ParticipantDashboardController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::post('/locale', LocaleController::class)->name('locale.update');

Route::get('/dashboard', ParticipantDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('competitions', CompetitionController::class)
        ->only(['index', 'show']);
    Route::post('competitions/{competition}/registration', [CompetitionRegistrationController::class, 'store'])
        ->name('competitions.registration.store');
    Route::delete('competitions/{competition}/registration', [CompetitionRegistrationController::class, 'destroy'])
        ->name('competitions.registration.destroy');
    Route::get('competitions/{competition}/problems/{problem}', [ProblemController::class, 'show'])
        ->name('competitions.problems.show');
    Route::post('competitions/{competition}/problems/{problem}/submissions', [SubmissionController::class, 'store'])
        ->middleware('throttle:30,1')
        ->name('competitions.problems.submissions.store');
    Route::get('submissions/{submission}', [SubmissionController::class, 'show'])
        ->name('submissions.show');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');
        Route::resource('competitions', AdminCompetitionController::class)
            ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::post('competitions/{competition}/published', [PublishedCompetitionController::class, 'store'])
            ->name('competitions.published.store');
        Route::delete('competitions/{competition}/published', [PublishedCompetitionController::class, 'destroy'])
            ->name('competitions.published.destroy');
        Route::post('competitions/{competition}/archived', [ArchivedCompetitionController::class, 'store'])
            ->name('competitions.archived.store');
        Route::delete('competitions/{competition}/archived', [ArchivedCompetitionController::class, 'destroy'])
            ->name('competitions.archived.destroy');
        Route::post('competitions/{competition}/participants', [CompetitionParticipantController::class, 'store'])
            ->name('competitions.participants.store');
        Route::delete('competitions/{competition}/participants/{user}', [CompetitionParticipantController::class, 'destroy'])
            ->name('competitions.participants.destroy');
        Route::get('problems', [AdminProblemController::class, 'index'])
            ->name('problems.index');
        Route::post('problem-images', ProblemImageController::class)
            ->middleware('throttle:30,1')
            ->name('problem-images.store');
        Route::get('tests', TestDashboardController::class)->name('tests.index');
        Route::get('submissions', [AdminSubmissionController::class, 'index'])->name('submissions.index');
        Route::resource('competitions.problems', AdminProblemController::class)
            ->only(['create', 'store', 'show', 'edit', 'update'])
            ->scoped();
        Route::get('competitions/{competition}/problems/{problem}/tests', [ProblemTestCaseController::class, 'index'])
            ->name('competitions.problems.tests.index');
        Route::put('competitions/{competition}/problems/{problem}/tests', [ProblemTestCaseController::class, 'update'])
            ->name('competitions.problems.tests.update');
        Route::put('competitions/{competition}/problems/{problem}/judge-settings', [ProblemJudgeSettingsController::class, 'update'])
            ->name('competitions.problems.judge-settings.update');
    });

require __DIR__.'/auth.php';

Route::fallback(fn () => abort(404));
