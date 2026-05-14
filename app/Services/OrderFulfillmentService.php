<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Str;

class OrderFulfillmentService
{
    /**
     * Forward an order to its supplier and mark it as processing.
     */
    public function fulfill(Order $order): Order
    {
        // In production this would call supplier APIs to place the order.
        $supplierOrderId = 'sup_' . Str::random(16);

        $order->update([
            'supplier_order_id' => $supplierOrderId,
            'status' => 'processing',
        ]);

        return $order->fresh();
    }

    /**
     * Mark an order as shipped with tracking information.
     */
    public function ship(Order $order, string $trackingNumber, ?string $trackingUrl = null): Order
    {
        $order->update([
            'status' => 'shipped',
            'tracking_number' => $trackingNumber,
            'tracking_url' => $trackingUrl,
            'shipped_at' => now(),
        ]);

        return $order->fresh();
    }

    /**
     * Mark an order as delivered.
     */
    public function deliver(Order $order): Order
    {
        $order->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        return $order->fresh();
    }

    /**
     * Cancel an order.
     */
    public function cancel(Order $order, ?string $reason = null): Order
    {
        $order->update([
            'status' => 'cancelled',
            'notes' => trim(($order->notes ?? '') . "\nCancelled: " . ($reason ?? 'No reason provided')),
        ]);

        return $order->fresh();
    }
}
