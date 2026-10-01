<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProblemImageRequest;
use Illuminate\Http\JsonResponse;

class ProblemImageController extends Controller
{
    public function __invoke(StoreProblemImageRequest $request): JsonResponse
    {
        $path = $request->file('image')->store('problem-images', 'public');

        return response()->json([
            'url' => '/storage/'.str_replace('\\', '/', $path),
        ], JsonResponse::HTTP_CREATED);
    }
}
