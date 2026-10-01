<?php

namespace App\Services\Judge;

use App\Services\Judge\Contracts\CodeRunner;
use App\Services\Judge\Data\CompilationResult;
use App\Services\Judge\Data\ExecutionResult;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Symfony\Component\Process\Exception\ProcessTimedOutException;
use Symfony\Component\Process\Process;

class DockerCodeRunner implements CodeRunner
{
    public function compile(string $language, string $sourceCode): CompilationResult
    {
        $configuration = $this->configuration($language);
        $identifier = (string) Str::uuid();
        $directory = $this->workspaceDirectory('workspace_path', $identifier);
        $dockerDirectory = $this->workspaceDirectory('docker_workspace_path', $identifier);
        File::ensureDirectoryExists($directory);
        File::put($directory.'/'.$configuration['filename'], $sourceCode);

        if ($language === 'csharp') {
            File::put($directory.'/Solution.csproj', <<<'XML'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
XML);
        }

        if ($configuration['compile'] === null) {
            return new CompilationResult(
                true,
                '',
                $directory,
                $configuration['image'],
                $configuration['run'],
                $dockerDirectory,
            );
        }

        $process = new Process([
            'docker', 'run', '--rm', '--network', 'none', '--memory', '768m', '--cpus', '1',
            '--pids-limit', '128', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
            '--mount', 'type=bind,source='.$dockerDirectory.',target=/workspace', '-w', '/workspace',
            $configuration['image'], ...$configuration['compile'],
        ]);
        $process->setTimeout(60)->run();

        return new CompilationResult(
            $process->isSuccessful(),
            Str::limit($process->getOutput().$process->getErrorOutput(), 10000, ''),
            $directory,
            $configuration['image'],
            $configuration['run'],
            $dockerDirectory,
        );
    }

    public function execute(CompilationResult $program, string $input, int $timeLimitMs, int $memoryLimitMb): ExecutionResult
    {
        $containerName = 'atu-judge-'.Str::lower(Str::random(16));
        $executionTimeout = number_format(max(1, $timeLimitMs) / 1000, 3, '.', '');
        $process = new Process([
            'docker', 'run', '--rm', '-i', '--name', $containerName, '--network', 'none',
            '--memory', $memoryLimitMb.'m', '--memory-swap', $memoryLimitMb.'m', '--cpus', '1',
            '--pids-limit', '64', '--read-only', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
            '--tmpfs', '/tmp:rw,noexec,nosuid,size=64m', '--user', '65534:65534',
            '--mount', 'type=bind,source='.($program->dockerDirectory ?? $program->directory).',target=/workspace,readonly',
            '-w', '/workspace',
            $program->image,
            'sh', '-c', 'timeout -s KILL "$@"', '--', $executionTimeout, ...$program->runCommand,
        ]);
        $process->setInput($input);
        $process->setTimeout(
            max(1, $timeLimitMs / 1000) + (int) config('judge.container_startup_grace_seconds'),
        );
        $startedAt = hrtime(true);

        try {
            $process->run();
            $executionTimeMs = min(
                $timeLimitMs,
                (int) ((hrtime(true) - $startedAt) / 1_000_000),
            );

            if ($process->getExitCode() === 137) {
                return new ExecutionResult(
                    124,
                    Str::limit($process->getOutput(), 100000, ''),
                    'Превышен лимит времени.',
                    $timeLimitMs,
                    true,
                );
            }

            return new ExecutionResult(
                $process->getExitCode() ?? 1,
                Str::limit($process->getOutput(), 100000, ''),
                Str::limit($process->getErrorOutput(), 10000, ''),
                $executionTimeMs,
                false,
            );
        } catch (ProcessTimedOutException) {
            (new Process(['docker', 'rm', '-f', $containerName]))->setTimeout(10)->run();

            return new ExecutionResult(
                124,
                Str::limit($process->getOutput(), 100000, ''),
                'Превышен лимит времени.',
                $timeLimitMs,
                true,
            );
        }
    }

    public function cleanup(CompilationResult $program): void
    {
        File::deleteDirectory($program->directory);
    }

    /**
     * @return array{filename: string, image: string, compile: array<int, string>|null, run: array<int, string>}
     */
    private function configuration(string $language): array
    {
        return match ($language) {
            'cpp' => [
                'filename' => 'main.cpp',
                'image' => 'gcc:14',
                'compile' => ['g++', '-O2', '-std=c++20', 'main.cpp', '-o', 'main'],
                'run' => ['./main'],
            ],
            'python' => [
                'filename' => 'main.py',
                'image' => 'python:3.13-alpine',
                'compile' => null,
                'run' => ['python', 'main.py'],
            ],
            'java' => [
                'filename' => 'Main.java',
                'image' => 'eclipse-temurin:21-jdk-alpine',
                'compile' => ['javac', 'Main.java'],
                'run' => ['java', 'Main'],
            ],
            'go' => [
                'filename' => 'main.go',
                'image' => 'golang:1.27-alpine',
                'compile' => ['go', 'build', '-o', 'main', 'main.go'],
                'run' => ['./main'],
            ],
            'javascript' => [
                'filename' => 'main.js',
                'image' => 'node:22-alpine',
                'compile' => null,
                'run' => ['node', 'main.js'],
            ],
            'csharp' => [
                'filename' => 'Program.cs',
                'image' => 'mcr.microsoft.com/dotnet/sdk:8.0-alpine',
                'compile' => ['dotnet', 'build', 'Solution.csproj', '-c', 'Release', '-o', 'out', '--nologo'],
                'run' => ['dotnet', 'out/Solution.dll'],
            ],
            default => throw new InvalidArgumentException('Неподдерживаемый язык программирования.'),
        };
    }

    private function workspaceDirectory(string $configurationKey, string $identifier): string
    {
        return rtrim((string) config('judge.'.$configurationKey), '/\\').DIRECTORY_SEPARATOR.$identifier;
    }
}
