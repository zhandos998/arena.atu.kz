<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['competition_id', 'problem_id', 'user_id', 'language', 'source_code', 'status', 'verdict', 'passed_tests', 'total_tests', 'score', 'execution_time_ms', 'memory_kb', 'compiler_output', 'judged_at'])]
class Submission extends Model
{
    public const VERDICTS = [
        'accepted' => 'Принято',
        'wrong_answer' => 'Неверный ответ',
        'time_limit' => 'Превышено время',
        'runtime_error' => 'Ошибка выполнения',
        'compilation_error' => 'Ошибка компиляции',
        'system_error' => 'Ошибка системы',
    ];

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(SubmissionResult::class)->orderBy('position');
    }

    protected function casts(): array
    {
        return ['judged_at' => 'datetime'];
    }
}
