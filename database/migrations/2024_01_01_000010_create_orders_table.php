<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_number')->unique();
            $table->string('external_order_id')->nullable()->index();
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
                ->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('shipping', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->json('shipping_address')->nullable();
            $table->json('billing_address')->nullable();
            $table->json('items');
            $table->string('tracking_number')->nullable();
            $table->string('tracking_url')->nullable();
            $table->string('supplier_order_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index(['store_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
