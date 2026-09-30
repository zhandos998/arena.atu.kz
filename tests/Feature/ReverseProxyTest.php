<?php

namespace Tests\Feature;

use Tests\TestCase;

class ReverseProxyTest extends TestCase
{
    public function test_https_forwarded_scheme_generates_secure_urls(): void
    {
        $response = $this
            ->withHeaders([
                'Host' => 'arena.atu.kz',
                'X-Forwarded-Proto' => 'https',
            ])
            ->get('/');

        $response->assertSee('href="https://localhost:8000/favicon.png"', false);
        $response->assertDontSee('href="http://localhost:8000/favicon.png"', false);
    }
}
