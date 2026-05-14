<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreSettingsController extends Controller
{
    public function edit(Store $store): Response
    {
        abort_unless($store->user_id === auth()->id(), 403);

        return Inertia::render('Stores/Settings', [
            'store' => $store,
        ]);
    }

    public function update(Request $request, Store $store): RedirectResponse
    {
        abort_unless($store->user_id === auth()->id(), 403);

        $data = $request->validate([
            'name' => 'required|string|max:120',
            'currency' => 'required|string|size:3',
            'language' => 'required|string|max:5',
            'custom_domain' => 'nullable|string|max:255',
            'theme' => 'nullable|string|max:50',
            'settings' => 'nullable|array',
        ]);

        $store->update($data);

        return back()->with('success', 'Settings saved.');
    }
}
