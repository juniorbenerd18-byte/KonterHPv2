<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'user_id', 'invoice_number', 'customer_name', 'customer_phone', 'customer_address',
        'customer_lat', 'customer_lng',
        'subtotal', 'discount', 'total', 'amount_paid', 'change_amount',
        'payment_method', 'delivery_type', 'cashier_name'
    ];

    protected $casts = [
        'customer_lat'  => 'float',
        'customer_lng'  => 'float',
        'subtotal'      => 'integer',
        'discount'      => 'integer',
        'total'         => 'integer',
        'amount_paid'   => 'integer',
        'change_amount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function getFormattedTotalAttribute(): string
    {
        return 'Rp ' . number_format($this->total, 0, ',', '.');
    }

    public static function generateInvoiceNumber(): string
    {
        $prefix = 'INV-' . date('Ymd');
        $last = static::where('invoice_number', 'like', $prefix . '%')->latest('id')->first()?->invoice_number;
        $seq = $last ? (int)substr($last, -4) + 1 : 1;
        return $prefix . '-' . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
