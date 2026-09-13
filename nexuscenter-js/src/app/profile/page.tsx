'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { Sale, Service, UserProfile, Role } from '@/types/database';

type Tab = 'account' | 'orders' | 'services';

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

  const loadData = useCallback(async () => {
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
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined' && window.location.hash.includes('orders')) {
      setTab('orders');
    }
  }, [loadData]);

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

              <Link
                href="/keranjang"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Keranjang Belanja
              </Link>

              {isStaff && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined">dashboard</span>
                    Dashboard Utama
                  </Link>
                  <Link
                    href="/pos"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined">point_of_sale</span>
                    Penjualan POS
                  </Link>
                </>
              )}
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
                    <label className="font-mono text-xs font-bold text-on-surface-variant uppercase">Alamat Pengiriman</label>
                    <input
                      type="text"
                      value={user.address || ''}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary transition-all"
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
        </div>
      </div>
    </div>
  );
}
