<?php

namespace App\Policies;

use App\Models\SiteAudit;
use App\Models\User;

class SiteAuditPolicy
{
    public function view(User $user, SiteAudit $audit): bool
    {
        return $user->id === $audit->user_id;
    }

    public function delete(User $user, SiteAudit $audit): bool
    {
        return $user->id === $audit->user_id;
    }
}
