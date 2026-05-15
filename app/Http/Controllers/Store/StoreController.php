<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function index(Request $request): Response
    {
        $stores = $request->user()->stores()->latest()->get();

        return Inertia::render('Stores/Index', [
            'stores' => $stores,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Stores/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'domain' => 'nullable|string|max:120|unique:stores,domain',
            'currency' => 'required|string|size:3',
            'language' => 'required|string|max:5',
        ]);

        $data['domain'] = $data['domain'] ?? Str::slug($data['name']) . '-' . Str::random(5);
        $data['user_id'] = $request->user()->id;
        $data['is_active'] = true;

        $store = Store::create($data);

        return redirect()->route('stores.show', $store)
            ->with('success', 'Store created successfully.');
    }

    public function show(Store $store): Response
    {
        $this->authorizeStore($store);

        return Inertia::render('Stores/Show', [
            'store' => $store->loadCount(['products', 'orders', 'customers']),
        ]);
    }

    public function edit(Store $store): Response
    {
        $this->authorizeStore($store);

        return Inertia::render('Stores/Edit', [
            'store' => $store,
        ]);
    }

    public function update(Request $request, Store $store): RedirectResponse
    {
        $this->authorizeStore($store);

        $data = $request->validate([
            'name' => 'required|string|max:120',
            'currency' => 'required|string|size:3',
            'language' => 'required|string|max:5',
            'custom_domain' => 'nullable|string|max:255',
            'theme' => 'nullable|string|max:50',
        ]);

        $store->update($data);

        return back()->with('success', 'Store updated successfully.');
    }

    public function destroy(Store $store): RedirectResponse
    {
        $this->authorizeStore($store);

        $store->delete();

        return redirect()->route('stores.index')->with('success', 'Store deleted.');
    }

    public function switchStore(Request $request, Store $store): RedirectResponse
    {
        $this->authorizeStore($store);

        $request->user()->stores()->update(['is_active' => false]);
        $store->update(['is_active' => true]);

        return back()->with('success', 'Switched to ' . $store->name);
    }

    protected function authorizeStore(Store $store): void
    {
        abort_unless($store->user_id === auth()->id(), 403);
    }
}
