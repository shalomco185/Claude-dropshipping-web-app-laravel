<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('external_id')->nullable()->index();
            $table->string('title');
            $table->string('slug');
            $table->longText('description')->nullable();
            $table->longText('ai_description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->json('images')->nullable();
            $table->json('variants')->nullable();
            $table->json('tags')->nullable();
            $table->string('category')->nullable();
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->unique(['store_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
