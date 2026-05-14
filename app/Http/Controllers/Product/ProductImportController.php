<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Services\SupplierService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductImportController extends Controller
{
    public function __construct(protected SupplierService $supplierService) {}

    public function index(): Response
    {
        return Inertia::render('Products/Import');
    }

    public function import(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'url' => 'required|url',
            'supplier' => 'required|in:aliexpress,cjdropshipping,zendrop,amazon,temu',
            'ai_enhance' => 'boolean',
        ]);

        $store = $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();

        abort_unless($store, 422, 'You must create a store first.');

        $product = $this->supplierService->importFromUrl(
            $store,
            $data['url'],
            $data['supplier'],
            $data['ai_enhance'] ?? false,
        );

        return redirect()->route('products.edit', $product)
            ->with('success', 'Product imported successfully.');
    }
}
