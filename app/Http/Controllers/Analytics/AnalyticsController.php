<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(protected AnalyticsService $analytics) {}

    public function index(Request $request): Response
    {
        $store = $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();

        $days = (int) $request->input('days', 30);

        return Inertia::render('Analytics/Index', [
            'summary' => $this->analytics->summary($store, $days),
            'revenueSeries' => $this->analytics->revenueSeries($store, $days),
            'topProducts' => $this->analytics->topProducts($store, 10),
            'days' => $days,
        ]);
    }
}
