<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['position', 'input', 'expected_output', 'points', 'is_enabled'])]
class ProblemTestCase extends Model
{
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(SubmissionResult::class);
    }

    protected function casts(): array
    {
        return ['is_enabled' => 'boolean'];
    }
}
