'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService, INITIAL_STORE_LOCATION } from '@/lib/store';
import { Sale, Service, UserProfile, Role, StoreLocation, CustomerAddress } from '@/types/database';
import { STORE_LAT, STORE_LNG, parseMapCoords } from '@/lib/geo';
import MapLocationPicker from '@/components/MapLocationPicker';

type Tab = 'account' | 'orders' | 'services' | 'addresses';

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('account');
  const [user, setUser] = useState<UserProfile>({
    id: 1,
    name: 'Pelanggan Setia TECHCELL',
    email: 'budi@gmail.com',
    phone: '081234567890',
    address: 'Jl. Ahmad Yani No. 88, Kartasura, Sukoharjo',
    latitude: -7.5583,
    longitude: 110.7681,
    role: 'pengguna',
    is_active: true,
    created_at: new Date().toISOString(),
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🏪 Staff Store Location state (khusus Admin & Kasir)
  const [storeLoc, setStoreLoc] = useState<StoreLocation>(INITIAL_STORE_LOCATION);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [storeFormName, setStoreFormName] = useState(INITIAL_STORE_LOCATION.name);
  const [storeFormPlusCode, setStoreFormPlusCode] = useState(INITIAL_STORE_LOCATION.plus_code);
  const [storeFormAddress, setStoreFormAddress] = useState(INITIAL_STORE_LOCATION.address);
  const [storeFormLat, setStoreFormLat] = useState(INITIAL_STORE_LOCATION.latitude);
  const [storeFormLng, setStoreFormLng] = useState(INITIAL_STORE_LOCATION.longitude);
  const [storeFormHours, setStoreFormHours] = useState(INITIAL_STORE_LOCATION.opening_hours);
  const [storeFormPhone, setStoreFormPhone] = useState(INITIAL_STORE_LOCATION.phone);
  const [storeFormRadius, setStoreFormRadius] = useState(INITIAL_STORE_LOCATION.free_delivery_km);

  // 🏠 Customer Delivery Addresses state (khusus Pengguna)
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([]);
  const [newCustLabel, setNewCustLabel] = useState('');
  const [newCustText, setNewCustText] = useState('');
  const [newCustLat, setNewCustLat] = useState(-7.5583);
  const [newCustLng, setNewCustLng] = useState(110.7681);
  const [showCustAddForm, setShowCustAddForm] = useState(false);

  const loadData = useCallback(async () => {
    if (!DataService.isLoggedIn()) {
      router.push('/login?redirect=/profile');
      return;
    }
    setLoading(true);
    const [allSales, allServices] = await Promise.all([
      DataService.getSales(),
      DataService.getServices(),
    ]);
    setSales(allSales);
    setServices(allServices);

    try {
      const current = DataService.getCurrentUser();
      if (current) {
        setUser(current);
      } else {
        const stored = localStorage.getItem('nexus_user_profile');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          const currentRole = DataService.getCurrentRole();
          setUser((prev) => ({
            ...prev,
            role: currentRole,
            name: currentRole === 'admin' ? 'Super Admin TECHCELL' : currentRole === 'kasir' ? 'Ahmad Kasir' : 'Pelanggan Setia TECHCELL',
            email: currentRole === 'admin' ? 'admin@techcell.com' : currentRole === 'kasir' ? 'kasir@techcell.com' : 'budi@gmail.com',
          }));
        }
      }

      // Load store location
      const loc = DataService.getStoreLocation();
      setStoreLoc(loc);
      setStoreFormName(loc.name);
      setStoreFormPlusCode(loc.plus_code);
      setStoreFormAddress(loc.address);
      setStoreFormLat(loc.latitude);
      setStoreFormLng(loc.longitude);
      setStoreFormHours(loc.opening_hours);
      setStoreFormPhone(loc.phone);
      setStoreFormRadius(loc.free_delivery_km);

      // Load customer addresses
      const addrs = DataService.getCustomerAddresses(current?.id);
      setCustomerAddresses(addrs);
    } catch {}
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const qTab = params.get('tab');
      if (hash.includes('orders') || qTab === 'orders') {
        setTab('orders');
      } else if (hash.includes('services') || qTab === 'services') {
        setTab('services');
      } else if (hash.includes('addresses') || hash.includes('store-location') || qTab === 'addresses' || qTab === 'store-location') {
        setTab('addresses');
      }
    }
  }, [loadData]);

  // 🏪 Store Location Handlers
  const handleStoreAddressInput = (text: string) => {
    setStoreFormAddress(text);
    const parsed = parseMapCoords(text);
    if (parsed) {
      setStoreFormLat(parsed.lat);
      setStoreFormLng(parsed.lng);
    }
  };

  const handleSaveStoreLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = DataService.updateStoreLocation({
      name: storeFormName.trim() || 'TECHCELL NexusCenter',
      plus_code: storeFormPlusCode.trim() || 'FQ2W+XGM',
      address: storeFormAddress.trim(),
      latitude: storeFormLat,
      longitude: storeFormLng,
      opening_hours: storeFormHours.trim(),
      phone: storeFormPhone.trim(),
      free_delivery_km: Number(storeFormRadius) || 4.0
    });
    setStoreLoc(updated);
    setIsEditingStore(false);
    setSavedSuccess(true);
    DataService.updateCurrentUser({
      address: updated.address,
      latitude: updated.latitude,
      longitude: updated.longitude
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // 🏠 Customer Address Handlers
  const detectCustomerGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setNewCustLat(pos.coords.latitude);
          setNewCustLng(pos.coords.longitude);
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
            .then(r => r.json())
            .then(data => {
              if (data && data.display_name) {
                setNewCustText(data.display_name);
              }
            })
            .catch(() => {});
        },
        () => alert('Gagal deteksi GPS. Pastikan izin lokasi aktif.')
      );
    } else {
      alert('Browser tidak mendukung GPS.');
    }
  };

  const handleCustomerAddressInput = (text: string) => {
    setNewCustText(text);
    const parsed = parseMapCoords(text);
    if (parsed) {
      setNewCustLat(parsed.lat);
      setNewCustLng(parsed.lng);
    }
  };

  const handleSaveNewCustomerAddress = () => {
    if (!newCustLabel.trim()) {
      alert('Masukkan label alamat (contoh: Rumah, Kantor, Kos)');
      return;
    }
    if (!newCustText.trim()) {
      alert('Masukkan alamat lengkap pengiriman');
      return;
    }
    const updated = DataService.saveCustomerAddress({
      label: newCustLabel.trim(),
      address: newCustText.trim(),
      lat: newCustLat,
      lng: newCustLng,
      is_default: customerAddresses.length === 0
    }, user.id);
    setCustomerAddresses(updated);
    setNewCustLabel('');
    setNewCustText('');
    setNewCustLat(-7.5583);
    setNewCustLng(110.7681);
    setShowCustAddForm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteCustomerAddress = (id: number) => {
    if (confirm('Hapus alamat pengiriman ini?')) {
      const updated = DataService.deleteCustomerAddress(id, user.id);
      setCustomerAddresses(updated);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      DataService.updateCurrentUser(user);
      localStorage.setItem('nexus_user_profile', JSON.stringify(user));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {}
  };

  const isStaff = user.role === 'admin' || user.role === 'kasir';

  return (
    <div className="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-20 w-full">
      {savedSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
          <span className="material-symbols-outlined text-green-600 text-2xl icon-filled">check_circle</span>
          <span className="font-mono text-sm font-bold">Profil berhasil disimpan!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-1/4 shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 sticky top-28 shadow-card space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
              <div className="w-12 h-12 rounded-full bg-secondary text-white font-display font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-display font-bold text-sm text-primary truncate">{user.name}</h4>
                <p className="font-mono text-[11px] text-on-surface-variant truncate">{user.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5 pt-2 font-mono text-xs font-bold">
              <button
                onClick={() => setTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  tab === 'account'
                    ? 'bg-secondary/10 text-secondary border-l-4 border-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">person</span>
                {isStaff ? 'Profil Staf' : 'Akun Saya'}
              </button>

              <button
                onClick={() => setTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  tab === 'orders'
                    ? 'bg-secondary/10 text-secondary border-l-4 border-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">receipt_long</span>
                Riwayat Pesanan
              </button>

              <button
                onClick={() => setTab('services')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  tab === 'services'
                    ? 'bg-secondary/10 text-secondary border-l-4 border-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">build</span>
                Riwayat Servis
              </button>

              <button
                onClick={() => setTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  tab === 'addresses'
                    ? 'bg-secondary/10 text-secondary border-l-4 border-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{isStaff ? 'storefront' : 'location_on'}</span>
                {isStaff ? 'Lokasi Konter Toko' : 'Alamat Pengiriman'}
              </button>

              <Link
                href="/keranjang"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Keranjang Belanja
              </Link>
            </nav>
          </div>
        </aside>

        {/* Profile Content */}
        <div className="w-full md:w-3/4 flex flex-col gap-8">
          {/* Header Card */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden shadow-card">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full bg-secondary text-white font-display font-bold text-4xl flex items-center justify-center border-4 border-surface shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-grow text-center md:text-left flex flex-col gap-2 z-10">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary">{user.name}</h1>
              <div className="flex flex-col gap-1 text-on-surface-variant font-mono text-xs">
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">mail</span> {user.email}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">badge</span> Role: {user.role.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-surface-container-low to-surface border border-outline-variant/30 p-6 rounded-2xl min-w-[200px] flex flex-col items-center justify-center text-center shadow-sm z-10 shrink-0">
              <span className="material-symbols-outlined icon-filled text-secondary text-[36px] mb-1">workspace_premium</span>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Status Akun</span>
              <span className="font-display font-bold text-lg text-primary mt-0.5 capitalize">{user.role} Member</span>
            </div>
          </section>

          {/* TAB 1: AKUN */}
          {tab === 'account' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                  <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">badge</span>
                    Informasi Pribadi
                  </h2>
                  <span className="text-xs font-mono text-on-surface-variant">Ubah data profil Anda</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-on-surface-variant uppercase">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-on-surface-variant uppercase">Email *</label>
                    <input
                      type="email"
                      required
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-on-surface-variant uppercase">No. Handphone</label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-on-surface-variant uppercase flex items-center justify-between">
                      <span>Alamat Pengiriman</span>
                      <button
                        type="button"
                        onClick={() => setTab('addresses')}
                        className="text-secondary hover:underline text-[11px] font-bold cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        Pilih dari Map
                      </button>
                    </label>
                    <input
                      type="text"
                      value={user.address || ''}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary transition-all"
                      placeholder="Klik 'Pilih dari Map' untuk set via peta"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </section>
            </form>
          )}

          {/* TAB 2: RIWAYAT PESANAN */}
          {tab === 'orders' && (
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">receipt_long</span>
                  Riwayat Pesanan Anda
                </h2>
                <span className="font-mono text-xs text-on-surface-variant">Total: {sales.length} Pesanan</span>
              </div>
              {sales.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant font-mono text-sm">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">receipt_long</span>
                  Belum ada riwayat pesanan.
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/15">
                  {sales.map((sale) => (
                    <div key={sale.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="font-mono font-bold text-primary text-sm">#{sale.invoice_number}</strong>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">Lunas</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          {sale.created_at ? new Date(sale.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                          {' • '}{sale.payment_method}
                        </p>
                        <p className="text-xs font-mono text-on-surface-variant mt-1">
                          {(sale.items || []).map((it) => `${it.product_name || it.name} (${it.quantity || it.qty || 1}x)`).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-base text-secondary">{fmt(sale.total)}</span>
                        <Link
                          href={`/penjualan/${sale.id}/struk`}
                          className="bg-surface-container hover:bg-secondary hover:text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-on-surface transition-all border border-outline-variant/30"
                        >
                          Lihat Struk
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: RIWAYAT SERVIS */}
          {tab === 'services' && (
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">build</span>
                  Riwayat Servis HP
                </h2>
                <span className="font-mono text-xs text-on-surface-variant">Total: {services.length} Servis</span>
              </div>
              {services.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant font-mono text-sm">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">build</span>
                  Belum ada riwayat servis.
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/15">
                  {services.map((srv) => (
                    <div key={srv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="font-mono font-bold text-primary text-sm">{srv.nota_number}</strong>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase">{srv.status}</span>
                        </div>
                        <p className="text-sm font-bold text-on-surface">{srv.device} — <span className="font-normal text-on-surface-variant">{srv.service_type}</span></p>
                        {srv.issue && <p className="text-xs text-on-surface-variant mt-0.5">{srv.issue}</p>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-sm text-on-surface">{fmt(srv.cost || srv.price || 0)}</span>
                        <Link
                          href={`/servis/${srv.id}/nota`}
                          className="bg-surface-container hover:bg-secondary hover:text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-on-surface transition-all border border-outline-variant/30"
                        >
                          Cetak Nota
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 4: ALAMAT / LOKASI KONTER */}
          {tab === 'addresses' && (
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card space-y-6">
              {isStaff ? (
                /* ════════════════════════════════════════════════════════════════════════
                   TAMPILAN KHUSUS ADMIN & KASIR: LOKASI KONTER TOKO FISIK
                   ════════════════════════════════════════════════════════════════════════ */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-secondary text-2xl">storefront</span>
                        <h2 className="font-display font-bold text-xl text-primary">
                          Lokasi Konter Fisik &amp; Operasional Toko
                        </h2>
                        <span className="bg-secondary/10 text-secondary text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-secondary/20">
                          Khusus Staf
                        </span>
                      </div>
                      <p className="text-xs font-mono text-on-surface-variant">
                        Titik pusat konter operasional TECHCELL, pangkalan kurir, dan acuan jarak bebas ongkir ({storeLoc.free_delivery_km} km).
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingStore(!isEditingStore)}
                      className={`font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 self-start sm:self-auto ${
                        isEditingStore
                          ? 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'
                          : 'bg-secondary text-white hover:bg-secondary/90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isEditingStore ? 'close' : 'edit_location_alt'}
                      </span>
                      {isEditingStore ? 'Tutup Form' : 'Ubah Data Konter'}
                    </button>
                  </div>

                  {/* Form Edit Lokasi Konter (Jika aktif) */}
                  {isEditingStore ? (
                    <form onSubmit={handleSaveStoreLocation} className="bg-surface-container-low border border-secondary/30 rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                        <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">edit_note</span>
                          Form Perubahan Lokasi Konter Fisik
                        </h3>
                        <span className="text-[11px] font-mono text-on-surface-variant">Data tersimpan di Konfigurasi Toko</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                            Nama Konter Toko *
                          </label>
                          <input
                            type="text"
                            value={storeFormName}
                            onChange={(e) => setStoreFormName(e.target.value)}
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                            Google Plus Code *
                          </label>
                          <input
                            type="text"
                            value={storeFormPlusCode}
                            onChange={(e) => setStoreFormPlusCode(e.target.value)}
                            placeholder="Contoh: FQ2W+XGM"
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                          Alamat Lengkap Konter Fisik *
                        </label>
                        <textarea
                          value={storeFormAddress}
                          onChange={(e) => handleStoreAddressInput(e.target.value)}
                          rows={2}
                          className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                            Jam Operasional
                          </label>
                          <input
                            type="text"
                            value={storeFormHours}
                            onChange={(e) => setStoreFormHours(e.target.value)}
                            placeholder="08:00 - 21:00 WIB"
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                            Telepon / WhatsApp Konter
                          </label>
                          <input
                            type="text"
                            value={storeFormPhone}
                            onChange={(e) => setStoreFormPhone(e.target.value)}
                            placeholder="081234567890"
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                            Radius Bebas Ongkir (km)
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="1"
                            max="30"
                            value={storeFormRadius}
                            onChange={(e) => setStoreFormRadius(Number(e.target.value))}
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary"
                          />
                        </div>
                      </div>

                      {/* Map Location Picker untuk Edit Lokasi Toko */}
                      <div className="border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-surface-container px-4 py-2.5 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-primary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
                            Geser atau Klik Peta untuk menentukan Titik Fisik Konter
                          </span>
                          <span className="text-secondary font-bold">
                            {storeFormLat.toFixed(6)}, {storeFormLng.toFixed(6)}
                          </span>
                        </div>
                        <MapLocationPicker
                          lat={storeFormLat}
                          lng={storeFormLng}
                          height={280}
                          circleRadiusKm={storeFormRadius}
                          label="Titik Konter Toko"
                          onLocationChange={(lat, lng) => {
                            setStoreFormLat(lat);
                            setStoreFormLng(lng);
                          }}
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Simpan Perubahan Lokasi Konter
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingStore(false)}
                          className="px-6 py-3 border border-outline-variant/40 rounded-xl text-xs font-mono font-bold text-on-surface hover:bg-surface-container transition-all"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Display Mode Konter Toko */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full mb-2">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                                Konter Fisik Aktif
                              </span>
                              <h3 className="font-display font-extrabold text-lg text-on-surface">
                                {storeLoc.name}
                              </h3>
                              <p className="font-mono text-xs text-secondary font-bold mt-0.5">
                                Plus Code: {storeLoc.plus_code}
                              </p>
                            </div>
                            <span className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                              <span className="material-symbols-outlined text-2xl icon-filled">storefront</span>
                            </span>
                          </div>

                          <div className="p-4 bg-surface rounded-xl border border-outline-variant/20 space-y-2 text-xs">
                            <p className="text-on-surface font-medium leading-relaxed">
                              {storeLoc.address}
                            </p>
                            <div className="pt-2 border-t border-outline-variant/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-on-surface-variant">
                              <div>⏰ Buka: <strong className="text-on-surface">{storeLoc.opening_hours}</strong></div>
                              <div>📞 Kontak: <strong className="text-on-surface">{storeLoc.phone}</strong></div>
                              <div>📍 Koordinat: <strong className="text-on-surface">{storeLoc.latitude.toFixed(6)}, {storeLoc.longitude.toFixed(6)}</strong></div>
                              <div>🚚 Free Ongkir: <strong className="text-secondary font-bold">Maks. {storeLoc.free_delivery_km} km</strong></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-1 flex-wrap">
                            <a
                              href={`https://www.google.com/maps?q=${storeLoc.latitude},${storeLoc.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface border border-outline-variant/30 text-on-surface hover:bg-surface-container text-xs font-mono font-bold rounded-xl transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px] text-secondary">open_in_new</span>
                              Buka Google Maps
                            </a>
                            <button
                              onClick={() => setIsEditingStore(true)}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-secondary text-white text-xs font-mono font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              Ubah Informasi Konter
                            </button>
                          </div>
                        </div>

                        {/* Side Info Box */}
                        <div className="bg-gradient-to-br from-secondary/10 via-surface-container-low to-surface-container-low border border-secondary/20 rounded-2xl p-6 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shadow-sm">
                              <span className="material-symbols-outlined text-xl">two_wheeler</span>
                            </div>
                            <h4 className="font-display font-bold text-sm text-primary">
                              Pusat Armada &amp; Pengiriman
                            </h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              Titik ini adalah lokasi awal kurir bertolak untuk pesanan pesan antar, serta acuan sistem dalam menghitung jarak ongkos kirim otomatis.
                            </p>
                          </div>
                          <div className="pt-4 border-t border-secondary/20 font-mono text-[11px] text-secondary font-bold">
                            ✓ Terintegrasi dengan POS &amp; Pengantaran
                          </div>
                        </div>
                      </div>

                      {/* Interactive Map View */}
                      <div className="border border-outline-variant/30 rounded-2xl overflow-hidden shadow-card">
                        <div className="bg-surface-container px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-secondary">map</span>
                            Peta Lokasi Konter &amp; Zona Bebas Ongkir (Lingkaran ≤ {storeLoc.free_delivery_km} km)
                          </span>
                          <span className="text-secondary font-bold">
                            FQ2W+XGM Baturan
                          </span>
                        </div>
                        <MapLocationPicker
                          lat={storeLoc.latitude}
                          lng={storeLoc.longitude}
                          height={320}
                          circleRadiusKm={storeLoc.free_delivery_km}
                          interactive={false}
                          label={`${storeLoc.name} (${storeLoc.plus_code})`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ════════════════════════════════════════════════════════════════════════
                   TAMPILAN KHUSUS PENGGUNA/CUSTOMER: ALAMAT PENGIRIMAN
                   ════════════════════════════════════════════════════════════════════════ */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                    <div>
                      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">location_on</span>
                        Alamat Pengiriman Saya
                      </h2>
                      <p className="text-xs font-mono text-on-surface-variant mt-1">
                        Simpan alamat favorit (Rumah, Kantor, dll) untuk pemesanan barang dan pengiriman cepat.
                      </p>
                    </div>
                    {!showCustAddForm && (
                      <button
                        onClick={() => setShowCustAddForm(true)}
                        className="bg-secondary text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_location</span>
                        Tambah Alamat
                      </button>
                    )}
                  </div>

                  {/* Add Customer Address Form */}
                  {showCustAddForm && (
                    <div className="bg-surface-container-low border border-secondary/30 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary">add_location_alt</span>
                          Tambah Alamat Pengiriman Baru
                        </h3>
                        <button
                          onClick={() => setShowCustAddForm(false)}
                          className="text-xs font-mono text-on-surface-variant hover:text-error"
                        >
                          ✕ Batal
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1.5">
                          Label Alamat (contoh: Rumah, Kantor, Kos) *
                        </label>
                        <input
                          type="text"
                          value={newCustLabel}
                          onChange={(e) => setNewCustLabel(e.target.value)}
                          placeholder="Rumah Utama"
                          className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-mono font-bold text-on-surface-variant uppercase">
                            Alamat Lengkap Pengiriman *
                          </label>
                          <button
                            type="button"
                            onClick={detectCustomerGPS}
                            className="text-xs font-mono text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">my_location</span> Deteksi GPS
                          </button>
                        </div>
                        <textarea
                          value={newCustText}
                          onChange={(e) => handleCustomerAddressInput(e.target.value)}
                          placeholder="Masukkan jalan, no rumah, RT/RW, kelurahan atau koordinat..."
                          rows={2}
                          className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                        <p className="text-[10px] font-mono text-on-surface-variant mt-1">💡 Bisa paste link Google Maps atau geser pin di peta</p>
                      </div>

                      {/* Map Location Picker */}
                      <div className="border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-surface-container px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
                            Peta Pin Lokasi (Geser/Klik untuk set lokasi rumah)
                          </span>
                          <span className="text-[11px] text-secondary font-bold">
                            {newCustLat.toFixed(5)}, {newCustLng.toFixed(5)}
                          </span>
                        </div>
                        <MapLocationPicker
                          lat={newCustLat}
                          lng={newCustLng}
                          height={260}
                          label="Lokasi Pengiriman"
                          onLocationChange={(lat, lng) => {
                            setNewCustLat(lat);
                            setNewCustLng(lng);
                          }}
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSaveNewCustomerAddress}
                          className="flex-1 bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Simpan Alamat Pengiriman
                        </button>
                        <button
                          onClick={() => setShowCustAddForm(false)}
                          className="px-6 py-3 border border-outline-variant/40 rounded-xl text-xs font-mono font-bold text-on-surface hover:bg-surface-container transition-all"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Customer Saved Addresses List */}
                  {customerAddresses.length === 0 && !showCustAddForm ? (
                    <div className="py-12 text-center text-on-surface-variant font-mono text-sm">
                      <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">location_off</span>
                      Belum ada alamat tersimpan. Klik "Tambah Alamat" untuk mulai.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customerAddresses.map((addr) => (
                        <div key={addr.id} className="bg-surface-container border border-outline-variant/30 rounded-2xl p-5 hover:border-secondary/40 transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary text-[20px]">home</span>
                                <h4 className="font-display font-bold text-sm text-primary">{addr.label}</h4>
                                {addr.is_default && (
                                  <span className="bg-secondary/10 text-secondary text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                                    Utama
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteCustomerAddress(addr.id)}
                                className="text-error hover:bg-red-50 p-1.5 rounded-lg transition-all"
                                title="Hapus alamat"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{addr.address}</p>
                          </div>
                          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                              <span>{addr.lat.toFixed(4)}, {addr.lng.toFixed(4)}</span>
                            </div>
                            <a
                              href={`https://www.google.com/maps?q=${addr.lat},${addr.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-mono text-secondary hover:underline font-bold"
                            >
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                              Buka Maps
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
