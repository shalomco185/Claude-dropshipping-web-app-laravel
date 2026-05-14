<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Store;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class AnalyticsService
{
    /**
     * Get high-level KPIs for the supplied store.
     */
    public function summary(?Store $store, int $days = 30): array
    {
        if (! $store) {
            return $this->emptySummary();
        }

        $start = Carbon::now()->subDays($days);
        $previousStart = (clone $start)->subDays($days);

        $orders = $store->orders()->where('created_at', '>=', $start);
        $previousOrders = $store->orders()
            ->whereBetween('created_at', [$previousStart, $start]);

        $revenue = (float) (clone $orders)->sum('total');
        $previousRevenue = (float) (clone $previousOrders)->sum('total');

        $orderCount = (clone $orders)->count();
        $previousOrderCount = (clone $previousOrders)->count();

        $customerCount = $store->customers()->count();
        $productCount = $store->products()->count();

        $sessions = max($store->analyticsEvents()->where('event_type', 'page_view')->count() ?? 0, 1);
        $conversion = $orderCount > 0 ? round(($orderCount / $sessions) * 100, 2) : 0;

        return [
            'revenue' => [
                'value' => $revenue,
                'change' => $this->percentChange($previousRevenue, $revenue),
            ],
            'orders' => [
                'value' => $orderCount,
                'change' => $this->percentChange($previousOrderCount, $orderCount),
            ],
            'products' => [
                'value' => $productCount,
                'change' => 0,
            ],
            'conversion' => [
                'value' => $conversion,
                'change' => 0,
            ],
            'customers' => $customerCount,
        ];
    }

    /**
     * Daily revenue series for the last N days.
     */
    public function revenueSeries(?Store $store, int $days = 30): Collection
    {
        $series = collect();
        $start = Carbon::now()->subDays($days - 1)->startOfDay();

        for ($i = 0; $i < $days; $i++) {
            $date = (clone $start)->addDays($i);
            $series->push([
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('M j'),
                'revenue' => $store
                    ? (float) Order::where('store_id', $store->id)
                        ->whereDate('created_at', $date)
                        ->sum('total')
                    : 0,
            ]);
        }

        return $series;
    }

    public function topProducts(?Store $store, int $limit = 5): Collection
    {
        if (! $store) {
            return collect();
        }

        return $store->products()
            ->orderByDesc('stock')
            ->limit($limit)
            ->get(['id', 'title', 'price', 'stock', 'images']);
    }

    public function recentOrders(?Store $store, int $limit = 5): Collection
    {
        if (! $store) {
            return collect();
        }

        return $store->orders()
            ->latest()
            ->limit($limit)
            ->get();
    }

    protected function percentChange(float $old, float $new): float
    {
        if ($old == 0.0) {
            return $new > 0 ? 100.0 : 0.0;
        }

        return round((($new - $old) / $old) * 100, 1);
    }

    protected function emptySummary(): array
    {
        return [
            'revenue' => ['value' => 0, 'change' => 0],
            'orders' => ['value' => 0, 'change' => 0],
            'products' => ['value' => 0, 'change' => 0],
            'conversion' => ['value' => 0, 'change' => 0],
            'customers' => 0,
        ];
    }
}
