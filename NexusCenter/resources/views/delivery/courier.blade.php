<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Kurir — {{ $delivery->tracking_code }} | TECHCELL</title>

    <!-- Google Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary-container': '#131b2e',
                        'secondary': '#00687a',
                        'secondary-fixed-dim': '#4cd7f6',
                        'surface-container-lowest': '#ffffff',
                        'surface-container-low': '#f2f4f6',
                    },
                    fontFamily: {
                        'display': ['Hanken Grotesk', 'sans-serif'],
                        'body': ['Inter', 'sans-serif'],
                        'mono': ['JetBrains Mono', 'monospace']
                    }
                }
            }
        }
    </script>
    <style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        #map { height: 260px; width: 100%; border-radius: 1rem; }
    </style>
</head>
<body class="bg-gray-100 font-body text-gray-800 antialiased min-h-screen flex flex-col justify-between">

    <!-- Header -->
    <header class="bg-primary-container text-white p-4 sticky top-0 z-40 shadow-md">
        <div class="max-w-md mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-2xl">two_wheeler</span>
                <div>
                    <h1 class="font-display font-extrabold text-base leading-tight">Layar Pengantaran Kurir</h1>
                    <p class="font-mono text-[11px] text-gray-300">Ref: {{ $delivery->tracking_code }}</p>
                </div>
            </div>
            <a href="{{ route('delivery.courier.dashboard') }}" class="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/20">
                Daftar Tugas
            </a>
        </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-md mx-auto p-4 w-full flex-grow space-y-4">

        <!-- Status Card -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-mono text-gray-500 uppercase">Status Pengantaran</span>
                <span id="status-badge" class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider {{ $delivery->status_badge_class }}">
                    {{ strtoupper($delivery->status) }}
                </span>
            </div>

            <!-- Customer Info -->
            <div class="bg-gray-50 p-4 rounded-xl space-y-1.5 text-xs font-mono border border-gray-200">
                <div class="flex justify-between">
                    <span class="text-gray-500">Penerima:</span>
                    <strong class="text-gray-900">{{ $delivery->customer_name }}</strong>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">No. HP WA:</span>
                    <a href="https://wa.me/{{ $delivery->formatted_customer_wa_phone }}" target="_blank" class="text-secondary font-bold hover:underline">
                        {{ $delivery->customer_phone }} 📱
                    </a>
                </div>
                <div class="pt-1 border-t border-gray-200">
                    <span class="text-gray-500 block mb-0.5">Alamat Tujuan:</span>
                    <p class="text-gray-900 font-sans font-medium text-xs leading-relaxed">{{ $delivery->customer_address }}</p>
                </div>
            </div>

            <!-- Signal & GPS Status Indicator -->
            <div id="gps-status-box" class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-mono">
                <span class="material-symbols-outlined text-lg animate-spin" id="gps-icon">sync</span>
                <span id="gps-text">GPS Belum Aktif. Klik "Mulai Pengantaran" untuk melacak.</span>
            </div>

            <!-- Actions -->
            @if($delivery->status !== 'selesai')
            <div class="space-y-2 pt-2">
                <!-- Tombol Navigasi Google Maps -->
                <a id="btn-nav-gmaps" href="https://www.google.com/maps/dir/?api=1&destination=@if($delivery->customer_lat && $delivery->customer_lng){{ $delivery->customer_lat }},{{ $delivery->customer_lng }}@else{{ urlencode($delivery->customer_address) }}@endif&travelmode=driving" target="_blank"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition-all">
                    <span class="material-symbols-outlined text-xl">near_me</span>
                    🗺️ NAVIGASI RUTE (GOOGLE MAPS)
                </a>

                <button id="btn-start" onclick="startTracking()"
                    class="w-full bg-secondary hover:bg-secondary/90 text-white font-mono font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-xl">navigation</span>
                    🚀 MULAI PENGANTARAN (AKTIFKAN GPS)
                </button>

                <button onclick="openPinModal()"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-mono font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-xl">verified</span>
                    ✅ INPUT PIN & SELESAIKAN
                </button>
            </div>
            @else
            <div class="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-mono text-xs space-y-1">
                <span class="material-symbols-outlined text-3xl text-green-600">check_circle</span>
                <p class="font-bold">PENGANTARAN TELAH SELESAI</p>
                <p class="text-[11px] text-gray-500">HP / Barang resmi diserahkan ke {{ $delivery->customer_name }}.</p>
            </div>
            @endif
        </div>

        <!-- Preview Map -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-2">
            <h3 class="font-mono text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-secondary">map</span> Preview Peta Lokasi
            </h3>
            <div id="map"></div>
        </div>

    </main>

    <!-- Modal Input PIN -->
    <div id="pin-modal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white rounded-2xl max-w-xs w-full p-6 space-y-4 shadow-2xl text-center">
            <span class="material-symbols-outlined text-4xl text-green-600">phonelink_lock</span>
            <div>
                <h3 class="font-display font-bold text-lg text-gray-900">Verifikasi PIN Pelanggan</h3>
                <p class="text-xs text-gray-500 mt-1">Minta 4 digit Kode PIN yang tampil pada HP {{ $delivery->customer_name }}.</p>
            </div>

            <form id="pin-form" onsubmit="submitPin(event)" class="space-y-4">
                <input type="text" id="input-pin" maxlength="4" placeholder="0 0 0 0" required
                    class="w-full text-center text-3xl font-mono tracking-[0.5em] font-bold border-2 border-gray-300 rounded-xl py-3 focus:border-green-600 focus:outline-none">

                <div id="pin-error" class="hidden text-xs text-red-600 font-mono font-semibold"></div>

                <div class="flex gap-2">
                    <button type="button" onclick="closePinModal()" class="w-1/2 bg-gray-200 text-gray-800 py-2.5 rounded-xl text-xs font-mono font-bold">Batal</button>
                    <button type="submit" class="w-1/2 bg-green-600 text-white py-2.5 rounded-xl text-xs font-mono font-bold hover:bg-green-700">Verifikasi</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        const CSRF_TOKEN   = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const trackingCode = "{{ $delivery->tracking_code }}";
        const deliveryId   = {{ $delivery->id }};
        const custAddr     = "{{ addslashes($delivery->customer_address) }}";
        let destLat        = {{ $delivery->customer_lat ?? 'null' }};
        let destLng        = {{ $delivery->customer_lng ?? 'null' }};

        const defaultLat = -7.588800;
        const defaultLng = 110.748300;

        // Initialize Map
        const map = L.map('map').setView([destLat || defaultLat, destLng || defaultLng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Custom Icon for House Destination (Red)
        const houseIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#dc2626;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);'><span class='material-symbols-outlined' style='font-size:20px;'>home</span></div>",
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        // House Marker
        const houseMarker = L.marker([destLat || defaultLat, destLng || defaultLng], { icon: houseIcon }).addTo(map)
            .bindPopup("<b>Tujuan Penerima Pelanggan</b><br>{{ $delivery->customer_name }}<br><small>{{ addslashes($delivery->customer_address) }}</small>").openPopup();

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
                        map.setView([destLat, destLng], 15);
                    }
                }).catch(e => console.log(e));
        }

        // Custom Icon for Courier Motorbike (Green)
        const motorIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#16a34a;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.4);'><span class='material-symbols-outlined' style='font-size:22px;'>two_wheeler</span></div>",
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        let courierMarker = null;
        let routeLine = null;
        let watchId = null;

        // Draw fastest road route using OSRM Driving API
        function drawFastestRoadRoute(fromLat, fromLng, toLat, toLng) {
            if (!toLat || !toLng) return;
            fetch(`https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`)
                .then(r => r.json())
                .then(data => {
                    if (data && data.routes && data.routes.length > 0) {
                        const routeCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                        if (routeLine) map.removeLayer(routeLine);
                        routeLine = L.polyline(routeCoords, {
                            color: '#00687a',
                            weight: 5,
                            opacity: 0.85
                        }).addTo(map);
                        map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
                    } else {
                        fallbackStraightPolyline(fromLat, fromLng, toLat, toLng);
                    }
                }).catch(err => {
                    fallbackStraightPolyline(fromLat, fromLng, toLat, toLng);
                });
        }

        function fallbackStraightPolyline(fromLat, fromLng, toLat, toLng) {
            if (routeLine) map.removeLayer(routeLine);
            routeLine = L.polyline([[fromLat, fromLng], [toLat, toLng]], {
                color: '#00687a',
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 12'
            }).addTo(map);
            map.fitBounds([houseMarker.getLatLng(), courierMarker.getLatLng()], { padding: [40, 40] });
        }

        function startTracking() {
            if (!navigator.geolocation) {
                alert("Browser HP Anda tidak mendukung sensor GPS.");
                return;
            }

            // Tell server status = diantar
            fetch(`/pengantaran/${deliveryId}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN }
            })
            .then(r => r.json())
            .then(data => {
                document.getElementById('status-badge').textContent = 'DIANTAR';
                document.getElementById('status-badge').className = 'px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200';
            });

            // Update GPS UI
            const statusBox = document.getElementById('gps-status-box');
            statusBox.className = 'flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-mono';
            document.getElementById('gps-icon').textContent = 'sensors';
            document.getElementById('gps-text').textContent = 'GPS AKTIF! Mengirim koordinat lokasi ke pelanggan...';

            // Watch Position GPS Bawaan HP
            watchId = navigator.geolocation.watchPosition(
                function(pos) {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    // Update local map marker
                    if (!courierMarker) {
                        courierMarker = L.marker([lat, lng], { icon: motorIcon }).addTo(map).bindPopup("<b>Posisi Kurir (Saya)</b>");
                    } else {
                        courierMarker.setLatLng([lat, lng]);
                    }

                    // Update Google Maps button link to use exact origin lat/lng
                    const btnNav = document.getElementById('btn-nav-gmaps');
                    if (btnNav && destLat && destLng) {
                        btnNav.href = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destLat},${destLng}&travelmode=driving`;
                    }

                    // Draw OSRM Fastest Road Route
                    drawFastestRoadRoute(lat, lng, destLat, destLng);

                    // Send to Laravel API
                    fetch(`/api/delivery/update-location/${deliveryId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                        body: JSON.stringify({ lat: lat, lng: lng })
                    }).catch(err => console.log('Err update GPS:', err));
                },
                function(err) {
                    alert("Gagal membaca GPS: " + err.message + ". Pastikan Izin Lokasi diizinkan pada browser HP!");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }

        function openPinModal() {
            document.getElementById('pin-modal').classList.remove('hidden');
            document.getElementById('input-pin').focus();
        }

        function closePinModal() {
            document.getElementById('pin-modal').classList.add('hidden');
        }

        function submitPin(e) {
            e.preventDefault();
            const pin = document.getElementById('input-pin').value;
            const errDiv = document.getElementById('pin-error');
            errDiv.classList.add('hidden');

            fetch(`/pengantaran/${deliveryId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                body: JSON.stringify({ pin: pin })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    if (watchId) navigator.geolocation.clearWatch(watchId);
                    window.location.reload();
                } else {
                    errDiv.textContent = data.message || 'Kode PIN Salah!';
                    errDiv.classList.remove('hidden');
                }
            })
            .catch(() => {
                errDiv.textContent = 'Gagal memverifikasi PIN. Periksa jaringan Anda!';
                errDiv.classList.remove('hidden');
            });
        }
    </script>
</body>
</html>
