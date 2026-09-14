# 🚀 Quick Start Guide — Trade-In System

## Test Complete Flow dalam 5 Menit!

---

## 🏁 Prerequisites

```bash
cd nexuscenter-js
npm run dev
```

Server running di: `http://localhost:3000`

---

## 📝 Test Scenario

### Step 1: Customer Booking (2 menit)

#### A. Home Page - Kalkulator
1. Buka `http://localhost:3000`
2. Scroll ke section **"Trade-In Calculator"**
3. Di search box, ketik: **"iPhone 13"**
4. Akan muncul dropdown hasil
5. Klik variant: **"128GB: Rp 6.500.000 - Rp 7.500.000"**
6. Klik button **"Booking Tukar Tambah →"**

#### B. Form Booking
1. URL berubah ke: `/tukar-tambah?device=iPhone+13&storage=128GB&min=6500000&max=7500000`
2. Form sudah terisi otomatis:
   - Device: iPhone 13
   - Storage: 128GB
   - Estimasi: Rp 6.5jt - 7.5jt
3. **PENTING**: Harus login dulu!
   - Klik "Login" → `login` / `user123`
   - Atau gunakan: `pengguna@nexuscenter.id` / `pengguna123`
4. Setelah login, kembali ke `/tukar-tambah`
5. Lengkapi form:
   - **Kondisi HP**: Baik
   - **HP Baru**: iPhone 15 Pro 256GB (opsional)
   - **Jadwal**: Pilih tanggal besok
6. Klik **"Kirim Booking Tukar Tambah"**

#### C. Konfirmasi
1. Redirect ke: `/tukar-tambah/[id]/konfirmasi`
2. Lihat bukti booking dengan nomor: `TI-20260914-XXXX`
3. ✅ Customer flow selesai!

---

### Step 2: Admin Notification (30 detik)

#### A. Login Admin
1. **Logout** dari akun pengguna
2. Klik **"Login"**
3. Login sebagai admin:
   - Email: `admin@nexuscenter.id`
   - Password: `admin123`

#### B. Check Notification
1. Lihat **navbar** → Icon notifikasi (bell)
2. Ada **badge merah** dengan angka **1**
3. Klik icon notifikasi
4. Lihat item pertama:
   - 🟡 **"1 Booking Tukar Tambah Baru"**
   - Background amber/kuning
   - "Ada booking trade-in yang menunggu taksir..."
5. Klik item tersebut

---

### Step 3: Admin Dashboard (2.5 menit)

#### A. View Dashboard
1. Redirect ke: `/trade-in-admin`
2. Lihat **Stats Cards**:
   - Total Booking: 1
   - **Pending Taksir: 1** (highlight amber)
   - Dalam Taksir: 0
   - Deal: 0

#### B. View Table Data
1. Lihat tabel dengan 1 row booking
2. Kolom yang ditampilkan:
   - Booking #: `TI-20260914-XXXX`
   - Pelanggan: Nama & Phone
   - HP Lama: iPhone 13, Apple, 128GB, **Baik**
   - Estimasi: Rp 6.5jt - 7.5jt
   - Status: 🟡 **Pending Taksir** (amber badge)
   - Tanggal: Just now

#### C. View Detail
1. Klik button **"👁️ Detail"** (icon mata)
2. Modal muncul dengan info lengkap:
   - Status badge
   - Customer info (nama, phone, tanggal booking)
   - HP lama detail (brand, model, storage, kondisi)
   - Estimasi harga
   - HP baru: iPhone 15 Pro 256GB
   - Jadwal: Besok
3. Klik **"Edit Status & Harga"**

#### D. Update Status & Harga
1. Modal edit muncul
2. Update fields:
   - **Status**: Ganti ke **"Dalam Taksir"**
   - **Harga Final**: Input **3500000** (Rp 3.5jt)
   - **Catatan**: "Kondisi fisik baik, layar mulus, baterai health 85%"
3. Klik **"Simpan Update"**
4. Alert: "✅ Data tukar tambah berhasil diupdate!"
5. Tabel auto-refresh
6. Status berubah jadi 🔵 **"Dalam Taksir"** (blue badge)
7. Kolom estimasi sekarang tampil: **Final: Rp 3.500.000** (green text)

#### E. Finalize Deal
1. Klik **"Edit"** lagi
2. Update:
   - **Status**: **"Deal"**
   - **Selisih Pembayaran**: **5500000** (Rp 5.5jt)
   - **Catatan**: "Deal untuk iPhone 15 Pro 256GB"
3. Klik **"Simpan Update"**
4. Status jadi 🟢 **"Deal"** (green badge)

---

## ✅ Testing Checklist

Ceklis setiap yang berhasil:

### Customer Side:
- [ ] ✅ Kalkulator search berfungsi
- [ ] ✅ Autocomplete muncul
- [ ] ✅ Button "Booking Tukar Tambah" dengan URL params
- [ ] ✅ Form pre-filled data
- [ ] ✅ Auth guard redirect ke login
- [ ] ✅ Submit booking berhasil
- [ ] ✅ Konfirmasi page dengan nomor unik
- [ ] ✅ Print receipt berfungsi
- [ ] ✅ Link WhatsApp berfungsi

### Admin Side:
- [ ] ✅ Login admin/kasir berhasil
- [ ] ✅ Notification badge muncul (angka 1)
- [ ] ✅ Notification dropdown tampil trade-in item
- [ ] ✅ Click notification → redirect ke admin page
- [ ] ✅ Stats cards tampil benar
- [ ] ✅ Table tampil data booking
- [ ] ✅ Detail modal berfungsi
- [ ] ✅ Edit modal berfungsi
- [ ] ✅ Update status & harga berhasil
- [ ] ✅ Auto-refresh setelah update
- [ ] ✅ Status color coding benar

### Navigation:
- [ ] ✅ Link "Tukar Tambah" di navbar (staff)
- [ ] ✅ Link "Tukar Tambah" di navbar (public)
- [ ] ✅ Mobile menu berfungsi
- [ ] ✅ Active state indicator
- [ ] ✅ Redirect unauthorized access

---

## 🐛 Common Issues & Solutions

### Issue 1: "Silakan login terlebih dahulu"
**Solution**: Login dulu sebelum booking
```
Email: pengguna@nexuscenter.id
Pass: pengguna123
```

### Issue 2: Notification badge tidak muncul
**Solution**: 
- Pastikan login sebagai **admin** atau **kasir**
- Refresh page (F5)
- Wait 1.5 detik untuk auto-sync

### Issue 3: Data tidak tersimpan
**Solution**: 
- Check browser console (F12)
- Verify localStorage: `nexus_trade_ins`
- Refresh page

### Issue 4: Modal tidak muncul
**Solution**: 
- Check z-index styling
- Refresh page
- Try different browser

---

## 🎯 Quick Commands

### Reset Data (jika perlu test ulang):
```javascript
// Paste di browser console (F12)
localStorage.removeItem('nexus_trade_ins');
location.reload();
```

### Check Data:
```javascript
// Lihat semua booking
JSON.parse(localStorage.getItem('nexus_trade_ins') || '[]');
```

### Manual Add Booking (for testing):
```javascript
const booking = {
  id: Date.now(),
  booking_number: 'TI-20260914-9999',
  customer_name: 'Test Customer',
  customer_phone: '081234567890',
  old_device_brand: 'Samsung',
  old_device_model: 'Galaxy S22',
  old_device_storage: '256GB',
  old_device_condition: 'Sangat Baik',
  estimated_price_min: 5000000,
  estimated_price_max: 6500000,
  status: 'Pending Taksir',
  created_at: new Date().toISOString()
};

const stored = JSON.parse(localStorage.getItem('nexus_trade_ins') || '[]');
stored.unshift(booking);
localStorage.setItem('nexus_trade_ins', JSON.stringify(stored));
location.reload();
```

---

## 📱 Responsive Testing

Test di berbagai device:

### Desktop (Chrome DevTools):
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

### Test Resolutions:
- **Desktop**: 1920x1080
- **Laptop**: 1366x768
- **Tablet**: iPad (768x1024)
- **Mobile**: iPhone SE (375x667)

### Check:
- [ ] Table horizontal scroll di mobile
- [ ] Modal full-screen di mobile
- [ ] Buttons tidak overlap
- [ ] Text readable
- [ ] Touch targets minimal 44px

---

## ✅ Success Criteria

Test dianggap **PASS** jika:

✅ **Customer dapat booking** tanpa error  
✅ **Admin dapat notifikasi** badge & dropdown  
✅ **Admin dapat lihat detail** booking  
✅ **Admin dapat update** status & harga  
✅ **Data persistent** setelah refresh  
✅ **Responsive** di mobile & desktop  
✅ **No console errors** di F12  

---

## 🎉 Done!

Jika semua checklist ✅, artinya sistem **BERHASIL** dan siap production!

**Next**: Deploy ke staging/production server

---

**Happy Testing!** 🚀  
**Questions?** Check dokumentasi lengkap di `COMPLETE_TRADE_IN_SYSTEM.md`
