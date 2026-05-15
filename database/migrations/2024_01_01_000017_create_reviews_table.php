<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reviewer_name')->nullable();
            $table->unsignedTinyInteger('rating'); // 1 - 5
            $table->text('comment')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();

            $table->index(['product_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
