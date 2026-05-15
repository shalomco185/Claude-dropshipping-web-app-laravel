<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'store_id',
        'event_type',
        'session_id',
        'user_id',
        'referrer',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'data',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
