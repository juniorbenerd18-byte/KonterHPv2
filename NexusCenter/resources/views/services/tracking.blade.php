@extends('layouts.app')
@section('title', 'Lacak Status Servis HP')

@section('content')
<div class="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-12 fade-in">
    <!-- Header Card -->
    <div class="max-w-2xl mx-auto bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-card text-center mb-10 space-y-4">
        <div class="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto border border-secondary/20 shadow-sm">
            <span class="material-symbols-outlined text-[36px]">travel_explore</span>
        </div>
        <h1 class="font-display font-extrabold text-2xl md:text-3xl text-on-surface">Lacak Status Servis HP</h1>
        <p class="text-on-surface-variant text-sm max-w-lg mx-auto leading-relaxed">
            Masukkan <strong>Nomor Nota</strong> (contoh: <code class="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">SRV-20260831-0001</code>) atau <strong>Nomor HP Pelanggan</strong> untuk mengecek status perbaikan HP Anda.
        </p>

        {{-- Form Pencarian --}}
        <form method="GET" action="{{ route('services.track') }}" class="flex gap-2 pt-2 max-w-lg mx-auto">
            <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Masukkan Nomor Nota / No. HP..."
                    class="w-full bg-slate-50 border border-outline-variant/40 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono" required>
            </div>
            <button type="submit"
                class="bg-secondary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all shadow-md active:scale-[0.98] flex items-center gap-2 flex-shrink-0">
                <span class="material-symbols-outlined text-[20px]">search</span>
                Lacak
            </button>
        </form>
    </div>

    {{-- Hasil Pencarian --}}
    @if(request()->filled('q'))
        @if($services->isNotEmpty())

            {{-- FIX #4: Jika ada >1 servis (misal cari by HP), tampilkan semua --}}
            @if($services->count() > 1)
            <div class="max-w-xl mx-auto mb-4">
                <p class="text-xs text-center text-on-surface-variant font-mono">
                    Ditemukan <strong>{{ $services->count() }}</strong> servis untuk nomor HP ini. Pilih yang ingin dilacak:
                </p>
            </div>
            @endif

            @foreach($services as $service)
            <div class="max-w-xl mx-auto bg-surface-container-lowest border border-secondary/30 rounded-2xl p-6 shadow-glass relative overflow-hidden mb-4">
                <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
                    <div>
                        <span class="text-xs font-mono text-on-surface-variant">Nomor Nota</span>
                        <h3 class="font-mono font-bold text-lg text-secondary">{{ $service->nota_number }}</h3>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider {{ $service->status_badge_class }}">
                        {{ $service->status }}
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p class="text-xs text-on-surface-variant">Pemilik / Pelanggan</p>
                        {{-- FIX #3: Masking nama agar tidak bocor sepenuhnya --}}
                        <p class="font-semibold text-on-surface">{{ Str::mask($service->customer_name, '*', 3) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-on-surface-variant">Perangkat HP</p>
                        <p class="font-semibold text-on-surface">{{ $service->device }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-on-surface-variant">Jenis Kerusakan / Servis</p>
                        <p class="font-medium text-on-surface">{{ $service->service_type }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-on-surface-variant">Tgl Masuk</p>
                        <p class="font-mono text-on-surface-variant text-xs">{{ $service->created_at->format('d M Y, H:i') }}</p>
                    </div>
                </div>

                @if($service->delivery)
                <div class="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-xl p-4 mb-4 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-secondary animate-bounce text-[24px]">two_wheeler</span>
                        <div>
                            <strong class="text-primary block font-mono text-sm">🚚 HP Anda Sedang Diantar Kurir ({{ $service->delivery->courier_name }})</strong>
                            <span class="text-on-surface-variant font-mono text-xs">Kode PIN Verifikasi Anda: <strong class="text-secondary font-mono font-bold text-sm ml-1">{{ $service->delivery->delivery_pin }}</strong></span>
                        </div>
                    </div>
                    <a href="{{ route('delivery.track', $service->delivery->tracking_code) }}" target="_blank"
                        class="bg-secondary text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-md">
                        <span class="material-symbols-outlined text-[18px]">map</span>
                        Lacak Peta Live &rarr;
                    </a>
                </div>
                @endif

                @if($service->issue)
                <div class="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 mb-4 text-xs">
                    <span class="font-semibold text-on-surface block mb-1">Catatan Keluhan:</span>
                    <p class="text-on-surface-variant">{{ $service->issue }}</p>
                </div>
                @endif

                <div class="flex justify-between items-center bg-secondary/5 border border-secondary/15 rounded-xl p-4">
                    <div>
                        <span class="text-xs text-on-surface-variant">Total Biaya Servis</span>
                        <p class="font-mono font-bold text-lg text-secondary">{{ $service->formatted_price }}</p>
                    </div>
                    @if($service->deposit > 0)
                    <div class="text-right">
                        <span class="text-xs text-on-surface-variant">Uang Muka (DP)</span>
                        <p class="font-mono text-sm font-semibold text-green-700">{{ $service->formatted_deposit }}</p>
                    </div>
                    @endif
                </div>
            </div>
            @endforeach

        @else
        <div class="max-w-xl mx-auto bg-surface-container-lowest border border-red-200 rounded-2xl p-8 text-center shadow-card">
            <span class="material-symbols-outlined text-red-500 text-5xl mb-2">search_off</span>
            <h3 class="font-display font-bold text-lg text-on-surface">Data Servis Tidak Ditemukan</h3>
            {{-- FIX #2: Contoh format diganti jadi SRV- --}}
            <p class="text-on-surface-variant text-sm mt-1">Pastikan Nomor Nota (contoh: <code>SRV-20260831-0001</code>) atau Nomor HP yang Anda masukkan sudah benar.</p>
        </div>
        @endif
    @endif
</div>
@endsection
