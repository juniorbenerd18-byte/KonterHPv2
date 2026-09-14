'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { Sale, Service, UserProfile, Role } from '@/types/database';

type Tab = 'account' | 'orders' | 'services' | 'addresses';

interface SavedAddress {
  id: number;
  label: string;
  address: string;
  lat: number;
  lng: number;
}

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('account');
  const [user, setUser] = useState<UserProfile>({
    id: 1,
    name: 'Pelanggan Setia TECHCELL',
    email: 'pelanggan@nexuscenter.id',
    phone: '081234567890',
    address: 'Jl. Ahmad Yani No. 88, Kartasura, Sukoharjo',
    role: 'pengguna',
    is_active: true,
    created_at: new Date().toISOString(),
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Address picker state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('Jl. Raya Gawok No. 12, Sukoharjo');
  const [newAddressLat, setNewAddressLat] = useState(-7.588800);
  const [newAddressLng, setNewAddressLng] = useState(110.748300);
  const [showAddForm, setShowAddForm] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const STORE_LAT = -7.588800;
  const STORE_LNG = 110.748300;

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
      const stored = localStorage.getItem('nexus_user_profile');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        const currentRole = DataService.getCurrentRole();
        setUser((prev) => ({
          ...prev,
          role: currentRole,
          name: currentRole === 'admin' ? 'Super Admin TECHCELL' : currentRole === 'kasir' ? 'Ahmad Kasir' : 'Pelanggan Setia TECHCELL',
          email: currentRole === 'admin' ? 'admin@nexuscenter.id' : currentRole === 'kasir' ? 'kasir@nexuscenter.id' : 'pelanggan@nexuscenter.id',
        }));
      }

      // Load saved addresses
      const addressesStored = localStorage.getItem('nexus_saved_addresses');
      if (addressesStored) {
        setSavedAddresses(JSON.parse(addressesStored));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined' && window.location.hash.includes('orders')) {
      setTab('orders');
    }
  }, [loadData]);

  // Initialize map when addresses tab is active and add form is shown
  useEffect(() => {
    // Cleanup if conditions not met
    if (tab !== 'addresses' || !showAddForm) {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup warning:', e);
        }
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    // Don't init if no container
    if (typeof window === 'undefined' || !mapContainerRef.current) {
      return;
    }

    // Don't re-init if already exists
    if (mapInstanceRef.current) {
      return;
    }

    let isMounted = true;
    let initTimeout: NodeJS.Timeout;

    initTimeout = setTimeout(() => {
      if (!isMounted || !mapContainerRef.current) return;

      import('leaflet').then(L => {
        if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

        try {
          // Clear container
          const container = mapContainerRef.current;
          container.innerHTML = '';
          container.className = 'w-full h-[280px] bg-surface-container';

          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });

          const map = L.map(container, {
            center: [newAddressLat, newAddressLng],
            zoom: 14,
            zoomControl: true,
            attributionControl: false
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          const marker = L.marker([newAddressLat, newAddressLng], { draggable: true }).addTo(map);

          marker.on('dragend', function (e: any) {
            const position = e.target.getLatLng();
            updateAddressCoords(position.lat, position.lng, false, true);
          });

          map.on('click', function (e: any) {
            marker.setLatLng(e.latlng);
            updateAddressCoords(e.latlng.lat, e.latlng.lng, false, true);
          });

          mapInstanceRef.current = map;
          markerRef.current = marker;

          setTimeout(() => {
            if (mapInstanceRef.current && isMounted) {
              mapInstanceRef.current.invalidateSize();
            }
          }, 150);
        } catch (error) {
          console.error('Map initialization error:', error);
          mapInstanceRef.current = null;
          markerRef.current = null;
        }
      }).catch(err => {
        console.error('Leaflet import error:', err);
      });
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
    };
  }, [tab, showAddForm]);

  const updateAddressCoords = (lat: number, lng: number, moveMap = true, updateAddr = false) => {
    setNewAddressLat(lat);
    setNewAddressLng(lng);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (moveMap && mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
    }

    if (updateAddr) {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(r => r.json())
        .then(data => {
          if (data && data.display_name) {
            setNewAddressText(data.display_name);
          }
        })
        .catch(() => {});
    }
  };

  const detectAddressGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          updateAddressCoords(pos.coords.latitude, pos.coords.longitude, true, true);
        },
        () => {
          alert('Gagal deteksi GPS. Pastikan izin lokasi aktif.');
        }
      );
    } else {
      alert('Browser tidak mendukung GPS.');
    }
  };

  const handleAddressInput = (text: string) => {
    setNewAddressText(text);
    const coordMatch = text.match(/@?(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/) || text.match(/q=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      updateAddressCoords(lat, lng, true, false);
    }
  };

  const handleSaveNewAddress = () => {
    if (!newAddressLabel.trim()) {
      alert('Masukkan label alamat (contoh: Rumah, Kantor, dll)');
      return;
    }
    const newAddr: SavedAddress = {
      id: Date.now(),
      label: newAddressLabel.trim(),
      address: newAddressText.trim(),
      lat: newAddressLat,
      lng: newAddressLng
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    localStorage.setItem('nexus_saved_addresses', JSON.stringify(updated));
    
    // Reset form
    setNewAddressLabel('');
    setNewAddressText('Jl. Raya Gawok No. 12, Sukoharjo');
    setNewAddressLat(-7.588800);
    setNewAddressLng(110.748300);
    setShowAddForm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAddress = (id: number) => {
    if (confirm('Hapus alamat ini?')) {
      const updated = savedAddresses.filter(a => a.id !== id);
      setSavedAddresses(updated);
      localStorage.setItem('nexus_saved_addresses', JSON.stringify(updated));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
                <span className="material-symbols-outlined">location_on</span>
                Alamat Saya
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

          {/* TAB 4: ALAMAT SAYA */}
          {tab === 'addresses' && (
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    Alamat Tersimpan
                  </h2>
                  <p className="text-xs font-mono text-on-surface-variant mt-1">Simpan alamat favorit untuk pengiriman lebih cepat</p>
                </div>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-secondary text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_location</span>
                    Tambah Alamat
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddForm && (
                <div className="bg-surface-container-low border border-secondary/30 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">add_location_alt</span>
                      Tambah Alamat Baru
                    </h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-xs font-mono text-on-surface-variant hover:text-error"
                    >
                      ✕ Batal
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                      Label Alamat (contoh: Rumah, Kantor, Kos) *
                    </label>
                    <input
                      type="text"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      placeholder="Rumah"
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono font-bold text-on-surface-variant uppercase">
                        Alamat Lengkap / Google Maps *
                      </label>
                      <button
                        type="button"
                        onClick={detectAddressGPS}
                        className="text-xs font-mono text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">my_location</span> Deteksi GPS
                      </button>
                    </div>
                    <textarea
                      value={newAddressText}
                      onChange={(e) => handleAddressInput(e.target.value)}
                      placeholder="Alamat lengkap atau paste link Google Maps..."
                      rows={2}
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    />
                    <p className="text-[10px] font-mono text-on-surface-variant mt-1">💡 Bisa paste link/koordinat dari Google Maps</p>
                  </div>

                  {/* Map Picker */}
                  <div className="border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-surface-container px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                        Peta Pin Lokasi (Geser/Klik untuk set lokasi)
                      </span>
                      <span className="text-[11px] text-secondary font-bold">
                        {newAddressLat.toFixed(5)}, {newAddressLng.toFixed(5)}
                      </span>
                    </div>
                    <div ref={mapContainerRef} className="w-full h-[280px] bg-surface-container"></div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveNewAddress}
                      className="flex-1 bg-secondary text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Simpan Alamat
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 border border-outline-variant/40 rounded-xl text-sm font-mono font-bold text-on-surface hover:bg-surface-container transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Addresses List */}
              {savedAddresses.length === 0 && !showAddForm ? (
                <div className="py-12 text-center text-on-surface-variant font-mono text-sm">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">location_off</span>
                  Belum ada alamat tersimpan. Klik "Tambah Alamat" untuk mulai.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="bg-surface-container border border-outline-variant/30 rounded-xl p-4 hover:border-secondary/40 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">home</span>
                          <h4 className="font-display font-bold text-sm text-primary">{addr.label}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-error hover:bg-red-50 p-1.5 rounded-lg transition-all"
                          title="Hapus alamat"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{addr.address}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                        <span>{addr.lat.toFixed(4)}, {addr.lng.toFixed(4)}</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${addr.lat},${addr.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-secondary hover:underline mt-2 font-bold"
                      >
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        Buka di Google Maps
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
