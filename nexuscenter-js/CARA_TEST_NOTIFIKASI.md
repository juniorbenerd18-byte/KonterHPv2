# 🧪 Cara Test Notifikasi Customer - Step by Step

## 📱 SCENARIO: Customer Booking → Admin Update → Customer Dapat Notif

---

## STEP 1: Customer Membuat Booking Tukar Tambah

### 1.1 Login sebagai Customer
```
URL: http://localhost:3000/login
Email: pengguna@nexuscenter.id
Password: pengguna123
```

### 1.2 Buka Halaman Tukar Tambah
- Klik menu **"Tukar Tambah"** di navbar
- Atau langsung ke: `http://localhost:3000/tukar-tambah`

### 1.3 Isi Form Booking
```
Nama Lengkap: Budi Santoso
No. WhatsApp: 081234567890

HP Lama:
- Brand: Samsung
- Model: Galaxy S21 Ultra  (ketik "galaxy" di search)
- Storage: 256GB
- Kondisi: Baik

HP Baru yang Diinginkan: iPhone 15 Pro Max 256GB
Jadwal Kunjungan: Pilih tanggal besok
Catatan: Minus kamera belakang sedikit baret
```

### 1.4 Kirim Booking
- Klik **"Kirim Booking Tukar Tambah"**
- Tunggu redirect ke halaman konfirmasi
- **CATAT BOOKING NUMBER**: Contoh `TI-20260914-1234`

### 1.5 Screenshot Bukti
- Halaman konfirmasi menampilkan:
  * ✅ "Booking Tukar Tambah Berhasil!"
  * 📱 Detail HP lama
  * 💰 Estimasi harga: Rp 4.500.000 - Rp 5.200.000
  * 📋 Booking number

### 1.6 Logout
- Klik profile → Keluar

---

## STEP 2: Admin Update Status Booking

### 2.1 Login sebagai Admin
```
URL: http://localhost:3000/login
Email: admin@nexuscenter.id
Password: admin123
```

### 2.2 Cek Notifikasi Badge
- Lihat icon 🔔 notification di navbar
- Harus ada **badge merah** dengan angka (jumlah Pending Taksir)
- Contoh: Badge "1" berarti ada 1 booking baru

### 2.3 Klik Notification Icon
- Dropdown muncul
- Lihat notifikasi amber: **"1 Booking Tukar Tambah Baru"**
- Klik notifikasi → redirect ke `/trade-in-admin`

### 2.4 Buka Page Admin Trade-In
- Atau langsung ke: `http://localhost:3000/trade-in-admin`
- Lihat dashboard stats:
  * Total Bookings
  * Pending Taksir (ada 1)
  * Dalam Taksir
  * Deal

### 2.5 Cari Booking Customer
- Di search bar, ketik: "Budi" atau booking number
- Atau filter status: "Pending Taksir"
- Lihat row booking customer di tabel

### 2.6 Edit Booking
- Klik **tombol Edit (icon ✏️)**
- Modal edit muncul

### 2.7 Update Status → "Dalam Taksir"
- **Status**: Pilih "Dalam Taksir"
- **Final Price**: Ketik `4800000` atau gunakan ↑↓ arrow keys
  * Setiap kali ↑ = tambah Rp 10.000
  * Setiap kali ↓ = kurang Rp 10.000
- **Additional Payment**: Ketik `7200000` (selisih ke iPhone 15 Pro Max)
- **Catatan**: "HP dalam kondisi baik, siap ditaksir"

### 2.8 Save Changes
- Klik **"Update Booking"**
- Toast notification: "✅ Booking berhasil diupdate"
- Modal close otomatis
- Lihat status berubah di tabel

### 2.9 Logout
- Klik profile → Keluar

---

## STEP 3: Customer Cek Notifikasi

### 3.1 Login Kembali sebagai Customer
```
Email: pengguna@nexuscenter.id
Password: pengguna123
```

### 3.2 Lihat Badge Notification
- **PERHATIKAN** icon 🔔 di navbar
- Sekarang ada **badge merah** dengan angka "1"
- Badge ini menandakan ada 1 notifikasi unread

### 3.3 Klik Icon Notification
- Dropdown notification muncul
- Header: "Notifikasi (1)"
- Lihat notifikasi dengan:
  * Background cyan (unread indicator)
  * Icon: 🔄 autorenew
  * Title: **"Update Status Trade-In"**
  * Message: **"Booking trade-in TI-20260914-1234 sedang ditaksir oleh teknisi kami"**
  * Timestamp: "Baru saja"
  * Dot biru animasi (unread indicator)

### 3.4 Click Notifikasi
- Click di notifikasi
- Redirect ke: `/tukar-tambah/[id]/konfirmasi`
- Notifikasi otomatis marked as read
- Badge counter berkurang (dari 1 → 0)

### 3.5 Lihat Detail Update
- Halaman konfirmasi update dengan info baru:
  * Status badge: "Dalam Taksir"
  * Progress tidak terlihat di halaman ini (hanya di tracking page)

---

## STEP 4: Customer Lacak Status via Tracking Page

### 4.1 Logout (Opsional)
- Customer bisa lacak status **tanpa login**

### 4.2 Buka Tracking Page
- URL: `http://localhost:3000/tukar-tambah/lacak`
- Atau klik link di:
  * Navbar → **"Lacak TT"**
  * Mobile menu → **"Lacak Tukar Tambah"**
  * Footer → **"Lacak Tukar Tambah"**
  * Confirmation page → **"Lacak Status Tukar Tambah"**

### 4.3 Masukkan Booking Number
- Input: `TI-20260914-1234`
- Klik **"Lacak Sekarang"**

### 4.4 Lihat Status Lengkap
**Status Header:**
- Background: Dark gradient (slate-900 → slate-800)
- Booking Number: Cyan color (TI-20260914-1234)
- Emoji: 🔍 (Dalam Taksir)

**Progress Bar:**
- Label: "Progress"
- Percentage: **40%** (Dalam Taksir = 40%)
- Gradient bar: secondary → cyan-400
- Animasi smooth transition

**Current Status:**
- Badge: "Dalam Taksir" (blue background)
- Message: "HP Anda sedang ditaksir oleh teknisi kami. Proses ini biasanya memakan waktu 15-30 menit."
- Animated pulse dot

**HP yang Ditukar:**
- Icon: 📱
- Model: Samsung Galaxy S21 Ultra
- Brand: Samsung
- Storage: 256GB
- Kondisi: Baik

**Informasi Harga:**
- Estimasi Awal: Rp 4.500.000 - Rp 5.200.000
- **Harga Final**: Rp 4.800.000 (green box) ✅
- **Selisih Dibayar**: Rp 7.200.000 (blue box)
- Untuk HP: iPhone 15 Pro Max 256GB

**Timeline:**
- Tanggal Booking: Senin, 14 September 2026, 10:30
- Jadwal Kunjungan: Selasa, 15 September 2026
- Update Terakhir: Senin, 14 September 2026, 11:15

**Action Buttons:**
- 🟢 **Hubungi via WhatsApp** → Open WA dengan pre-filled message
- 📄 **Lihat Bukti Booking** → Redirect ke confirmation page

---

## STEP 5: Admin Update Lagi (Multiple Notifications)

### 5.1 Login sebagai Admin
```
Email: admin@nexuscenter.id
Password: admin123
```

### 5.2 Update ke "Menunggu Persetujuan"
- Buka `/trade-in-admin`
- Edit booking Budi
- Status: **"Menunggu Persetujuan"**
- Catatan: "Harga final sudah ditentukan. Mohon konfirmasi untuk lanjut."
- Save

### 5.3 Update ke "Deal"
- Edit lagi
- Status: **"Deal"**
- Catatan: "Customer setuju. Silakan datang ke toko besok."
- Save

### 5.4 Logout

---

## STEP 6: Customer Lihat Multiple Notifications

### 6.1 Login sebagai Customer
```
Email: pengguna@nexuscenter.id
Password: pengguna123
```

### 6.2 Lihat Badge Notification
- Badge sekarang: **"2"** (2 unread notifications)

### 6.3 Buka Dropdown Notification
- Lihat 2 notifikasi:
  1. **"Update Status Trade-In"** - "Harga trade-in TI-20260914-1234 sudah ditentukan. Silakan cek detail"
  2. **"Update Status Trade-In"** - "Trade-in TI-20260914-1234 berhasil! Silakan datang ke toko untuk proses transaksi"

### 6.4 Click Salah Satu Notification
- Notification marked as read
- Badge counter: 2 → 1

### 6.5 Lacak Status via Tracking Page
- Buka `/tukar-tambah/lacak`
- Input booking number
- Lihat update:
  * Progress: **80%** (Deal)
  * Status: "Deal" (green badge)
  * Message: "Selamat! Trade-in telah disepakati. Silakan datang ke toko untuk menyelesaikan transaksi."

---

## ✅ EXPECTED RESULTS

### Customer Experience:
1. ✅ Customer booking → dapat confirmation
2. ✅ Admin update status → notification muncul
3. ✅ Badge merah di navbar → menarik perhatian
4. ✅ Click notification → redirect ke detail
5. ✅ Mark as read → badge counter berkurang
6. ✅ Tracking page → status lengkap dengan progress

### Admin Experience:
1. ✅ Badge untuk Pending Taksir
2. ✅ Notification dropdown
3. ✅ Easy status update
4. ✅ Number input step 10k
5. ✅ Real-time stats update

---

## 🐛 TROUBLESHOOTING

### Badge Tidak Muncul?
```javascript
// Check di browser console:
localStorage.getItem('nexus_notifications')
```
- Jika `null` → belum ada notifikasi
- Jika ada data → parse JSON dan check `is_read` status

### Notifikasi Tidak Tersimpan?
- Check console errors
- Pastikan `updateTradeIn` di `store.ts` jalan
- Coba manual:
```javascript
const notifs = JSON.parse(localStorage.getItem('nexus_notifications') || '[]')
console.log(notifs)
```

### Tracking Page Not Found?
- Check URL: `/tukar-tambah/lacak` (bukan `/tukar-tambah/track`)
- Pastikan file ada di: `src/app/tukar-tambah/lacak/page.tsx`

### Progress Bar Tidak Animasi?
- Check Tailwind config
- Pastikan `transition-all duration-500` applied
- Refresh page

---

## 📸 SCREENSHOTS CHECKLIST

- [ ] Navbar dengan badge notification (customer view)
- [ ] Dropdown notification dengan unread item
- [ ] Tracking page dengan progress bar
- [ ] Admin edit modal dengan step 10k
- [ ] Confirmation page dengan tracking link
- [ ] Footer dengan tracking link

---

**Happy Testing! 🚀**
