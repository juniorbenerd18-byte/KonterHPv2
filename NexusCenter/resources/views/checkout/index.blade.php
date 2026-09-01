@extends('layouts.app')
@section('title', 'Checkout Pembelian — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
    <h1 class="font-display font-extrabold text-2xl md:text-3xl text-on-surface mb-8 flex items-center gap-3">
        <span class="material-symbols-outlined text-secondary text-3xl">payments</span>
        Checkout Pesanan
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <!-- Form Info Pembeli & Pembayaran -->
        <div class="lg:col-span-7">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                <h3 class="font-display font-bold text-lg text-on-surface mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary">person</span>
                    Informasi Pembeli
                </h3>

                <form method="POST" action="{{ route('checkout.process') }}" class="space-y-6">
                    @csrf
                    <div>
                        <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Nama Lengkap *</label>
                        <input type="text" name="customer_name" value="{{ old('customer_name', auth()->check() ? auth()->user()->name : '') }}" required
                            class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Masukkan nama lengkap Anda">
                    </div>

                    <div>
                        <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Nomor Telepon / WhatsApp *</label>
                        <input type="text" name="customer_phone" value="{{ old('customer_phone') }}" required
                            class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                            placeholder="Contoh: 081234567890">
                    </div>

                    <div>
                        <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Metode Pengiriman *</label>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <label class="flex items-center gap-2.5 p-3 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-secondary transition-all">
                                <input type="radio" name="delivery_type" value="delivery" checked onchange="toggleAddressBox(true)" class="text-secondary focus:ring-secondary">
                                <span class="font-mono text-xs font-bold text-on-surface flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-secondary">local_shipping</span> Diantar ke Rumah</span>
                            </label>
                            <label class="flex items-center gap-2.5 p-3 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-secondary transition-all">
                                <input type="radio" name="delivery_type" value="pickup" onchange="toggleAddressBox(false)" class="text-secondary focus:ring-secondary">
                                <span class="font-mono text-xs font-bold text-on-surface flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-primary">storefront</span> Ambil di Konter</span>
                            </label>
                        </div>
                    </div>

                    <div id="address-field-wrap">
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase">Alamat Lengkap Pengiriman *</label>
                            <button type="button" onclick="detectGPSLocation()" class="text-xs font-mono text-secondary hover:underline font-bold flex items-center gap-1">
                                <span class="material-symbols-outlined text-[16px]">my_location</span> Deteksi GPS Saya
                            </button>
                        </div>
                        <textarea name="customer_address" id="customer_address_input" rows="2" required onchange="calcDistanceByAddress()"
                            class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Jl. Raya No. XX, Kelurahan, Kecamatan, Patokan..."></textarea>
                        
                        <input type="hidden" name="customer_lat" id="customer_lat">
                        <input type="hidden" name="customer_lng" id="customer_lng">

                        {{-- Distance Badge --}}
                        <div id="distance-badge-wrap" class="mt-2 p-3 rounded-xl text-xs font-mono hidden">
                            <div id="distance-badge-content" class="flex items-center gap-2"></div>
                        </div>
                    </div>

                    <script>
                    const STORE_LAT = -6.200000;
                    const STORE_LNG = 106.816666;

                    function haversineDistance(lat1, lon1, lat2, lon2) {
                        const R = 6371; // km
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLon = (lon2 - lon1) * Math.PI / 180;
                        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                                  Math.sin(dLon/2) * Math.sin(dLon/2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        return R * c;
                    }

                    function updateDistanceUI(distKm, textLocation = '') {
                        const wrap = document.getElementById('distance-badge-wrap');
                        const content = document.getElementById('distance-badge-content');
                        wrap.classList.remove('hidden', 'bg-green-50', 'border-green-200', 'text-green-800', 'bg-amber-50', 'border-amber-200', 'text-amber-800');
                        
                        if (distKm <= 4.0) {
                            wrap.classList.add('bg-green-50', 'border', 'border-green-200', 'text-green-800');
                            content.innerHTML = `<span class="material-symbols-outlined text-green-600 text-[18px]">verified</span> 
                                <div><strong>Jarak ke Konter: ${distKm.toFixed(1)} km</strong> (≤ 4km) — <span class="font-bold text-green-700">GRATIS ONGKIR!</span></div>`;
                        } else {
                            const extraDist = (distKm - 4.0).toFixed(1);
                            wrap.classList.add('bg-amber-50', 'border', 'border-amber-200', 'text-amber-800');
                            content.innerHTML = `<span class="material-symbols-outlined text-amber-600 text-[18px]">warning</span> 
                                <div><strong>Jarak ke Konter: ${distKm.toFixed(1)} km</strong> (> 4km) — Melebihi batas ${extraDist} km. Estimasi ongkir tambahan dihitung oleh admin/kurir.</div>`;
                        }
                    }

                    function detectGPSLocation() {
                        const badge = document.getElementById('distance-badge-wrap');
                        badge.classList.remove('hidden');
                        badge.className = 'mt-2 p-3 rounded-xl text-xs font-mono bg-blue-50 border border-blue-200 text-blue-800';
                        document.getElementById('distance-badge-content').innerHTML = '📡 Mengambil koordinat GPS lokasi Anda...';

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(pos) {
                                const lat = pos.coords.latitude;
                                const lng = pos.coords.longitude;
                                document.getElementById('customer_lat').value = lat;
                                document.getElementById('customer_lng').value = lng;

                                const distKm = haversineDistance(STORE_LAT, STORE_LNG, lat, lng);
                                updateDistanceUI(distKm);
                            }, function(err) {
                                badge.className = 'mt-2 p-3 rounded-xl text-xs font-mono bg-red-50 border border-red-200 text-red-800';
                                document.getElementById('distance-badge-content').innerHTML = '⚠️ Gagal mendeteksi lokasi GPS secara otomatis. Silakan ketik alamat Anda secara manual.';
                            });
                        }
                    }

                    function calcDistanceByAddress() {
                        const addr = document.getElementById('customer_address_input').value.trim();
                        if (addr.length < 5) return;
                        
                        // OpenStreetMap Nominatim Geocoding API (Free)
                        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`)
                            .then(r => r.json())
                            .then(data => {
                                if (data && data.length > 0) {
                                    const lat = parseFloat(data[0].lat);
                                    const lng = parseFloat(data[0].lon);
                                    document.getElementById('customer_lat').value = lat;
                                    document.getElementById('customer_lng').value = lng;
                                    const distKm = haversineDistance(STORE_LAT, STORE_LNG, lat, lng);
                                    updateDistanceUI(distKm);
                                }
                            }).catch(e => console.log(e));
                    }

                    function toggleAddressBox(show) {
                        const wrap = document.getElementById('address-field-wrap');
                        const input = document.getElementById('customer_address_input');
                        if (show) {
                            wrap.style.display = 'block';
                            input.setAttribute('required', 'required');
                        } else {
                            wrap.style.display = 'none';
                            input.removeAttribute('required');
                        }
                    }
                    </script>

                    <div>
                        <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Metode Pembayaran *</label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-secondary transition-all">
                                <input type="radio" name="payment_method" value="QRIS" checked class="text-secondary focus:ring-secondary">
                                <span class="font-mono text-xs font-bold text-on-surface">QRIS / E-Wallet</span>
                            </label>
                            <label class="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-secondary transition-all">
                                <input type="radio" name="payment_method" value="Transfer" class="text-secondary focus:ring-secondary">
                                <span class="font-mono text-xs font-bold text-on-surface">Transfer Bank</span>
                            </label>
                            <label class="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-secondary transition-all">
                                <input type="radio" name="payment_method" value="Debit" class="text-secondary focus:ring-secondary">
                                <span class="font-mono text-xs font-bold text-on-surface">Kartu Debit</span>
                            </label>
                            <label class="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-secondary transition-all">
                                <input type="radio" name="payment_method" value="Tunai" class="text-secondary focus:ring-secondary">
                                <span class="font-mono text-xs font-bold text-on-surface">Bayar di Kasir / COD</span>
                            </label>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-outline-variant/20">
                        <button type="submit" class="w-full bg-secondary text-white font-mono text-sm font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-[20px]">check_circle</span>
                            Konfirmasi & Proses Pesanan
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Ringkasan Produk Checkout -->
        <div class="lg:col-span-5">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card sticky top-28">
                <h3 class="font-display font-bold text-lg text-on-surface mb-4 border-b border-outline-variant/20 pb-3">Detail Pesanan</h3>
                <div class="divide-y divide-outline-variant/15 mb-6 max-h-80 overflow-y-auto pr-1">
                    @foreach($cart as $item)
                    <div class="py-3 flex items-center gap-3 text-sm">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/20 flex items-center justify-center">
                            @if(!empty($item['image']))
                                <img src="{{ Storage::url($item['image']) }}" alt="{{ $item['name'] }}" class="w-full h-full object-cover">
                            @else
                                <span class="text-xl">{{ $item['icon'] ?? '📱' }}</span>
                            @endif
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-on-surface truncate">{{ $item['name'] }}</p>
                            <p class="text-xs font-mono text-on-surface-variant">{{ $item['qty'] }} x Rp {{ number_format($item['price'], 0, ',', '.') }}</p>
                        </div>
                        <span class="font-mono font-bold text-on-surface shrink-0">
                            Rp {{ number_format($item['price'] * $item['qty'], 0, ',', '.') }}
                        </span>
                    </div>
                    @endforeach
                </div>

                <div class="space-y-2 text-sm font-mono border-t border-outline-variant/20 pt-4">
                    <div class="flex justify-between text-on-surface-variant">
                        <span>Subtotal</span>
                        <span>Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex justify-between text-on-surface-variant">
                        <span>Ongkos Kirim</span>
                        <span class="text-green-700 font-bold">GRATIS</span>
                    </div>
                    <div class="flex justify-between font-bold text-base text-on-surface pt-2 border-t border-outline-variant/15">
                        <span>Total Pembayaran</span>
                        <span class="text-secondary text-lg">Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
