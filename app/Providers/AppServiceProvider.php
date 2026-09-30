<?php

namespace App\Providers;

use App\Services\Judge\Contracts\CodeRunner;
use App\Services\Judge\DockerCodeRunner;
use Illuminate\Foundation\DevCommands;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CodeRunner::class, DockerCodeRunner::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        DevCommands::artisan(
            'queue:listen --queue=judge,default --tries=2 --timeout=900',
            'queue',
        );
    }
}
