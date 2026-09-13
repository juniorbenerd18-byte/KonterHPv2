'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/store';
import { Product } from '@/types/database';

const PROMO_ITEMS = [
  { icon: '🎯', name: 'Diskon Aksesori 20%', description: 'Dapatkan potongan harga 20% untuk semua produk aksesori dan pelindung layar. Berlaku untuk pembelian minimum 2 item.', price: 'Hemat 20%' },
  { icon: '📦', name: 'Bundling HP + Aksesoris', description: 'Beli smartphone pilihan dan dapatkan free aksesoris senilai Rp 150.000. Promo terbatas untuk stok tersedia.', price: 'Free Aksesoris' },
  { icon: '🔧', name: 'Servis Gratis Ongkir', description: 'Servis HP Anda dan nikmati layanan antar-jemput gratis dalam radius 4km dari toko kami di Gawok.', price: 'Free Ongkir' },
  { icon: '💳', name: 'Cashback QRIS 5%', description: 'Bayar menggunakan QRIS dan dapatkan cashback 5% untuk transaksi di atas Rp 500.000. Berlaku harian.', price: 'Cashback 5%' },
  { icon: '⚡', name: 'Flash Sale Harian', description: 'Setiap hari ada produk flash sale dengan diskon hingga 30%. Cek terus halaman ini untuk penawaran terbaru.', price: 'Diskon s/d 30%' },
  { icon: '🎁', name: 'Member Loyal Reward', description: 'Pelanggan setia mendapatkan poin reward setiap transaksi. Tukarkan poin dengan diskon eksklusif.', price: 'Poin Reward' },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 4, m: 28, s: 15 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30">
      <span className="font-mono text-xs text-on-surface-variant font-bold uppercase">Berakhir dalam:</span>
      <div className="flex gap-1.5 font-mono font-bold text-sm text-secondary">
        <span className="bg-surface-container-highest px-2 py-1 rounded">{pad(time.h)}</span>:
        <span className="bg-surface-container-highest px-2 py-1 rounded">{pad(time.m)}</span>:
        <span className="bg-surface-container-highest px-2 py-1 rounded">{pad(time.s)}</span>
      </div>
    </div>
  );
}

export default function PromosPage() {
  const [flashSales, setFlashSales] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const products = await DataService.getProducts();
      setFlashSales(products.slice(0, 4));
    }
    load();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <section className="relative w-full py-20 md:py-32 flex items-center justify-center overflow-hidden bg-primary circuit-pattern text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container/90 to-transparent z-10" />
        <div className="relative z-20 max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full text-center md:text-left">
          <span className="inline-block px-4 py-1.5 mb-4 border border-secondary text-secondary-fixed font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-sm bg-secondary/20 rounded-full">
            ⚡ Promo Guncang Teknologi 2026
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 tracking-tight leading-tight max-w-2xl">
            Diskon Eksklusif Smartphone &amp; Aksesoris
          </h1>
          <p className="font-body text-inverse-primary text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            Tingkatkan pengalaman digital Anda dengan penawaran harga terbaik tahun ini. Potongan langsung dan garansi resmi toko.
          </p>
          <a href="#flash-sale" className="inline-block bg-secondary text-white font-mono text-sm font-bold px-8 py-3.5 rounded-lg uppercase tracking-wider hover:bg-secondary/90 transition-all shadow-[0_0_20px_rgba(0,104,122,0.4)] active:scale-95">
            Lihat Penawaran Flash Sale
          </a>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section id="flash-sale" className="py-16 bg-surface-container-lowest border-b border-outline-variant/20 relative overflow-hidden">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary icon-filled text-3xl">bolt</span>
                Flash Sale Terbatas
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">Dapatkan diskon khusus hingga 30% untuk produk terpilih hari ini.</p>
            </div>
            <CountdownTimer />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSales.map((product) => {
              const origPrice = Math.round((product.price || 0) * 1.15);
              return (
                <div key={product.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 relative group transition-all duration-300 hover:border-secondary hover:shadow-lg flex flex-col justify-between">
                  <div className="absolute top-4 left-4 bg-error text-white font-mono text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">PROMO</div>
                  <div className="h-48 relative mb-4 flex items-center justify-center bg-surface-container-low rounded-xl overflow-hidden">
                    {product.image ? (
                      <img src={`/storage/products/${product.image}`} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.icon || '📱'}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-on-surface-variant uppercase">{product.brand || 'TECHCELL'}</span>
                    <h3 className="font-display font-bold text-base text-on-surface mb-2 line-clamp-1">{product.name}</h3>
                    <p className="font-mono text-xs text-outline line-through mb-1">Rp {origPrice.toLocaleString('id-ID')}</p>
                    <p className="font-mono font-bold text-lg text-secondary mb-4">Rp {(product.price || 0).toLocaleString('id-ID')}</p>
                    <Link href="/produk" className="block text-center w-full bg-secondary text-white font-mono text-xs font-bold py-2.5 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
                      Beli Sekarang
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Promos Grid */}
      <section className="py-16 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max-width mx-auto">
          <h2 className="font-display font-bold text-2xl text-on-surface mb-8 text-center">Semua Promo Aktif</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMO_ITEMS.map((item) => (
              <div key={item.name} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center font-bold text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-on-surface">{item.name}</h4>
                    <span className="text-xs font-mono text-secondary font-semibold">Voucher Diskon Tersedia</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between border-t border-outline-variant/15 pt-4">
                  <span className="font-mono font-bold text-base text-secondary">{item.price}</span>
                  <Link href="/produk" className="text-xs font-mono font-bold text-secondary hover:underline">
                    Klaim Promo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
