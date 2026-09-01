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
    <style>.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }</style>
</head>
<body class="bg-gray-100 font-body text-gray-800 antialiased min-h-screen">

    <header class="bg-primary-container text-white p-4 sticky top-0 z-40 shadow-md">
        <div class="max-w-md mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-2xl">two_wheeler</span>
                <h1 class="font-display font-extrabold text-base">Daftar Tugas Pengantaran Kurir</h1>
            </div>
            <a href="{{ route('home') }}" class="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">Home</a>
        </div>
    </header>

    <main class="max-w-md mx-auto p-4 space-y-4">

        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <h2 class="font-display font-bold text-sm text-gray-900 mb-1">Tugas Hari Ini ({{ count($deliveries) }})</h2>
            <p class="text-xs text-gray-500 font-mono">Pilih salah satu tugas untuk membuka layar GPS pengantaran.</p>
        </div>

        <div class="space-y-3">
            @forelse($deliveries as $del)
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-3 hover:border-secondary transition-all">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span class="font-mono text-xs font-bold text-secondary">#{{ $del->tracking_code }}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase {{ $del->status_badge_class }}">
                        {{ $del->status }}
                    </span>
                </div>

                <div class="space-y-1 text-xs">
                    <p class="font-display font-bold text-sm text-gray-900">{{ $del->customer_name }}</p>
                    <p class="font-mono text-gray-500">{{ $del->customer_phone }}</p>
                    <p class="text-gray-600 leading-relaxed font-sans mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{{ $del->customer_address }}</p>
                </div>

                <a href="{{ route('delivery.courier.task', $del->tracking_code) }}"
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

</body>
</html>
