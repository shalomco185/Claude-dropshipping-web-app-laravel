<?php

use App\Http\Controllers\AI\AIController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Store\StoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    // Stores REST API
    Route::apiResource('stores', StoreController::class);

    // Products REST API
    Route::apiResource('products', ProductController::class);

    // Orders REST API
    Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'update']);

    // AI endpoints
    Route::post('/ai/generate-description', [AIController::class, 'productDescription']);
    Route::post('/ai/generate-ad-copy', [AIController::class, 'adCopy']);
    Route::post('/ai/generate-seo', [AIController::class, 'seo']);
});
