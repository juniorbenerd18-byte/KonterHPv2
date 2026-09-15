'use client';

import { addToCart } from '@/lib/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DataService } from '@/lib/store';
import { Product } from '@/types/database';

import { TRADE_IN_DB, scoreMatch, detectStorageFromQuery, TradeInEntry, TradeInVariant } from '@/lib/tradeInDb';

export default function HomePage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Trade-in calculator state
    const [tradeInInput, setTradeInInput] = useState('');
    const [selectedEntry, setSelectedEntry] = useState<TradeInEntry | null>(null);
    const [matchingEntries, setMatchingEntries] = useState<TradeInEntry[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<TradeInVariant | null>(null);
    const [tradeInNotFound, setTradeInNotFound] = useState(false);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Product Detail Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [reviewRating, setReviewRating] = useState('5');

    useEffect(() => {
        DataService.getProducts().then((data) => setProducts(data));
    }, []);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!DataService.isLoggedIn()) {
            showToast('⚠️ Silakan login terlebih dahulu untuk menambah produk ke keranjang!');
            setTimeout(() => {
                router.push('/login?redirect=/produk');
            }, 1000);
            return;
        }
        try {
            addToCart(product, 1);
            showToast(`"${product.name}" berhasil ditambahkan ke keranjang!`);
        } catch (err: any) {
            if (err?.message === 'LOGIN_REQUIRED') {
                showToast('⚠️ Silakan login terlebih dahulu!');
                router.push('/login?redirect=/produk');
            } else {
                showToast('Gagal menambahkan ke keranjang');
            }
        }
    };

    const handleTradeInSearch = (val: string) => {
        setTradeInInput(val);
        const query = val.trim();
        if (query.length < 2) {
            setSelectedEntry(null);
            setMatchingEntries([]);
            setSelectedVariant(null);
            setTradeInNotFound(false);
            return;
        }

        const autoStorage = detectStorageFromQuery(query);

        // Collect all matching entries scored by scoreMatch
        const scoredEntries: { entry: TradeInEntry; score: number }[] = [];

        for (const entry of TRADE_IN_DB) {
            const score = scoreMatch(query, entry);
            if (score > 0) {
                scoredEntries.push({ entry, score });
            }
        }

        // Sort descending by score
        scoredEntries.sort((a, b) => b.score - a.score);

        if (scoredEntries.length > 0) {
            const topMatch = scoredEntries[0].entry;
            setSelectedEntry(topMatch);
            setMatchingEntries(scoredEntries.slice(0, 12).map(s => s.entry));
            setTradeInNotFound(false);

            if (autoStorage) {
                const foundVar = topMatch.variants.find(
                    v => v.storage.toLowerCase() === autoStorage.toLowerCase()
                );
                setSelectedVariant(foundVar || topMatch.variants[0]);
            } else {
                setSelectedVariant(topMatch.variants[0]);
            }
        } else {
            setSelectedEntry(null);
            setMatchingEntries([]);
            setSelectedVariant(null);
            setTradeInNotFound(true);
        }
    };

    const formatRp = (num: number) => {
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const toggleFaq = (idx: number) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    return (
        <div className="fade-in">
            {/* TOAST NOTIFICATION POPUP */}
            {toastMessage && (
                <div className="fixed top-24 right-4 z-[9999] bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 fade-in">
                    <span className="material-symbols-outlined icon-filled text-xl text-green-600">check_circle</span>
                    <span className="text-sm font-medium">{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-gray-700">
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
            )}

            {/* 1. TOP MINI BAR */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                        <span className="flex items-center gap-1.5 text-slate-200">
                            <span className="material-symbols-outlined text-secondary-fixed-dim text-[16px]">call</span>
                            <a href="tel:081234567890" className="hover:text-secondary-fixed-dim font-mono transition-colors">0812-3456-7890</a>
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="material-symbols-outlined text-secondary-fixed-dim text-[16px]">storefront</span>
                            TECHCELL NexusCenter — Palembang
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            Buka Hari Ini: 09.00 - 21.00 WIB
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] tracking-wide">
                        <span className="bg-secondary/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-secondary/40 font-mono font-bold animate-pulse">
                            🚀 Radius 4KM Gratis Ongkir
                        </span>
                        <a href="#outlet" className="hover:text-white transition-colors">Cari Toko Terdekat &rarr;</a>
                    </div>
                </div>
            </div>

            {/* 2. HERO SECTION WITH RICH ANIMATIONS */}
            <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 px-4 sm:px-8 lg:px-12">
                {/* Ambient background glowing light orbs & tech matrix pattern */}
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4cd7f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-10 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

                <div className="max-w-[1280px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Content */}
                        <div className="lg:col-span-7 flex flex-col items-start gap-6">
                            {/* Trust Badge */}
                            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-cyan-400/30 px-4 py-2 rounded-full text-xs text-cyan-300 backdrop-blur-md shadow-lg animate-bounce-gentle">
                                <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
                                <span className="font-mono font-bold tracking-wide">⭐ Terpercaya Sejak 2015 • Solusi Gadget & Servis #1</span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                                Pusat Gadget, Aksesoris & Servis HP <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-cyan-400 drop-shadow-[0_0_20px_rgba(76,215,246,0.4)]">
                                    Terlengkap & Bergaransi Resmi
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                                Kunjungi konter fisik resmi kami di <strong className="text-white">Palembang</strong> atau pesan mudah dari rumah dengan <span className="text-cyan-300 font-semibold font-mono">Gratis Ongkir & Jemput Antar hingga 4 KM</span>. Pengerjaan servis kilat 1 jam, sparepart 100% original, dan garansi pasti.
                            </p>

                            {/* Hero Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                                <Link href="/produk" className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-cyan-600 hover:from-cyan-600 hover:to-secondary text-white px-7 py-3.5 rounded-xl font-mono text-xs font-bold shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/50 transition-all hover:scale-105 active:scale-95">
                                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                    <span>Lihat Produk</span>
                                </Link>
                                <Link href="/booking-servis" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-cyan-300 px-7 py-3.5 rounded-xl font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-md">
                                    <span className="material-symbols-outlined text-[20px]">build_circle</span>
                                    <span>Booking Servis</span>
                                </Link>
                                <a href="https://wa.me/6281234567890?text=Halo%20NexusCenter,%20saya%20ingin%20tanya%20produk%20dan%20servis" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                    <span>Hubungi Kami</span>
                                </a>
                            </div>

                            {/* 3 Counter Statistics */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-slate-800/80 w-full">
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-cyan-400/50 hover:-translate-y-1">
                                    <div className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-cyan-300 flex items-baseline">
                                        <span>9</span><span>+</span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono font-medium">Tahun Pengalaman</p>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-cyan-400/50 hover:-translate-y-1">
                                    <div className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-white flex items-baseline">
                                        <span>12</span><span>+</span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono font-medium">Outlet & Mitra Toko</p>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-amber-400/50 hover:-translate-y-1">
                                    <div className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-400 flex items-baseline">
                                        <span>50.000</span><span>+</span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono font-medium">Pelanggan Puas</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Futuristic Showcase Visual with Motion & Real Poster */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="relative w-full max-w-md lg:max-w-none">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                                <div className="relative rounded-3xl overflow-hidden border border-cyan-400/30 bg-slate-900 shadow-2xl p-3 animate-float-card-1">
                                    <div className="bg-slate-950/80 rounded-2xl overflow-hidden relative border border-white/10 group h-80 sm:h-96">
                                        <img
                                            src="/images/posters/hero_tradein.png"
                                            alt="Pusat Gadget & Trade-In TECHCELL NexusCenter"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-emerald-500/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur shadow-md">
                                            Official Store & Trade-In
                                        </div>
                                    </div>
                                    {/* Floating Micro-Badge */}
                                    <div className="mt-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                                                <span className="material-symbols-outlined text-[22px]">verified</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white leading-tight">Garansi Resmi SEIN & iBox</h4>
                                                <p className="text-[10px] text-slate-400 font-mono">Siap trade-in dengan harga tertinggi</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/40">100% Ori</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SECTION 4 KEUNGGULAN UTAMA */}
            <section className="py-16 bg-surface-container-lowest border-b border-outline-variant/20" id="tentang">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                            Kualitas Terbukti
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">4 Keunggulan Utama TECHCELL</h2>
                        <p className="text-on-surface-variant text-sm sm:text-base mt-2">Komitmen kami memberikan standar layanan tertinggi untuk setiap kebutuhan digital Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card 1 */}
                        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-on-surface mb-2">9+ Tahun Pengalaman</h3>
                            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Beroperasi aktif di industri gadget & telekomunikasi sejak 2015 dengan rekam jejak puluhan ribu transaksi amanah.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">engineering</span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-on-surface mb-2">Teknisi Bersertifikat Resmi</h3>
                            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Tim ahli tersertifikasi dengan peralatan mikrosolder dan diagnosa presisi untuk menangani kerusakan ringan hingga berat.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">verified</span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-on-surface mb-2">Sparepart 100% Original</h3>
                            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Pasokan suku cadang asli OEM & Original Equipment Manufacturer teruji presisi agar performa gadget tetap optimal.</p>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">security</span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-on-surface mb-2">Garansi Resmi Hingga 90 Hari</h3>
                            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Jaminan servis dan perlindungan aksesoris hingga 3 bulan penuh. Penggantian unit baru bila kendala tidak tuntas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guest Registration Banner */}
            <section className="py-6 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-y border-white/10">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/15 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary-fixed-dim text-2xl shrink-0 animate-bounce-gentle">
                            💡
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-base text-white">Belum Mempunyai Akun Pelanggan?</h3>
                            <p className="text-xs font-mono text-gray-300">Daftar akun gratis sekarang untuk kemudahan pemesanan, lacak servis, dan promo spesial!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link href="/login" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white border border-white/20 transition-all">
                            Masuk
                        </Link>
                        <Link href="/register" className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-xs font-mono font-bold text-white shadow-lg transition-all active:scale-95">
                            🚀 Daftar Akun Baru
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. KATALOG PRODUK UNGGULAN */}
            <section className="py-20 bg-surface-container-low border-b border-outline-variant/20" id="produk">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-2">
                                Pilihan Terbaik
                            </span>
                            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">Katalog Produk & Aksesoris Terpopuler</h2>
                            <p className="text-on-surface-variant text-sm mt-1">Stok terjamin dengan garansi toko & pasang langsung di konter TECHCELL NexusCenter.</p>
                        </div>
                        <Link href="/produk" className="inline-flex items-center gap-2 bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95">
                            <span>Lihat Semua Produk</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Product Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 8).map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="product-card group bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden hover:border-secondary transition-all duration-300 hover:shadow-xl relative flex flex-col h-full cursor-pointer hover:-translate-y-2"
                            >
                                <div className="absolute top-3 left-3 bg-secondary/15 text-secondary text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border border-secondary/30 z-10 backdrop-blur">
                                    {product.category}
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => handleAddToCart(product, e)}
                                    className="absolute top-3 right-3 z-20 text-on-surface-variant hover:text-secondary bg-surface-container-lowest/90 backdrop-blur p-2 rounded-full shadow-md transition-all hover:scale-110 active:scale-95"
                                    title="Tambah ke Keranjang"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                </button>
                                <div className="p-6 bg-surface-container-low flex justify-center items-center h-48 sm:h-56 relative overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{product.icon}</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                                        className="absolute bottom-3 right-3 bg-white/90 text-secondary text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg backdrop-blur flex items-center gap-1 shadow-md border border-secondary/30 hover:bg-secondary hover:text-white transition-all cursor-pointer z-20 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">info</span> Detail
                                    </button>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className="text-xs font-mono text-on-surface-variant">{product.brand || 'TECHCELL'}</span>
                                        <span className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                                            <span className="material-symbols-outlined text-xs">star</span> {Number(product.rating || 4.9).toFixed(1)} ({product.review_count || 128})
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold text-base text-on-surface mb-1 line-clamp-2 group-hover:text-secondary transition-colors">{product.name}</h3>
                                    <p className="font-mono text-xs text-on-surface-variant line-clamp-2 mb-3 opacity-80">{product.description}</p>
                                    <div className="mt-auto pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                                        <div>
                                            <p className="font-mono text-xs text-outline line-through">Rp {Number(product.price * 1.1).toLocaleString('id-ID')}</p>
                                            <p className="font-mono font-bold text-secondary text-lg">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                                            className="text-xs font-mono font-bold text-secondary hover:text-cyan-700 flex items-center gap-0.5 group-hover:translate-x-1 transition-all cursor-pointer hover:underline z-20"
                                        >
                                            Detail &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trade-In Callout Banner with Official Poster Image */}
                    <div className="mt-12 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card hover:shadow-xl transition-all overflow-hidden relative">
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-outline-variant/30 shrink-0 shadow-md">
                                <img src="/images/posters/gadgets_accessories.png" alt="Aksesoris & Gadget TECHCELL" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-display text-lg font-bold text-on-surface">Program Tukar Tambah (Trade-In) & Aksesoris Premium</h4>
                                <p className="text-on-surface-variant text-xs sm:text-sm mt-0.5">Bawa HP lama merk apapun ke konter TECHCELL NexusCenter, kami taksir dengan harga tertinggi dan transparan.</p>
                            </div>
                        </div>
                        <a href="#trade-in-section" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all shadow-md active:scale-95 shrink-0 relative z-10">
                            <span>Taksir HP Lama Anda</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* 5. SECTION SERVIS & JEMPUT ANTAR */}
            <section className="py-20 bg-surface-container-lowest border-b border-outline-variant/20" id="servis">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Visual Banner with Official Poster */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative rounded-3xl overflow-hidden border border-outline-variant/30 shadow-2xl group">
                                <img src="/images/posters/service_technician.png" alt="Teknisi Servis Presisi TECHCELL" className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                                    <span className="bg-secondary/90 backdrop-blur text-white text-[11px] font-mono font-bold px-3.5 py-1 rounded-full border border-cyan-400/40 shadow-md">
                                        🛠️ Lab Servis Steril & Modern
                                    </span>
                                    <h3 className="font-display text-2xl font-extrabold text-white">Dikerjakan Transparan & Bergaransi</h3>
                                    <p className="text-xs text-slate-200 font-mono">
                                        Konsep open-kitchen lab di TECHCELL NexusCenter. Data pribadi aman, pengerjaan cepat 1 jam & presisi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Service Features */}
                        <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
                            <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block w-fit">
                                Service & Repair Center
                            </span>
                            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight">
                                Layanan Servis Kilat & Ganti Sparepart Original
                            </h2>
                            <p className="text-on-surface-variant text-sm leading-relaxed">
                                Solusi perbaikan handphone profesional untuk iPhone, Samsung, Xiaomi, Oppo, Vivo, dan merk lainnya dengan jaminan kepuasan.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                                    <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[18px]">timer</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">Servis Kilat 1 Jam</h4>
                                        <p className="text-[11px] text-on-surface-variant mt-0.5">Ganti LCD & baterai bisa ditunggu di tempat.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                                    <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[18px]">screen_rotation_alt</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">OLED / LCD Presisi</h4>
                                        <p className="text-[11px] text-on-surface-variant mt-0.5">TrueTone aktif, touch responsif tanpa ghost touch.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                                    <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[18px]">badge</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">Teknisi Tersertifikasi</h4>
                                        <p className="text-[11px] text-on-surface-variant mt-0.5">Spesialis micro-soldering IC & bypass mesin.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                                    <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-on-surface">Garansi Nyata 90 Hari</h4>
                                        <p className="text-[11px] text-on-surface-variant mt-0.5">Garansi ganti part baru tanpa berbelit-belit.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Link href="/booking-servis" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3.5 rounded-xl font-mono text-xs font-bold shadow-md transition-all active:scale-95">
                                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                    <span>Booking Servis Sekarang</span>
                                </Link>
                                <Link href="/lacak-servis" className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/30 text-on-surface px-6 py-3.5 rounded-xl font-mono text-xs font-bold hover:border-secondary transition-all">
                                    <span className="material-symbols-outlined text-[18px]">search</span>
                                    <span>Lacak Status Servis</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trade-In Calculator Interactive Section */}
                    <div id="trade-in-section" className="mt-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-white/10 relative shadow-2xl overflow-hidden">
                        <div className="max-w-2xl space-y-4 relative z-10">
                            <span className="px-3.5 py-1 bg-secondary/30 text-cyan-300 font-mono text-xs font-bold rounded-full border border-secondary/40 inline-block">
                                🔄 Program Tukar Tambah Interactive
                            </span>
                            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">Cek Perkiraan Harga HP Lama Kamu</h3>
                            <p className="font-mono text-xs text-slate-300 leading-relaxed">Ketik nama HP lama kamu di bawah ini dan dapatkan estimasi harga tukar tambah terbaik dari TECHCELL NexusCenter.</p>

                            <div className="space-y-3 pt-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tradeInInput}
                                        onChange={(e) => handleTradeInSearch(e.target.value)}
                                        placeholder="Contoh: Samsung Galaxy A52, iPhone 11, Oppo Reno..."
                                        className="flex-1 bg-white/15 border border-white/30 text-white placeholder-white/50 text-xs font-mono px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleTradeInSearch(tradeInInput)}
                                        className="bg-secondary text-white px-5 py-3 rounded-xl font-mono text-xs font-bold hover:bg-secondary/90 transition-all shrink-0 shadow-lg active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-base">search</span>
                                    </button>
                                </div>

                                {/* Similar Models Pills / Quick Switch */}
                                {matchingEntries.length > 1 && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 font-medium">
                                                <span className="material-symbols-outlined text-sm text-cyan-300">devices</span>
                                                <span>Model serupa ditemukan ({matchingEntries.length}):</span>
                                            </p>
                                            <span className="text-[10px] font-mono text-cyan-300">Klik untuk pilih model</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {matchingEntries.map((m) => {
                                                const isCurrent = selectedEntry?.name === m.name;
                                                return (
                                                    <button
                                                        key={m.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedEntry(m);
                                                            setSelectedVariant(m.variants[0]);
                                                        }}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 active:scale-95 ${
                                                            isCurrent
                                                                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm ring-1 ring-cyan-200'
                                                                : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                                                        }`}
                                                    >
                                                        {isCurrent && <span className="material-symbols-outlined text-[12px]">check</span>}
                                                        <span>{m.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Result Box with Storage Selection */}
                                {selectedEntry && (
                                    <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-5 space-y-4 animate-float-card-1">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                                                    {selectedEntry.brand}
                                                </span>
                                                <h4 className="font-display font-extrabold text-white text-lg sm:text-xl mt-1">{selectedEntry.name}</h4>
                                            </div>
                                            <span className="text-[10px] font-mono bg-secondary/30 text-cyan-300 px-2.5 py-1 rounded-full border border-secondary/30">
                                                Estimasi Resmi
                                            </span>
                                        </div>

                                        {/* Step 2: Storage Variant Selector */}
                                        <div>
                                            <label className="block text-xs font-mono text-slate-300 mb-2 font-medium">
                                                Step 2: Pilih Kapasitas Storage ({selectedEntry.variants.length} Varian Ditemukan):
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedEntry.variants.map((v) => {
                                                    const isSelected = selectedVariant?.storage === v.storage;
                                                    return (
                                                        <button
                                                            key={v.storage}
                                                            type="button"
                                                            onClick={() => setSelectedVariant(v)}
                                                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                                                                isSelected
                                                                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-200'
                                                                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                                                            }`}
                                                        >
                                                            {isSelected && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                                                            <span>{v.storage}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Price display for active variant */}
                                        {selectedVariant && (
                                            <div className="bg-slate-950/60 border border-cyan-400/20 rounded-xl p-4 space-y-1">
                                                <p className="font-mono text-xs text-slate-400">
                                                    Estimasi Harga Pasar Bekas ({selectedEntry.name} — <span className="text-cyan-300 font-bold">{selectedVariant.storage}</span>):
                                                </p>
                                                <p className="font-mono font-extrabold text-cyan-300 text-2xl sm:text-3xl tracking-tight drop-shadow-[0_0_12px_rgba(76,215,246,0.3)]">
                                                    {formatRp(selectedVariant.min)} — {formatRp(selectedVariant.max)}
                                                </p>
                                            </div>
                                        )}

                                        <p className="font-mono text-[11px] text-white/70 leading-relaxed">
                                            *Harga bersifat estimasi pasar bekas miring/normal di Indonesia. Nilai pasti ditentukan dari kondisi layar, bodi, &amp; fungsi fisik HP di konter.
                                        </p>
                                        <div className="pt-1 flex flex-wrap gap-3">
                                            <Link 
                                                href={`/tukar-tambah?device=${encodeURIComponent(selectedEntry.name)}&storage=${encodeURIComponent(selectedVariant?.storage || '')}&min=${selectedVariant?.min || 0}&max=${selectedVariant?.max || 0}`}
                                                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-sm">autorenew</span> Booking Tukar Tambah &rarr;
                                            </Link>
                                            <a
                                                href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo TECHCELL, saya mau tanya tukar tambah HP ${selectedEntry.name} variant ${selectedVariant?.storage || ''}`)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-sm">chat</span> Tanya via WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Not Found Box */}
                                {tradeInNotFound && (
                                    <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-xs font-mono text-white/80 space-y-1">
                                        <p className="font-bold text-amber-300">HP tidak ditemukan di database 70+ model kami.</p>
                                        <p className="text-slate-300">Silakan masukkan nama HP secara lebih spesifik (misal: "iPhone 13" atau "Galaxy S23") atau datang langsung ke konter TECHCELL NexusCenter untuk penilaian gratis!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Callout Antar-Jemput Gratis Radius 4 KM with Official Courier Poster */}
                    <div className="mt-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-white/10 overflow-hidden relative shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/20 shadow-xl group h-60 sm:h-64">
                                <img src="/images/posters/courier_driver.png" alt="Kurir Delivery Driver Resmi TECHCELL" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="md:col-span-7 flex flex-col items-start gap-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-amber-500 text-white text-xs font-mono font-bold px-3 py-1 rounded-full shadow-sm">Layanan Kurir Instan</span>
                                    <span className="text-xs text-cyan-300 font-mono font-bold">🚀 Radius 4KM Gratis Ongkir</span>
                                </div>
                                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">Ingin Beli HP / Servis Tapi Malas Keluar? Kami Antar Ke Rumah!</h3>
                                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                    Khusus area dalam jangkauan 4 km dari konter TECHCELL NexusCenter, kurir resmi kami siap menjemput unit HP rusak Anda dan mengantarkannya kembali setelah selesai diperbaiki.
                                </p>
                                <Link href="/pengantaran" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95">
                                    <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                                    <span>Lacak Driver & Request Jemput-Antar &rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. SECTION TESTIMONI PELANGGAN */}
            <section className="py-20 bg-surface-container-low border-b border-outline-variant/20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                            Google Reviews 4.9/5.0
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">Apa Kata Pelanggan TECHCELL?</h2>
                        <p className="text-on-surface-variant text-sm sm:text-base mt-2">Ulasan transparan dari pelanggan yang telah berbelanja dan servis di konter kami.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Testimoni 1 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div>
                                <div className="flex items-center gap-1 text-amber-500 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                                    ))}
                                </div>
                                <p className="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                                    &ldquo;Ganti LCD iPhone 13 Pro cuma 45 menit kelar ditunggu di konter. Dikasih bonus pasang tempered glass pula. Stafnya super ramah & pengerjaan rapi banget!&rdquo;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">BP</div>
                                <div>
                                    <h4 className="text-xs font-bold text-on-surface">Budi Pratama</h4>
                                    <p className="text-[11px] font-mono text-on-surface-variant">Servis iPhone 13 Pro</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimoni 2 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div>
                                <div className="flex items-center gap-1 text-amber-500 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                                    ))}
                                </div>
                                <p className="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                                    &ldquo;Beli GaN Charger 65W & kabel Type-C original. Karena lagi repot kerja, coba layanan antar konter. 30 menit pesanan langsung sampai ke rumah tanpa ongkir!&rdquo;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs">SA</div>
                                <div>
                                    <h4 className="text-xs font-bold text-on-surface">Sarah Amanda</h4>
                                    <p className="text-[11px] font-mono text-on-surface-variant">Aksesoris & Delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimoni 3 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div>
                                <div className="flex items-center gap-1 text-amber-500 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                                    ))}
                                </div>
                                <p className="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                                    &ldquo;Trade-in HP lama dapat harga paling fair dibanding toko lain. Proses cek fisik cuma 10 menit dan langsung bisa upgrade ke Samsung S-series baru. Recommended!&rdquo;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">HW</div>
                                <div>
                                    <h4 className="text-xs font-bold text-on-surface">Hendra Wijaya</h4>
                                    <p className="text-[11px] font-mono text-on-surface-variant">Trade-In Smartphone</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimoni 4 */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div>
                                <div className="flex items-center gap-1 text-amber-500 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                                    ))}
                                </div>
                                <p className="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                                    &ldquo;Servis HP mati total kena air berhasil diselamatkan datanya sama teknisi TECHCELL. Biaya dijelaskan di awal sebelum dikerjakan, sangat jujur dan transparan!&rdquo;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">RK</div>
                                <div>
                                    <h4 className="text-xs font-bold text-on-surface">Rian Kusuma</h4>
                                    <p className="text-[11px] font-mono text-on-surface-variant">Servis IC & Recovery Data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. SECTION FAQ ACCORDION */}
            <section className="py-20 bg-surface-container-lowest border-b border-outline-variant/20" id="faq">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                            Pusat Informasi
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">Pertanyaan yang Sering Diajukan</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Jawaban cepat seputar layanan, klaim garansi, dan antar jemput.</p>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                q: 'Bagaimana cara melakukan booking servis HP di TECHCELL NexusCenter?',
                                a: 'Anda dapat langsung menekan tombol "Booking Servis" di website ini atau mengirim pesan WhatsApp ke 0812-3456-7890. Sebutkan merk, tipe, dan gejala kerusakan HP Anda. Tim CS kami akan memberikan estimasi biaya dan nomor antrean prioritas.'
                            },
                            {
                                q: 'Apa saja metode pembayaran yang diterima di konter?',
                                a: 'Kami menerima Pembayaran Tunai (COD / POS), QRIS Instant (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, ShopeePay, DANA), serta Transfer Bank & Virtual Account.'
                            },
                            {
                                q: 'Berapa lama masa garansi untuk perbaikan dan sparepart?',
                                a: 'Untuk penggantian LCD dan baterai original, kami memberikan garansi resmi hingga 90 hari (3 bulan). Untuk perbaikan mesin / IC, garansi berlaku 30 hari.'
                            },
                            {
                                q: 'Apakah layanan antar-jemput benar-benar gratis untuk radius 4 km?',
                                a: 'Benar! 100% Gratis Ongkir tanpa minimum belanja untuk jarak maksimal 4 km dari konter pusat TECHCELL NexusCenter.'
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="faq-card bg-surface-container-low border border-outline-variant/25 rounded-2xl overflow-hidden transition-all shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-secondary transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span
                                        className={`material-symbols-outlined faq-icon text-on-surface-variant transition-transform duration-300 ${
                                            openFaq === idx ? 'rotate-180 text-secondary' : ''
                                        }`}
                                    >
                                        expand_more
                                    </span>
                                </button>
                                {openFaq === idx && (
                                    <div className="faq-content px-4 pb-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3 fade-in">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCT SPECIFICATION & REVIEW MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/30 relative max-h-[90vh] overflow-y-auto space-y-6">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-surface-container transition-colors z-20"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            {/* Product Image / Icon Box */}
                            <div className="md:col-span-5 flex flex-col items-center justify-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 relative">
                                {selectedProduct.image ? (
                                    <div className="w-full h-48 md:h-56 flex items-center justify-center">
                                        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain rounded-xl shadow-md" />
                                    </div>
                                ) : (
                                    <div className="text-7xl py-6">{selectedProduct.icon}</div>
                                )}
                                <span className="mt-3 px-3 py-1 bg-secondary/15 text-secondary text-[11px] font-mono font-bold rounded-full uppercase border border-secondary/30">
                                    {selectedProduct.category}
                                </span>
                            </div>

                            {/* Main Specs & Details */}
                            <div className="md:col-span-7 space-y-4">
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                                        <span className="material-symbols-outlined text-base">star</span>
                                        <span className="font-mono text-xs font-bold text-on-surface">
                                            {Number(selectedProduct.rating || 4.9).toFixed(1)} ★ ({selectedProduct.review_count || 128} ulasan)
                                        </span>
                                    </div>
                                    <h3 className="font-display font-extrabold text-2xl text-on-surface leading-tight">{selectedProduct.name}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="font-mono font-extrabold text-secondary text-2xl">
                                            Rp {Number(selectedProduct.price).toLocaleString('id-ID')}
                                        </span>
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold text-xs rounded-full border border-emerald-200">
                                            {selectedProduct.stock > 0 ? `${selectedProduct.stock} Unit Tersedia` : 'Stok Habis'}
                                        </span>
                                    </div>
                                </div>

                                {/* Technical Specification Grid */}
                                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 space-y-2">
                                    <h4 className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">memory</span> Spesifikasi Teknis Produk:
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                        <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                                            <span className="text-on-surface-variant block text-[10px]">CHIPSET / Dapur Pacu:</span>
                                            <strong className="text-on-surface">
                                                {selectedProduct.name.includes('S24 Ultra') ? 'Snapdragon 8 Gen 3 (4nm)' : selectedProduct.name.includes('iPhone 15') ? 'Apple A17 Pro Bionic' : 'Octa-Core Pro Performance'}
                                            </strong>
                                        </div>
                                        <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                                            <span className="text-on-surface-variant block text-[10px]">KAMERA:</span>
                                            <strong className="text-on-surface">
                                                {selectedProduct.name.includes('S24 Ultra') ? '200MP Quad AI Camera' : selectedProduct.name.includes('iPhone 15') ? '48MP Main + 5x Zoom' : '50MP Ultra-HD Clarity'}
                                            </strong>
                                        </div>
                                        <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                                            <span className="text-on-surface-variant block text-[10px]">LAYAR:</span>
                                            <strong className="text-on-surface">
                                                {selectedProduct.name.includes('S24 Ultra') ? '6.8" Dynamic AMOLED 2X' : 'Super AMOLED 120Hz FHD+'}
                                            </strong>
                                        </div>
                                        <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                                            <span className="text-on-surface-variant block text-[10px]">BATERAI & DAYA:</span>
                                            <strong className="text-on-surface">5000mAh Super Fast Charging</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <span className="text-xs font-mono text-on-surface-variant font-bold uppercase block mb-1">Deskripsi Ringkas:</span>
                                    <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                                        {selectedProduct.description || 'Produk original bergaransi resmi dari TECHCELL NexusCenter.'}
                                    </p>
                                </div>

                                {/* Rating & Review Submission Form */}
                                <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                                    <span className="text-[11px] font-mono font-bold text-amber-600 uppercase block mb-1.5 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">star_rate</span> Beri Ulasan Produk Ini:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={reviewRating}
                                            onChange={(e) => setReviewRating(e.target.value)}
                                            className="bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-secondary flex-1"
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ (5/5) Sangat Puas</option>
                                            <option value="4">⭐⭐⭐⭐ (4/5) Bagus</option>
                                            <option value="3">⭐⭐⭐ (3/5) Cukup</option>
                                            <option value="2">⭐⭐ (2/5) Kurang</option>
                                            <option value="1">⭐ (1/5) Buruk</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => showToast('Terima kasih! Ulasan bintang ' + reviewRating + ' berhasil dikirim.')}
                                            className="bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold py-2 px-3 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">send</span> Kirim Ulasan
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleAddToCart(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                        Tambah ke Keranjang
                                    </button>
                                    <Link
                                        href="/keranjang"
                                        onClick={() => handleAddToCart(selectedProduct)}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">bolt</span> Beli & Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
