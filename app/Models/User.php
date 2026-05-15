<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'facebook_id',
        'avatar',
        'plan',
        'trial_ends_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function teamMemberships(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function activeSubscription(): ?Subscription
    {
        return $this->subscriptions()
            ->whereIn('status', ['trialing', 'active'])
            ->latest()
            ->first();
    }

    public function onTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    public function hasTwoFactorEnabled(): bool
    {
        return ! is_null($this->two_factor_confirmed_at);
    }
}
