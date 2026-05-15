<?php

use App\Http\Controllers\AI\AIController;
use App\Http\Controllers\Analytics\AnalyticsController;
use App\Http\Controllers\Billing\BillingController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Marketing\CampaignController;
use App\Http\Controllers\Marketing\CouponController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Order\OrderFulfillmentController;
use App\Http\Controllers\Product\CategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductImportController;
use App\Http\Controllers\Store\StoreController;
use App\Http\Controllers\Store\StoreSettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Stores
    Route::resource('stores', StoreController::class);
    Route::get('stores/{store}/settings', [StoreSettingsController::class, 'edit'])->name('stores.settings');
    Route::put('stores/{store}/settings', [StoreSettingsController::class, 'update'])->name('stores.settings.update');
    Route::post('stores/{store}/switch', [StoreController::class, 'switchStore'])->name('stores.switch');

    // Products
    Route::resource('products', ProductController::class);
    Route::post('products/bulk-action', [ProductController::class, 'bulkAction'])->name('products.bulk-action');
    Route::get('products-import', [ProductImportController::class, 'index'])->name('products.import');
    Route::post('products-import', [ProductImportController::class, 'import'])->name('products.import.store');

    // Categories
    Route::resource('categories', CategoryController::class);

    // Orders
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
    Route::post('orders/{order}/fulfill', [OrderFulfillmentController::class, 'fulfill'])->name('orders.fulfill');
    Route::get('orders/export/csv', [OrderController::class, 'export'])->name('orders.export');

    // Customers
    Route::resource('customers', CustomerController::class)->only(['index', 'show']);

    // Marketing
    Route::prefix('marketing')->name('marketing.')->group(function () {
        Route::get('/', [CampaignController::class, 'overview'])->name('index');
        Route::resource('campaigns', CampaignController::class);
        Route::resource('coupons', CouponController::class);
    });

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    // AI Tools
    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/', [AIController::class, 'index'])->name('index');
        Route::post('/product-description', [AIController::class, 'productDescription'])->name('product-description');
        Route::post('/ad-copy', [AIController::class, 'adCopy'])->name('ad-copy');
        Route::post('/seo', [AIController::class, 'seo'])->name('seo');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', fn () => Inertia::render('Settings/Index'))->name('index');
        Route::get('/billing', [BillingController::class, 'index'])->name('billing');
        Route::post('/billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
        Route::post('/billing/cancel', [BillingController::class, 'cancel'])->name('billing.cancel');
        Route::get('/team', fn () => Inertia::render('Settings/Team'))->name('team');
    });
});

// Stripe webhook (no auth)
Route::post('/webhooks/stripe', [BillingController::class, 'webhook'])->name('webhooks.stripe');
