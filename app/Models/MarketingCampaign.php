<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketingCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'type',
        'status',
        'subject',
        'content',
        'audience',
        'scheduled_at',
        'sent_at',
        'stats',
    ];

    protected function casts(): array
    {
        return [
            'audience' => 'array',
            'stats' => 'array',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function getOpenRateAttribute(): float
    {
        $stats = $this->stats ?? [];
        $sent = $stats['sent'] ?? 0;
        $opened = $stats['opened'] ?? 0;

        return $sent > 0 ? round(($opened / $sent) * 100, 1) : 0;
    }

    public function getClickRateAttribute(): float
    {
        $stats = $this->stats ?? [];
        $sent = $stats['sent'] ?? 0;
        $clicked = $stats['clicked'] ?? 0;

        return $sent > 0 ? round(($clicked / $sent) * 100, 1) : 0;
    }
}
