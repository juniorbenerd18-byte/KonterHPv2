@extends('layouts.app')
@section('title', 'TECHCELL — Halaman Utama')

@section('content')
<div class="fade-in">
    <!-- Hero Section -->
    <section class="relative bg-primary-container text-on-primary-container overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40 px-margin-mobile md:px-margin-desktop">
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 50%, #4cd7f6 10%, transparent 20%); background-size: 40px 40px;"></div>
        <div class="max-w-container-max-width mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center relative z-10">
            <div class="md:col-span-6 flex flex-col items-start gap-6">
                <span class="font-mono text-xs text-secondary-fixed uppercase tracking-widest bg-secondary/20 px-3 py-1 rounded-full border border-secondary/30">
                    🏪 TECHCELL NexusCenter — Palembang
                </span>
                <h1 class="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
                    Pusat Smartphone &amp; <br><span class="text-secondary-fixed-dim">Servis HP Terpercaya.</span>
                </h1>
                <p class="font-body text-base text-inverse-primary max-w-md leading-relaxed">
                    Temukan smartphone terbaru, aksesoris original, isi pulsa &amp; data, hingga servis HP profesional dengan teknisi bersertifikat — semua dalam satu tempat. Belanja mudah, antar ke rumah, harga transparan.
                </p>
                <div class="flex flex-wrap gap-3 mt-2">
                    <div class="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono text-secondary-fixed-dim">
                        <span class="material-symbols-outlined text-sm">smartphone</span> Smartphone Original
                    </div>
                    <div class="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono text-secondary-fixed-dim">
                        <span class="material-symbols-outlined text-sm">build</span> Servis Bergaransi
                    </div>
                    <div class="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono text-secondary-fixed-dim">
                        <span class="material-symbols-outlined text-sm">two_wheeler</span> Antar ke Rumah
                    </div>
                </div>
                <div class="flex items-center gap-4 mt-2 flex-wrap">
                    <a href="{{ route('products.index', ['category' => 'smartphone']) }}" class="bg-secondary text-white px-8 py-4 font-mono text-xs font-bold rounded-lg hover:bg-secondary/90 transition-colors shadow-[0_0_15px_rgba(0,104,122,0.5)] active:scale-95">
                        Lihat Produk
                    </a>
                    <a href="{{ route('services.booking') }}" class="bg-transparent text-secondary-fixed border-2 border-secondary-fixed px-8 py-4 font-mono text-xs font-bold rounded-lg hover:bg-secondary-fixed/10 transition-colors">
                        Booking Servis
                    </a>
                </div>
            </div>
            <div class="md:col-span-6 mt-12 md:mt-0 relative flex justify-center">
                <div class="absolute inset-0 bg-secondary-fixed/20 blur-[100px] rounded-full w-[300px] h-[300px] md:w-[500px] md:h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <!-- Stats Cards floating -->
                <div class="relative z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                        <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">smartphone</span>
                        <p class="font-display font-extrabold text-2xl text-white">500+</p>
                        <p class="font-mono text-xs text-gray-300">Produk Tersedia</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                        <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">build_circle</span>
                        <p class="font-display font-extrabold text-2xl text-white">1.200+</p>
                        <p class="font-mono text-xs text-gray-300">Servis Selesai</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                        <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">star</span>
                        <p class="font-display font-extrabold text-2xl text-white">4.9★</p>
                        <p class="font-mono text-xs text-gray-300">Rating Pelanggan</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2">
                        <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">two_wheeler</span>
                        <p class="font-display font-extrabold text-2xl text-white">Free</p>
                        <p class="font-mono text-xs text-gray-300">Ongkir &lt; 4 km</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Bento Grid -->
    <section class="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div class="max-w-container-max-width mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
                <a class="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 p-6 flex flex-col items-center justify-center gap-4 rounded-xl hover:border-secondary transition-all hover:shadow-[0_4px_20px_rgba(0,104,122,0.08)]" href="{{ route('products.index', ['category' => 'smartphone']) }}">
                    <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                        <span class="material-symbols-outlined text-secondary text-3xl">smartphone</span>
                    </div>
                    <span class="font-mono text-sm font-bold text-on-surface">Smartphone</span>
                </a>
                <a class="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 p-6 flex flex-col items-center justify-center gap-4 rounded-xl hover:border-secondary transition-all hover:shadow-[0_4px_20px_rgba(0,104,122,0.08)]" href="{{ route('products.index', ['category' => 'aksesoris']) }}">
                    <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                        <span class="material-symbols-outlined text-secondary text-3xl">headphones</span>
                    </div>
                    <span class="font-mono text-sm font-bold text-on-surface">Aksesoris</span>
                </a>
                <a class="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 p-6 flex flex-col items-center justify-center gap-4 rounded-xl hover:border-secondary transition-all hover:shadow-[0_4px_20px_rgba(0,104,122,0.08)]" href="{{ route('pulsa.index') }}">
                    <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                        <span class="material-symbols-outlined text-secondary text-3xl">sim_card</span>
                    </div>
                    <span class="font-mono text-sm font-bold text-on-surface">Pulsa & Data</span>
                </a>
                <a class="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 p-6 flex flex-col items-center justify-center gap-4 rounded-xl hover:border-secondary transition-all hover:shadow-[0_4px_20px_rgba(0,104,122,0.08)]" href="{{ route('services.track') }}">
                    <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                        <span class="material-symbols-outlined text-secondary text-3xl">build</span>
                    </div>
                    <span class="font-mono text-sm font-bold text-on-surface">Servis HP</span>
                </a>
            </div>
        </div>
    </section>

    <!-- Popular Products Section -->
    <section class="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div class="max-w-container-max-width mx-auto">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <h2 class="font-display font-bold text-3xl text-on-surface mb-2">Produk Terpopuler</h2>
                    <p class="text-sm text-on-surface-variant">Pilihan terbaik untuk kebutuhan digital Anda.</p>
                </div>
                <a class="hidden md:flex items-center gap-2 font-mono text-xs font-bold text-secondary hover:text-secondary/80 transition-colors" href="{{ route('products.index') }}">
                    Lihat Semua <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
                @foreach($products as $product)
                <div class="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden hover:border-secondary transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,104,122,0.12)] relative flex flex-col h-full">
                    <div class="absolute top-3 left-3 bg-error text-white font-mono text-[10px] font-bold px-2 py-1 rounded z-10">Promo</div>
                    <form method="POST" action="{{ route('cart.add', $product) }}" class="absolute top-3 right-3 z-10">
                        @csrf
                        <button type="submit" class="text-on-surface-variant hover:text-secondary bg-surface-container-lowest/80 backdrop-blur p-1.5 rounded-full shadow-sm" title="Tambah ke Keranjang">
                            <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                    </form>
                    <div class="p-6 bg-surface-container-low flex justify-center items-center h-48 md:h-64 relative overflow-hidden">
                        @if($product->image)
                            <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}"
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        @else
                            <span class="text-6xl group-hover:scale-105 transition-transform duration-500">{{ $product->icon }}</span>
                        @endif
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="flex items-center gap-1 mb-2">
                            <span class="material-symbols-outlined text-amber-500 icon-filled text-[16px]">star</span>
                            <span class="font-mono text-xs text-on-surface-variant">4.9 (120 ulasan)</span>
                        </div>
                        <h3 class="font-display text-base font-semibold text-on-surface mb-1 flex-grow line-clamp-2">{{ $product->name }}</h3>
                        <div class="mt-4">
                            <p class="font-mono text-xs text-outline line-through mb-1">Rp {{ number_format($product->price * 1.1, 0, ',', '.') }}</p>
                            <p class="font-mono font-bold text-secondary text-lg">{{ $product->formatted_price }}</p>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Special Banner Section (Tukar Tambah & Servis Kilat) -->
    <section class="py-24 px-margin-mobile md:px-margin-desktop bg-background">
        <div class="max-w-container-max-width mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <!-- Tukar Tambah / Cek Harga HP Lama -->
                <div class="bg-primary-container text-on-primary-container rounded-2xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[400px] border border-outline-variant/10">
                    <div class="absolute inset-0 bg-gradient-to-br from-primary-container to-tertiary-container z-0"></div>
                    <div class="absolute top-0 right-0 p-8 opacity-20 z-0">
                        <span class="material-symbols-outlined text-white" style="font-size: 120px;">autorenew</span>
                    </div>
                    <div class="relative z-10 space-y-5">
                        <span class="inline-block px-3 py-1 bg-secondary/20 text-secondary-fixed font-mono text-xs rounded mb-2 border border-secondary/30">Program Tukar Tambah</span>
                        <h3 class="font-display font-bold text-2xl text-white">Cek Harga HP Lama Kamu</h3>
                        <p class="font-body text-sm text-on-primary-container leading-relaxed">Ketik nama HP lama kamu di bawah ini dan dapatkan estimasi harga tukar tambah terbaik dari TECHCELL NexusCenter.</p>

                        <!-- Interactive Price Checker -->
                        <div class="space-y-3" id="trade-in-checker">
                            <div class="flex gap-2">
                                <input type="text" id="trade-in-input" placeholder="Contoh: Samsung Galaxy A52, iPhone 11..."
                                    class="flex-1 bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm font-mono px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-fixed backdrop-blur-sm"
                                    oninput="checkTradeInPrice()">
                                <button onclick="checkTradeInPrice()" class="bg-secondary text-white px-4 py-3 rounded-xl font-mono text-xs font-bold hover:bg-secondary/90 transition-all shrink-0">
                                    <span class="material-symbols-outlined text-base">search</span>
                                </button>
                            </div>

                            <!-- Result Box -->
                            <div id="trade-in-result" class="hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-2 transition-all">
                                <div class="flex items-center justify-between">
                                    <p class="font-mono text-xs text-secondary-fixed">ESTIMASI HARGA TUKAR TAMBAH:</p>
                                    <span id="result-badge" class="text-[10px] font-mono bg-secondary/30 text-secondary-fixed-dim px-2 py-0.5 rounded-full border border-secondary/30">Perkiraan</span>
                                </div>
                                <p id="result-name" class="font-display font-bold text-white text-sm"></p>
                                <p id="result-price" class="font-mono font-extrabold text-secondary-fixed-dim text-2xl"></p>
                                <p class="font-mono text-[11px] text-white/60">*Harga final ditentukan setelah pengecekan fisik di toko. Bawa HP ke TECHCELL NexusCenter untuk penawaran resmi.</p>
                                <a href="{{ route('services.booking') }}" class="inline-flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-lg font-mono text-xs font-bold hover:bg-secondary/90 transition-all mt-1">
                                    <span class="material-symbols-outlined text-sm">autorenew</span> Booking Tukar Tambah
                                </a>
                            </div>

                            <!-- Not Found Box -->
                            <div id="trade-in-notfound" class="hidden bg-white/10 border border-white/20 rounded-xl p-3 text-xs font-mono text-white/70">
                                HP tidak ditemukan di daftar kami. Silakan datang langsung ke toko untuk penilaian gratis.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Servis Kilat -->
                <div class="bg-surface-container-high rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px] border border-outline-variant/30">
                    <div class="absolute top-0 right-0 p-8 opacity-10 z-0">
                        <span class="material-symbols-outlined text-secondary" style="font-size: 120px;">build</span>
                    </div>
                    <div class="relative z-10 max-w-sm">
                        <span class="inline-block px-3 py-1 bg-secondary/10 text-secondary font-mono text-xs rounded mb-4 border border-secondary/20">Layanan Ahli</span>
                        <h3 class="font-display font-bold text-2xl text-on-surface mb-4">Servis Kilat 1 Jam</h3>
                        <p class="font-body text-base text-on-surface-variant mb-8 leading-relaxed">Layar pecah? Baterai drop? Teknisi bersertifikat kami siap memperbaiki HP Anda dengan sparepart original, bisa ditunggu.</p>
                        <a href="{{ route('services.booking') }}" class="inline-block bg-transparent text-primary border-2 border-primary px-6 py-3 font-mono text-xs font-bold rounded hover:bg-primary hover:text-white transition-colors w-fit shadow-sm">
                            Booking Servis
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

@push('scripts')
<script>
const tradeInDatabase = [
    // Samsung
    { keywords: ['samsung s24 ultra','galaxy s24 ultra'], name: 'Samsung Galaxy S24 Ultra', min: 9500000, max: 11000000 },
    { keywords: ['samsung s24+','galaxy s24+'], name: 'Samsung Galaxy S24+', min: 8000000, max: 9500000 },
    { keywords: ['samsung s24','galaxy s24'], name: 'Samsung Galaxy S24', min: 7000000, max: 8500000 },
    { keywords: ['samsung s23 ultra','galaxy s23 ultra'], name: 'Samsung Galaxy S23 Ultra', min: 7500000, max: 9000000 },
    { keywords: ['samsung s23','galaxy s23'], name: 'Samsung Galaxy S23', min: 5500000, max: 7000000 },
    { keywords: ['samsung a55','galaxy a55'], name: 'Samsung Galaxy A55', min: 2800000, max: 3500000 },
    { keywords: ['samsung a54','galaxy a54'], name: 'Samsung Galaxy A54', min: 2500000, max: 3200000 },
    { keywords: ['samsung a52','galaxy a52'], name: 'Samsung Galaxy A52', min: 1800000, max: 2400000 },
    { keywords: ['samsung a35','galaxy a35'], name: 'Samsung Galaxy A35', min: 2200000, max: 2800000 },
    { keywords: ['samsung a34','galaxy a34'], name: 'Samsung Galaxy A34', min: 1800000, max: 2400000 },
    { keywords: ['samsung a25','galaxy a25'], name: 'Samsung Galaxy A25', min: 1600000, max: 2100000 },
    { keywords: ['samsung a15','galaxy a15'], name: 'Samsung Galaxy A15', min: 1000000, max: 1500000 },
    { keywords: ['samsung m14','galaxy m14'], name: 'Samsung Galaxy M14', min: 900000, max: 1300000 },
    // iPhone
    { keywords: ['iphone 15 pro max'], name: 'iPhone 15 Pro Max', min: 14000000, max: 17000000 },
    { keywords: ['iphone 15 pro'], name: 'iPhone 15 Pro', min: 12000000, max: 15000000 },
    { keywords: ['iphone 15 plus'], name: 'iPhone 15 Plus', min: 10000000, max: 12500000 },
    { keywords: ['iphone 15'], name: 'iPhone 15', min: 9000000, max: 11500000 },
    { keywords: ['iphone 14 pro max'], name: 'iPhone 14 Pro Max', min: 11000000, max: 13500000 },
    { keywords: ['iphone 14 pro'], name: 'iPhone 14 Pro', min: 9500000, max: 12000000 },
    { keywords: ['iphone 14'], name: 'iPhone 14', min: 8000000, max: 10000000 },
    { keywords: ['iphone 13 pro max'], name: 'iPhone 13 Pro Max', min: 8500000, max: 10500000 },
    { keywords: ['iphone 13 pro'], name: 'iPhone 13 Pro', min: 7500000, max: 9500000 },
    { keywords: ['iphone 13'], name: 'iPhone 13', min: 6000000, max: 7500000 },
    { keywords: ['iphone 12 pro max'], name: 'iPhone 12 Pro Max', min: 6000000, max: 7500000 },
    { keywords: ['iphone 12 pro'], name: 'iPhone 12 Pro', min: 5000000, max: 6500000 },
    { keywords: ['iphone 12'], name: 'iPhone 12', min: 4000000, max: 5500000 },
    { keywords: ['iphone 11 pro max'], name: 'iPhone 11 Pro Max', min: 3500000, max: 4500000 },
    { keywords: ['iphone 11 pro'], name: 'iPhone 11 Pro', min: 3000000, max: 4000000 },
    { keywords: ['iphone 11'], name: 'iPhone 11', min: 2500000, max: 3500000 },
    { keywords: ['iphone xr','iphone x r'], name: 'iPhone XR', min: 1800000, max: 2500000 },
    { keywords: ['iphone xs max'], name: 'iPhone XS Max', min: 2000000, max: 2800000 },
    { keywords: ['iphone xs'], name: 'iPhone XS', min: 1700000, max: 2300000 },
    // Xiaomi
    { keywords: ['xiaomi 14 ultra'], name: 'Xiaomi 14 Ultra', min: 7000000, max: 9000000 },
    { keywords: ['xiaomi 14'], name: 'Xiaomi 14', min: 5500000, max: 7000000 },
    { keywords: ['xiaomi 13t pro'], name: 'Xiaomi 13T Pro', min: 4500000, max: 6000000 },
    { keywords: ['xiaomi 13t'], name: 'Xiaomi 13T', min: 3500000, max: 5000000 },
    { keywords: ['redmi note 13 pro'], name: 'Redmi Note 13 Pro', min: 2200000, max: 3000000 },
    { keywords: ['redmi note 13'], name: 'Redmi Note 13', min: 1600000, max: 2200000 },
    { keywords: ['redmi note 12'], name: 'Redmi Note 12', min: 1300000, max: 1800000 },
    { keywords: ['poco x6 pro'], name: 'POCO X6 Pro', min: 2500000, max: 3200000 },
    { keywords: ['poco x6'], name: 'POCO X6', min: 1800000, max: 2500000 },
    { keywords: ['poco x5 pro'], name: 'POCO X5 Pro', min: 1800000, max: 2500000 },
    // Oppo
    { keywords: ['oppo reno 11 pro'], name: 'OPPO Reno 11 Pro', min: 3500000, max: 4500000 },
    { keywords: ['oppo reno 11'], name: 'OPPO Reno 11', min: 2800000, max: 3600000 },
    { keywords: ['oppo reno 10 pro'], name: 'OPPO Reno 10 Pro', min: 3000000, max: 3800000 },
    { keywords: ['oppo reno 10'], name: 'OPPO Reno 10', min: 2300000, max: 3000000 },
    { keywords: ['oppo a78'], name: 'OPPO A78', min: 1500000, max: 2000000 },
    { keywords: ['oppo a58'], name: 'OPPO A58', min: 1200000, max: 1700000 },
    // Vivo
    { keywords: ['vivo v30 pro'], name: 'vivo V30 Pro', min: 3200000, max: 4200000 },
    { keywords: ['vivo v30'], name: 'vivo V30', min: 2500000, max: 3300000 },
    { keywords: ['vivo y100'], name: 'vivo Y100', min: 1800000, max: 2400000 },
    { keywords: ['vivo y36'], name: 'vivo Y36', min: 1400000, max: 1900000 },
    // Realme
    { keywords: ['realme gt 5'], name: 'Realme GT 5', min: 3000000, max: 4000000 },
    { keywords: ['realme c55'], name: 'Realme C55', min: 1200000, max: 1700000 },
    // Google Pixel
    { keywords: ['pixel 8 pro'], name: 'Google Pixel 8 Pro', min: 7000000, max: 9000000 },
    { keywords: ['pixel 8'], name: 'Google Pixel 8', min: 5500000, max: 7000000 },
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
</script>
@endpush

@endsection
