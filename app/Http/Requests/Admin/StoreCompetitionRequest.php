<?php

namespace App\Http\Requests\Admin;

use App\Models\Competition;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCompetitionRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:5000'],
            'rules' => ['nullable', 'string', 'max:10000'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'status' => ['required', Rule::in(array_keys(Competition::STATUSES))],
            'registration_type' => ['required', Rule::in(array_keys(Competition::REGISTRATION_TYPES))],
            'allowed_languages' => ['required', 'array', 'min:1'],
            'allowed_languages.*' => ['string', 'distinct', Rule::in(array_keys(Competition::LANGUAGES))],
        ];
    }

    /**
     * Get the validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Введите название соревнования.',
            'title.max' => 'Название не должно быть длиннее 150 символов.',
            'description.max' => 'Описание не должно быть длиннее 5000 символов.',
            'rules.max' => 'Правила не должны быть длиннее 10000 символов.',
            'starts_at.required' => 'Укажите дату и время начала.',
            'starts_at.date' => 'Укажите корректную дату начала.',
            'ends_at.required' => 'Укажите дату и время окончания.',
            'ends_at.date' => 'Укажите корректную дату окончания.',
            'ends_at.after' => 'Окончание должно быть позже начала.',
            'status.in' => 'Выберите допустимый статус соревнования.',
            'registration_type.in' => 'Выберите допустимый тип регистрации.',
            'allowed_languages.required' => 'Выберите хотя бы один язык программирования.',
            'allowed_languages.min' => 'Выберите хотя бы один язык программирования.',
            'allowed_languages.*.in' => 'Выбран неподдерживаемый язык программирования.',
        ];
    }
}
