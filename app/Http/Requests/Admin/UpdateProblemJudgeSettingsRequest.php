<?php

namespace App\Http\Requests\Admin;

use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProblemJudgeSettingsRequest extends FormRequest
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
        return [
            'checker_type' => ['required', Rule::in(['tokens', 'exact'])],
            'reference_language' => ['nullable', 'required_with:reference_solution', Rule::in(array_keys(Competition::LANGUAGES))],
            'reference_solution' => ['nullable', 'string', 'max:100000'],
        ];
    }
}
