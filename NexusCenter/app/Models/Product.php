<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'category', 'brand', 'price', 'stock',
        'icon', 'description', 'image', 'rating', 'review_count', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'integer',
        'stock' => 'integer',
        'rating' => 'float',
        'review_count' => 'integer',
    ];

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function getCategoryLabelAttribute(): string
    {
        return match($this->category) {
            'smartphone' => '📱 Smartphone',
            'aksesoris'  => '🔌 Aksesoris',
            'pulsa'      => '📶 Pulsa/Data',
            default      => $this->category,
        };
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}
