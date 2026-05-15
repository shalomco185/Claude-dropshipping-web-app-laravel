<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(Request $request): Response
    {
        $store = $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();

        return Inertia::render('Marketing/Coupons/Index', [
            'coupons' => $store ? $store->coupons()->latest()->paginate(20) : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $store = $request->user()->stores()->where('is_active', true)->first();
        abort_unless($store, 403);

        $data = $request->validate([
            'code' => 'required|string|max:60',
            'type' => 'required|in:percentage,fixed,free_shipping',
            'value' => 'required|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:0',
            'expires_at' => 'nullable|date|after:today',
        ]);

        $data['store_id'] = $store->id;
        $data['code'] = strtoupper($data['code']);

        Coupon::create($data);

        return back()->with('success', 'Coupon created.');
    }

    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        abort_unless($coupon->store->user_id === auth()->id(), 403);

        $data = $request->validate([
            'value' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'expires_at' => 'nullable|date',
            'max_uses' => 'nullable|integer|min:0',
        ]);

        $coupon->update($data);

        return back()->with('success', 'Coupon updated.');
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        abort_unless($coupon->store->user_id === auth()->id(), 403);
        $coupon->delete();

        return back()->with('success', 'Coupon deleted.');
    }

    public function create(): Response
    {
        return $this->index(request());
    }

    public function show(Coupon $coupon): Response
    {
        abort_unless($coupon->store->user_id === auth()->id(), 403);

        return Inertia::render('Marketing/Coupons/Index', ['coupon' => $coupon]);
    }

    public function edit(Coupon $coupon): Response
    {
        return $this->show($coupon);
    }
}
