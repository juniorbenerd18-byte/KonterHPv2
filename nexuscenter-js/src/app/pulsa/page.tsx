'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';

const PROVIDERS = [
  { id: 'Telkomsel', label: 'Telkomsel', abbr: 'TS', color: 'red', bg: 'bg-red-600' },
  { id: 'Three (3)', label: 'Tri (3)', abbr: '3', color: 'orange', bg: 'bg-gradient-to-r from-orange-500 to-amber-500' },
  { id: 'Indosat', label: 'Indosat', abbr: 'ISAT', color: 'amber', bg: 'bg-amber-400' },
  { id: 'XL Axiata', label: 'XL Axiata', abbr: 'XL', color: 'blue', bg: 'bg-blue-600' },
  { id: 'Smartfren', label: 'Smartfren', abbr: 'SF', color: 'pink', bg: 'bg-pink-600' },
  { id: 'Axis', label: 'Axis', abbr: 'AX', color: 'purple', bg: 'bg-purple-600' },
];

const PROVIDER_COLORS: Record<string, string> = {
  'Telkomsel': 'bg-red-600', 'Three (3)': 'bg-orange-500', 'Indosat': 'bg-amber-400',
  'XL Axiata': 'bg-blue-600', 'Smartfren': 'bg-pink-600', 'Axis': 'bg-purple-600',
};

const PULSA_PACKAGES = [
  { amount: '10.000', validity: '+7 Hari', price: 'Rp 11.000', priceNum: 11000 },
  { amount: '25.000', validity: '+14 Hari', price: 'Rp 26.500', priceNum: 26500 },
  { amount: '50.000', validity: '+30 Hari', price: 'Rp 51.500', priceNum: 51500, selected: true },
  { amount: '100.000', validity: '+60 Hari', price: 'Rp 100.000', priceNum: 100000 },
  { amount: '150.000', validity: '+90 Hari', price: 'Rp 149.000', priceNum: 149000 },
  { amount: '200.000', validity: '+120 Hari', price: 'Rp 198.500', priceNum: 198500 },
];

const DATA_PACKAGES = [
  { amount: '1 GB', validity: '7 Hari', price: 'Rp 12.000', priceNum: 12000, desc: 'YouTube & TikTok' },
  { amount: '5 GB', validity: '30 Hari', price: 'Rp 45.000', priceNum: 45000, desc: 'All Apps', selected: true },
  { amount: '10 GB', validity: '30 Hari', price: 'Rp 85.000', priceNum: 85000, desc: 'Gaming & Stream' },
  { amount: '25 GB', validity: '30 Hari', price: 'Rp 150.000', priceNum: 150000, desc: 'Heavy User' },
  { amount: '50 GB', validity: '30 Hari', price: 'Rp 280.000', priceNum: 280000, desc: 'Premium Unlimited' },
  { amount: '100 GB', validity: '30 Hari', price: 'Rp 450.000', priceNum: 450000, desc: 'Ultra Plus' },
];

export default function PulsaPage() {
  const router = useRouter();
  const [provider, setProvider] = useState('Telkomsel');
  const [phone, setPhone] = useState('0812 3456 7890');
  const [tab, setTab] = useState<'pulsa' | 'data'>('pulsa');
  const [selectedPkg, setSelectedPkg] = useState<{ amount: string; price: string; priceNum: number; type: string } | null>(
    { amount: '50.000', price: 'Rp 51.500', priceNum: 51500, type: 'Pulsa' }
  );
  const [processing, setProcessing] = useState(false);

  function handleSelectPkg(amount: string, price: string, priceNum: number, type: string) {
    setSelectedPkg({ amount, price, priceNum, type });
  }

  function handleTopup() {
    if (!DataService.isLoggedIn()) {
      alert('⚠️ Anda belum login! Silakan masuk ke akun TECHCELL Anda terlebih dahulu untuk melakukan transaksi Pulsa & Data.');
      router.push('/login?redirect=/pulsa');
      return;
    }
    if (!phone.trim()) { alert('Masukkan nomor HP target!'); return; }
    if (!selectedPkg) { alert('Pilih paket terlebih dahulu!'); return; }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert(`✅ Transaksi berhasil!\n${selectedPkg.type} ${selectedPkg.amount} untuk ${provider}\nNomor: ${phone}\nTotal: ${selectedPkg.price}\n\nTopup akan masuk dalam beberapa detik.`);
    }, 2000);
  }

  const providerBg = PROVIDER_COLORS[provider] || 'bg-secondary';

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="w-full bg-primary-container text-on-primary-container rounded-2xl overflow-hidden relative mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4cd7f6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10 p-8 md:p-16 flex flex-col gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 text-secondary-fixed font-mono text-xs font-bold rounded-full px-3 py-1 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container" />
            </span>
            Layanan Digital
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">Isi Ulang Cepat, Koneksi Tanpa Batas</h1>
          <p className="font-body text-sm md:text-base text-inverse-primary leading-relaxed">
            Beli pulsa dan paket data dengan mudah. Transaksi aman, langsung masuk dalam hitungan detik.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Provider Selection */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">cell_tower</span>
                Pilih Provider / Operator
              </label>
              <span className="text-xs font-mono font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                {provider} Active
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PROVIDERS.map((p) => {
                const isActive = provider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer ${
                      isActive ? `border-${p.color}-500 bg-${p.color}-500/10` : 'border-outline-variant/30 bg-surface hover:border-outline-variant'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full ${p.bg} text-white font-mono text-[10px] font-black flex items-center justify-center shadow`}>{p.abbr}</span>
                    <span className="font-mono text-[11px] font-bold text-on-surface mt-1.5">{p.label}</span>
                    {isActive && <span className="absolute top-1 right-1 material-symbols-outlined text-xs" style={{ color: `var(--color-${p.color}-600, #0891b2)` }}>check_circle</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Input */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 flex flex-col gap-4">
            <label className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor Handphone Target</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">phone_iphone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812 3456 7890"
                className="w-full pl-12 pr-32 py-4 bg-surface rounded-xl border border-outline-variant/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-mono text-sm text-on-surface outline-none transition-all"
              />
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${providerBg} text-white px-3 py-1 rounded-lg font-mono text-xs font-bold shadow-sm transition-all`}>
                {provider.toUpperCase().slice(0, 8)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-outline-variant/30">
            <button onClick={() => setTab('pulsa')} className={`px-6 py-3 font-mono text-sm font-bold transition-all ${tab === 'pulsa' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'}`}>Pulsa</button>
            <button onClick={() => setTab('data')} className={`px-6 py-3 font-mono text-sm font-bold transition-all ${tab === 'data' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'}`}>Paket Data</button>
          </div>

          {/* Pulsa Packages */}
          {tab === 'pulsa' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {PULSA_PACKAGES.map((pkg) => {
                const isSelected = selectedPkg?.amount === pkg.amount && selectedPkg?.type === 'Pulsa';
                return (
                  <div
                    key={pkg.amount}
                    onClick={() => handleSelectPkg(pkg.amount, pkg.price, pkg.priceNum, 'Pulsa')}
                    className={`package-card bg-surface-container-lowest border rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer relative group ${
                      isSelected ? 'border-2 border-secondary shadow-[0_0_15px_rgba(0,104,122,0.1)]' : 'border-outline-variant/30 hover:border-secondary hover:shadow-[0_0_15px_rgba(0,104,122,0.1)]'
                    }`}
                  >
                    <div className={`absolute top-3 right-3 ${isSelected ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      <span className={`material-symbols-outlined text-secondary ${isSelected ? 'icon-filled' : ''}`}>check_circle</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-on-surface">{pkg.amount}</h3>
                    <p className="font-mono text-xs text-on-surface-variant">Masa aktif {pkg.validity}</p>
                    <div className="mt-2 pt-3 border-t border-outline-variant/20">
                      <span className="font-mono font-bold text-sm text-secondary">{pkg.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Data Packages */}
          {tab === 'data' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {DATA_PACKAGES.map((pkg) => {
                const isSelected = selectedPkg?.amount === pkg.amount && selectedPkg?.type === 'Paket Data';
                return (
                  <div
                    key={pkg.amount}
                    onClick={() => handleSelectPkg(`${pkg.amount} — ${pkg.desc}`, pkg.price, pkg.priceNum, 'Paket Data')}
                    className={`package-card bg-surface-container-lowest border rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer relative group ${
                      isSelected ? 'border-2 border-secondary shadow-[0_0_15px_rgba(0,104,122,0.1)]' : 'border-outline-variant/30 hover:border-secondary hover:shadow-[0_0_15px_rgba(0,104,122,0.1)]'
                    }`}
                  >
                    <div className={`absolute top-3 right-3 ${isSelected ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      <span className={`material-symbols-outlined text-secondary ${isSelected ? 'icon-filled' : ''}`}>check_circle</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-on-surface">{pkg.amount}</h3>
                    <p className="font-mono text-xs text-on-surface-variant">{pkg.desc} • {pkg.validity}</p>
                    <div className="mt-2 pt-3 border-t border-outline-variant/20">
                      <span className="font-mono font-bold text-sm text-secondary">{pkg.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 sticky top-28 flex flex-col gap-6">
            <h2 className="font-display font-bold text-lg text-on-surface border-b border-outline-variant/20 pb-4">Ringkasan Pesanan</h2>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Nomor Target</span>
                <span className="font-bold text-on-surface">{phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Provider</span>
                <span className="font-bold text-secondary font-extrabold">{provider}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Produk Paket</span>
                <span className="font-bold text-on-surface">{selectedPkg ? `${selectedPkg.type} ${selectedPkg.amount}` : '—'}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
              <span className="font-mono text-xs font-bold text-on-surface">Total Pembayaran</span>
              <span className="font-display font-bold text-lg text-secondary">{selectedPkg?.price ?? '—'}</span>
            </div>
            <button
              onClick={handleTopup}
              disabled={processing || !selectedPkg}
              className="w-full bg-secondary text-white font-mono text-sm font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {processing ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Memproses...
                </>
              ) : (
                <>
                  Lanjut Pembayaran
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-secondary font-semibold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              Tersedia layanan antar ke rumah (Free Ongkir, maks. 4km).
            </p>
            <p className="text-[11px] text-center text-on-surface-variant flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Transaksi diproses secara aman &amp; terenkripsi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
