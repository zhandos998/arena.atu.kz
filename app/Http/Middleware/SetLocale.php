<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @var array<int, string>
     */
    private const SUPPORTED_LOCALES = ['kk', 'ru', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('atu_locale')
            ?? $request->session()->get('locale', config('app.locale'));

        if (! in_array($locale, self::SUPPORTED_LOCALES, true)) {
            $locale = 'ru';
        }

        App::setLocale($locale);

        return $next($request);
    }
}
