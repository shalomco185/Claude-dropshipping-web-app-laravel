<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $store = $this->currentStore($request);

        $products = $store
            ? $store->products()
                ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
                ->when($request->status, fn ($q, $status) => $q->where('status', $status))
                ->latest()
                ->paginate(20)
                ->withQueryString()
            : null;

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $store = $this->currentStore($request);
        abort_unless($store, 403, 'No active store.');

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:draft,active,archived',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $data['store_id'] = $store->id;
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Product created.');
    }

    public function show(Product $product): Response
    {
        $this->authorizeProduct($product);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        $this->authorizeProduct($product);

        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $this->authorizeProduct($product);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:draft,active,archived',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $product->update($data);

        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorizeProduct($product);

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'action' => 'required|in:delete,activate,archive',
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:products,id',
        ]);

        $store = $this->currentStore($request);
        $query = Product::whereIn('id', $data['ids']);
        if ($store) {
            $query->where('store_id', $store->id);
        }

        match ($data['action']) {
            'delete' => $query->delete(),
            'activate' => $query->update(['status' => 'active']),
            'archive' => $query->update(['status' => 'archived']),
        };

        return back()->with('success', 'Bulk action applied.');
    }

    protected function currentStore(Request $request)
    {
        return $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();
    }

    protected function authorizeProduct(Product $product): void
    {
        abort_unless($product->store->user_id === auth()->id(), 403);
    }
}
