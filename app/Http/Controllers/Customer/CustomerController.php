<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $store = $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();

        $customers = $store
            ? $store->customers()
                ->when($request->search, fn ($q, $search) => $q
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"))
                ->latest()
                ->paginate(20)
                ->withQueryString()
            : null;

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Customer $customer): Response
    {
        abort_unless($customer->store->user_id === auth()->id(), 403);

        return Inertia::render('Customers/Show', [
            'customer' => $customer->load(['orders' => fn ($q) => $q->latest()->limit(20)]),
        ]);
    }
}
