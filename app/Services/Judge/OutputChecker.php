<?php

namespace App\Services\Judge;

class OutputChecker
{
    public function matches(string $expected, string $actual, string $checkerType): bool
    {
        if ($checkerType === 'exact') {
            return $this->normalizeLines($expected) === $this->normalizeLines($actual);
        }

        return $this->tokens($expected) === $this->tokens($actual);
    }

    private function normalizeLines(string $value): string
    {
        return rtrim(str_replace(["\r\n", "\r"], "\n", $value));
    }

    /**
     * @return array<int, string>
     */
    private function tokens(string $value): array
    {
        $trimmed = trim($value);

        return $trimmed === '' ? [] : (preg_split('/\s+/u', $trimmed) ?: []);
    }
}
