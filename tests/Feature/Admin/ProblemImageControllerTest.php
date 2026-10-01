<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProblemImageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_upload_problem_image(): void
    {
        $response = $this->postJson(route('admin.problem-images.store'), [
            'image' => UploadedFile::fake()->image('diagram.png'),
        ]);

        $response->assertUnauthorized();
    }

    public function test_regular_user_cannot_upload_problem_image(): void
    {
        $response = $this->actingAs(User::factory()->create())->postJson(
            route('admin.problem-images.store'),
            ['image' => UploadedFile::fake()->image('diagram.png')],
        );

        $response->assertForbidden();
    }

    public function test_administrator_can_upload_problem_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson(
            route('admin.problem-images.store'),
            ['image' => UploadedFile::fake()->image('diagram.png', 1200, 800)],
        );

        $response->assertCreated()
            ->assertJsonStructure(['url']);

        $path = str($response->json('url'))->after('/storage/')->toString();
        Storage::disk('public')->assertExists($path);
    }

    public function test_problem_image_must_be_a_supported_safe_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson(
            route('admin.problem-images.store'),
            ['image' => UploadedFile::fake()->create('diagram.svg', 20, 'image/svg+xml')],
        );

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('image');
        Storage::disk('public')->assertDirectoryEmpty('problem-images');
    }
}
