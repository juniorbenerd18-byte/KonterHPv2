@extends('layouts.app')
@section('title', 'Lacak Pengantaran & Driver — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">

    <!-- Header Section -->
    <div class="bg-white border border-outline-variant/30 rounded-3xl p-8 md:p-10 shadow-card relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-3 max-w-2xl text-center md:text-left z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-mono font-bold border border-secondary/20">
                <span class="material-symbols-outlined text-sm">two_wheeler</span>
                LIVE DRIVER & DELIVERY TRACKER
            </div>
            <h1 class="font-display font-extrabold text-2xl md:text-4xl text-on-surface tracking-tight">
                Lacak Pengantaran Pesanan & Driver
            </h1>
            <p class="text-sm font-sans text-on-surface-variant leading-relaxed">
                Pantau lokasi kurir pengantar secara realtime, cek estimasi jarak, dan dapatkan PIN verifikasi untuk menerima pesanan Anda dengan aman.
            </p>
        </div>

        <!-- Form Cari Nomor Resi / Phone -->
        <div class="w-full md:w-80 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 shadow-sm shrink-0 z-10">
            <form method="GET" action="{{ route('delivery.userIndex') }}" class="space-y-2">
                <label class="font-mono text-xs text-on-surface-variant block font-semibold">Cari Kode Resi / No. HP:</label>
                <div class="flex gap-2">
                    <input type="text" name="q" value="{{ request('q') }}" placeholder="Contoh: TRK-2026..."
                        class="w-full bg-white text-on-surface text-xs font-mono px-3 py-2.5 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary">
                    <button type="submit" class="bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0">
                        Cari
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Daftar Pengantaran -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="font-display font-bold text-xl text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">local_shipping</span>
                Pengantaran Pesanan Anda
            </h2>
            @if(request('q'))
                <a href="{{ route('delivery.userIndex') }}" class="text-xs font-mono text-secondary hover:underline flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">restart_alt</span> Reset Pencarian
                </a>
            @endif
        </div>

        @forelse($deliveries as $del)
        <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all space-y-4">
            
            <!-- Top Status Row -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center font-bold">
                        <span class="material-symbols-outlined text-2xl">two_wheeler</span>
                    </div>
                    <div>
                        <span class="font-mono text-xs text-on-surface-variant">Kode Pelacakan:</span>
                        <h3 class="font-mono font-extrabold text-base text-primary">#{{ $del->tracking_code }}</h3>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider {{ $del->status_badge_class }}">
                        @if($del->status === 'diantar')
                            ⚡ SEDANG DIANTAR KURIR
                        @elseif($del->status === 'pending')
                            ⏳ MENUNGGU KURIR
                        @elseif($del->status === 'selesai')
                            ✅ PENGANTARAN SELESAI
                        @else
                            {{ strtoupper($del->status) }}
                        @endif
                    </span>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <!-- Driver Info -->
                <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-1">
                    <span class="text-on-surface-variant block text-[11px] font-bold">DRIVER / KURIR:</span>
                    <strong class="text-primary text-sm font-sans block">{{ $del->courier_name }}</strong>
                    <a href="https://wa.me/{{ $del->formatted_courier_wa_phone }}" target="_blank" class="inline-flex items-center gap-1 text-secondary font-bold hover:underline pt-1">
                        <span class="material-symbols-outlined text-sm">chat</span> {{ $del->courier_phone }}
                    </a>
                </div>

                <!-- Recipient Info -->
                <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-1">
                    <span class="text-on-surface-variant block text-[11px] font-bold">ALAMAT TUJUAN:</span>
                    <strong class="text-primary font-sans block truncate">{{ $del->customer_name }}</strong>
                    <p class="font-sans text-on-surface-variant line-clamp-2 text-[11px]">{{ $del->customer_address }}</p>
                </div>

                <!-- PIN & Actions -->
                <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2 flex flex-col justify-between">
                    <div>
                        <span class="text-on-surface-variant block text-[11px] font-bold">KODE PIN VERIFIKASI:</span>
                        <span class="font-mono text-xl font-extrabold text-secondary tracking-widest">{{ $del->delivery_pin }}</span>
                    </div>

                    <a href="{{ route('delivery.track', $del->tracking_code) }}"
                        class="w-full bg-secondary hover:bg-secondary/90 text-white font-mono font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md">
                        <span class="material-symbols-outlined text-base">map</span>
                        🗺️ Buka Peta Live Kurir
                    </a>
                </div>
            </div>

        </div>
        @empty
        <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-12 text-center space-y-4 shadow-card">
            <div class="w-16 h-16 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center mx-auto">
                <span class="material-symbols-outlined text-3xl">two_wheeler</span>
            </div>
            <div class="space-y-1 max-w-sm mx-auto">
                <h3 class="font-display font-bold text-base text-primary">Belum Ada Pengantaran Aktif</h3>
                <p class="text-xs text-on-surface-variant font-mono">
                    @if(request('q'))
                        Pencarian untuk "{{ request('q') }}" tidak ditemukan. Periksa kembali nomor resi Anda.
                    @else
                        Anda belum memiliki pesanan pengantaran kurir yang sedang berlangsung.
                    @endif
                </p>
            </div>
            <a href="{{ route('products.index') }}" class="inline-flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold hover:bg-primary-container/90 transition-all">
                <span class="material-symbols-outlined text-base">shopping_bag</span> belanja Sekarang
            </a>
        </div>
        @endforelse

        <div class="pt-4">
            {{ $deliveries->withQueryString()->links() }}
        </div>
    </div>

</div>
@endsection
