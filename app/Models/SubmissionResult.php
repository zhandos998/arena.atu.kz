<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['problem_test_case_id', 'position', 'verdict', 'execution_time_ms', 'memory_kb', 'message'])]
class SubmissionResult extends Model
{
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function testCase(): BelongsTo
    {
        return $this->belongsTo(ProblemTestCase::class, 'problem_test_case_id');
    }
}
