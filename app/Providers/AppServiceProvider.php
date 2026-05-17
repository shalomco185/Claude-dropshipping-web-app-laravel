<?php

namespace App\Providers;

use App\Models\SiteAudit;
use App\Policies\SiteAuditPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Gate::policy(SiteAudit::class, SiteAuditPolicy::class);
    }
}
