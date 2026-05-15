<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->string('event_type'); // page_view, add_to_cart, purchase, etc.
            $table->string('session_id')->nullable()->index();
            $table->string('user_id')->nullable();
            $table->string('referrer')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->json('data')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['store_id', 'event_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
