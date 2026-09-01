<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'user_id', 'nota_number', 'customer_name', 'customer_phone', 'device',
        'service_type', 'issue', 'price', 'deposit', 'status',
        'estimated_date', 'technician', 'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function delivery()
    {
        return $this->hasOne(Delivery::class)->latestOfMany();
    }

    protected $casts = [
        'price' => 'integer',
        'deposit' => 'integer',
        'estimated_date' => 'date',
    ];

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'Diterima'           => 'bg-blue-100 text-blue-700',
            'Dalam Proses'       => 'bg-yellow-100 text-yellow-700',
            'Menunggu Sparepart' => 'bg-orange-100 text-orange-700',
            'Selesai'            => 'bg-green-100 text-green-700',
            'Diambil'            => 'bg-gray-100 text-gray-600',
            default              => 'bg-gray-100 text-gray-600',
        };
    }

    public function getStatusBadgeClassAttribute(): string
    {
        return match($this->status) {
            'Diterima'           => 'bg-blue-100 text-blue-700 border border-blue-200',
            'Dalam Proses'       => 'bg-yellow-100 text-yellow-700 border border-yellow-200',
            'Menunggu Sparepart' => 'bg-orange-100 text-orange-700 border border-orange-200',
            'Selesai'            => 'bg-green-100 text-green-700 border border-green-200',
            'Diambil'            => 'bg-gray-100 text-gray-600 border border-gray-200',
            default              => 'bg-gray-100 text-gray-600 border border-gray-200',
        };
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price ?? 0, 0, ',', '.');
    }

    public function getFormattedDepositAttribute(): string
    {
        return 'Rp ' . number_format($this->deposit ?? 0, 0, ',', '.');
    }

    public function getRemainingPaymentAttribute(): int
    {
        return max(0, $this->price - $this->deposit);
    }

    public static function generateNotaNumber(): string
    {
        $prefix = 'SRV-' . date('Ymd');
        $last = static::where('nota_number', 'like', $prefix . '%')->max('nota_number');
        $seq = $last ? (int)substr($last, -4) + 1 : 1;
        return $prefix . '-' . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
