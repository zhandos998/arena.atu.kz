<?php

namespace App\Services\Judge\Contracts;

use App\Services\Judge\Data\CompilationResult;
use App\Services\Judge\Data\ExecutionResult;

interface CodeRunner
{
    public function compile(string $language, string $sourceCode): CompilationResult;

    public function execute(CompilationResult $program, string $input, int $timeLimitMs, int $memoryLimitMb): ExecutionResult;

    public function cleanup(CompilationResult $program): void;
}
