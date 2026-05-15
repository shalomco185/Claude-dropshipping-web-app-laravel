<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirect;
use Throwable;

class SocialAuthController extends Controller
{
    public function redirect(string $provider): SymfonyRedirect
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (Throwable $e) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Unable to authenticate with ' . ucfirst($provider) . '.']);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            $user->update([
                "{$provider}_id" => $socialUser->getId(),
                'avatar' => $user->avatar ?? $socialUser->getAvatar(),
            ]);
        } else {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'New User',
                'email' => $socialUser->getEmail(),
                'password' => bcrypt(Str::random(32)),
                'avatar' => $socialUser->getAvatar(),
                'email_verified_at' => now(),
                "{$provider}_id" => $socialUser->getId(),
                'plan' => 'starter',
                'trial_ends_at' => now()->addDays(14),
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('dashboard'));
    }

    protected function validateProvider(string $provider): void
    {
        abort_unless(in_array($provider, ['google', 'facebook']), 404);
    }
}
