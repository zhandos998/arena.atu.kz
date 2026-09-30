<?php

namespace Tests\Unit;

use App\Services\Judge\OutputChecker;
use PHPUnit\Framework\TestCase;

class OutputCheckerTest extends TestCase
{
    public function test_token_checker_ignores_whitespace_differences(): void
    {
        $checker = new OutputChecker;

        $this->assertTrue($checker->matches("1 2\n3", "1\n  2 3\n", 'tokens'));
        $this->assertFalse($checker->matches('1 2 3', '1 2 4', 'tokens'));
    }

    public function test_exact_checker_preserves_internal_whitespace(): void
    {
        $checker = new OutputChecker;

        $this->assertTrue($checker->matches("hello\r\n", "hello\n", 'exact'));
        $this->assertFalse($checker->matches('hello world', 'hello  world', 'exact'));
    }
}
