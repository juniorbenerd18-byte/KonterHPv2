<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ──────────────────────────────────────────────
        User::updateOrCreate(['name' => 'Admin'], [
            'email'    => 'admin@nexuscenter.id',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
            'is_active'=> true,
        ]);
        User::updateOrCreate(['name' => 'Kasir'], [
            'email'    => 'kasir@nexuscenter.id',
            'password' => Hash::make('kasir123'),
            'role'     => 'kasir',
            'is_active'=> true,
        ]);
        User::updateOrCreate(['name' => 'Pengguna'], [
            'email'    => 'pengguna@nexuscenter.id',
            'password' => Hash::make('pengguna123'),
            'role'     => 'pengguna',
            'is_active'=> true,
        ]);

        // ── Products ───────────────────────────────────────────
        $products = [
            // Smartphone
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'brand' => 'Samsung',
                'category' => 'smartphone',
                'price' => 19999000,
                'stock' => 5,
                'icon' => '📱',
                'description' => 'Experience the new era of mobile AI. The Galaxy S24 Ultra empowers you to unleash your creativity, productivity and possibilities – starting with the most important device in your life. (Snapdragon 8 Gen 3, Kamera 200MP Main, Display 6.8" Dynamic AMOLED 2X, Battery 5000mAh, Garansi Resmi Official Warranty)',
                'rating' => 4.9,
                'review_count' => 128
            ],
            [
                'name' => 'iPhone 15 Pro 256GB',
                'brand' => 'Apple',
                'category' => 'smartphone',
                'price' => 20999000,
                'stock' => 3,
                'icon' => '🍎',
                'description' => 'Desain titanium yang tangguh dan ringan kelas penerbangan. Chipset A17 Pro revolusioner dengan GPU 6-core pro, tombol Tindakan yang dapat disesuaikan, dan sistem kamera pro serbaguna.',
                'rating' => 5.0,
                'review_count' => 89
            ],
            [
                'name' => 'Xiaomi 14 Leica Camera',
                'brand' => 'Xiaomi',
                'category' => 'smartphone',
                'price' => 11999000,
                'stock' => 8,
                'icon' => '📱',
                'description' => 'Optik Leica Generasi Baru dengan Lensa Summilux. Ditenagai Snapdragon 8 Gen 3, pengisian daya super cepat 90W HyperCharge, dan layar CrystalRes AMOLED 120Hz.',
                'rating' => 4.8,
                'review_count' => 56
            ],
            [
                'name' => 'Oppo Reno 11 Pro 5G',
                'brand' => 'Oppo',
                'category' => 'smartphone',
                'price' => 8499000,
                'stock' => 10,
                'icon' => '📱',
                'description' => 'Sistem Kamera Potret Kelas Unggulan dengan Sensor Sony IMX890. Desain 3D Dual-Curved ultra elegan, baterai besar dengan 80W SUPERVOOC Flash Charge.',
                'rating' => 4.7,
                'review_count' => 210
            ],
            [
                'name' => 'Samsung Galaxy A55',
                'brand' => 'Samsung',
                'category' => 'smartphone',
                'price' => 5499000,
                'stock' => 15,
                'icon' => '📱',
                'description' => 'Desain metalik ikonik dengan proteksi air dan debu IP67. Kamera 50MP Nightography dengan OIS, layar Super AMOLED FHD+ 120Hz yang sangat jernih.',
                'rating' => 4.6,
                'review_count' => 304
            ],
            [
                'name' => 'Vivo V30 Pro',
                'brand' => 'Vivo',
                'category' => 'smartphone',
                'price' => 7499000,
                'stock' => 7,
                'icon' => '📱',
                'description' => 'ZEISS Professional Portrait Camera dengan Aura Light Portrait pintar. Bodi super tipis dengan baterai besar 5000mAh & 80W FlashCharge.',
                'rating' => 4.5,
                'review_count' => 78
            ],
            [
                'name' => 'Realme GT 6',
                'brand' => 'Realme',
                'category' => 'smartphone',
                'price' => 6999000,
                'stock' => 4,
                'icon' => '📱',
                'description' => 'Flagship Killer bertenaga Snapdragon 8s Gen 3. Layar Ultra Bright 6000 nits termutakhir dan pengisian kilat 120W SUPERVOOC Charge.',
                'rating' => 4.7,
                'review_count' => 91
            ],
            // Aksesoris
            [
                'name' => 'Charger 65W GaN USB-C',
                'brand' => 'Anker',
                'category' => 'aksesoris',
                'price' => 299000,
                'stock' => 20,
                'icon' => '🔌',
                'description' => 'Teknologi GaN Prime ukuran ringkas dengan efisiensi tinggi. Pengisian daya cepat multi-port untuk laptop, smartphone, dan tablet secara bersamaan.',
                'rating' => 4.8,
                'review_count' => 521
            ],
            [
                'name' => 'TWS Earbuds Pro ANC',
                'brand' => 'Xiaomi',
                'category' => 'aksesoris',
                'price' => 499000,
                'stock' => 12,
                'icon' => '🎧',
                'description' => 'Active Noise Cancellation hingga 40dB dengan audio resolusi tinggi Hi-Res Wireless. Daya tahan baterai hingga 28 jam dengan cangkang pengisi daya.',
                'rating' => 4.6,
                'review_count' => 187
            ],
            [
                'name' => 'Tempered Glass iPhone 15',
                'brand' => 'Spigen',
                'category' => 'aksesoris',
                'price' => 89000,
                'stock' => 30,
                'icon' => '📱',
                'description' => 'Kekuatan kaca 9H hardness anti-gores, lapisan oleophobic anti-sidik jari, dan transmisi cahaya tinggi presisi edge-to-edge.',
                'rating' => 4.7,
                'review_count' => 445
            ],
            [
                'name' => 'Powerbank 20000mAh 65W',
                'brand' => 'Baseus',
                'category' => 'aksesoris',
                'price' => 549000,
                'stock' => 9,
                'icon' => '🔋',
                'description' => 'Kapasitas raksasa 20000mAh dengan pengisian cepat PD 65W dua arah. Dilengkapi layar LCD indikator persentase baterai real-time.',
                'rating' => 4.8,
                'review_count' => 238
            ],
            [
                'name' => 'Case Samsung S24 Ultra',
                'brand' => 'Spigen',
                'category' => 'aksesoris',
                'price' => 149000,
                'stock' => 25,
                'icon' => '📦',
                'description' => 'Perlindungan jatuh standar militer (Military Grade Drop Protection) dengan teknologi Air Cushion di setiap sudutnya.',
                'rating' => 4.5,
                'review_count' => 312
            ],
            // Pulsa & Data
            [
                'name' => 'Pulsa Telkomsel 50.000',
                'brand' => 'Telkomsel',
                'category' => 'pulsa',
                'price' => 50000,
                'stock' => 999,
                'icon' => '📶',
                'description' => 'Isi ulang pulsa reguler Telkomsel instant 24 jam untuk memperpanjang masa aktif dan transaksi layanan.',
                'rating' => 5.0,
                'review_count' => 1000
            ],
            [
                'name' => 'Paket Data XL 30GB 30hr',
                'brand' => 'XL',
                'category' => 'pulsa',
                'price' => 65000,
                'stock' => 999,
                'icon' => '📡',
                'description' => 'Kuota utama 30GB berlaku 24 jam di semua jaringan + bonus kuota lokal 10GB untuk masa aktif 30 hari.',
                'rating' => 4.6,
                'review_count' => 678
            ],
            [
                'name' => 'Paket Data Indosat 25GB',
                'brand' => 'Indosat',
                'category' => 'pulsa',
                'price' => 55000,
                'stock' => 999,
                'icon' => '📡',
                'description' => 'IM3 Ooredoo 25GB kuota utama tanpa pembagian waktu, berlaku selama 30 hari.',
                'rating' => 4.5,
                'review_count' => 423
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(['name' => $data['name']], $data);
        }
    }
}
