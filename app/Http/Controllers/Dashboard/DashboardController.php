<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected AnalyticsService $analytics) {}

    public function index(Request $request): Response
    {
        $store = $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();

        return Inertia::render('Dashboard/Index', [
            'summary' => $this->analytics->summary($store),
            'revenueSeries' => $this->analytics->revenueSeries($store),
            'recentOrders' => $this->analytics->recentOrders($store),
            'topProducts' => $this->analytics->topProducts($store),
        ]);
    }
}
