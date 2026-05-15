<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->json('address')->nullable();
            $table->integer('total_orders')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->json('tags')->nullable();
            $table->timestamp('last_order_at')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'email']);
            $table->index('store_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
