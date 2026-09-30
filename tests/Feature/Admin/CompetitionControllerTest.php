<?php

namespace Tests\Feature\Admin;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompetitionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->post(route('admin.competitions.store'), $this->validPayload());

        $response->assertRedirect(route('login'));
        $this->assertDatabaseEmpty('competitions');
    }

    public function test_regular_user_is_forbidden_from_creating_competition(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('admin.competitions.store'), $this->validPayload());

        $response->assertForbidden();
        $this->assertDatabaseEmpty('competitions');
    }

    public function test_administrator_can_view_competitions(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create([
            'title' => 'ATU Autumn Cup',
        ]);
        Problem::factory()->count(2)->for($competition)->create();

        $response = $this->actingAs($admin)->get(route('admin.competitions.index'));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Competitions/Index')
            ->has('competitions.data', 1)
            ->where('competitions.data.0.title', 'ATU Autumn Cup')
            ->where('competitions.data.0.status_label', 'Черновик')
            ->where('competitions.data.0.language_labels', ['C++ 20', 'Python 3'])
            ->where('competitions.data.0.problems_count', 2)
        );
    }

    public function test_administrator_can_view_create_form(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('admin.competitions.create'));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Competitions/Create')
            ->has('options.statuses', 1)
            ->has('options.registrationTypes', 2)
            ->has('options.languages', 6)
            ->where('options.languages.3.value', 'go')
            ->where('options.languages.3.label', 'Go 1.27')
        );
    }

    public function test_administrator_can_create_competition(): void
    {
        $admin = User::factory()->admin()->create();
        $anotherUser = User::factory()->create();
        $payload = [
            ...$this->validPayload(),
            'created_by' => $anotherUser->id,
        ];

        $response = $this->actingAs($admin)
            ->post(route('admin.competitions.store'), $payload);

        $response
            ->assertRedirect(route('admin.competitions.index'))
            ->assertSessionHas('success', 'Соревнование успешно создано.');
        $this->assertDatabaseHas('competitions', [
            'title' => 'ATU Programming Cup 2026',
            'created_by' => $admin->id,
            'status' => 'draft',
            'registration_type' => 'open',
        ]);

        $competition = Competition::query()->sole();

        $this->assertSame(['cpp', 'python'], $competition->allowed_languages);
    }

    public function test_new_competition_is_always_created_as_draft(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.competitions.store'), [
                ...$this->validPayload(),
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.competitions.index'));

        $this->assertDatabaseHas('competitions', ['status' => 'draft']);
    }

    public function test_required_competition_fields_are_validated(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->post(route('admin.competitions.store'), []);

        $response->assertSessionHasErrors([
            'title' => 'Введите название соревнования.',
            'starts_at' => 'Укажите дату и время начала.',
            'ends_at' => 'Укажите дату и время окончания.',
            'status',
            'registration_type',
            'allowed_languages' => 'Выберите хотя бы один язык программирования.',
        ]);
        $this->assertDatabaseEmpty('competitions');
    }

    public function test_competition_end_must_be_after_start(): void
    {
        $admin = User::factory()->admin()->create();
        $payload = [
            ...$this->validPayload(),
            'ends_at' => '2026-10-20 08:59:00',
        ];

        $response = $this->actingAs($admin)
            ->post(route('admin.competitions.store'), $payload);

        $response->assertSessionHasErrors([
            'ends_at' => 'Окончание должно быть позже начала.',
        ]);
        $this->assertDatabaseEmpty('competitions');
    }

    public function test_competition_options_must_be_supported(): void
    {
        $admin = User::factory()->admin()->create();
        $payload = [
            ...$this->validPayload(),
            'status' => 'secret',
            'registration_type' => 'vip',
            'allowed_languages' => ['brainfuck'],
        ];

        $response = $this->actingAs($admin)
            ->post(route('admin.competitions.store'), $payload);

        $response->assertSessionHasErrors([
            'status' => 'Выберите допустимый статус соревнования.',
            'registration_type' => 'Выберите допустимый тип регистрации.',
            'allowed_languages.0' => 'Выбран неподдерживаемый язык программирования.',
        ]);
        $this->assertDatabaseEmpty('competitions');
    }

    public function test_administrator_can_edit_competition_and_rules(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $payload = [
            ...$this->validPayload(),
            'title' => 'Обновлённый турнир',
            'rules' => 'Одна команда — один аккаунт.',
        ];

        $this->actingAs($admin)
            ->get(route('admin.competitions.edit', $competition))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Admin/Competitions/Edit')
                ->where('competition.id', $competition->id)
            );

        $this->actingAs($admin)
            ->put(route('admin.competitions.update', $competition), $payload)
            ->assertRedirect(route('admin.competitions.show', $competition));

        $this->assertDatabaseHas('competitions', [
            'id' => $competition->id,
            'title' => 'Обновлённый турнир',
            'rules' => 'Одна команда — один аккаунт.',
        ]);
    }

    public function test_competition_requires_a_problem_before_publication(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->create();

        $this->actingAs($admin)
            ->post(route('admin.competitions.published.store', $competition))
            ->assertUnprocessable();

        $this->assertSame('draft', $competition->refresh()->status);
    }

    public function test_administrator_can_publish_archive_and_restore_competition(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->create();
        Problem::factory()->for($competition)->create();

        $this->actingAs($admin)
            ->post(route('admin.competitions.published.store', $competition))
            ->assertRedirect();
        $this->assertSame('published', $competition->refresh()->status);

        $this->actingAs($admin)
            ->post(route('admin.competitions.archived.store', $competition))
            ->assertRedirect();
        $this->assertSame('archived', $competition->refresh()->status);

        $this->actingAs($admin)
            ->delete(route('admin.competitions.archived.destroy', $competition))
            ->assertRedirect();
        $this->assertSame('draft', $competition->refresh()->status);
    }

    public function test_only_empty_draft_can_be_deleted(): void
    {
        $admin = User::factory()->admin()->create();
        $participant = User::factory()->create();
        $competition = Competition::factory()->create();
        $competition->registeredUsers()->attach($participant);

        $this->actingAs($admin)
            ->delete(route('admin.competitions.destroy', $competition))
            ->assertUnprocessable();

        $competition->registeredUsers()->detach($participant);

        $this->actingAs($admin)
            ->delete(route('admin.competitions.destroy', $competition))
            ->assertRedirect(route('admin.competitions.index'));

        $this->assertModelMissing($competition);
    }

    public function test_administrator_can_add_and_remove_participant(): void
    {
        $admin = User::factory()->admin()->create();
        $participant = User::factory()->create();
        $competition = Competition::factory()->create(['registration_type' => 'closed']);

        $this->actingAs($admin)
            ->post(route('admin.competitions.participants.store', $competition), [
                'email' => $participant->email,
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('competition_user', [
            'competition_id' => $competition->id,
            'user_id' => $participant->id,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.competitions.participants.destroy', [$competition, $participant]))
            ->assertRedirect();

        $this->assertDatabaseEmpty('competition_user');
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'title' => 'ATU Programming Cup 2026',
            'description' => 'Университетское соревнование по программированию.',
            'starts_at' => '2026-10-20 09:00:00',
            'ends_at' => '2026-10-20 13:00:00',
            'status' => 'draft',
            'registration_type' => 'open',
            'allowed_languages' => ['cpp', 'python'],
        ];
    }
}
