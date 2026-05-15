<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'supplier_id',
        'category_id',
        'external_id',
        'title',
        'slug',
        'description',
        'ai_description',
        'price',
        'compare_price',
        'cost',
        'stock',
        'images',
        'variants',
        'tags',
        'category',
        'status',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'cost' => 'decimal:2',
            'images' => 'array',
            'variants' => 'array',
            'tags' => 'array',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function categoryRelation(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getProfitMarginAttribute(): float
    {
        if (! $this->cost || $this->cost == 0) {
            return 0;
        }

        return round((($this->price - $this->cost) / $this->price) * 100, 2);
    }

    public function getThumbnailAttribute(): ?string
    {
        return is_array($this->images) && count($this->images) > 0
            ? $this->images[0]
            : null;
    }
}
