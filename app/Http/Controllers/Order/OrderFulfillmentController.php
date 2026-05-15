<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderFulfillmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OrderFulfillmentController extends Controller
{
    public function __construct(protected OrderFulfillmentService $service) {}

    public function fulfill(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->store->user_id === auth()->id(), 403);

        $data = $request->validate([
            'action' => 'required|in:process,ship,deliver,cancel',
            'tracking_number' => 'nullable|string|max:255',
            'tracking_url' => 'nullable|url',
            'reason' => 'nullable|string|max:255',
        ]);

        match ($data['action']) {
            'process' => $this->service->fulfill($order),
            'ship' => $this->service->ship($order, $data['tracking_number'] ?? '', $data['tracking_url'] ?? null),
            'deliver' => $this->service->deliver($order),
            'cancel' => $this->service->cancel($order, $data['reason'] ?? null),
        };

        return back()->with('success', 'Order ' . $data['action'] . ' completed.');
    }
}
