@extends('layouts.app')
@section('title', 'Lacak Kurir Live — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-10">

    <!-- Header & Info -->
    <div class="max-w-3xl mx-auto bg-white border border-outline-variant/30 rounded-3xl p-6 md:p-8 text-center mb-8 space-y-2 shadow-card">
        <div class="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto border border-secondary/20 shadow-sm">
            <span class="material-symbols-outlined text-3xl">two_wheeler</span>
        </div>
        <h1 class="font-display font-extrabold text-2xl md:text-3xl text-on-surface">Live Tracking Kurir Pengantaran</h1>
        <p class="font-mono text-xs text-on-surface-variant">Nomor Pelacakan: <strong class="text-secondary font-bold">#{{ $delivery->tracking_code }}</strong></p>
    </div>

    <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- KIRI: Peta Live Leaflet.js -->
        <div class="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-card space-y-3 overflow-hidden">
            <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    Posisi Kurir Realtime
                </div>
                <span id="distance-badge" class="font-mono text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    Menghitung jarak...
                </span>
            </div>

            <!-- Leaflet Map Container -->
            <div id="live-map" class="w-full h-[400px] md:h-[450px] rounded-xl border border-outline-variant/30 shadow-inner z-10"></div>

            <p class="text-[11px] font-mono text-on-surface-variant text-center opacity-70">
                Peta diperbarui secara otomatis setiap 5 detik. Pastikan Kurir mengaktifkan lokasi HP.
            </p>
        </div>

        <!-- KANAN: Detail & PIN Khusus Pelanggan -->
        <div class="lg:col-span-4 space-y-6">

            <!-- PIN Card (Clean White Background) -->
            <div class="bg-white text-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 relative overflow-hidden text-center space-y-4">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-50 text-cyan-800 font-mono text-[11px] font-bold rounded-full border border-cyan-200 shadow-sm">
                    <span>🔐</span> KODE PIN VERIFIKASI ANDA
                </div>
                <h3 class="font-display font-extrabold text-xs text-slate-700 uppercase tracking-wider">Berikan Kode Ini Kepada Kurir Saat HP Tiba:</h3>
                <div class="bg-gradient-to-r from-cyan-50 via-sky-50 to-cyan-50 rounded-2xl py-4 border-2 border-dashed border-cyan-400/60 shadow-inner">
                    <span class="font-mono font-black text-4xl tracking-[0.4em] text-cyan-700 pl-3 drop-shadow-sm">{{ $delivery->delivery_pin }}</span>
                </div>
                <p class="text-[11px] text-slate-500 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Jangan berikan PIN ini sebelum Anda menerima dan memeriksa HP/barang secara langsung.
                </p>
            </div>

            <!-- Detail Pengantaran Card -->
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card space-y-4">
                <h3 class="font-display font-bold text-base text-primary border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary">info</span>
                    Detail Pengantaran
                </h3>

                <div class="space-y-3 text-xs font-mono">
                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Status Pengantaran:</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase {{ $delivery->status_badge_class }}">
                            {{ $delivery->status }}
                        </span>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Nama Kurir:</span>
                        <strong class="text-primary">{{ $delivery->courier_name }}</strong>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">No. HP / WA Kurir:</span>
                        <a href="https://wa.me/{{ $delivery->formatted_courier_wa_phone }}" target="_blank" class="text-secondary font-bold hover:underline">
                            {{ $delivery->courier_phone }} 💬
                        </a>
                    </div>

                    <div class="pt-2 border-t border-outline-variant/20">
                        <span class="text-on-surface-variant block mb-1">Alamat Penerima:</span>
                        <p class="font-sans font-medium text-xs text-primary leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            {{ $delivery->customer_address }}
                        </p>
                    </div>

                    @if($delivery->service)
                    <div class="pt-2 border-t border-outline-variant/20">
                        <span class="text-on-surface-variant block mb-1">Perangkat Servis:</span>
                        <div class="flex justify-between items-center">
                            <strong class="font-sans text-primary">{{ $delivery->service->device }}</strong>
                            <span class="text-secondary font-bold">{{ $delivery->service->formatted_price }}</span>
                        </div>
                    </div>
                    @endif
                </div>
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
    const deliveryId = {{ $delivery->id }};
    const custAddr   = "{{ addslashes($delivery->customer_address) }}";
    let destLat      = {{ $delivery->customer_lat ?? 'null' }};
    let destLng      = {{ $delivery->customer_lng ?? 'null' }};
    let courierLat   = {{ $delivery->courier_lat ?? 'null' }};
    let courierLng   = {{ $delivery->courier_lng ?? 'null' }};

    // Default center fallback (Gawok, Sukoharjo) if unlocatable
    const defaultLat = -7.588800;
    const defaultLng = 110.748300;

    const map = L.map('live-map').setView([destLat || defaultLat, destLng || defaultLng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const houseIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#00687a;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);'><span class='material-symbols-outlined' style='font-size:18px;'>home</span></div>",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    let houseMarker = L.marker([destLat || defaultLat, destLng || defaultLng], { icon: houseIcon }).addTo(map).bindPopup("<b>" + (custAddr || "Rumah Anda (Tujuan)") + "</b>").openPopup();

    // Auto-geocode address if coordinates are missing
    if (!destLat || !destLng) {
        let searchQuery = custAddr;
        if (!/sukoharjo|surakarta|solo|jawa\s+tengah|gawok/i.test(searchQuery)) {
            searchQuery += ', Sukoharjo, Jawa Tengah';
        }
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=id&bounded=1&viewbox=110.40,-7.75,111.00,-7.40`)
            .then(r => r.json())
            .then(data => {
                if (data && data.length > 0) {
                    destLat = parseFloat(data[0].lat);
                    destLng = parseFloat(data[0].lon);
                    houseMarker.setLatLng([destLat, destLng]);
                    houseMarker.getPopup().setContent(`<b>${custAddr}</b>`);
                    map.setView([destLat, destLng], 15);
                }
            }).catch(e => console.log(e));
    }

    const motorIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#16a34a;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.4); animate:pulse;'><span class='material-symbols-outlined' style='font-size:22px;'>two_wheeler</span></div>",
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
    let courierMarker = courierLat ? L.marker([courierLat, courierLng], { icon: motorIcon }).addTo(map).bindPopup("<b>Kurir TECHCELL</b>") : null;
    let routeLine = null;

    function drawFastestTrackRoute(cLat, cLng, dLat, dLng) {
        if (!dLat || !dLng) return;
        fetch(`https://router.project-osrm.org/route/v1/driving/${cLng},${cLat};${dLng},${dLat}?overview=full&geometries=geojson`)
            .then(r => r.json())
            .then(data => {
                if (data && data.routes && data.routes.length > 0) {
                    const routeCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    if (routeLine) map.removeLayer(routeLine);
                    routeLine = L.polyline(routeCoords, { color: '#00687a', weight: 5, opacity: 0.85 }).addTo(map);
                    map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
                } else {
                    fallbackTrackPolyline(cLat, cLng, dLat, dLng);
                }
            }).catch(() => fallbackTrackPolyline(cLat, cLng, dLat, dLng));
    }

    function fallbackTrackPolyline(cLat, cLng, dLat, dLng) {
        if (routeLine) map.removeLayer(routeLine);
        routeLine = L.polyline([[cLat, cLng], [dLat, dLng]], { color: '#00687a', weight: 4, opacity: 0.8, dashArray: '8, 12' }).addTo(map);
        map.fitBounds([[cLat, cLng], [dLat, dLng]], { padding: [40, 40] });
    }

    // Fetch Live Location API every 5 seconds
    function pollLocation() {
        fetch(`/api/delivery/location/${deliveryId}`)
            .then(res => res.json())
            .then(data => {
                if (data.courier_lat && data.courier_lng) {
                    const newLatLng = new L.LatLng(data.courier_lat, data.courier_lng);
                    if (!courierMarker) {
                        courierMarker = L.marker(newLatLng, { icon: motorIcon }).addTo(map).bindPopup("<b>Kurir TECHCELL</b>");
                    } else {
                        courierMarker.setLatLng(newLatLng);
                    }

                    // Draw OSRM Road Route
                    drawFastestTrackRoute(data.courier_lat, data.courier_lng, destLat, destLng);
                }

                if (data.distance_meters !== null) {
                    const km = (data.distance_meters / 1000).toFixed(1);
                    document.getElementById('distance-badge').textContent = `Jarak Sisa: ${data.distance_meters} m (${km} km)`;
                }

                if (data.status === 'selesai') {
                    document.getElementById('distance-badge').textContent = 'PENGANTARAN SELESAI 🎉';
                    document.getElementById('distance-badge').className = 'font-mono text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300';
                }
            })
            .catch(err => console.log('Poll err:', err));
    }

    pollLocation();
    setInterval(pollLocation, 5000);
</script>
@endpush
@endsection
