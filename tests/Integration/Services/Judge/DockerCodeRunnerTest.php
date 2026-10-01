<?php

namespace Tests\Integration\Services\Judge;

use App\Services\Judge\DockerCodeRunner;
use Symfony\Component\Process\Process;
use Tests\TestCase;

class DockerCodeRunnerTest extends TestCase
{
    private DockerCodeRunner $runner;

    protected function setUp(): void
    {
        parent::setUp();

        $docker = new Process(['docker', 'info']);
        $docker->setTimeout(10)->run();

        if (! $docker->isSuccessful()) {
            $this->markTestSkipped('Docker is required for judge integration tests.');
        }

        $workspace = storage_path('framework/testing/judge');
        config()->set('judge.workspace_path', $workspace);
        config()->set('judge.docker_workspace_path', $workspace);
        config()->set('judge.container_startup_grace_seconds', 5);

        $this->runner = app(DockerCodeRunner::class);
    }

    public function test_fast_python_program_is_not_timed_out_by_container_startup(): void
    {
        $program = $this->runner->compile('python', 'print(42)');

        try {
            $result = $this->runner->execute($program, '', 1000, 256);
        } finally {
            $this->runner->cleanup($program);
        }

        $this->assertFalse($result->timedOut);
        $this->assertSame(0, $result->exitCode);
        $this->assertSame("42\n", $result->output);
    }

    public function test_python_program_is_stopped_at_the_problem_time_limit(): void
    {
        $program = $this->runner->compile('python', 'while True: pass');

        try {
            $result = $this->runner->execute($program, '', 300, 256);
        } finally {
            $this->runner->cleanup($program);
        }

        $this->assertTrue($result->timedOut);
        $this->assertSame(124, $result->exitCode);
        $this->assertSame(300, $result->executionTimeMs);
    }
}
