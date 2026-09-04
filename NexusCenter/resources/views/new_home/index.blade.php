@extends('layouts.app')
@section('title', 'TECHCELL NexusCenter — Pusat Gadget, Aksesoris & Servis HP Bergaransi')

@section('content')
<div class="fade-in">
    <!-- 1. TOP MINI BAR -->
    <div class="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-col sm:flex-row justify-between items-center gap-2">
            <div class="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <span class="flex items-center gap-1.5 text-slate-200">
                    <span class="material-symbols-outlined text-secondary-fixed-dim text-[16px]">call</span>
                    <a href="tel:081234567890" class="hover:text-secondary-fixed-dim font-mono transition-colors">0812-3456-7890</a>
                </span>
                <span class="text-slate-600 hidden sm:inline">•</span>
                <span class="flex items-center gap-1.5 text-slate-300">
                    <span class="material-symbols-outlined text-secondary-fixed-dim text-[16px]">storefront</span>
                    TECHCELL NexusCenter — Palembang
                </span>
                <span class="text-slate-600 hidden sm:inline">•</span>
                <span class="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Buka Hari Ini: 09.00 - 21.00 WIB
                </span>
            </div>
            <div class="flex items-center gap-4 text-[11px] tracking-wide">
                <span class="bg-secondary/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-secondary/40 font-mono font-bold animate-pulse">
                    🚀 Radius 4KM Gratis Ongkir
                </span>
                <a href="#outlet" class="hover:text-white transition-colors">Cari Toko Terdekat &rarr;</a>
            </div>
        </div>
    </div>

    <!-- 2. HERO SECTION WITH RICH ANIMATIONS -->
    <section class="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 px-margin-mobile md:px-margin-desktop">
        <!-- Ambient background glowing light orbs & tech matrix pattern -->
        <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(circle at 50% 50%, #4cd7f6 1px, transparent 1px); background-size: 32px 32px;"></div>
        <div class="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div class="absolute bottom-10 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

        <div class="max-w-container-max-width mx-auto relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <!-- Left Content -->
                <div class="lg:col-span-7 flex flex-col items-start gap-6">
                    <!-- Trust Badge -->
                    <div class="inline-flex items-center gap-2 bg-slate-800/90 border border-cyan-400/30 px-4 py-2 rounded-full text-xs text-cyan-300 backdrop-blur-md shadow-lg animate-bounce-gentle">
                        <span class="material-symbols-outlined text-[16px] text-amber-400">star</span>
                        <span class="font-mono font-bold tracking-wide">⭐ Terpercaya Sejak 2015 • Solusi Gadget & Servis #1</span>
                    </div>

                    <!-- Headline -->
                    <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                        Pusat Gadget, Aksesoris &amp; Servis HP <br>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-cyan-400 drop-shadow-[0_0_20px_rgba(76,215,246,0.4)]">
                            Terlengkap &amp; Bergaransi Resmi
                        </span>
                    </h1>

                    <!-- Subheadline -->
                    <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                        Kunjungi konter fisik resmi kami di <strong class="text-white">Palembang</strong> atau pesan mudah dari rumah dengan <span class="text-cyan-300 font-semibold font-mono">Gratis Ongkir &amp; Jemput Antar hingga 4 KM</span>. Pengerjaan servis kilat 1 jam, sparepart 100% original, dan garansi pasti.
                    </p>

                    <!-- Hero Action Buttons -->
                    <div class="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                        <a href="{{ route('products.index') }}" class="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-cyan-600 hover:from-cyan-600 hover:to-secondary text-white px-7 py-3.5 rounded-xl font-mono text-xs font-bold shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/50 transition-all hover:scale-105 active:scale-95">
                            <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                            <span>Lihat Produk</span>
                        </a>
                        <a href="{{ route('services.booking') }}" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-cyan-300 px-7 py-3.5 rounded-xl font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-md">
                            <span class="material-symbols-outlined text-[20px]">build_circle</span>
                            <span>Booking Servis</span>
                        </a>
                        <a href="https://wa.me/6281234567890?text=Halo%20NexusCenter,%20saya%20ingin%20tanya%20produk%20dan%20servis" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95">
                            <span class="material-symbols-outlined text-[20px]">chat</span>
                            <span>Hubungi Kami</span>
                        </a>
                    </div>

                    <!-- 3 Counter Statistics with Animated Numbers -->
                    <div class="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-slate-800/80 w-full">
                        <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-cyan-400/50 hover:-translate-y-1">
                            <div class="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-cyan-300 flex items-baseline">
                                <span class="counter-num" data-target="9">9</span><span>+</span>
                            </div>
                            <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono font-medium">Tahun Pengalaman</p>
                        </div>
                        <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-cyan-400/50 hover:-translate-y-1">
                            <div class="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-white flex items-baseline">
                                <span class="counter-num" data-target="12">12</span><span>+</span>
                            </div>
                            <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono font-medium">Outlet &amp; Mitra Toko</p>
                        </div>
                        <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-amber-400/50 hover:-translate-y-1">
                            <div class="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-400 flex items-baseline">
                                <span class="counter-num" data-target="50000">50000</span><span>+</span>
                            </div>
                            <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono font-medium">Pelanggan Puas</p>
                        </div>
                    </div>
                </div>

                <!-- Right Futuristic Showcase Visual with Motion -->
                <div class="lg:col-span-5 relative flex justify-center">
                    <div class="relative w-full max-w-md lg:max-w-none">
                        <div class="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                        <div class="relative rounded-3xl overflow-hidden border border-cyan-400/30 bg-slate-900 shadow-2xl p-3 animate-float-card-1">
                            <div class="bg-slate-950/80 rounded-2xl overflow-hidden relative border border-white/10 group h-80 sm:h-96">
                                <img src="{{ asset('images/posters/hero_tradein.png') }}" alt="Pusat Gadget & Trade-In TECHCELL NexusCenter" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                <div class="absolute top-4 right-4 bg-emerald-500/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur shadow-md">
                                    Official Store &amp; Trade-In
                                </div>
                            </div>
                            <!-- Floating Micro-Badge -->
                            <div class="mt-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                                        <span class="material-symbols-outlined text-[22px]">verified</span>
                                    </div>
                                    <div>
                                        <h4 class="text-xs font-bold text-white leading-tight">Garansi Resmi SEIN &amp; iBox</h4>
                                        <p class="text-[10px] text-slate-400 font-mono">Siap trade-in dengan harga tertinggi</p>
                                    </div>
                                </div>
                                <span class="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/40">100% Ori</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. SECTION 4 KEUNGGULAN UTAMA -->
    <section class="py-16 bg-surface-container-lowest border-b border-outline-variant/20" id="tentang">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center max-w-2xl mx-auto mb-12">
                <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                    Kualitas Terbukti
                </span>
                <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">4 Keunggulan Utama TECHCELL</h2>
                <p class="text-on-surface-variant text-sm sm:text-base mt-2">Komitmen kami memberikan standar layanan tertinggi untuk setiap kebutuhan digital Anda.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Card 1 -->
                <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                    <div class="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[28px]">workspace_premium</span>
                    </div>
                    <h3 class="font-display text-lg font-bold text-on-surface mb-2">9+ Tahun Pengalaman</h3>
                    <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Beroperasi aktif di industri gadget &amp; telekomunikasi sejak 2015 dengan rekam jejak puluhan ribu transaksi amanah.</p>
                </div>
                <!-- Card 2 -->
                <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                    <div class="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[28px]">engineering</span>
                    </div>
                    <h3 class="font-display text-lg font-bold text-on-surface mb-2">Teknisi Bersertifikat Resmi</h3>
                    <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Tim ahli tersertifikasi dengan peralatan mikrosolder dan diagnosa presisi untuk menangani kerusakan ringan hingga berat.</p>
                </div>
                <!-- Card 3 -->
                <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                    <div class="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[28px]">verified</span>
                    </div>
                    <h3 class="font-display text-lg font-bold text-on-surface mb-2">Sparepart 100% Original</h3>
                    <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Pasokan suku cadang asli OEM &amp; Original Equipment Manufacturer teruji presisi agar performa gadget tetap optimal.</p>
                </div>
                <!-- Card 4 -->
                <div class="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                    <div class="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[28px]">security</span>
                    </div>
                    <h3 class="font-display text-lg font-bold text-on-surface mb-2">Garansi Resmi Hingga 90 Hari</h3>
                    <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed">Jaminan servis dan perlindungan aksesoris hingga 3 bulan penuh. Penggantian unit baru bila kendala tidak tuntas.</p>
                </div>
            </div>
        </div>
    </section>

    @guest
    <!-- Guest Registration Banner -->
    <section class="py-6 px-margin-mobile md:px-margin-desktop bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-y border-white/10">
        <div class="max-w-container-max-width mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/15 shadow-xl">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary-fixed-dim text-2xl shrink-0 animate-bounce-gentle">
                    💡
                </div>
                <div>
                    <h3 class="font-display font-bold text-base text-white">Belum Mempunyai Akun Pelanggan?</h3>
                    <p class="text-xs font-mono text-gray-300">Daftar akun gratis sekarang untuk kemudahan pemesanan, lacak servis, dan promo spesial!</p>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <a href="{{ route('login') }}" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white border border-white/20 transition-all">
                    Masuk
                </a>
                <a href="{{ route('register') }}" class="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-xs font-mono font-bold text-white shadow-lg transition-all active:scale-95">
                    🚀 Daftar Akun Baru
                </a>
            </div>
        </div>
    </section>
    @endguest

    <!-- 4. KATALOG PRODUK UNGGULAN -->
    <section class="py-20 bg-surface-container-low border-b border-outline-variant/20" id="produk">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-2">
                        Pilihan Terbaik
                    </span>
                    <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">Katalog Produk &amp; Aksesoris Terpopuler</h2>
                    <p class="text-on-surface-variant text-sm mt-1">Stok terjamin dengan garansi toko &amp; pasang langsung di konter TECHCELL NexusCenter.</p>
                </div>
                <a href="{{ route('products.index') }}" class="inline-flex items-center gap-2 bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95">
                    <span>Lihat Semua Produk</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
            </div>

            <!-- Product Grid Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @foreach($products as $product)
                <div class="product-card group bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden hover:border-secondary transition-all duration-300 hover:shadow-xl relative flex flex-col h-full cursor-pointer hover:-translate-y-2"
                     data-product="{{ json_encode($product) }}"
                     data-image="{{ $product->image ? Storage::url($product->image) : '' }}"
                     onclick="triggerCardModal(this, event)">
                    <div class="absolute top-3 left-3 bg-secondary/15 text-secondary text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border border-secondary/30 z-10 backdrop-blur">
                        {{ $product->category }}
                    </div>
                    <form method="POST" action="{{ route('cart.add', $product) }}" class="absolute top-3 right-3 z-20" onclick="event.stopPropagation()">
                        @csrf
                        <button type="submit" class="text-on-surface-variant hover:text-secondary bg-surface-container-lowest/90 backdrop-blur p-2 rounded-full shadow-md transition-all hover:scale-110 active:scale-95" title="Tambah ke Keranjang">
                            <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                    </form>
                    <div class="p-6 bg-surface-container-low flex justify-center items-center h-48 sm:h-56 relative overflow-hidden">
                        @if($product->image)
                            <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        @else
                            <span class="text-6xl group-hover:scale-110 transition-transform duration-500">{{ $product->icon }}</span>
                        @endif
                        <button type="button" onclick="triggerCardModal(this, event)" class="absolute bottom-3 right-3 bg-white/90 text-secondary text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg backdrop-blur flex items-center gap-1 shadow-md border border-secondary/30 hover:bg-secondary hover:text-white transition-all cursor-pointer z-20 active:scale-95">
                            <span class="material-symbols-outlined text-[14px]">info</span> Detail
                        </button>
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="flex items-center justify-between gap-1 mb-1">
                            <span class="text-xs font-mono text-on-surface-variant">{{ $product->brand ?? 'TECHCELL' }}</span>
                            <span class="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                                <span class="material-symbols-outlined text-xs">star</span> {{ number_format($product->rating ?: 4.9, 1) }} ({{ $product->review_count ?: 128 }})
                            </span>
                        </div>
                        <h3 class="font-display font-bold text-base text-on-surface mb-1 line-clamp-2 group-hover:text-secondary transition-colors">{{ $product->name }}</h3>
                        <p class="font-mono text-xs text-on-surface-variant line-clamp-2 mb-3 opacity-80">{{ $product->description }}</p>
                        <div class="mt-auto pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                            <div>
                                <p class="font-mono text-xs text-outline line-through">Rp {{ number_format($product->price * 1.1, 0, ',', '.') }}</p>
                                <p class="font-mono font-bold text-secondary text-lg">{{ $product->formatted_price }}</p>
                            </div>
                            <button type="button" onclick="triggerCardModal(this, event)" class="text-xs font-mono font-bold text-secondary hover:text-cyan-700 flex items-center gap-0.5 group-hover:translate-x-1 transition-all cursor-pointer hover:underline z-20">
                                Detail &rarr;
                            </button>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>

            <!-- Trade-In Callout Banner with Poster Image -->
            <div class="mt-12 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card hover:shadow-xl transition-all overflow-hidden relative">
                <div class="flex items-center gap-5 relative z-10">
                    <div class="w-16 h-16 rounded-2xl overflow-hidden border border-outline-variant/30 shrink-0 shadow-md">
                        <img src="{{ asset('images/posters/gadgets_accessories.png') }}" alt="Aksesoris & Gadget TECHCELL" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-display text-lg font-bold text-on-surface">Program Tukar Tambah (Trade-In) &amp; Aksesoris Premium</h4>
                        <p class="text-on-surface-variant text-xs sm:text-sm mt-0.5">Bawa HP lama merk apapun ke konter TECHCELL NexusCenter, kami taksir dengan harga tertinggi dan transparan.</p>
                    </div>
                </div>
                <a href="#trade-in-section" class="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all shadow-md active:scale-95 shrink-0 relative z-10">
                    <span>Taksir HP Lama Anda</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
            </div>
        </div>
    </section>

    <!-- 5. SECTION SERVIS & JEMPUT ANTAR -->
    <section class="py-20 bg-surface-container-lowest border-b border-outline-variant/20" id="servis">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <!-- Left Visual Banner -->
                <div class="lg:col-span-6 relative">
                    <div class="relative rounded-3xl overflow-hidden border border-outline-variant/30 shadow-2xl group">
                        <img src="{{ asset('images/posters/service_technician.png') }}" alt="Teknisi Servis Presisi TECHCELL" class="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
                            <span class="bg-secondary/90 backdrop-blur text-white text-[11px] font-mono font-bold px-3.5 py-1 rounded-full border border-cyan-400/40 shadow-md">
                                🛠️ Lab Servis Steril &amp; Modern
                            </span>
                            <h3 class="font-display text-2xl font-extrabold text-white">Dikerjakan Transparan &amp; Bergaransi</h3>
                            <p class="text-xs text-slate-200 font-mono">
                                Konsep open-kitchen lab di TECHCELL NexusCenter. Data pribadi aman, pengerjaan cepat 1 jam &amp; presisi.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right Service Features -->
                <div class="lg:col-span-6 flex flex-col justify-center space-y-4">
                    <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block w-fit">
                        Service &amp; Repair Center
                    </span>
                    <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight">
                        Layanan Servis Kilat &amp; Ganti Sparepart Original
                    </h2>
                    <p class="text-on-surface-variant text-sm leading-relaxed">
                        Solusi perbaikan handphone profesional untuk iPhone, Samsung, Xiaomi, Oppo, Vivo, dan merk lainnya dengan jaminan kepuasan.
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div class="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                            <div class="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span class="material-symbols-outlined text-[18px]">timer</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-xs sm:text-sm text-on-surface">Servis Kilat 1 Jam</h4>
                                <p class="text-[11px] text-on-surface-variant mt-0.5">Ganti LCD &amp; baterai bisa ditunggu di tempat.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                            <div class="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span class="material-symbols-outlined text-[18px]">screen_rotation_alt</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-xs sm:text-sm text-on-surface">OLED / LCD Presisi</h4>
                                <p class="text-[11px] text-on-surface-variant mt-0.5">TrueTone aktif, touch responsif tanpa ghost touch.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                            <div class="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span class="material-symbols-outlined text-[18px]">badge</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-xs sm:text-sm text-on-surface">Teknisi Tersertifikasi</h4>
                                <p class="text-[11px] text-on-surface-variant mt-0.5">Spesialis micro-soldering IC &amp; bypass mesin.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                            <div class="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-xs sm:text-sm text-on-surface">Garansi Nyata 90 Hari</h4>
                                <p class="text-[11px] text-on-surface-variant mt-0.5">Garansi ganti part baru tanpa berbelit-belit.</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-4 pt-4">
                        <a href="{{ route('services.booking') }}" class="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3.5 rounded-xl font-mono text-xs font-bold shadow-md transition-all active:scale-95">
                            <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                            <span>Booking Servis Sekarang</span>
                        </a>
                        <a href="{{ route('services.track') }}" class="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/30 text-on-surface px-6 py-3.5 rounded-xl font-mono text-xs font-bold hover:border-secondary transition-all">
                            <span class="material-symbols-outlined text-[18px]">search</span>
                            <span>Lacak Status Servis</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Trade-In Calculator Interactive Section -->
            <div id="trade-in-section" class="mt-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-white/10 relative shadow-2xl overflow-hidden">
                <div class="max-w-2xl space-y-4 relative z-10">
                    <span class="px-3.5 py-1 bg-secondary/30 text-cyan-300 font-mono text-xs font-bold rounded-full border border-secondary/40 inline-block">
                        🔄 Program Tukar Tambah Interactive
                    </span>
                    <h3 class="font-display font-extrabold text-2xl sm:text-3xl text-white">Cek Perkiraan Harga HP Lama Kamu</h3>
                    <p class="font-mono text-xs text-slate-300 leading-relaxed">Ketik nama HP lama kamu di bawah ini dan dapatkan estimasi harga tukar tambah terbaik dari TECHCELL NexusCenter.</p>

                    <div class="space-y-3 pt-2">
                        <div class="flex gap-2">
                            <input type="text" id="trade-in-input" placeholder="Contoh: Samsung Galaxy A52, iPhone 11, Oppo Reno..."
                                class="flex-1 bg-white/15 border border-white/30 text-white placeholder-white/50 text-xs font-mono px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary font-semibold"
                                oninput="checkTradeInPrice()">
                            <button onclick="checkTradeInPrice()" class="bg-secondary text-white px-5 py-3 rounded-xl font-mono text-xs font-bold hover:bg-secondary/90 transition-all shrink-0 shadow-lg active:scale-95">
                                <span class="material-symbols-outlined text-base">search</span>
                            </button>
                        </div>

                        <!-- Result Box -->
                        <div id="trade-in-result" class="hidden bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-5 space-y-3 animate-float-card-1">
                            <div class="flex items-center justify-between">
                                <p class="font-mono text-xs text-cyan-300 font-bold">ESTIMASI HARGA TUKAR TAMBAH:</p>
                                <span class="text-[10px] font-mono bg-secondary/30 text-cyan-300 px-2.5 py-0.5 rounded-full border border-secondary/30">Perkiraan Resmi</span>
                            </div>
                            <p id="result-name" class="font-display font-bold text-white text-base"></p>
                            <p id="result-price" class="font-mono font-extrabold text-cyan-300 text-2xl md:text-3xl tracking-tight"></p>
                            <p class="font-mono text-[11px] text-white/70 leading-relaxed">*Harga final ditentukan setelah pengecekan fisik di toko TECHCELL NexusCenter.</p>
                            <a href="{{ route('services.booking') }}" class="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold hover:bg-secondary/90 transition-all shadow-md mt-1">
                                <span class="material-symbols-outlined text-sm">autorenew</span> Booking Tukar Tambah &rarr;
                            </a>
                        </div>

                        <!-- Not Found Box -->
                        <div id="trade-in-notfound" class="hidden bg-white/10 border border-white/20 rounded-xl p-4 text-xs font-mono text-white/80">
                            HP tidak ditemukan di daftar kami. Silakan datang langsung ke konter untuk penilaian gratis!
                        </div>
                    </div>
                </div>
            </div>

            <!-- Callout Antar-Jemput Gratis Radius 4 KM with Official Courier Poster -->
            <div class="mt-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-white/10 overflow-hidden relative shadow-2xl">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                    <div class="md:col-span-5 rounded-2xl overflow-hidden border border-white/20 shadow-xl group h-60 sm:h-64">
                        <img src="{{ asset('images/posters/courier_driver.png') }}" alt="Kurir Delivery Driver Resmi TECHCELL" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    </div>
                    <div class="md:col-span-7 flex flex-col items-start gap-4">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="bg-amber-500 text-white text-xs font-mono font-bold px-3 py-1 rounded-full shadow-sm">Layanan Kurir Instan</span>
                            <span class="text-xs text-cyan-300 font-mono font-bold">🚀 Radius 4KM Gratis Ongkir</span>
                        </div>
                        <h3 class="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">Ingin Beli HP / Servis Tapi Malas Keluar? Kami Antar Ke Rumah!</h3>
                        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Khusus area dalam jangkauan 4 km dari konter TECHCELL NexusCenter, kurir resmi kami siap menjemput unit HP rusak Anda dan mengantarkannya kembali setelah selesai diperbaiki.
                        </p>
                        <a href="{{ route('delivery.userIndex') }}" class="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95">
                            <span class="material-symbols-outlined text-[18px]">two_wheeler</span>
                            <span>Lacak Driver &amp; Request Jemput-Antar &rarr;</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 6. SECTION TESTIMONI PELANGGAN -->
    <section class="py-20 bg-surface-container-low border-b border-outline-variant/20">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                    Google Reviews 4.9/5.0
                </span>
                <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">Apa Kata Pelanggan TECHCELL?</h2>
                <p class="text-on-surface-variant text-sm sm:text-base mt-2">Ulasan transparan dari pelanggan yang telah berbelanja dan servis di konter kami.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Testimoni 1 -->
                <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div>
                        <div class="flex items-center gap-1 text-amber-500 mb-3">
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                        </div>
                        <p class="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                            "Ganti LCD iPhone 13 Pro cuma 45 menit kelar ditunggu di konter. Dikasih bonus pasang tempered glass pula. Stafnya super ramah &amp; pengerjaan rapi banget!"
                        </p>
                    </div>
                    <div class="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                        <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">BP</div>
                        <div>
                            <h4 class="text-xs font-bold text-on-surface">Budi Pratama</h4>
                            <p class="text-[11px] font-mono text-on-surface-variant">Servis iPhone 13 Pro</p>
                        </div>
                    </div>
                </div>

                <!-- Testimoni 2 -->
                <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div>
                        <div class="flex items-center gap-1 text-amber-500 mb-3">
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                        </div>
                        <p class="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                            "Beli GaN Charger 65W &amp; kabel Type-C original. Karena lagi repot kerja, coba layanan antar konter. 30 menit pesanan langsung sampai ke rumah tanpa ongkir!"
                        </p>
                    </div>
                    <div class="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                        <div class="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs">SA</div>
                        <div>
                            <h4 class="text-xs font-bold text-on-surface">Sarah Amanda</h4>
                            <p class="text-[11px] font-mono text-on-surface-variant">Aksesoris &amp; Delivery</p>
                        </div>
                    </div>
                </div>

                <!-- Testimoni 3 -->
                <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div>
                        <div class="flex items-center gap-1 text-amber-500 mb-3">
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                        </div>
                        <p class="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                            "Trade-in HP lama dapat harga paling fair dibanding toko lain. Proses cek fisik cuma 10 menit dan langsung bisa upgrade ke Samsung S-series baru. Recommended!"
                        </p>
                    </div>
                    <div class="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">HW</div>
                        <div>
                            <h4 class="text-xs font-bold text-on-surface">Hendra Wijaya</h4>
                            <p class="text-[11px] font-mono text-on-surface-variant">Trade-In Smartphone</p>
                        </div>
                    </div>
                </div>

                <!-- Testimoni 4 -->
                <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div>
                        <div class="flex items-center gap-1 text-amber-500 mb-3">
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                            <span class="material-symbols-outlined text-[18px]">star</span>
                        </div>
                        <p class="text-on-surface-variant text-xs sm:text-sm italic leading-relaxed">
                            "Servis HP mati total kena air berhasil diselamatkan datanya sama teknisi TECHCELL. Biaya dijelaskan di awal sebelum dikerjakan, sangat jujur dan transparan!"
                        </p>
                    </div>
                    <div class="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/15">
                        <div class="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">RK</div>
                        <div>
                            <h4 class="text-xs font-bold text-on-surface">Rian Kusuma</h4>
                            <p class="text-[11px] font-mono text-on-surface-variant">Servis IC &amp; Recovery Data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 7. SECTION FAQ ACCORDION -->
    <section class="py-20 bg-surface-container-lowest border-b border-outline-variant/20" id="faq">
        <div class="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center max-w-xl mx-auto mb-12">
                <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-3">
                    Pusat Informasi
                </span>
                <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">Pertanyaan yang Sering Diajukan</h2>
                <p class="text-on-surface-variant text-sm mt-1">Jawaban cepat seputar layanan, klaim garansi, dan antar jemput.</p>
            </div>

            <div class="space-y-3">
                <!-- FAQ 1 -->
                <div class="faq-card bg-surface-container-low border border-outline-variant/25 rounded-2xl overflow-hidden transition-all shadow-sm">
                    <button class="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-secondary transition-colors">
                        <span>Bagaimana cara melakukan booking servis HP di TECHCELL NexusCenter?</span>
                        <span class="material-symbols-outlined faq-icon text-on-surface-variant transition-transform duration-300">expand_more</span>
                    </button>
                    <div class="faq-content hidden px-4 pb-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3">
                        Anda dapat langsung menekan tombol "Booking Servis" di website ini atau mengirim pesan WhatsApp ke 0812-3456-7890. Sebutkan merk, tipe, dan gejala kerusakan HP Anda. Tim CS kami akan memberikan estimasi biaya dan nomor antrean prioritas.
                    </div>
                </div>

                <!-- FAQ 2 -->
                <div class="faq-card bg-surface-container-low border border-outline-variant/25 rounded-2xl overflow-hidden transition-all shadow-sm">
                    <button class="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-secondary transition-colors">
                        <span>Apa saja metode pembayaran yang diterima di konter?</span>
                        <span class="material-symbols-outlined faq-icon text-on-surface-variant transition-transform duration-300">expand_more</span>
                    </button>
                    <div class="faq-content hidden px-4 pb-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3">
                        Kami menerima Pembayaran Tunai (COD / POS), QRIS Instant (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, ShopeePay, DANA), serta Transfer Bank & Virtual Account.
                    </div>
                </div>

                <!-- FAQ 3 -->
                <div class="faq-card bg-surface-container-low border border-outline-variant/25 rounded-2xl overflow-hidden transition-all shadow-sm">
                    <button class="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-secondary transition-colors">
                        <span>Berapa lama masa garansi untuk perbaikan dan sparepart?</span>
                        <span class="material-symbols-outlined faq-icon text-on-surface-variant transition-transform duration-300">expand_more</span>
                    </button>
                    <div class="faq-content hidden px-4 pb-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3">
                        Untuk penggantian LCD dan baterai original, kami memberikan garansi resmi hingga 90 hari (3 bulan). Untuk perbaikan mesin / IC, garansi berlaku 30 hari.
                    </div>
                </div>

                <!-- FAQ 4 -->
                <div class="faq-card bg-surface-container-low border border-outline-variant/25 rounded-2xl overflow-hidden transition-all shadow-sm">
                    <button class="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-secondary transition-colors">
                        <span>Apakah layanan antar-jemput benar-benar gratis untuk radius 4 km?</span>
                        <span class="material-symbols-outlined faq-icon text-on-surface-variant transition-transform duration-300">expand_more</span>
                    </button>
                    <div class="faq-content hidden px-4 pb-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3">
                        Benar! 100% Gratis Ongkir tanpa minimum belanja untuk jarak maksimal 4 km dari konter pusat TECHCELL NexusCenter.
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- Product Specification & Review Modal -->
<div id="home-detail-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/30 relative max-h-[90vh] overflow-y-auto space-y-6">
        <button onclick="closeHomeDetailModal()" class="absolute top-4 right-4 text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-surface-container transition-colors z-20">
            <span class="material-symbols-outlined text-2xl">close</span>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <!-- Product Image / Icon Box -->
            <div class="md:col-span-5 flex flex-col items-center justify-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 relative">
                <div id="home-detail-image-container" class="w-full h-48 md:h-56 hidden flex items-center justify-center">
                    <img id="home-detail-image" src="" alt="Produk" class="w-full h-full object-cover rounded-xl shadow-md">
                </div>
                <div id="home-detail-icon" class="text-7xl py-6">📱</div>
                <span id="home-detail-category-badge" class="mt-3 px-3 py-1 bg-secondary/15 text-secondary text-[11px] font-mono font-bold rounded-full uppercase border border-secondary/30">
                    SMARTPHONE
                </span>
            </div>

            <!-- Main Specs & Details -->
            <div class="md:col-span-7 space-y-4">
                <div>
                    <div class="flex items-center gap-1 text-amber-500 mb-1">
                        <span class="material-symbols-outlined text-base">star</span>
                        <span id="home-detail-rating-text" class="font-mono text-xs font-bold text-on-surface">4.9 ★ (128 ulasan)</span>
                    </div>
                    <h3 id="home-detail-name" class="font-display font-extrabold text-2xl text-on-surface leading-tight">Nama Produk</h3>
                    <div class="flex items-center gap-3 mt-2">
                        <span id="home-detail-price" class="font-mono font-extrabold text-secondary text-2xl">Rp 0</span>
                        <span id="home-detail-stock" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold text-xs rounded-full border border-emerald-200">
                            Stok Tersedia
                        </span>
                    </div>
                </div>

                <!-- Technical Specification Grid -->
                <div class="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 space-y-2">
                    <h4 class="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">memory</span> Spesifikasi Teknis Produk:
                    </h4>
                    <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div class="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                            <span class="text-on-surface-variant block text-[10px]">CHIPSET / Dapur Pacu:</span>
                            <strong id="home-spec-chipset" class="text-on-surface">Octa-Core High Performance</strong>
                        </div>
                        <div class="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                            <span class="text-on-surface-variant block text-[10px]">KAMERA:</span>
                            <strong id="home-spec-camera" class="text-on-surface">50MP Ultra-HD Camera</strong>
                        </div>
                        <div class="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                            <span class="text-on-surface-variant block text-[10px]">LAYAR:</span>
                            <strong id="home-spec-display" class="text-on-surface">AMOLED 120Hz FullView</strong>
                        </div>
                        <div class="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                            <span class="text-on-surface-variant block text-[10px]">BATERAI & DAYA:</span>
                            <strong id="home-spec-battery" class="text-on-surface">5000mAh Fast Charging</strong>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <span class="text-xs font-mono text-on-surface-variant font-bold uppercase block mb-1">Deskripsi Ringkas:</span>
                    <p id="home-detail-description" class="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                        Deskripsi rinci...
                    </p>
                </div>

                <!-- Rating & Review Submission Form -->
                <div class="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                    <span class="text-[11px] font-mono font-bold text-amber-600 uppercase block mb-1.5 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">star_rate</span> Beri Ulasan Produk Ini:
                    </span>
                    <form id="home-review-form" method="POST" action="" class="flex items-center gap-2">
                        @csrf
                        <select name="rating" class="bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-secondary flex-1">
                            <option value="5">⭐⭐⭐⭐⭐ (5/5) Sangat Puas</option>
                            <option value="4">⭐⭐⭐⭐ (4/5) Bagus</option>
                            <option value="3">⭐⭐⭐ (3/5) Cukup</option>
                            <option value="2">⭐⭐ (2/5) Kurang</option>
                            <option value="1">⭐ (1/5) Buruk</option>
                        </select>
                        <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold py-2 px-3 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">send</span> Kirim Ulasan
                        </button>
                    </form>
                </div>

                <!-- Action Buttons -->
                <div class="pt-2 flex items-center gap-3">
                    <form id="home-detail-cart-form" method="POST" action="" class="flex-1">
                        @csrf
                        <button type="submit" class="w-full bg-secondary hover:bg-secondary/90 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                            Tambah ke Keranjang
                        </button>
                    </form>
                    <a href="{{ route('checkout.index') }}" class="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-1.5 active:scale-95">
                        <span class="material-symbols-outlined text-[18px]">bolt</span> Beli & Checkout
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

@push('styles')
<style>
@keyframes floatUp1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(0.8deg); }
}
@keyframes pulseGlowOrb {
    0%, 100% { opacity: 0.25; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(1.18); }
}
@keyframes bounceGentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
.animate-float-card-1 { animation: floatUp1 4.2s ease-in-out infinite; }
.animate-pulse-glow { animation: pulseGlowOrb 6s ease-in-out infinite; }
.animate-bounce-gentle { animation: bounceGentle 2.5s ease-in-out infinite; }
</style>
@endpush

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Logic
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.faq-card');
            const content = card.querySelector('.faq-content');
            const icon = toggle.querySelector('.faq-icon');
            const isHidden = content.classList.contains('hidden');

            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

            if (isHidden) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter-num');
    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (isNaN(target)) return;
            let start = 0;
            const increment = Math.ceil(target / 40);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    counter.innerText = target.toLocaleString('id-ID');
                    clearInterval(timer);
                } else {
                    counter.innerText = start.toLocaleString('id-ID');
                }
            }, 30);
        });
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.disconnect();
            }
        }, { threshold: 0.2 });
        const firstCounter = document.querySelector('.counter-num');
        if (firstCounter) observer.observe(firstCounter);
    } else {
        startCounters();
    }
});

// Trade In lookup DB
const tradeInDatabase = [
    { keywords: ['samsung s24 ultra','galaxy s24 ultra'], name: 'Samsung Galaxy S24 Ultra', min: 9500000, max: 11000000 },
    { keywords: ['samsung s24+','galaxy s24+'], name: 'Samsung Galaxy S24+', min: 8000000, max: 9500000 },
    { keywords: ['samsung s24','galaxy s24'], name: 'Samsung Galaxy S24', min: 7000000, max: 8500000 },
    { keywords: ['iphone 15 pro max'], name: 'iPhone 15 Pro Max', min: 14000000, max: 17000000 },
    { keywords: ['iphone 15 pro'], name: 'iPhone 15 Pro', min: 12000000, max: 15000000 },
    { keywords: ['iphone 14 pro max'], name: 'iPhone 14 Pro Max', min: 11000000, max: 13500000 },
    { keywords: ['iphone 11'], name: 'iPhone 11', min: 2500000, max: 3500000 },
    { keywords: ['xiaomi 14'], name: 'Xiaomi 14', min: 5500000, max: 7000000 },
    { keywords: ['oppo reno 11 pro'], name: 'OPPO Reno 11 Pro', min: 3500000, max: 4500000 },
    { keywords: ['vivo v30 pro'], name: 'vivo V30 Pro', min: 3200000, max: 4200000 },
];

function formatRp(num) {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

let searchTimer = null;
function checkTradeInPrice() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const input = document.getElementById('trade-in-input').value.trim().toLowerCase();
        const resultBox = document.getElementById('trade-in-result');
        const notFoundBox = document.getElementById('trade-in-notfound');

        resultBox.classList.add('hidden');
        notFoundBox.classList.add('hidden');

        if (input.length < 3) return;

        const found = tradeInDatabase.find(item =>
            item.keywords.some(kw => input.includes(kw) || kw.includes(input))
        );

        if (found) {
            document.getElementById('result-name').textContent = found.name;
            document.getElementById('result-price').textContent = formatRp(found.min) + ' — ' + formatRp(found.max);
            resultBox.classList.remove('hidden');
        } else {
            notFoundBox.classList.remove('hidden');
        }
    }, 300);
}

function triggerCardModal(el, event) {
    if (event) event.stopPropagation();
    const card = el.closest('.product-card');
    if (!card) return;
    try {
        const product = typeof card.dataset.product === 'string' ? JSON.parse(card.dataset.product) : card.dataset.product;
        const imageUrl = card.dataset.image || '';
        openHomeDetailModal(product, imageUrl);
    } catch(e) {
        console.error('Error opening product modal:', e);
    }
}

function openHomeDetailModal(product, imageUrl) {
    document.getElementById('home-detail-icon').innerText = product.icon || '📱';
    document.getElementById('home-detail-name').innerText = product.name;
    document.getElementById('home-detail-category-badge').innerText = (product.category || 'smartphone').toUpperCase();
    document.getElementById('home-detail-price').innerText = 'Rp ' + Number(product.price).toLocaleString('id-ID');
    document.getElementById('home-detail-stock').innerText = product.stock > 0 ? product.stock + ' Unit Tersedia' : 'Stok Habis';
    document.getElementById('home-detail-description').innerText = product.description || 'Produk original bergaransi resmi dari TECHCELL NexusCenter.';
    
    const rating = product.rating ? Number(product.rating).toFixed(1) : '4.9';
    const reviews = product.review_count || 128;
    document.getElementById('home-detail-rating-text').innerText = `${rating} ★ (${reviews} ulasan)`;

    const imgContainer = document.getElementById('home-detail-image-container');
    const imgEl = document.getElementById('home-detail-image');
    if (imageUrl) {
        imgEl.src = imageUrl;
        imgEl.alt = product.name;
        imgContainer.classList.remove('hidden');
        document.getElementById('home-detail-icon').style.display = 'none';
    } else {
        imgContainer.classList.add('hidden');
        document.getElementById('home-detail-icon').style.display = '';
    }

    if (product.name.includes('S24 Ultra')) {
        document.getElementById('home-spec-chipset').innerText = 'Snapdragon 8 Gen 3 (4nm)';
        document.getElementById('home-spec-camera').innerText = '200MP Quad AI Camera';
        document.getElementById('home-spec-display').innerText = '6.8" Dynamic AMOLED 2X 120Hz';
        document.getElementById('home-spec-battery').innerText = '5000mAh 45W Super Fast';
    } else if (product.name.includes('iPhone 15')) {
        document.getElementById('home-spec-chipset').innerText = 'Apple A17 Pro Bionic';
        document.getElementById('home-spec-camera').innerText = '48MP Main + 3x Telephoto';
        document.getElementById('home-spec-display').innerText = 'Super Retina XDR OLED';
        document.getElementById('home-spec-battery').innerText = 'All-Day Fast Charging';
    } else if (product.category === 'smartphone') {
        document.getElementById('home-spec-chipset').innerText = 'Octa-Core Pro Processor';
        document.getElementById('home-spec-camera').innerText = '50MP Ultra-Clear Camera';
        document.getElementById('home-spec-display').innerText = 'FHD+ AMOLED 120Hz Display';
        document.getElementById('home-spec-battery').innerText = '5000mAh 67W Turbo Charge';
    } else {
        document.getElementById('home-spec-chipset').innerText = 'Original Genuine Chip';
        document.getElementById('home-spec-camera').innerText = 'High Durability Build';
        document.getElementById('home-spec-display').innerText = 'Official Brand Certified';
        document.getElementById('home-spec-battery').innerText = 'Low Power Efficiency';
    }

    const cartForm = document.getElementById('home-detail-cart-form');
    cartForm.action = `/keranjang/tambah/${product.id}`;

    const reviewForm = document.getElementById('home-review-form');
    if (reviewForm) {
        reviewForm.action = `/produk/${product.id}/ulasan`;
    }

    document.getElementById('home-detail-modal').classList.remove('hidden');
}

function closeHomeDetailModal() {
    document.getElementById('home-detail-modal').classList.add('hidden');
}
</script>
@endpush
@endsection
