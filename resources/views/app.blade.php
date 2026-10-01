<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'ATU Code Arena') }}</title>

        <script>
            try {
                const theme = localStorage.getItem('atu-color-theme');
                const dark = theme !== 'light';
                document.documentElement.classList.toggle('dark', dark);
                document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
            } catch {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
            }
        </script>
        <meta name="theme-color" content="#193f7d">
        <meta name="description" content="{{ match (app()->getLocale()) {
            'kk' => 'ATU Code Arena — Алматы технологиялық университетінің бағдарламалау жарыстары платформасы.',
            'en' => 'ATU Code Arena — the programming competition platform of Almaty Technological University.',
            default => 'ATU Code Arena — платформа соревнований по программированию Алматинского технологического университета.',
        } }}">
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
