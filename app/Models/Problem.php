<?php

namespace App\Models;

use Database\Factories\ProblemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'title', 'statement', 'input_format', 'output_format', 'constraints', 'time_limit_ms', 'memory_limit_mb', 'score', 'checker_type', 'reference_language', 'reference_solution'])]
class Problem extends Model
{
    /** @use HasFactory<ProblemFactory> */
    use HasFactory;

    /**
     * The competition that contains the problem.
     */
    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function samples(): HasMany
    {
        return $this->hasMany(ProblemSample::class)->orderBy('position');
    }

    public function testCases(): HasMany
    {
        return $this->hasMany(ProblemTestCase::class)->orderBy('position');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
