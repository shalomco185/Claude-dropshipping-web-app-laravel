<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AIController extends Controller
{
    public function __construct(protected AIService $ai) {}

    public function index(): Response
    {
        return Inertia::render('AI/Index');
    }

    public function productDescription(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'features' => 'nullable|array',
            'tone' => 'nullable|string|in:professional,friendly,playful,luxurious,bold',
        ]);

        $description = $this->ai->generateProductDescription(
            $data['title'],
            $data['features'] ?? [],
            $data['tone'] ?? 'professional',
        );

        return response()->json(['description' => $description]);
    }

    public function adCopy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product' => 'required|string|max:255',
            'platform' => 'required|in:facebook,google,tiktok,instagram',
            'audience' => 'nullable|string|max:255',
        ]);

        $copy = $this->ai->generateAdCopy(
            $data['product'],
            $data['platform'],
            $data['audience'] ?? 'general consumers',
        );

        return response()->json(['variations' => $copy]);
    }

    public function seo(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $seo = $this->ai->generateSeo($data['title'], $data['description'] ?? '');

        return response()->json(['seo' => $seo]);
    }
}
