<?php

namespace App\Http\Requests;

use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $competition = $this->route('competition');
        $languages = $competition instanceof Competition ? $competition->allowed_languages : [];

        return [
            'language' => ['required', Rule::in($languages)],
            'source_code' => ['required', 'string', 'max:100000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'language.in' => 'Выбранный язык недоступен в этом соревновании.',
            'source_code.required' => 'Вставьте исходный код решения.',
            'source_code.max' => 'Исходный код не должен превышать 100 000 символов.',
        ];
    }
}
