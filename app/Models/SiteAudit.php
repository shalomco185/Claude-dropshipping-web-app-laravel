<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteAudit extends Model
{
    protected $fillable = [
        'user_id', 'domain', 'label', 'status', 'config',
        'semrush_data', 'screaming_frog_data', 'crawl_data',
        'ai_analysis', 'report_path', 'error_message', 'progress',
        'started_at', 'completed_at',
    ];

    protected $casts = [
        'config' => 'array',
        'semrush_data' => 'array',
        'screaming_frog_data' => 'array',
        'crawl_data' => 'array',
        'ai_analysis' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function hasFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function overallScore(): int
    {
        return $this->ai_analysis['overall_score'] ?? 0;
    }

    public function scoreColor(): string
    {
        $score = $this->overallScore();

        return match (true) {
            $score >= 80 => 'green',
            $score >= 60 => 'yellow',
            default => 'red',
        };
    }
}
