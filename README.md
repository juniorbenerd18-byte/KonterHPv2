 # 📱 Nexus Center — Mobile Phone Store & Service Management System

**Nexus Center** adalah aplikasi berbasis web untuk membantu mengelola operasional **konter HP**, mulai dari penjualan produk, transaksi pembayaran, layanan servis, trade-in, hingga delivery.

## 📌 Project Versions

Repository ini memiliki dua implementasi NexusCenter:

| Folder | Teknologi | Keterangan |
|---|---|---|
| `NexusCenter/` | Laravel | Versi Laravel |
| `nexuscenter-js/` | JavaScript Framework | Versi Web App yang digunakan pada Live Demo |

> Live Demo menggunakan versi `nexuscenter-js`.

Aplikasi ini menggabungkan fitur **Point of Sale (POS)** dan **Service Management** dalam satu platform.

## 🖼️ Screenshots

### 🔐 Login
![Nexus Center Login](./screenshots/login.p)

### 📊 HomeMenu
![Nexus Center HomeMenu](<img width="1366" height="768" alt="HomeMenu - Copy" src="https://github.com/user-attachments/assets/0e9f4d55-2c48-41e9-a8df-f46990a67d07" />
)

###  👤 Profil
![Nexus Center POS](<img width="390" height="816" alt="Screenshot 2026-09-14 140908" src="https://github.com/user-attachments/assets/8aed561a-87c3-464f-aae4-9fff0e897a4d" />
)

### 🔧 Booking Service
![Nexus Center Service](./screenshots/service.png)

 

## 🚀 Live Demo

🌐 **Website:** https://nexuscenter-js.juniorbenerd18.workers.dev/

## 🪧 Video Demo

🌐 **Website:** https://youtu.be/Tpc3Yo-yHVs

## ✨ Fitur Utama

### 🛒 Penjualan & POS

* Katalog HP dan produk
* Keranjang belanja
* Checkout
* Pemilihan metode pembayaran
* Perhitungan total transaksi
* Format nominal dengan pemisah ribuan

### 🔧 Layanan Servis HP

* Pengajuan servis
* Pencatatan data perangkat
* Pengelolaan status servis
* Pengelolaan layanan servis oleh petugas
* Pelacakan status servis oleh pelanggan

### 🔄 Trade-In

* Pengajuan tukar tambah HP
* Pencatatan informasi perangkat lama
* Estimasi nilai perangkat
* Pengelolaan proses trade-in

### 🚚 Delivery

* Pengajuan antar/jemput perangkat
* Pengelolaan permintaan delivery
* Informasi status pengiriman atau penjemputan

### 👤 Manajemen Pengguna

| Role        | Fungsi                                                                |
| ----------- | --------------------------------------------------------------------- |
| 👤 Pengguna | Membeli produk, checkout, mengajukan servis, trade-in, dan delivery   |
| 💰 Kasir    | Mengelola transaksi penjualan dan layanan servis                      |
| 🛠️ Admin   | Mengelola produk, pengguna, transaksi, servis, dan operasional sistem |

---

## 🏗️ Kategori Aplikasi

**Mobile Phone Store & Service Management System**

Aplikasi ini mencakup beberapa konsep:

* **Point of Sale (POS)**
* **E-Commerce**
* **Service Management**
* **Product Management**
* **Customer Management**
* **Trade-In Management**

---

## 💻 Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js |
| Language | JavaScript |
| Frontend | React |
| Styling | Tailwind CSS |
| Database | Supabase |
| Deployment | Cloudflare Workers |

### Backend & Database

* Supabase

### Deployment

* Cloudflare Workers

---

## 📂 Struktur Aplikasi

```text
Nexus Center
├── Authentication
├── Dashboard
├── Products
├── Cart
├── Checkout
├── Payment
├── Service
├── Trade-In
├── Delivery
├── Transaction History
└── User Management
```

---

## 🔐 Authentication & Authorization

Sistem menggunakan autentikasi dan pembagian akses berdasarkan role.

### User
Gmail : Budi@gmail.com
Password : user123


### Kasir
Gmail : Kasir@techcell.com
Password : kasir123

Mengelola transaksi pelanggan dan layanan servis.

### Admin
Gmail : admin@techcell.com
Password : admin123

Mengelola data produk, pengguna, transaksi, servis, dan operasional sistem.

---

## 💳 Alur Transaksi

```text
Pilih Produk
     ↓
Tambah ke Keranjang
     ↓
Checkout
     ↓
Proses Pembayaran
     ↓
Pilih Metode Pembayaran
     ↓
Konfirmasi
     ↓
Transaksi Selesai
```

Metode pembayaran ditampilkan setelah pengguna menekan tombol **Proses Pembayaran** melalui pop-up.

---

## 🔧 Alur Servis

```text
Pelanggan
    ↓
Ajukan Servis
    ↓
Data Perangkat Dicatat
    ↓
Pengecekan
    ↓
Proses Perbaikan
    ↓
Selesai
    ↓
Pengambilan / Delivery
```

---

## 🎯 Tujuan Project

Nexus Center dibuat untuk membantu digitalisasi operasional konter HP agar proses:

* Penjualan
* Pembayaran
* Servis HP
* Trade-in
* Delivery
* Pengelolaan pelanggan
* Pengelolaan produk
* Pengelolaan transaksi

dapat dilakukan dalam satu sistem.

---

## ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/juniorbenerd18-byte/KonterHPv2.git
```

Masuk ke folder project:

```bash
cd nexuscenter-js
* Ini adalah veri Web App Framework JS
```

Install dependency:

```bash
npm install
```

Jalankan project:

```bash
npm run dev
```

---

## 🛖 Portofolio 

https://portfolio.edusoftcenter.com/contributors/junior-alfredo-benerd-setiawan

## 🌐 Deployment

Project ini di-deploy menggunakan **Cloudflare Workers**.

```bash
npm run build
```

Kemudian lakukan deployment menggunakan konfigurasi Cloudflare yang digunakan oleh project.

---

## 📄 License

Project ini dibuat untuk keperluan **pembelajaran, pengembangan aplikasi, dan portfolio**.

© 2026 Nexus Center
