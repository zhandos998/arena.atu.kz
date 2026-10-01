<?php

return [
    'workspace_path' => env('JUDGE_WORKSPACE_PATH', storage_path('app/judge')),
    'docker_workspace_path' => env('JUDGE_DOCKER_WORKSPACE_PATH', storage_path('app/judge')),
    'container_startup_grace_seconds' => (int) env('JUDGE_CONTAINER_STARTUP_GRACE_SECONDS', 5),
];
