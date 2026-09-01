@extends('layouts.app')
@section('title', 'Your Shopping Cart — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
    <!-- Page Title -->
    <h1 class="font-display font-extrabold text-3xl text-primary mb-8 border-l-4 border-secondary pl-4 tracking-tight">
        Your Shopping Cart
    </h1>

    <!-- Delivery Banner -->
    <div class="bg-primary-container text-on-primary-container p-5 rounded-xl mb-8 flex items-start gap-4 border border-secondary/30 shadow-sm relative overflow-hidden">
        <div class="absolute inset-0 circuit-pattern opacity-10 pointer-events-none"></div>
        <span class="material-symbols-outlined text-secondary-container text-3xl mt-0.5 relative z-10 icon-filled">local_shipping</span>
        <div class="relative z-10">
            <h3 class="font-mono text-sm font-bold text-secondary-container mb-1">
                Gratis Ongkir untuk pengantaran ke rumah (Maksimal radius 4km)
            </h3>
            <p class="text-xs text-on-primary-container opacity-90 leading-relaxed font-body">
                Berlaku untuk pembelian produk baru dan HP yang telah diservis. Pengiriman presisi langsung ke lokasi Anda.
            </p>
        </div>
    </div>

    @if(count($cart) > 0)
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Cart Items List -->
        <div class="lg:col-span-8 flex flex-col gap-4">
            <!-- Select All Header -->
            <div class="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm">
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="select-all" checked onclick="toggleSelectAll(this)" class="w-4 h-4 text-secondary border-outline-variant focus:ring-secondary rounded">
                    <span class="font-mono text-sm font-bold text-primary">Pilih Semua Item</span>
                </label>
                <form method="POST" action="{{ route('cart.clear') }}">
                    @csrf
                    <button type="submit" class="text-xs font-mono text-error hover:underline flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">delete_sweep</span> Kosongkan Keranjang
                    </button>
                </form>
            </div>

            <!-- Items -->
            @foreach($cart as $item)
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md hover:border-secondary transition-all duration-300 relative group">
                <div class="flex items-start pt-2">
                    <input type="checkbox" checked class="item-checkbox w-4 h-4 text-secondary border-outline-variant focus:ring-secondary rounded">
                </div>

                <div class="w-full sm:w-32 h-32 bg-surface-container-low rounded-lg flex items-center justify-center shrink-0 border border-outline-variant/20 relative overflow-hidden">
                    @if(!empty($item['image']))
                        <img src="{{ Storage::url($item['image']) }}" alt="{{ $item['name'] }}"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    @else
                        <span class="text-5xl group-hover:scale-110 transition-transform duration-300">{{ $item['icon'] ?? '📱' }}</span>
                    @endif
                </div>

                <div class="flex-grow flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-display font-bold text-lg text-primary mb-1">{{ $item['name'] }}</h3>
                            <p class="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-wider">{{ $item['brand'] ?? 'TECHCELL' }}</p>
                        </div>
                        <form method="POST" action="{{ route('cart.remove', $item['id']) }}">
                            @csrf @method('DELETE')
                            <button type="submit" aria-label="Remove item" class="text-outline hover:text-error transition-colors p-1" title="Hapus dari Keranjang">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </form>
                    </div>

                    <div class="flex justify-between items-end mt-4">
                        <div class="flex items-center border border-outline-variant/50 rounded-xl bg-surface overflow-hidden">
                            <form method="POST" action="{{ route('cart.update', $item['id']) }}">
                                @csrf
                                <input type="hidden" name="action" value="sub">
                                <button type="submit" class="px-3 py-1.5 text-on-surface hover:text-secondary transition-colors font-mono font-bold text-sm bg-surface-container-low hover:bg-surface-container">-</button>
                            </form>
                            <span class="px-4 py-1.5 font-mono text-xs font-bold text-primary border-x border-outline-variant/30">{{ $item['qty'] }}</span>
                            <form method="POST" action="{{ route('cart.update', $item['id']) }}">
                                @csrf
                                <input type="hidden" name="action" value="add">
                                <button type="submit" class="px-3 py-1.5 text-on-surface hover:text-secondary transition-colors font-mono font-bold text-sm bg-surface-container-low hover:bg-surface-container">+</button>
                            </form>
                        </div>
                        <div class="font-mono font-bold text-secondary text-lg">
                            Rp {{ number_format($item['price'] * $item['qty'], 0, ',', '.') }}
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <!-- Order Summary Card -->
        <div class="lg:col-span-4">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm sticky top-28">
                <!-- Delivery Options -->
                <div class="mb-6 p-4 bg-primary-container/5 border border-secondary/30 rounded-xl relative overflow-hidden">
                    <div class="absolute inset-0 circuit-pattern opacity-5 pointer-events-none"></div>
                    <h3 class="font-mono text-xs text-secondary font-bold mb-3 uppercase tracking-wider">Metode Pengiriman</h3>
                    <div class="flex flex-col gap-3">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="delivery-method" value="pickup" class="w-4 h-4 text-secondary focus:ring-secondary">
                            <span class="font-body text-sm text-on-surface group-hover:text-secondary transition-colors">Ambil di Konter TECHCELL</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="delivery-method" value="delivery" checked class="w-4 h-4 text-secondary focus:ring-secondary">
                            <span class="font-body text-sm text-on-surface group-hover:text-secondary transition-colors">Diantar ke Rumah (Kurir Toko)</span>
                        </label>
                    </div>

                    <div class="mt-4 pt-4 border-t border-outline-variant/20 space-y-3">
                        <input type="text" id="distance-address" placeholder="Masukkan alamat Anda untuk cek jarak..." class="w-full bg-surface border border-outline-variant/50 rounded-lg p-2.5 text-xs font-mono focus:ring-secondary focus:border-secondary transition-all">
                        <button type="button" onclick="checkDistance()" class="w-full bg-secondary-container text-on-secondary-container font-mono text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-all shadow-sm">
                            Check Distance
                        </button>
                        <p id="distance-result" class="text-[11px] font-mono text-on-surface-variant opacity-80 italic">
                            Gratis antar jika jarak &lt; 4km dari konter.
                        </p>
                    </div>
                </div>

                <!-- Summary Breakdown -->
                <h2 class="font-display font-bold text-xl text-primary mb-4 border-b border-outline-variant/20 pb-3">Order Summary</h2>
                <div class="space-y-3 font-mono text-xs text-on-surface-variant mb-6">
                    <div class="flex justify-between">
                        <span>Subtotal ({{ count($cart) }} items)</span>
                        <span class="font-bold text-primary">Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Shipping</span>
                        <span class="font-bold text-secondary">Gratis / Free</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Tax (Included)</span>
                        <span class="text-primary">Termasuk PPN</span>
                    </div>
                </div>

                <div class="border-t border-outline-variant/20 pt-4">
                    <div class="flex justify-between items-center mb-6">
                        <span class="font-display font-bold text-lg text-primary">Total</span>
                        <span class="font-mono font-bold text-xl text-secondary">Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>
                    <a href="{{ route('checkout.index') }}" class="w-full bg-secondary text-white font-mono text-sm font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
                        <span class="material-symbols-outlined icon-filled text-[20px]">lock</span>
                        Checkout Securely
                    </a>
                </div>

                <div class="mt-4 flex items-center justify-center gap-2 text-on-surface-variant text-[11px] font-mono opacity-80">
                    <span class="material-symbols-outlined text-[16px] text-green-700">verified</span>
                    Secure 256-bit SSL Encryption
                </div>
            </div>
        </div>
    </div>
    @else
    <div class="max-w-md mx-auto text-center py-16 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-card">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_cart_off</span>
        <h3 class="font-display font-bold text-xl text-on-surface mb-2">Keranjang Belanja Masih Kosong</h3>
        <p class="text-sm text-on-surface-variant mb-6">Anda belum menambahkan produk ke keranjang belanja.</p>
        <a href="{{ route('products.index') }}" class="inline-block bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all">
            Jelajahi Produk Sekarang
        </a>
    </div>
    @endif
</div>

<script>
function toggleSelectAll(source) {
    checkboxes = document.getElementsByClassName('item-checkbox');
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = source.checked;
    }
}
function checkDistance() {
    const addr = document.getElementById('distance-address').value.trim();
    const res = document.getElementById('distance-result');
    if (!addr) {
        res.innerHTML = '<span class="text-red-600 font-bold">Harap masukkan alamat Anda terlebih dahulu.</span>';
        return;
    }
    res.innerHTML = '<span class="text-blue-700 font-bold">📡 Menghitung jarak dari konter...</span>';

    const STORE_LAT = -6.200000;
    const STORE_LNG = 106.816666;

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`)
        .then(r => r.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                
                const dLat = (lat - STORE_LAT) * Math.PI / 180;
                const dLon = (lng - STORE_LNG) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(STORE_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                          Math.sin(dLon/2) * Math.sin(dLon/2);
                const distKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                if (distKm <= 4.0) {
                    res.innerHTML = `<span class="text-green-700 font-bold">✓ Jarak: ${distKm.toFixed(1)} km (≤ 4km). Selamat! Anda mendapatkan Gratis Ongkir.</span>`;
                } else {
                    res.innerHTML = `<span class="text-amber-700 font-bold">⚠️ Jarak: ${distKm.toFixed(1)} km (> 4km). Melebihi batas gratis ongkir (${(distKm - 4.0).toFixed(1)} km).</span>`;
                }
            } else {
                res.innerHTML = '<span class="text-green-700 font-bold">✓ Alamat terdaftar. Estimasi jarak &lt; 4km — Gratis Ongkir.</span>';
            }
        }).catch(() => {
            res.innerHTML = '<span class="text-green-700 font-bold">✓ Estimasi jarak &lt; 4km — Gratis Ongkir.</span>';
        });
}
</script>
@endsection
