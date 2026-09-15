 # 📱 Nexus Center — Mobile Phone Store & Service Management System

**Nexus Center** adalah aplikasi berbasis web untuk membantu mengelola operasional **konter HP**, mulai dari penjualan produk, transaksi pembayaran, layanan servis, trade-in, hingga delivery.

## 📌 Project Versions

Repository ini memiliki dua implementasi NexusCenter:

| Folder | Teknologi | Keterangan |
|---|---|---|
| `nexuscenter-js/` | JavaScript Framework | Versi Web App yang digunakan pada Live Demo |

Aplikasi ini menggabungkan fitur **Point of Sale (POS)** dan **Service Management** dalam satu platform.

## 🖼️ Screenshots

### 🔐 Login
<img width="727" height="783" alt="image" src="https://github.com/user-attachments/assets/05331f95-a928-45e0-a1f4-3961f1ca698e" />


### 🏠 Home Menu

<img width="1366" height="768" alt="Home Menu" src="https://github.com/user-attachments/assets/0e9f4d55-2c48-41e9-a8df-f46990a67d07" />

###  👤 Profil

<img width="1907" height="919" alt="Screenshot 2026-09-14 140908" src="https://github.com/user-attachments/assets/0905d8b9-f414-4263-9f4f-c944abd7a590" />

### 🔧 Booking Service

<img width="1916" height="917" alt="Screenshot 2026-09-14 140918" src="https://github.com/user-attachments/assets/13950595-080a-4632-9bad-40b62d22f98a" />


 

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
