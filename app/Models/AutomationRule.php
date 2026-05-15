<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutomationRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'trigger',
        'conditions',
        'actions',
        'is_active',
        'runs_count',
        'last_run_at',
    ];

    protected function casts(): array
    {
        return [
            'conditions' => 'array',
            'actions' => 'array',
            'is_active' => 'boolean',
            'last_run_at' => 'datetime',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
