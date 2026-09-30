<?php

return [
    'workspace_path' => env('JUDGE_WORKSPACE_PATH', storage_path('app/judge')),
    'docker_workspace_path' => env('JUDGE_DOCKER_WORKSPACE_PATH', storage_path('app/judge')),
];
