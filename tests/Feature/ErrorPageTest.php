<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ErrorPageTest extends TestCase
{
    public function test_html_404_uses_custom_error_page(): void
    {
        $this->withSession(['locale' => 'en'])
            ->get('/missing-page-for-error-test')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Error')
                ->where('status', 404)
                ->where('locale', 'en')
                ->has('locales', 3)
            );
    }

    public function test_json_404_remains_json(): void
    {
        $this->getJson('/missing-api-page')
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    }
}
