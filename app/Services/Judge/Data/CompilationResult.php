<?php

namespace App\Services\Judge\Data;

final readonly class CompilationResult
{
    /**
     * @param  array<int, string>  $runCommand
     */
    public function __construct(
        public bool $successful,
        public string $output,
        public string $directory,
        public string $image,
        public array $runCommand,
    ) {}
}
