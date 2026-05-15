<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'customer_id',
        'reviewer_name',
        'rating',
        'comment',
        'images',
        'is_verified',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'is_verified' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
