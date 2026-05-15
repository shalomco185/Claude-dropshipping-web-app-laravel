<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['email', 'sms', 'whatsapp', 'push']);
            $table->enum('status', ['draft', 'scheduled', 'sending', 'sent', 'paused', 'failed'])->default('draft');
            $table->string('subject')->nullable();
            $table->longText('content');
            $table->json('audience')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->json('stats')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_campaigns');
    }
};
