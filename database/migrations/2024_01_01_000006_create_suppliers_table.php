<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['aliexpress', 'cjdropshipping', 'zendrop', 'amazon', 'temu', 'spocket', 'modalyst']);
            $table->string('api_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->json('settings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('store_suppliers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'supplier_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_suppliers');
        Schema::dropIfExists('suppliers');
    }
};
