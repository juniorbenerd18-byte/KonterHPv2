@extends('layouts.app')
@section('title', 'My Profile — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-20 w-full">
    <div class="flex flex-col md:flex-row gap-8">

        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-1/4 shrink-0">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 sticky top-28 shadow-card space-y-4">
                <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    @if($user->avatar)
                        <img src="{{ Storage::url($user->avatar) }}" alt="{{ $user->name }}" class="w-12 h-12 rounded-full object-cover shadow-sm shrink-0 border border-outline-variant/30">
                    @else
                        <div class="w-12 h-12 rounded-full bg-secondary text-white font-display font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
                            {{ substr($user->name, 0, 1) }}
                        </div>
                    @endif
                    <div class="overflow-hidden">
                        <h4 class="font-display font-bold text-sm text-primary truncate">{{ $user->name }}</h4>
                        <p class="font-mono text-[11px] text-on-surface-variant truncate">{{ $user->email }}</p>
                    </div>
                </div>

                <nav class="flex flex-col gap-1.5 pt-2">
                    <a href="#account-section" onclick="switchProfileTab('account')" id="sidebar-tab-account" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-secondary font-mono text-xs font-bold border-l-4 border-secondary transition-all">
                        <span class="material-symbols-outlined icon-filled">person</span>
                        Akun Saya
                    </a>
                    <a href="#orders-section" onclick="switchProfileTab('orders')" id="sidebar-tab-orders" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">receipt_long</span>
                        Riwayat Pesanan
                    </a>
                    <a href="{{ route('profile.services') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">build</span>
                        Riwayat Servis
                    </a>
                    <a href="{{ route('cart.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">shopping_cart</span>
                        Keranjang Belanja
                    </a>
                </nav>
            </div>
        </aside>

        <!-- Profile Form & Canvas -->
        <div class="w-full md:w-3/4 flex flex-col gap-8">

            <form id="profile-form" method="POST" action="{{ route('profile.update') }}" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <input type="file" id="avatar-file-input" name="avatar" class="hidden" accept="image/*" onchange="previewAndSubmitAvatar()">

                <!-- User Header & Status Card -->
                <section class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden shadow-card mb-8">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div class="relative shrink-0 group cursor-pointer" onclick="document.getElementById('avatar-file-input').click()">
                        @if($user->avatar)
                            <img id="avatar-preview-img" src="{{ Storage::url($user->avatar) }}" alt="{{ $user->name }}" class="w-28 h-28 rounded-full object-cover border-4 border-surface shadow-md">
                        @else
                            <div id="avatar-preview-placeholder" class="w-28 h-28 rounded-full bg-secondary text-white font-display font-bold text-4xl flex items-center justify-center border-4 border-surface shadow-md">
                                {{ substr($user->name, 0, 1) }}
                            </div>
                        @endif
                        <button type="button" class="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg hover:bg-secondary transition-colors group-hover:scale-110" title="Ganti Foto Profil">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                    </div>
                    <div class="flex-grow text-center md:text-left flex flex-col gap-2 z-10">
                        <h1 class="font-display font-bold text-2xl md:text-3xl text-primary">{{ $user->name }}</h1>
                        <div class="flex flex-col gap-1 text-on-surface-variant font-mono text-xs">
                            <span class="flex items-center justify-center md:justify-start gap-2">
                                <span class="material-symbols-outlined text-[16px] text-secondary">mail</span> {{ $user->email }}
                            </span>
                            <span class="flex items-center justify-center md:justify-start gap-2">
                                <span class="material-symbols-outlined text-[16px] text-secondary">badge</span> Role: {{ ucfirst($user->role) }}
                            </span>
                        </div>
                    </div>
                    <div class="bg-gradient-to-br from-surface-container-low to-surface border border-outline-variant/30 p-6 rounded-2xl min-w-[200px] flex flex-col items-center justify-center text-center shadow-sm z-10 shrink-0">
                        <span class="material-symbols-outlined icon-filled text-secondary text-[36px] mb-1">workspace_premium</span>
                        <span class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Status Akun</span>
                        <span class="font-display font-bold text-lg text-primary mt-0.5">{{ ucfirst($user->role) }} Member</span>
                        <span class="text-secondary font-mono text-xs font-bold mt-1">12.450 Points</span>
                    </div>
                </section>

                <!-- Account Details Tab Content -->
                <div id="content-account" class="space-y-8">
                    <section class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                            <h2 class="font-display font-bold text-xl text-primary flex items-center gap-2">
                                <span class="material-symbols-outlined text-secondary">badge</span>
                                Informasi Pribadi
                            </h2>
                            <span class="text-xs font-mono text-on-surface-variant">Klik untuk mengubah data profil</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Nama Lengkap *</label>
                                <input type="text" name="name" value="{{ old('name', $user->name) }}" required class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Alamat Email *</label>
                                <input type="email" name="email" value="{{ old('email', $user->email) }}" required class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-mono text-sm text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Nomor Telepon / WhatsApp</label>
                                <input type="text" name="phone" value="{{ old('phone', $user->phone) }}" placeholder="Contoh: 081234567890" class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-mono text-sm text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Password Baru (Opsional)</label>
                                <input type="password" name="password" placeholder="Kosongkan jika tidak ingin diubah" class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-mono text-sm text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                        </div>

                        {{-- Section Alamat Pengiriman Utama --}}
                        <div class="mt-8 pt-6 border-t border-outline-variant/20 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="font-display font-bold text-base text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-secondary">home_pin</span>
                                    Alamat Pengiriman Utama
                                </h3>
                                <button type="button" onclick="detectProfileGPS()" class="text-xs font-mono text-secondary hover:underline font-bold flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[16px]">my_location</span> Deteksi GPS
                                </button>
                            </div>
                            
                            <textarea name="address" id="profile_address" rows="2" oninput="handleProfileAddressChange()" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Alamat lengkap (Jl. Raya Gawok No. XX, Sukoharjo...) atau tempelkan link/koordinat Google Maps">{{ old('address', $user->address) }}</textarea>
                            <p class="text-[11px] font-mono text-on-surface-variant/80">💡 Alamat ini akan otomatis tersimpan dan digunakan saat checkout pesanan berikutnya.</p>

                            <input type="hidden" name="latitude" id="profile_lat" value="{{ old('latitude', $user->latitude) }}">
                            <input type="hidden" name="longitude" id="profile_lng" value="{{ old('longitude', $user->longitude) }}">

                            <div class="border border-outline-variant/30 rounded-xl overflow-hidden shadow-inner">
                                <div class="bg-surface-container-low px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                                    <span class="font-bold text-primary flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[16px] text-secondary">map</span>
                                        Geser Pin Lokasi Rumah Anda
                                    </span>
                                    <span id="profile-pin-text" class="text-[11px] text-secondary font-bold"></span>
                                </div>
                                <div id="profile-map" class="w-full h-[220px] bg-surface-container"></div>
                            </div>
                        </div>

                        <div class="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end">
                            <button type="submit" class="bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md flex items-center gap-2 active:scale-95">
                                <span class="material-symbols-outlined text-[18px]">save</span>
                                Simpan Perubahan Profil & Alamat
                            </button>
                        </div>
                    </section>
                </div>
            </form>

            <!-- Orders Tab Content -->
            <div id="content-orders" class="space-y-8">
                <section id="orders-section" class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                    <header class="mb-6 border-b border-outline-variant/20 pb-4 flex items-center justify-between">
                        <div>
                            <h2 class="font-display font-bold text-2xl text-primary">Riwayat Pesanan</h2>
                            <p class="font-mono text-xs text-on-surface-variant mt-1">Daftar transaksi dan hasil checkout Anda di TECHCELL NexusCenter.</p>
                        </div>
                        <a href="{{ route('cart.index') }}" class="bg-secondary text-white font-mono text-xs font-bold px-4 py-2 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-sm">
                            <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
                            Keranjang ({{ count(session('cart', [])) }})
                        </a>
                    </header>

                    <div class="space-y-6">
                        @forelse($orders as $order)
                        <div class="border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary transition-all duration-300 bg-surface-container-lowest shadow-sm">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-outline-variant/20 gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-secondary icon-filled">local_shipping</span>
                                    <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider">Lunas / Completed</span>
                                    <span class="text-outline-variant mx-1">•</span>
                                    <span class="font-mono text-xs font-bold text-on-surface-variant">#{{ $order->invoice_number }}</span>
                                </div>
                                <span class="font-mono text-xs text-on-surface-variant">{{ $order->created_at->format('d M Y H:i') }}</span>
                            </div>

                            @foreach($order->items as $item)
                            <div class="flex flex-col sm:flex-row gap-4 mb-3 items-center justify-between border-b border-outline-variant/10 pb-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-2xl shrink-0">
                                        📱
                                    </div>
                                    <div>
                                        <h4 class="font-display font-bold text-base text-primary">{{ $item->product_name }}</h4>
                                        <p class="font-mono text-xs text-on-surface-variant">{{ $item->quantity }} x Rp {{ number_format($item->price, 0, ',', '.') }}</p>
                                    </div>
                                </div>
                                <span class="font-mono font-bold text-sm text-secondary">
                                    Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                                </span>
                            </div>
                            @endforeach

                            <div class="flex flex-col sm:flex-row justify-between items-center pt-3 gap-3">
                                <div class="text-xs font-mono text-on-surface-variant">
                                    Metode Pembayaran: <span class="font-bold text-on-surface">{{ $order->payment_method }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="font-mono text-sm font-bold text-primary">Total: Rp {{ number_format($order->total, 0, ',', '.') }}</span>
                                    <a href="{{ route('sales.receipt', $order->id) }}" class="bg-surface-container text-on-surface font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-secondary/10 hover:text-secondary transition-all">
                                        Struk / Receipt &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                        @empty
                        <div class="text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-2">receipt_long</span>
                            <h4 class="font-display font-bold text-base text-on-surface">Belum Ada Pesanan</h4>
                            <p class="text-xs text-on-surface-variant mt-1">Anda belum melakukan checkout pesanan produk.</p>
                            <a href="{{ route('products.index') }}" class="inline-block mt-4 bg-secondary text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-sm">
                                Mulai Belanja Sekarang
                            </a>
                        </div>
                        @endforelse
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>

@push('styles')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
@endpush

@push('scripts')
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const DEFAULT_STORE_LAT = -7.588800;
const DEFAULT_STORE_LNG = 110.748300;

let profileMap = null;
let profileMarker = null;

function setProfileCoordinates(lat, lng, moveMap = true, updateAddressText = false) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    document.getElementById('profile_lat').value = lat;
    document.getElementById('profile_lng').value = lng;
    document.getElementById('profile-pin-text').textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    if (profileMarker) {
        profileMarker.setLatLng([lat, lng]);
    }
    if (moveMap && profileMap) {
        profileMap.setView([lat, lng], 15);
    }

    if (updateAddressText) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(r => r.json())
            .then(data => {
                if (data && data.display_name) {
                    document.getElementById('profile_address').value = data.display_name;
                }
            }).catch(e => console.log(e));
    }
}

function parseProfileGoogleMapsUrlOrCoords(text) {
    if (!text) return null;
    let match = text.match(/@?(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/) 
        || text.match(/q=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
        || text.match(/ll=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (!match) {
        const latMatch = text.match(/!3d(-?\d+\.\d+)/);
        const lngMatch = text.match(/!4d(-?\d+\.\d+)/);
        if (latMatch && lngMatch) {
            return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
        }
    }
    if (!match) {
        const rawMatch = text.match(/(-?\d{1,2}\.\d+)\s*[\s,]\s*(1\d{2}\.\d+)/);
        if (rawMatch) {
            return { lat: parseFloat(rawMatch[1]), lng: parseFloat(rawMatch[2]) };
        }
    }
    if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
}

let profileDebounceTimer = null;
function handleProfileAddressChange() {
    const addr = document.getElementById('profile_address').value.trim();
    const parsedCoords = parseProfileGoogleMapsUrlOrCoords(addr);
    if (parsedCoords) {
        setProfileCoordinates(parsedCoords.lat, parsedCoords.lng);
        return;
    }

    if (addr.length < 3) return;

    clearTimeout(profileDebounceTimer);
    profileDebounceTimer = setTimeout(() => {
        let searchQuery = addr;
        if (!/sukoharjo|surakarta|solo|jawa\s+tengah|gawok/i.test(searchQuery)) {
            searchQuery += ', Sukoharjo, Jawa Tengah';
        }

        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=id&bounded=1&viewbox=110.40,-7.75,111.00,-7.40`)
            .then(r => r.json())
            .then(data => {
                if (data && data.length > 0) {
                    setProfileCoordinates(data[0].lat, data[0].lon);
                } else {
                    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr + ', Jawa Tengah')}&format=json&limit=1&countrycodes=id`)
                        .then(r => r.json())
                        .then(d2 => {
                            if (d2 && d2.length > 0) {
                                setProfileCoordinates(d2[0].lat, d2[0].lon);
                            }
                        });
                }
            }).catch(e => console.log(e));
    }, 600);
}

function detectProfileGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            setProfileCoordinates(pos.coords.latitude, pos.coords.longitude, true, true);
        }, function(err) {
            alert('Gagal mengambil GPS: ' + err.message);
        });
    }
}

function switchProfileTab(tab) {
    const tabAccount = document.getElementById('sidebar-tab-account');
    const tabOrders = document.getElementById('sidebar-tab-orders');
    const contentAccount = document.getElementById('content-account');
    const contentOrders = document.getElementById('content-orders');

    if (tab === 'account') {
        tabAccount.classList.add('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabAccount.classList.remove('text-on-surface-variant');
        tabOrders.classList.remove('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabOrders.classList.add('text-on-surface-variant');
        contentAccount.classList.remove('hidden');
        contentOrders.classList.remove('hidden');
    } else {
        tabOrders.classList.add('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabOrders.classList.remove('text-on-surface-variant');
        tabAccount.classList.remove('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabAccount.classList.add('text-on-surface-variant');
        document.getElementById('orders-section').scrollIntoView({ behavior: 'smooth' });
    }
}

function previewAndSubmitAvatar() {
    const fileInput = document.getElementById('avatar-file-input');
    if (fileInput.files && fileInput.files[0]) {
        document.getElementById('profile-form').submit();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'orders' || window.location.hash === '#orders-section') {
        switchProfileTab('orders');
    }

    const initLat = parseFloat(document.getElementById('profile_lat').value) || DEFAULT_STORE_LAT;
    const initLng = parseFloat(document.getElementById('profile_lng').value) || DEFAULT_STORE_LNG;

    profileMap = L.map('profile-map').setView([initLat, initLng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(profileMap);

    const houseIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#00687a;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);cursor:grab;'><span class='material-symbols-outlined' style='font-size:18px;'>home</span></div>",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    profileMarker = L.marker([initLat, initLng], { icon: houseIcon, draggable: true }).addTo(profileMap);

    profileMarker.on('dragend', function(e) {
        const position = profileMarker.getLatLng();
        setProfileCoordinates(position.lat, position.lng, false, true);
    });

    profileMap.on('click', function(e) {
        setProfileCoordinates(e.latlng.lat, e.latlng.lng, false, true);
    });

    if (document.getElementById('profile_lat').value && document.getElementById('profile_lng').value) {
        setProfileCoordinates(initLat, initLng);
    }
});
</script>
@endpush
@endsection
