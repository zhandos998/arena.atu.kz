<?php

namespace Database\Factories;

use App\Models\Competition;
use App\Models\Problem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Problem>
 */
class ProblemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'competition_id' => Competition::factory(),
            'code' => strtoupper(fake()->unique()->bothify('?##')),
            'title' => fake()->sentence(3),
            'statement' => fake()->paragraphs(3, true),
            'input_format' => fake()->paragraph(),
            'output_format' => fake()->paragraph(),
            'constraints' => '1 ≤ n ≤ 100000',
            'time_limit_ms' => 1000,
            'memory_limit_mb' => 256,
            'score' => 100,
        ];
    }
}
