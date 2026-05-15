<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('domain')->unique();
            $table->string('custom_domain')->nullable()->unique();
            $table->string('theme')->default('default');
            $table->string('currency', 3)->default('USD');
            $table->string('language', 5)->default('en');
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
