<?php

namespace App\Services\Judge\Data;

final readonly class ExecutionResult
{
    public function __construct(
        public int $exitCode,
        public string $output,
        public string $errorOutput,
        public int $executionTimeMs,
        public bool $timedOut,
    ) {}
}
