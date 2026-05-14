<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Auth\TwoFactorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('forgot-password', fn () => Inertia::render('Auth/ForgotPassword'))->name('password.request');
    Route::post('forgot-password', [LoginController::class, 'sendResetLink'])->name('password.email');

    // Social Auth
    Route::get('auth/{provider}', [SocialAuthController::class, 'redirect'])
        ->where('provider', 'google|facebook')
        ->name('social.redirect');
    Route::get('auth/{provider}/callback', [SocialAuthController::class, 'callback'])
        ->where('provider', 'google|facebook')
        ->name('social.callback');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

    // Two-Factor Authentication
    Route::get('two-factor', [TwoFactorController::class, 'show'])->name('two-factor.show');
    Route::post('two-factor', [TwoFactorController::class, 'verify'])->name('two-factor.verify');
    Route::post('two-factor/enable', [TwoFactorController::class, 'enable'])->name('two-factor.enable');
    Route::post('two-factor/disable', [TwoFactorController::class, 'disable'])->name('two-factor.disable');
});
