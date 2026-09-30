<?php

namespace Tests\Feature\Admin;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\ProblemSample;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProblemControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_problem_index_to_login(): void
    {
        $response = $this->get(route('admin.problems.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_regular_user_is_forbidden_from_problem_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.problems.index'));

        $response->assertForbidden();
    }

    public function test_administrator_can_view_problem_index(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create([
            'title' => 'ATU Algorithms Cup',
        ]);
        $problem = Problem::factory()->for($competition)->create([
            'code' => 'A',
            'title' => 'Конечные автоматы',
        ]);
        ProblemSample::factory()->for($problem)->create();

        $response = $this->actingAs($admin)->get(route('admin.problems.index'));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Problems/Index')
            ->has('problems.data', 1)
            ->where('problems.data.0.title', 'Конечные автоматы')
            ->where('problems.data.0.competition_title', 'ATU Algorithms Cup')
            ->where('problems.data.0.samples_count', 1)
            ->has('competitions', 1)
            ->where('stats.total', 1)
            ->where('stats.with_samples', 1)
            ->where('stats.competitions', 1)
            ->where('filters.competition', null)
        );
    }

    public function test_problem_index_can_be_filtered_by_competition(): void
    {
        $admin = User::factory()->admin()->create();
        $firstCompetition = Competition::factory()->for($admin, 'creator')->create();
        $secondCompetition = Competition::factory()->for($admin, 'creator')->create();
        Problem::factory()->for($firstCompetition)->create(['code' => 'A']);
        Problem::factory()->for($secondCompetition)->create(['code' => 'B']);

        $response = $this->actingAs($admin)->get(route('admin.problems.index', [
            'competition' => $secondCompetition->id,
        ]));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Problems/Index')
            ->has('problems.data', 1)
            ->where('problems.data.0.code', 'B')
            ->where('problems.data.0.competition_id', $secondCompetition->id)
            ->where('filters.competition', $secondCompetition->id)
        );
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $competition = Competition::factory()->create();

        $response = $this->post(
            route('admin.competitions.problems.store', $competition),
            $this->validPayload(),
        );

        $response->assertRedirect(route('login'));
        $this->assertDatabaseEmpty('problems');
    }

    public function test_regular_user_is_forbidden_from_creating_problem(): void
    {
        $user = User::factory()->create();
        $competition = Competition::factory()->create();

        $response = $this->actingAs($user)->post(
            route('admin.competitions.problems.store', $competition),
            $this->validPayload(),
        );

        $response->assertForbidden();
        $this->assertDatabaseEmpty('problems');
    }

    public function test_administrator_can_view_problem_create_form(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create([
            'title' => 'ATU Spring Cup',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.competitions.problems.create', $competition));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Problems/Create')
            ->where('competition.id', $competition->id)
            ->where('competition.title', 'ATU Spring Cup')
        );
    }

    public function test_administrator_can_view_competition_with_problems(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        Problem::factory()->for($competition)->create([
            'code' => 'A',
            'title' => 'Сумма двух чисел',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.competitions.show', $competition));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Competitions/Show')
            ->where('competition.id', $competition->id)
            ->has('competition.problems', 1)
            ->where('competition.problems.0.code', 'A')
            ->where('competition.problems.0.title', 'Сумма двух чисел')
        );
    }

    public function test_administrator_can_add_problem_to_competition(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $anotherCompetition = Competition::factory()->for($admin, 'creator')->create();
        $payload = [
            ...$this->validPayload(),
            'code' => ' a ',
            'competition_id' => $anotherCompetition->id,
        ];

        $response = $this->actingAs($admin)->post(
            route('admin.competitions.problems.store', $competition),
            $payload,
        );
        $problem = Problem::query()->sole();

        $response
            ->assertRedirect(route('admin.competitions.problems.show', [$competition, $problem]))
            ->assertSessionHas('success', 'Задача и примеры успешно добавлены.');
        $this->assertDatabaseHas('problems', [
            'competition_id' => $competition->id,
            'code' => 'A',
            'title' => 'Сумма двух чисел',
            'time_limit_ms' => 1000,
            'memory_limit_mb' => 256,
            'score' => 100,
        ]);
        $this->assertDatabaseMissing('problems', [
            'competition_id' => $anotherCompetition->id,
            'code' => 'A',
        ]);
        $this->assertDatabaseHas('problem_samples', [
            'problem_id' => $problem->id,
            'position' => 1,
            'input' => "2\n1 2\n3 4",
            'output' => "3\n7",
        ]);
    }

    public function test_required_problem_fields_are_validated(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();

        $response = $this->actingAs($admin)->post(
            route('admin.competitions.problems.store', $competition),
            [],
        );

        $response->assertSessionHasErrors([
            'code' => 'Введите код задачи.',
            'title' => 'Введите название задачи.',
            'statement' => 'Добавьте условие задачи.',
            'time_limit_ms' => 'Укажите лимит времени.',
            'memory_limit_mb' => 'Укажите лимит памяти.',
            'score' => 'Укажите количество баллов.',
            'samples' => 'Добавьте хотя бы один пример.',
        ]);
        $this->assertDatabaseEmpty('problems');
    }

    public function test_problem_code_must_be_unique_within_competition(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        Problem::factory()->for($competition)->create(['code' => 'A']);

        $response = $this->actingAs($admin)->post(
            route('admin.competitions.problems.store', $competition),
            $this->validPayload(),
        );

        $response->assertSessionHasErrors([
            'code' => 'Задача с таким кодом уже есть в этом соревновании.',
        ]);
        $this->assertSame(1, $competition->problems()->count());
    }

    public function test_same_problem_code_can_be_used_in_another_competition(): void
    {
        $admin = User::factory()->admin()->create();
        $firstCompetition = Competition::factory()->for($admin, 'creator')->create();
        $secondCompetition = Competition::factory()->for($admin, 'creator')->create();
        Problem::factory()->for($firstCompetition)->create(['code' => 'A']);

        $response = $this->actingAs($admin)->post(
            route('admin.competitions.problems.store', $secondCompetition),
            $this->validPayload(),
        );

        $problem = Problem::query()->whereBelongsTo($secondCompetition)->sole();

        $response->assertRedirect(route('admin.competitions.problems.show', [$secondCompetition, $problem]));
        $this->assertDatabaseHas('problems', [
            'competition_id' => $secondCompetition->id,
            'code' => 'A',
        ]);
    }

    public function test_problem_limits_and_code_format_are_validated(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $payload = [
            ...$this->validPayload(),
            'code' => 'A.1',
            'time_limit_ms' => 99,
            'memory_limit_mb' => 1025,
            'score' => 0,
        ];

        $response = $this->actingAs($admin)->post(
            route('admin.competitions.problems.store', $competition),
            $payload,
        );

        $response->assertSessionHasErrors([
            'code' => 'Код может содержать только латинские буквы, цифры, дефис и подчёркивание.',
            'time_limit_ms' => 'Лимит времени должен быть от 100 до 10000 мс.',
            'memory_limit_mb' => 'Лимит памяти должен быть от 16 до 1024 МБ.',
            'score' => 'Количество баллов должно быть от 1 до 1000.',
        ]);
        $this->assertDatabaseEmpty('problems');
    }

    public function test_administrator_can_preview_problem_with_samples(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $problem = Problem::factory()->for($competition)->create([
            'code' => 'A',
            'statement' => 'Вычислите значение формулы.',
        ]);
        ProblemSample::factory()->for($problem)->create([
            'input' => "2\n15 20\n1000 26000",
            'output' => "48767\n1340237",
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.competitions.problems.show', [$competition, $problem]));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Problems/Show')
            ->where('problem.statement', 'Вычислите значение формулы.')
            ->has('problem.samples', 1)
            ->where('problem.samples.0.input', "2\n15 20\n1000 26000")
            ->where('problem.samples.0.output', "48767\n1340237")
        );
    }

    public function test_administrator_can_view_problem_edit_form(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $problem = Problem::factory()->for($competition)->create(['code' => 'B']);
        ProblemSample::factory()->for($problem)->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.competitions.problems.edit', [$competition, $problem]));

        $response->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Problems/Edit')
            ->where('problem.id', $problem->id)
            ->where('problem.code', 'B')
            ->has('problem.samples', 1)
        );
    }

    public function test_administrator_can_update_problem_and_replace_samples(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $problem = Problem::factory()->for($competition)->create(['code' => 'A']);
        ProblemSample::factory()->for($problem)->create([
            'input' => 'old input',
            'output' => 'old output',
        ]);
        $payload = [
            ...$this->validPayload(),
            'code' => 'A',
            'title' => 'Конечные автоматы',
            'samples' => [
                ['input' => "4\n2 0", 'output' => '44344'],
                ['input' => "2\n15 20", 'output' => '48767'],
            ],
        ];

        $response = $this->actingAs($admin)->put(
            route('admin.competitions.problems.update', [$competition, $problem]),
            $payload,
        );

        $response
            ->assertRedirect(route('admin.competitions.problems.show', [$competition, $problem]))
            ->assertSessionHas('success', 'Изменения задачи сохранены.');
        $this->assertDatabaseHas('problems', [
            'id' => $problem->id,
            'title' => 'Конечные автоматы',
        ]);
        $this->assertDatabaseMissing('problem_samples', ['input' => 'old input']);
        $this->assertDatabaseHas('problem_samples', [
            'problem_id' => $problem->id,
            'position' => 2,
            'input' => "2\n15 20",
            'output' => '48767',
        ]);
        $this->assertSame(2, $problem->samples()->count());
    }

    public function test_problem_from_another_competition_returns_not_found(): void
    {
        $admin = User::factory()->admin()->create();
        $firstCompetition = Competition::factory()->for($admin, 'creator')->create();
        $secondCompetition = Competition::factory()->for($admin, 'creator')->create();
        $problem = Problem::factory()->for($firstCompetition)->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.competitions.problems.show', [$secondCompetition, $problem]));

        $response->assertNotFound();
    }

    public function test_public_sample_input_and_output_are_required(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->for($admin, 'creator')->create();
        $payload = [
            ...$this->validPayload(),
            'samples' => [['input' => '', 'output' => '']],
        ];

        $response = $this->actingAs($admin)->post(
            route('admin.competitions.problems.store', $competition),
            $payload,
        );

        $response->assertSessionHasErrors([
            'samples.0.input' => 'Заполните входные данные примера.',
            'samples.0.output' => 'Заполните ожидаемый результат примера.',
        ]);
        $this->assertDatabaseEmpty('problems');
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'code' => 'A',
            'title' => 'Сумма двух чисел',
            'statement' => 'Даны два целых числа. Выведите их сумму.',
            'input_format' => 'В одной строке записаны два целых числа a и b.',
            'output_format' => 'Выведите сумму a + b.',
            'constraints' => '-10^9 ≤ a, b ≤ 10^9',
            'time_limit_ms' => 1000,
            'memory_limit_mb' => 256,
            'score' => 100,
            'samples' => [
                [
                    'input' => "2\n1 2\n3 4",
                    'output' => "3\n7",
                ],
            ],
        ];
    }
}
