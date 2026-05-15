<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $store = $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();

        $orders = $store
            ? $store->orders()
                ->with('customer:id,name,email')
                ->when($request->status, fn ($q, $status) => $q->where('status', $status))
                ->when($request->search, fn ($q, $search) => $q->where('order_number', 'like', "%{$search}%"))
                ->latest()
                ->paginate(20)
                ->withQueryString()
            : null;

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'statusCounts' => $store ? $this->statusCounts($store) : [],
        ]);
    }

    public function show(Order $order): Response
    {
        abort_unless($order->store->user_id === auth()->id(), 403);

        return Inertia::render('Orders/Show', [
            'order' => $order->load('customer'),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->store->user_id === auth()->id(), 403);

        $data = $request->validate([
            'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled,refunded',
            'tracking_number' => 'nullable|string|max:255',
            'tracking_url' => 'nullable|url',
            'notes' => 'nullable|string',
        ]);

        $order->update($data);

        return back()->with('success', 'Order updated.');
    }

    public function export(Request $request): StreamedResponse
    {
        $store = $request->user()->stores()->where('is_active', true)->first();
        abort_unless($store, 403);

        $filename = 'orders-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($store) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Order #', 'Customer', 'Status', 'Total', 'Date']);
            $store->orders()->with('customer')->chunk(200, function ($orders) use ($handle) {
                foreach ($orders as $order) {
                    fputcsv($handle, [
                        $order->order_number,
                        $order->customer?->name ?? 'Guest',
                        $order->status,
                        $order->total,
                        $order->created_at->toDateTimeString(),
                    ]);
                }
            });
            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    protected function statusCounts($store): array
    {
        return $store->orders()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
    }
}
