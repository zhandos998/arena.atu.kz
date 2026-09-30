<?php

namespace App\Http\Requests\Admin;

use App\Models\Competition;
use App\Models\Problem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreProblemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $competition = $this->route('competition');
        $competitionId = $competition instanceof Competition ? $competition->getKey() : $competition;
        $uniqueCode = Rule::unique('problems', 'code')->where('competition_id', $competitionId);
        $problem = $this->route('problem');

        if ($problem instanceof Problem) {
            $uniqueCode->ignore($problem);
        }

        return [
            'code' => [
                'required',
                'string',
                'max:10',
                'regex:/^[A-Z0-9_-]+$/',
                $uniqueCode,
            ],
            'title' => ['required', 'string', 'max:150'],
            'statement' => ['required', 'string', 'max:30000'],
            'input_format' => ['nullable', 'string', 'max:10000'],
            'output_format' => ['nullable', 'string', 'max:10000'],
            'constraints' => ['nullable', 'string', 'max:5000'],
            'time_limit_ms' => ['required', 'integer', 'between:100,10000'],
            'memory_limit_mb' => ['required', 'integer', 'between:16,1024'],
            'score' => ['required', 'integer', 'between:1,1000'],
            'samples' => ['required', 'array', 'min:1', 'max:10'],
            'samples.*.input' => ['required', 'string', 'max:30000'],
            'samples.*.output' => ['required', 'string', 'max:30000'],
        ];
    }

    /**
     * Normalize the problem code before validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge([
                'code' => Str::upper($this->string('code')->trim()->toString()),
            ]);
        }
    }

    /**
     * Get the validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Введите код задачи.',
            'code.max' => 'Код задачи не должен быть длиннее 10 символов.',
            'code.regex' => 'Код может содержать только латинские буквы, цифры, дефис и подчёркивание.',
            'code.unique' => 'Задача с таким кодом уже есть в этом соревновании.',
            'title.required' => 'Введите название задачи.',
            'title.max' => 'Название не должно быть длиннее 150 символов.',
            'statement.required' => 'Добавьте условие задачи.',
            'statement.max' => 'Условие задачи слишком длинное.',
            'input_format.max' => 'Описание входных данных слишком длинное.',
            'output_format.max' => 'Описание выходных данных слишком длинное.',
            'constraints.max' => 'Ограничения слишком длинные.',
            'time_limit_ms.required' => 'Укажите лимит времени.',
            'time_limit_ms.integer' => 'Лимит времени должен быть целым числом.',
            'time_limit_ms.between' => 'Лимит времени должен быть от 100 до 10000 мс.',
            'memory_limit_mb.required' => 'Укажите лимит памяти.',
            'memory_limit_mb.integer' => 'Лимит памяти должен быть целым числом.',
            'memory_limit_mb.between' => 'Лимит памяти должен быть от 16 до 1024 МБ.',
            'score.required' => 'Укажите количество баллов.',
            'score.integer' => 'Баллы должны быть целым числом.',
            'score.between' => 'Количество баллов должно быть от 1 до 1000.',
            'samples.required' => 'Добавьте хотя бы один пример.',
            'samples.min' => 'Добавьте хотя бы один пример.',
            'samples.max' => 'Можно добавить не более 10 примеров.',
            'samples.*.input.required' => 'Заполните входные данные примера.',
            'samples.*.input.max' => 'Входные данные примера слишком длинные.',
            'samples.*.output.required' => 'Заполните ожидаемый результат примера.',
            'samples.*.output.max' => 'Результат примера слишком длинный.',
        ];
    }
}
