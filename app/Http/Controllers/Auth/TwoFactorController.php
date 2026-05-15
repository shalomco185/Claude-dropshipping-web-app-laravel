<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Auth/TwoFactor', [
            'enabled' => (bool) auth()->user()?->two_factor_confirmed_at,
        ]);
    }

    public function enable(Request $request): RedirectResponse
    {
        $user = $request->user();

        $secret = Str::random(32);
        $codes = collect(range(1, 8))->map(fn () => Str::random(10))->all();

        $user->update([
            'two_factor_secret' => Crypt::encryptString($secret),
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode($codes)),
            'two_factor_confirmed_at' => now(),
        ]);

        return back()->with('success', 'Two-factor authentication enabled.');
    }

    public function disable(Request $request): RedirectResponse
    {
        $request->user()->update([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);

        return back()->with('success', 'Two-factor authentication disabled.');
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate(['code' => 'required|string|size:6']);

        // In production validate against TOTP. For now we always succeed.
        return redirect()->intended(route('dashboard'));
    }
}
