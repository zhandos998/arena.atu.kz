<?php

namespace Tests\Feature\Admin;

use App\Models\Competition;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProblemTestCaseControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_administrator_can_open_hidden_tests_page(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->create();
        $problem = Problem::factory()->for($competition)->create();
        $problem->testCases()->create([
            'position' => 1,
            'input' => '2 3',
            'expected_output' => '5',
            'points' => 2,
            'is_enabled' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.competitions.problems.tests.index', [$competition, $problem]))
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('Admin/Problems/Tests/Index')
                ->has('problem.tests', 1)
                ->where('problem.tests.0.expected_output', '5')
                ->has('options.languages', 6)
            );
    }

    public function test_administrator_can_bulk_create_update_reorder_and_delete_tests(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->create();
        $problem = Problem::factory()->for($competition)->create();
        $first = $problem->testCases()->create([
            'position' => 1,
            'input' => 'old one',
            'expected_output' => '1',
            'points' => 1,
            'is_enabled' => true,
        ]);
        $removed = $problem->testCases()->create([
            'position' => 2,
            'input' => 'remove me',
            'expected_output' => '2',
            'points' => 1,
            'is_enabled' => true,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.competitions.problems.tests.update', [$competition, $problem]), [
                'tests' => [
                    [
                        'input' => 'new first',
                        'expected_output' => '10',
                        'points' => 3,
                        'is_enabled' => true,
                    ],
                    [
                        'id' => $first->id,
                        'input' => 'updated second',
                        'expected_output' => '20',
                        'points' => 5,
                        'is_enabled' => false,
                    ],
                ],
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('problem_test_cases', ['id' => $removed->id]);
        $this->assertDatabaseHas('problem_test_cases', [
            'problem_id' => $problem->id,
            'position' => 1,
            'input' => 'new first',
        ]);
        $this->assertDatabaseHas('problem_test_cases', [
            'id' => $first->id,
            'position' => 2,
            'input' => 'updated second',
            'is_enabled' => false,
        ]);
        $this->assertSame(2, $problem->testCases()->count());
    }

    public function test_test_id_must_belong_to_the_same_problem(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->create();
        $problem = Problem::factory()->for($competition)->create();
        $foreignProblem = Problem::factory()->for($competition)->create();
        $foreignTest = $foreignProblem->testCases()->create([
            'position' => 1,
            'input' => 'x',
            'expected_output' => 'y',
            'points' => 1,
            'is_enabled' => true,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.competitions.problems.tests.update', [$competition, $problem]), [
                'tests' => [[
                    'id' => $foreignTest->id,
                    'input' => 'x',
                    'expected_output' => 'y',
                    'points' => 1,
                    'is_enabled' => true,
                ]],
            ])
            ->assertSessionHasErrors('tests.0.id');
    }

    public function test_administrator_can_save_checker_and_reference_solution(): void
    {
        $admin = User::factory()->admin()->create();
        $competition = Competition::factory()->create();
        $problem = Problem::factory()->for($competition)->create();

        $this->actingAs($admin)
            ->put(route('admin.competitions.problems.judge-settings.update', [$competition, $problem]), [
                'checker_type' => 'exact',
                'reference_language' => 'cpp',
                'reference_solution' => 'int main() {}',
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('problems', [
            'id' => $problem->id,
            'checker_type' => 'exact',
            'reference_language' => 'cpp',
            'reference_solution' => 'int main() {}',
        ]);
    }
}
