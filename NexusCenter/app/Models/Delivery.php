<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
        'tracking_code',
        'service_id',
        'sale_id',
        'courier_name',
        'courier_phone',
        'customer_name',
        'customer_phone',
        'customer_address',
        'customer_lat',
        'customer_lng',
        'courier_lat',
        'courier_lng',
        'delivery_pin',
        'status',
        'notes',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'customer_lat' => 'float',
        'customer_lng' => 'float',
        'courier_lat'  => 'float',
        'courier_lng'  => 'float',
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public static function generateTrackingCode(): string
    {
        $prefix = 'TRK-' . date('Ymd');
        $last = static::where('tracking_code', 'like', $prefix . '%')->max('tracking_code');
        $seq = $last ? (int)substr($last, -4) + 1 : 1;
        return $prefix . '-' . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    public static function generatePin(): string
    {
        return str_pad((string)rand(1000, 9999), 4, '0', STR_PAD_LEFT);
    }

    public function getStatusBadgeClassAttribute(): string
    {
        return match($this->status) {
            'pending' => 'bg-amber-100 text-amber-800 border border-amber-200',
            'diantar' => 'bg-blue-100 text-blue-800 border border-blue-200',
            'selesai' => 'bg-green-100 text-green-800 border border-green-200',
            'batal'   => 'bg-red-100 text-red-800 border border-red-200',
            default   => 'bg-gray-100 text-gray-800 border border-gray-200',
        };
    }

    public static function formatWaPhone(?string $phone): string
    {
        if (empty($phone)) return '';
        $number = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($number, '0')) {
            $number = '62' . substr($number, 1);
        } elseif (str_starts_with($number, '8')) {
            $number = '62' . $number;
        }
        return $number;
    }

    public function getFormattedCourierWaPhoneAttribute(): string
    {
        return $this->formatWaPhone($this->courier_phone);
    }

    public function getFormattedCustomerWaPhoneAttribute(): string
    {
        return $this->formatWaPhone($this->customer_phone);
    }

    /**
     * Menghitung jarak antara 2 koordinat GPS menggunakan Formula Haversine (dalam satuan meter).
     */
    public static function calculateDistanceInMeters(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000; // Radius Bumi dalam meter

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
