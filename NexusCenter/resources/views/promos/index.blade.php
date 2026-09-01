@extends('layouts.app')
@section('title', 'Promo Spesial — TECHCELL NexusCenter')

@section('content')
<div class="fade-in">
    <!-- Hero Banner Promo -->
    <section class="relative w-full py-20 md:py-32 flex items-center justify-center overflow-hidden bg-primary circuit-pattern text-white">
        <div class="absolute inset-0 bg-gradient-to-r from-primary via-primary-container/90 to-transparent z-10"></div>
        <div class="relative z-20 max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop w-full text-center md:text-left">
            <span class="inline-block px-4 py-1.5 mb-4 border border-secondary text-secondary-fixed font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-sm bg-secondary/20 rounded-full">
                ⚡ Promo Guncang Teknologi 2026
            </span>
            <h1 class="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 tracking-tight leading-tight max-w-2xl">
                Diskon Eksklusif Smartphone & Aksesoris
            </h1>
            <p class="font-body text-inverse-primary text-base md:text-lg max-w-xl mb-8 leading-relaxed">
                Tingkatkan pengalaman digital Anda dengan penawaran harga terbaik tahun ini. Potongan langsung dan garansi resmi toko.
            </p>
            <a href="#flash-sale" class="inline-block bg-secondary text-white font-mono text-sm font-bold px-8 py-3.5 rounded-lg uppercase tracking-wider hover:bg-secondary/90 transition-all shadow-[0_0_20px_rgba(0,104,122,0.4)] active:scale-95">
                Lihat Penawaran Flash Sale
            </a>
        </div>
    </section>

    <!-- Section: Flash Sale -->
    <section id="flash-sale" class="py-16 bg-surface-container-lowest border-b border-outline-variant/20 relative overflow-hidden">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h2 class="font-display font-bold text-2xl md:text-3xl text-on-surface flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary icon-filled text-3xl">bolt</span>
                        Flash Sale Terbatas
                    </h2>
                    <p class="text-sm text-on-surface-variant mt-1">Dapatkan diskon khusus hingga 30% untuk produk terpilih hari ini.</p>
                </div>
                <div class="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30">
                    <span class="font-mono text-xs text-on-surface-variant font-bold uppercase">Berakhir dalam:</span>
                    <div class="flex gap-1.5 font-mono font-bold text-sm text-secondary">
                        <span class="bg-surface-container-highest px-2 py-1 rounded">04</span>:
                        <span class="bg-surface-container-highest px-2 py-1 rounded">28</span>:
                        <span class="bg-surface-container-highest px-2 py-1 rounded">15</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @foreach($flashSales as $product)
                <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 relative group transition-all duration-300 hover:border-secondary hover:shadow-lg flex flex-col justify-between">
                    <div class="absolute top-4 left-4 bg-error text-white font-mono text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
                        PROMO
                    </div>
                    <div class="h-48 relative mb-4 flex items-center justify-center bg-surface-container-low rounded-xl">
                        <span class="text-6xl group-hover:scale-110 transition-transform duration-300">{{ $product->icon }}</span>
                    </div>
                    <div>
                        <span class="text-xs font-mono text-on-surface-variant uppercase">{{ $product->brand ?? 'TECHCELL' }}</span>
                        <h3 class="font-display font-bold text-base text-on-surface mb-2 line-clamp-1">{{ $product->name }}</h3>
                        <p class="font-mono text-xs text-outline line-through mb-1">
                            Rp {{ number_format($product->price * 1.15, 0, ',', '.') }}
                        </p>
                        <p class="font-mono font-bold text-lg text-secondary mb-4">
                            {{ $product->formatted_price }}
                        </p>
                        <a href="{{ route('products.index') }}" class="block text-center w-full bg-secondary text-white font-mono text-xs font-bold py-2.5 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
                            Beli Sekarang
                        </a>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Special Promo Grid -->
    <section class="py-16 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
        <div class="max-w-container-max-width mx-auto">
            <h2 class="font-display font-bold text-2xl text-on-surface mb-8 text-center">Semua Promo Aktif</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @foreach($promos as $item)
                <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center font-bold text-2xl">
                            {{ $item->icon }}
                        </div>
                        <div>
                            <h4 class="font-display font-bold text-base text-on-surface">{{ $item->name }}</h4>
                            <span class="text-xs font-mono text-secondary font-semibold">Voucher Diskon Tersedia</span>
                        </div>
                    </div>
                    <p class="text-xs text-on-surface-variant mb-4 leading-relaxed">{{ $item->description }}</p>
                    <div class="flex items-center justify-between border-t border-outline-variant/15 pt-4">
                        <span class="font-mono font-bold text-base text-secondary">{{ $item->formatted_price }}</span>
                        <a href="{{ route('products.index') }}" class="text-xs font-mono font-bold text-secondary hover:underline">
                            Klaim Promo &rarr;
                        </a>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>
</div>
@endsection
