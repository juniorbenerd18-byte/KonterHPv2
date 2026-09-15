# 📱 Nexus Center — Mobile Phone Store & Service Management System

**Nexus Center** adalah aplikasi berbasis web yang dirancang untuk membantu mengelola operasional **konter HP**, mulai dari penjualan produk, transaksi pembayaran, layanan servis, trade-in, hingga delivery.

Aplikasi ini menggabungkan konsep **Point of Sale (POS)** dan **Service Management** dalam satu platform dengan sistem role untuk **Pengguna, Kasir, dan Admin**.

---

## 📌 Project Version

Repository ini memiliki implementasi Nexus Center berbasis **Next.js** yang digunakan untuk Live Demo.

| Folder | Teknologi | Keterangan |
|---|---|---|
| `nexuscenter-js/` | Next.js, React, JavaScript | Versi Web App yang digunakan pada Live Demo |

---

## 🚀 Live Demo

🌐 **Website:**  
https://nexuscenter-js.juniorbenerd18.workers.dev/

### 🔐 Demo Login

Gunakan akun demo berikut untuk mencoba fitur berdasarkan masing-masing role:

| Role | Email | Password |
|---|---|---|
| 👤 Pengguna | `Budi@gmail.com` | `user123` |
| 💰 Kasir | `Kasir@techcell.com` | `kasir123` |
| 🛠️ Admin | `admin@techcell.com` | `admin123` |

> **Catatan:** Akun di atas merupakan akun demo yang disediakan khusus untuk keperluan pengujian aplikasi dan bukan akun pribadi.

Reviewer dapat menggunakan akun tersebut pada halaman **Login** untuk mencoba fitur dari masing-masing role.

---

## 🎓 Edusoft Portfolio

Portfolio project:

https://portfolio.edusoftcenter.com/contributors/junior-alfredo-benerd-setiawan

---

## 🎥 Video Demo

▶️ **YouTube:**  
https://youtu.be/Tpc3Yo-yHVs

Video demo menampilkan penggunaan aplikasi dan beberapa fitur utama Nexus Center, termasuk penjualan, checkout, layanan servis, dan pengelolaan berdasarkan role pengguna.

---

# 🖼️ Screenshots

## 🔐 Login

<img width="727" height="783" alt="Login Nexus Center" src="https://github.com/user-attachments/assets/05331f95-a928-45e0-a1f4-3961f1ca698e" />

Halaman login digunakan untuk masuk ke dalam sistem berdasarkan role pengguna.

---

## 🏠 Home Menu

<img width="1366" height="768" alt="Home Menu Nexus Center" src="https://github.com/user-attachments/assets/0e9f4d55-2c48-41e9-a8df-f46990a67d07" />

Halaman utama yang menyediakan akses ke berbagai fitur aplikasi.

---

## 👤 Profil

<img width="1907" height="919" alt="Profil Nexus Center" src="https://github.com/user-attachments/assets/0905d8b9-f414-4263-9f4f-c944abd7a590" />

Halaman profil digunakan untuk melihat informasi pengguna.

---

## 🔧 Booking Service

<img width="1916" height="917" alt="Booking Service Nexus Center" src="https://github.com/user-attachments/assets/13950595-080a-4632-9bad-40b62d22f98a" />

Fitur booking service digunakan pelanggan untuk mengajukan layanan perbaikan perangkat.

---

# ✨ Fitur Utama

## 🛒 Penjualan & Point of Sale

- Katalog HP dan produk
- Menampilkan informasi produk
- Keranjang belanja
- Checkout
- Pemilihan metode pembayaran
- Perhitungan total transaksi
- Format nominal dengan pemisah ribuan
- Pengelolaan transaksi penjualan

---

## 🔧 Layanan Servis HP

- Pengajuan servis
- Pencatatan data perangkat
- Pencatatan keluhan kerusakan
- Pengelolaan status servis
- Pengelolaan layanan servis oleh petugas
- Pelacakan status servis oleh pelanggan

---

## 🔄 Trade-In

- Pengajuan tukar tambah HP
- Pencatatan informasi perangkat lama
- Estimasi nilai perangkat
- Pengelolaan proses trade-in

---

## 🚚 Delivery

- Pengajuan antar/jemput perangkat
- Pengelolaan permintaan delivery
- Informasi status pengiriman
- Pengelolaan proses penjemputan atau pengantaran

---

# 👤 Role & User Management

Nexus Center memiliki tiga role utama:

| Role | Fungsi |
|---|---|
| 👤 **Pengguna** | Membeli produk, checkout, mengajukan servis, trade-in, dan delivery |
| 💰 **Kasir** | Mengelola transaksi penjualan dan layanan servis |
| 🛠️ **Admin** | Mengelola produk, pengguna, transaksi, servis, dan operasional sistem |

---

# 🏗️ Kategori Aplikasi

**Mobile Phone Store & Service Management System**

Aplikasi ini mencakup beberapa konsep:

- 🛒 **Point of Sale (POS)**
- 🛍️ **E-Commerce**
- 🔧 **Service Management**
- 📦 **Product Management**
- 👥 **Customer Management**
- 🔄 **Trade-In Management**
- 🚚 **Delivery Management**
- 💳 **Payment Management**

---

# 💻 Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js |
| Language | JavaScript |
| Frontend | React |
| Styling | Tailwind CSS |
| Database | Supabase |
| Deployment | Cloudflare Workers |

---

# ⚙️ Installation

Ikuti langkah berikut untuk menjalankan **Nexus Center** di komputer secara lokal.

### 1. Clone Repository

Clone repository GitHub dan masuk ke folder project:

```bash
git clone https://github.com/juniorbenerd18-byte/KonterHPv2.git
cd KonterHPv2/nexuscenter-js
```

### 2. Install Dependencies

Pastikan **Node.js** dan **npm** sudah terinstall, kemudian jalankan:

```bash
npm install
```

### 3. Konfigurasi Supabase

Buat file `.env.local` di dalam folder `nexuscenter-js`, kemudian masukkan konfigurasi Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Ganti `your_supabase_url` dan `your_supabase_anon_key` dengan konfigurasi Supabase yang digunakan oleh project.

> **Penting:** Jangan upload file `.env.local` atau secret key ke repository GitHub publik.

### 4. Jalankan Aplikasi

Setelah dependencies dan konfigurasi database selesai, jalankan development server:

```bash
npm run dev
```

Kemudian buka browser dan akses:

```text
http://localhost:3000
```

### 5. Login Menggunakan Akun Demo

Setelah aplikasi terbuka, gunakan salah satu akun demo berikut:

| Role | Email | Password |
|---|---|---|
| 👤 Pengguna | `Budi@gmail.com` | `user123` |
| 💰 Kasir | `Kasir@techcell.com` | `kasir123` |
| 🛠️ Admin | `admin@techcell.com` | `admin123` |

> Akun di atas merupakan akun demo yang disediakan khusus untuk keperluan pengujian aplikasi.

### 📌 Ringkasan Installation

```bash
# Clone repository
git clone https://github.com/juniorbenerd18-byte/KonterHPv2.git

# Masuk ke folder project
cd KonterHPv2/nexuscenter-js

# Install dependencies
npm install

# Jalankan aplikasi
npm run dev
```

Aplikasi kemudian dapat diakses melalui:

**http://localhost:3000**

---

# 🗄️ Database

Nexus Center menggunakan **Supabase** sebagai database utama.

Database digunakan untuk menyimpan dan mengelola data seperti:

- Data pengguna
- Data produk
- Data transaksi
- Data servis
- Data trade-in
- Data delivery
- Data pembayaran

Konfigurasi koneksi database dilakukan menggunakan **environment variable** melalui file `.env.local`.

---

# 📂 Struktur Aplikasi

```text
Nexus Center
│
├── nexuscenter-js/
│   │
│   ├── Authentication
│   ├── Dashboard
│   ├── Products
│   ├── Cart
│   ├── Checkout
│   ├── Payment
│   ├── Service
│   ├── Trade-In
│   ├── Delivery
│   ├── Transaction History
│   └── User Management
│
├── Screenshots/
│
└── README.md
```

---

# 🔒 Security

Beberapa hal yang perlu diperhatikan ketika menjalankan project:

- Credential demo hanya digunakan untuk keperluan pengujian.
- Credential pribadi tidak dicantumkan di repository.
- Konfigurasi Supabase menggunakan environment variable.
- File `.env.local` tidak boleh di-upload ke repository publik.
- Jangan membagikan Supabase secret/service role key ke publik.

---

# 📋 Project Information

| Informasi | Link |
|---|---|
| 🌐 Live Demo | https://nexuscenter-js.juniorbenerd18.workers.dev/ |
| 🎥 Video Demo | https://youtu.be/Tpc3Yo-yHVs |
| 🎓 Edusoft Portfolio | https://portfolio.edusoftcenter.com/contributors/junior-alfredo-benerd-setiawan |
| 💻 GitHub Repository | https://github.com/juniorbenerd18-byte/KonterHPv2 |

---

# 👨‍💻 Project

**Nexus Center**

**Mobile Phone Store & Service Management System**

Dibangun menggunakan:

**Next.js + React + Tailwind CSS + Supabase + Cloudflare Workers**
