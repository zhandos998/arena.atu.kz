<?php

namespace App\Http\Requests\Admin;

use App\Models\Problem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProblemTestCasesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->isAdmin();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $problem = $this->route('problem');
        $problemId = $problem instanceof Problem ? $problem->id : $problem;

        return [
            'tests' => ['present', 'array', 'max:200'],
            'tests.*.id' => [
                'nullable',
                'integer',
                Rule::exists('problem_test_cases', 'id')->where('problem_id', $problemId),
            ],
            'tests.*.input' => ['present', 'string', 'max:1000000'],
            'tests.*.expected_output' => ['present', 'string', 'max:1000000'],
            'tests.*.points' => ['required', 'integer', 'between:1,1000'],
            'tests.*.is_enabled' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tests.max' => 'Для одной задачи можно сохранить не более 200 тестов.',
            'tests.*.input.present' => 'Укажите входные данные теста.',
            'tests.*.expected_output.present' => 'Укажите ожидаемый ответ теста.',
            'tests.*.points.between' => 'Вес теста должен быть от 1 до 1000.',
        ];
    }
}
