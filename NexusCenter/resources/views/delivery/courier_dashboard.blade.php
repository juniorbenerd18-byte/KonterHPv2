<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Tugas Kurir — TECHCELL</title>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary-container': '#131b2e',
                        'secondary': '#00687a',
                        'secondary-fixed-dim': '#4cd7f6',
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
        @keyframes pulseRing {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes ringShake {
            0%, 100% { transform: rotate(0deg); }
            20%, 60% { transform: rotate(15deg); }
            40%, 80% { transform: rotate(-15deg); }
        }
        .animate-ring-pulse { animation: pulseRing 1.5s ease-in-out infinite; }
        .animate-ring-shake { animation: ringShake 0.6s ease-in-out infinite; }
    </style>
</head>
<body class="bg-gray-100 font-body text-gray-800 antialiased min-h-screen pb-10">

    <!-- Header -->
    <header class="bg-primary-container text-white p-4 sticky top-0 z-40 shadow-md">
        <div class="max-w-md mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-2xl animate-ring-shake">two_wheeler</span>
                <h1 class="font-display font-extrabold text-base">Daftar Tugas Kurir</h1>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="testRingtoneSound()" class="text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-amber-500/30 transition-all">
                    <span>🔔</span> Tes Dering
                </button>
                <a href="{{ route('home') }}" class="text-xs font-mono bg-white/10 px-3 py-1 rounded-lg border border-white/20">Home</a>
            </div>
        </div>
    </header>

    <main class="max-w-md mx-auto p-4 space-y-4">

        <!-- Audio Status Notification Banner -->
        <div id="audio-enable-banner" class="bg-gradient-to-r from-cyan-900 to-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-cyan-500/30 flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs font-mono">
                <span class="material-symbols-outlined text-cyan-400 animate-pulse">volume_up</span>
                <div>
                    <strong class="block text-cyan-300 font-bold">Notifikasi Dering Kurir Aktif</strong>
                    <span class="text-[11px] text-gray-300">HP akan berdering saat ada tugas pengantaran baru</span>
                </div>
            </div>
            <button onclick="unlockAudioEngine()" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow uppercase tracking-wider">
                Aktifkan Dering
            </button>
        </div>

        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <h2 class="font-display font-bold text-sm text-gray-900 mb-0.5">Tugas Hari Ini ({{ count($deliveries) }})</h2>
                <p class="text-xs text-gray-500 font-mono">Pilih salah satu tugas untuk mengantar.</p>
            </div>
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold rounded-full border border-emerald-200">
                🟢 Standby
            </span>
        </div>

        <div class="space-y-3" id="delivery-list-container">
            @forelse($deliveries as $del)
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-3 hover:border-secondary transition-all relative overflow-hidden group">
                @if($del->status === 'pending')
                <div class="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-bl-xl shadow">
                    🔔 PERLU DIANTAR
                </div>
                @endif

                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span class="font-mono text-xs font-bold text-secondary flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">local_shipping</span>
                        #{{ $del->tracking_code }}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase {{ $del->status_badge_class }}">
                        {{ $del->status }}
                    </span>
                </div>

                <div class="space-y-1 text-xs">
                    <p class="font-display font-bold text-sm text-gray-900">{{ $del->customer_name }}</p>
                    <p class="font-mono text-gray-500 flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs">phone</span>
                        {{ $del->customer_phone }}
                    </p>
                    <p class="text-gray-600 leading-relaxed font-sans mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-start gap-1.5">
                        <span class="material-symbols-outlined text-xs text-secondary mt-0.5">location_on</span>
                        <span>{{ $del->customer_address }}</span>
                    </p>
                </div>

                <a href="{{ route('delivery.courier.task', $del->tracking_code) }}"
                    onclick="stopRingtoneSound()"
                    class="block w-full bg-secondary hover:bg-secondary/90 text-white font-mono font-bold py-3 rounded-xl text-center text-xs shadow-md transition-all">
                    🚀 BUKA LAYAR GPS PENGANTARAN &rarr;
                </a>
            </div>
            @empty
            <div class="bg-white rounded-2xl p-8 text-center border border-gray-200 text-gray-500 space-y-2">
                <span class="material-symbols-outlined text-4xl text-gray-300">task_alt</span>
                <p class="font-display font-bold text-sm text-gray-800">Tidak ada tugas pengantaran aktif</p>
                <p class="text-xs font-mono">Semua pengantaran telah selesai atau belum ditugaskan.</p>
            </div>
            @endforelse
        </div>
    </main>

    <!-- Incoming Delivery Audio Alarm Modal -->
    <div id="ringtone-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-amber-400 space-y-5 text-center relative overflow-hidden animate-ring-pulse">
            <div class="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>

            <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto border-4 border-amber-300 animate-ring-shake shadow-lg">
                <span class="material-symbols-outlined text-amber-600 text-4xl">notifications_active</span>
            </div>

            <div class="space-y-1">
                <span class="px-3 py-1 bg-amber-500 text-white font-mono text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    🚨 PANGGILAN PENGANTARAN BARU!
                </span>
                <h3 class="font-display font-extrabold text-xl text-gray-900 pt-2">Perintah Antar HP Masuk</h3>
                <p class="text-xs font-mono text-gray-500">HP Anda sedang berdering. Segera terima tugas ini!</p>
            </div>

            <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left space-y-2 text-xs font-mono">
                <div class="flex justify-between border-b border-amber-200/60 pb-1.5">
                    <span class="text-gray-500">No. Tracking:</span>
                    <strong id="modal-tracking-code" class="text-secondary font-bold">#---</strong>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Penerima:</span>
                    <strong id="modal-customer-name" class="text-gray-900">Pelanggan</strong>
                </div>
                <div>
                    <span class="text-gray-500 block mb-0.5">Alamat Tujuan:</span>
                    <p id="modal-customer-address" class="text-gray-800 font-sans text-xs bg-white p-2 rounded-lg border border-amber-200/80 leading-snug">
                        -
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <a id="modal-accept-btn" href="#" onclick="stopRingtoneSound()"
                    class="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-3.5 rounded-xl text-center text-xs shadow-lg transition-all transform active:scale-95">
                    🚀 TERIMA TUGAS & BUKA GPS &rarr;
                </a>
                <button onclick="stopRingtoneSound(); closeRingtoneModal()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono font-bold py-2 rounded-xl text-xs">
                    🔕 Matikan Dering Saja
                </button>
            </div>
        </div>
    </div>

    <!-- Web Audio API Ringtone Sound Engine -->
    <script>
        let audioCtx = null;
        let ringtoneInterval = null;
        let isRinging = false;

        function getAudioContext() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        function unlockAudioEngine() {
            getAudioContext();
            document.getElementById('audio-enable-banner').classList.add('hidden');
            testRingtoneSound(false);
        }

        // Generate pleasant dual-frequency delivery ringtone pulse
        function playChimePulse() {
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;

                // Tone 1 (High bell chime: 880Hz)
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(880, now);
                gain1.gain.setValueAtTime(0.3, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.35);

                // Tone 2 (Harmonic ring: 1046.5Hz)
                setTimeout(() => {
                    const now2 = ctx.currentTime;
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(1046.5, now2);
                    gain2.gain.setValueAtTime(0.4, now2);
                    gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.45);
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    osc2.start(now2);
                    osc2.stop(now2 + 0.45);
                }, 180);
            } catch (e) {
                console.log('Audio playback error:', e);
            }
        }

        function startRingtoneSound() {
            if (isRinging) return;
            isRinging = true;
            playChimePulse();
            ringtoneInterval = setInterval(() => {
                playChimePulse();
            }, 1200);
        }

        function stopRingtoneSound() {
            isRinging = false;
            if (ringtoneInterval) {
                clearInterval(ringtoneInterval);
                ringtoneInterval = null;
            }
        }

        function testRingtoneSound(showModal = true) {
            getAudioContext();
            playChimePulse();
            if (showModal) {
                const modal = document.getElementById('ringtone-modal');
                document.getElementById('modal-tracking-code').textContent = '#TEST-KURIR';
                document.getElementById('modal-customer-name').textContent = 'Tes Dering Notifikasi Kurir';
                document.getElementById('modal-customer-address').textContent = 'Fasilitas dering suara notifikasi pengantaran berfungsi dengan baik!';
                document.getElementById('modal-accept-btn').href = '#';
                modal.classList.remove('hidden');
                startRingtoneSound();
            }
        }

        function closeRingtoneModal() {
            document.getElementById('ringtone-modal').classList.add('hidden');
        }

        // Check if there are pending deliveries that require ringing
        const pendingCount = {{ $deliveries->where('status', 'pending')->count() }};
        @if($deliveries->where('status', 'pending')->first())
        const firstPending = {
            tracking_code: '{{ $deliveries->where('status', 'pending')->first()->tracking_code }}',
            customer_name: '{{ addslashes($deliveries->where('status', 'pending')->first()->customer_name) }}',
            customer_address: '{{ addslashes($deliveries->where('status', 'pending')->first()->customer_address) }}',
            task_url: '{{ route('delivery.courier.task', $deliveries->where('status', 'pending')->first()->tracking_code) }}'
        };

        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.getElementById('modal-tracking-code').textContent = '#' + firstPending.tracking_code;
                document.getElementById('modal-customer-name').textContent = firstPending.customer_name;
                document.getElementById('modal-customer-address').textContent = firstPending.customer_address;
                document.getElementById('modal-accept-btn').href = firstPending.task_url;
                document.getElementById('ringtone-modal').classList.remove('hidden');
                startRingtoneSound();
            }, 800);
        });
        @endif

        // Auto-refresh page every 12 seconds to poll for new deliveries
        setInterval(() => {
            if (!isRinging) {
                fetch(window.location.href)
                    .then(res => res.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const newContainer = doc.getElementById('delivery-list-container');
                        if (newContainer) {
                            document.getElementById('delivery-list-container').innerHTML = newContainer.innerHTML;
                        }
                    }).catch(err => console.log(err));
            }
        }, 12000);
    </script>
</body>
</html>
