<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => ['required', Rule::in(['kk', 'ru', 'en'])],
        ]);

        $request->session()->put('locale', $validated['locale']);

        return back(303)->withCookie(cookie()->forever('atu_locale', $validated['locale']));
    }
}
