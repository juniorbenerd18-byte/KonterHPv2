# ConterHP v2 — NexusCenter

Versi kedua dari proyek **ConterHP**, sebuah aplikasi manajemen toko ponsel berbasis web yang dibangun ulang dari awal dengan arsitektur yang lebih matang, fitur yang lebih lengkap, dan tampilan yang lebih modern.

Proyek ini bernama **NexusCenter** — sistem all-in-one untuk toko HP yang mencakup penjualan, servis, pengantaran, hingga manajemen pelanggan.

---

## Tentang Versi Ini

ConterHP v2 adalah pengembangan lanjutan yang signifikan dari versi pertama. Perbedaan utama dibandingkan v1:

- Dibangun ulang menggunakan **Laravel 12** (dari yang sebelumnya versi lebih lama)
- Penambahan sistem **pengantaran GPS real-time** dengan lacak kurir
- Sistem **multi-role** yang lebih terstruktur (Admin, Kasir, Pengguna)
- Halaman publik untuk pelanggan: booking servis, lacak servis, belanja online
- Desain UI baru menggunakan **Tailwind CSS v4** dengan tema futuristik
- Fitur **checkout & keranjang belanja** untuk pelanggan

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | PHP 8.2+, Laravel 12 |
| Frontend | Blade, Tailwind CSS v4, Vite 7 |
| Database | SQLite (default), bisa MySQL |
| Build Tool | Vite + Laravel Vite Plugin |
| Queue/Cache | Database driver |

---

## Fitur Utama

### 🛒 Toko Online (Pelanggan)
- Halaman utama dengan produk terbaru
- Katalog produk: smartphone, aksesoris, pulsa & data
- Keranjang belanja & checkout
- Struk pembelian digital
- Halaman promo spesial

### 🔧 Servis HP
- Booking servis online tanpa perlu login
- Lacak status servis via nomor nota
- Manajemen servis untuk staff (terima, proses, selesai)
- Struk servis dengan detail biaya & DP
- Riwayat servis per akun pengguna

### 🚴 Pengantaran GPS
- Buat & kelola order pengantaran (Admin/Kasir)
- Kurir update lokasi real-time via HP
- Pelanggan lacak posisi kurir di peta
- PIN konfirmasi penerimaan paket
- Notifikasi WhatsApp ke pelanggan & kurir
- Perhitungan jarak menggunakan formula Haversine

### 📊 Manajemen (Staff)
- Dashboard dengan ringkasan penjualan & servis
- POS (Point of Sale) kasir
- Manajemen produk (CRUD) — Admin only
- Laporan penjualan & servis — Admin only
- Riwayat transaksi lengkap
- Notifikasi in-app untuk pesanan & servis baru

### 👤 Akun & Profil
- Login multi-role
- Edit profil & foto avatar
- Riwayat pembelian & servis per pengguna

---

## Role Pengguna

| Role | Akses |
|---|---|
| **Admin** | Semua fitur, manajemen produk, laporan |
| **Kasir** | Dashboard, POS, servis, pengantaran, riwayat |
| **Pengguna** | Belanja, booking servis, lacak, profil |

---

## Instalasi

### Prasyarat
- PHP >= 8.2
- Composer
- Node.js >= 18 & npm

### Langkah Setup

```bash
# 1. Clone repositori
git clone <repo-url>
cd ConterHPv2/NexusCenter

# 2. Install dependensi (satu perintah setup lengkap)
composer run setup
```

Perintah `composer run setup` otomatis menjalankan:
- `composer install`
- Copy `.env.example` → `.env`
- Generate app key
- Jalankan migrasi database
- `npm install` & `npm run build`

### Atau setup manual:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
npm install
npm run build
```

### Jalankan Aplikasi

```bash
composer run dev
```

Perintah ini menjalankan sekaligus: Laravel server, queue worker, log watcher (Pail), dan Vite dev server.

Atau jalankan satu per satu:
```bash
php artisan serve        # http://localhost:8000
npm run dev              # Vite asset watcher
php artisan queue:listen # Queue worker
```

---

## Akun Default (Seeder)

| Role | Email | Password |
|---|---|---|
| Admin | admin@nexuscenter.id | admin123 |
| Kasir | kasir@nexuscenter.id | kasir123 |
| Pengguna | pengguna@nexuscenter.id | pengguna123 |

---

## Struktur Folder Penting

```
NexusCenter/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # AuthController, SaleController, ServiceController, DeliveryController, dll
│   │   └── Middleware/      # EnsureUserIsAdmin, EnsureUserIsStaff
│   └── Models/              # User, Product, Sale, SaleItem, Service, Delivery, Notification
├── database/
│   ├── migrations/          # Skema tabel
│   └── seeders/             # Data awal produk & user
├── resources/views/         # Blade templates per fitur
│   ├── delivery/            # Lacak, kurir, manajemen pengantaran
│   ├── services/            # Booking, tracking, manajemen servis
│   ├── sales/               # POS kasir & struk
│   └── ...
├── routes/web.php           # Semua routing aplikasi
└── Design/                  # Desain HTML prototype tiap halaman
```

---

## Folder Design

Folder `Design/` berisi prototipe HTML statis dari setiap halaman yang dibuat sebelum diimplementasikan ke dalam Laravel. Berguna sebagai referensi visual dan dokumentasi desain UI.

---

## Konfigurasi Database

Secara default menggunakan **SQLite**. Untuk beralih ke MySQL, ubah `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexuscenter
DB_USERNAME=root
DB_PASSWORD=
```

Lalu jalankan ulang: `php artisan migrate --seed`
