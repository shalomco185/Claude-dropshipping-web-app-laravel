<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('plan', ['starter', 'professional', 'agency', 'enterprise']);
            $table->enum('status', ['trialing', 'active', 'past_due', 'cancelled', 'expired'])->default('trialing');
            $table->string('stripe_id')->nullable()->index();
            $table->string('stripe_customer_id')->nullable()->index();
            $table->string('stripe_price_id')->nullable();
            $table->integer('quantity')->default(1);
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
