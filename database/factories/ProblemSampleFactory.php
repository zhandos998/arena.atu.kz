<?php

namespace Database\Factories;

use App\Models\Problem;
use App\Models\ProblemSample;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProblemSample>
 */
class ProblemSampleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'problem_id' => Problem::factory(),
            'position' => 1,
            'input' => "2\n1 2\n3 4",
            'output' => "3\n7",
        ];
    }
}
