<?php

namespace App\Models;

use Database\Factories\ProblemSampleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['position', 'input', 'output'])]
class ProblemSample extends Model
{
    /** @use HasFactory<ProblemSampleFactory> */
    use HasFactory;

    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
