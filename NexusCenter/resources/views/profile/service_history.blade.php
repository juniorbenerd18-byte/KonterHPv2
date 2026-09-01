@extends('layouts.app')
@section('title', 'Riwayat Servis HP — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-20 w-full">
    <div class="flex flex-col md:flex-row gap-8">

        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-1/4 shrink-0">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 sticky top-28 shadow-card space-y-4">
                <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    @if($user && $user->avatar)
                        <img src="{{ Storage::url($user->avatar) }}" alt="{{ $user->name }}" class="w-12 h-12 rounded-full object-cover shadow-sm shrink-0 border border-outline-variant/30">
                    @else
                        <div class="w-12 h-12 rounded-full bg-secondary text-white font-display font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
                            {{ substr($user->name ?? 'G', 0, 1) }}
                        </div>
                    @endif
                    <div class="overflow-hidden">
                        <h4 class="font-display font-bold text-sm text-primary truncate">{{ $user->name ?? 'Pelanggan' }}</h4>
                        <p class="font-mono text-[11px] text-on-surface-variant truncate">{{ $user->email ?? '-' }}</p>
                    </div>
                </div>

                <nav class="flex flex-col gap-1.5 pt-2">
                    <a href="{{ route('profile.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">person</span>
                        Akun Saya
                    </a>
                    <a href="{{ route('profile.index') }}#orders-section" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">receipt_long</span>
                        Riwayat Pesanan
                    </a>
                    <a href="{{ route('profile.services') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-secondary font-mono text-xs font-bold border-l-4 border-secondary transition-all">
                        <span class="material-symbols-outlined icon-filled text-secondary">build</span>
                        Riwayat Servis
                    </a>
                    <a href="{{ route('cart.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">shopping_cart</span>
                        Keranjang Belanja
                    </a>
                </nav>
            </div>
        </aside>

        <!-- Main Content: Riwayat Servis -->
        <main class="w-full md:w-3/4 flex flex-col gap-6">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                <header class="mb-6 pb-4 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 class="font-display font-bold text-2xl md:text-3xl text-primary flex items-center gap-2">
                            <span class="material-symbols-outlined text-secondary">build_circle</span>
                            Riwayat Servis HP
                        </h1>
                        <p class="font-mono text-xs text-on-surface-variant mt-1">Lacak status perbaikan & pelunasan servis perangkat Anda di TECHCELL.</p>
                    </div>
                    <a href="{{ route('services.booking') }}" class="bg-secondary text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-sm shrink-0">
                        <span class="material-symbols-outlined text-[18px]">add</span>
                        Booking Servis Baru
                    </a>
                </header>

                <!-- Filters & Search Bar -->
                <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 pb-6 border-b border-outline-variant/20">
                    <!-- Status Tabs -->
                    <div class="flex gap-1.5 bg-surface-container p-1 rounded-xl overflow-x-auto">
                        <a href="{{ route('profile.services', array_merge(request()->query(), ['status' => 'all'])) }}"
                            class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap {{ request('status', 'all') === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary' }}">
                            Semua
                        </a>
                        <a href="{{ route('profile.services', array_merge(request()->query(), ['status' => 'Diterima'])) }}"
                            class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap {{ request('status') === 'Diterima' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary' }}">
                            Diterima
                        </a>
                        <a href="{{ route('profile.services', array_merge(request()->query(), ['status' => 'Dalam Proses'])) }}"
                            class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap {{ request('status') === 'Dalam Proses' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary' }}">
                            Dalam Proses
                        </a>
                        <a href="{{ route('profile.services', array_merge(request()->query(), ['status' => 'Selesai'])) }}"
                            class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap {{ request('status') === 'Selesai' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary' }}">
                            Selesai
                        </a>
                        <a href="{{ route('profile.services', array_merge(request()->query(), ['status' => 'Diambil'])) }}"
                            class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap {{ request('status') === 'Diambil' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary' }}">
                            Diambil
                        </a>
                    </div>

                    <!-- Search Form -->
                    <form method="GET" action="{{ route('profile.services') }}" class="relative w-full sm:w-64">
                        @if(request('status'))
                            <input type="hidden" name="status" value="{{ request('status') }}">
                        @endif
                        <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari ID Nota / HP..."
                            class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                        <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                    </form>
                </div>

                <!-- Service List Cards -->
                <div class="space-y-4">
                    @forelse($services as $service)
                    @php
                        $accentColor = match($service->status) {
                            'Diterima'           => 'bg-blue-500',
                            'Dalam Proses'       => 'bg-yellow-500',
                            'Menunggu Sparepart' => 'bg-amber-500',
                            'Selesai'            => 'bg-green-500',
                            'Diambil'            => 'bg-gray-400',
                            default              => 'bg-secondary',
                        };
                    @endphp

                    <article class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 hover:border-secondary/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                        <!-- Left Accent Bar -->
                        <div class="absolute top-0 left-0 w-1.5 h-full {{ $accentColor }}"></div>

                        <div class="flex flex-col lg:flex-row justify-between gap-6 pl-2">
                            <!-- Detail Kiri -->
                            <div class="flex gap-5 items-start">
                                <div class="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center shrink-0 border border-outline-variant/20 shadow-sm">
                                    <span class="material-symbols-outlined text-secondary text-3xl">smartphone</span>
                                </div>
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2.5 flex-wrap">
                                        <h3 class="font-display font-bold text-lg text-primary">{{ $service->device }}</h3>
                                        <span class="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider {{ $service->status_badge_class }}">
                                            @if($service->status === 'Dalam Proses')
                                                <span class="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block animate-pulse mr-1"></span>
                                            @endif
                                            {{ $service->status }}
                                        </span>
                                    </div>
                                    <p class="font-mono text-xs text-on-surface-variant font-medium">Jenis Servis: {{ $service->service_type }}</p>

                                    @if($service->issue)
                                    <div class="mt-2 text-xs bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 text-on-surface-variant">
                                        <span class="font-semibold text-primary">Keluhan:</span> {{ $service->issue }}
                                    </div>
                                    @endif

                                    @if($service->delivery)
                                    <div class="mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                                        <div class="flex items-center gap-2">
                                            <span class="material-symbols-outlined text-secondary animate-bounce text-[20px]">two_wheeler</span>
                                            <div>
                                                <strong class="text-primary block font-mono">🚚 HP Sedang Diantar Kurir ({{ $service->delivery->courier_name }})</strong>
                                                <span class="text-on-surface-variant font-mono text-[11px]">PIN Verifikasi Anda: <strong class="text-secondary font-mono font-bold text-sm ml-1">{{ $service->delivery->delivery_pin }}</strong></span>
                                            </div>
                                        </div>
                                        <a href="{{ route('delivery.track', $service->delivery->tracking_code) }}" target="_blank"
                                            class="bg-secondary text-white font-mono text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-sm">
                                            <span class="material-symbols-outlined text-[16px]">map</span>
                                            Lacak Peta Live &rarr;
                                        </a>
                                    </div>
                                    @endif

                                    <div class="flex flex-wrap gap-4 text-xs font-mono text-on-surface-variant pt-2">
                                        <span class="flex items-center gap-1">
                                            <span class="material-symbols-outlined text-[16px] text-secondary">tag</span>
                                            {{ $service->nota_number }}
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <span class="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
                                            Tgl Masuk: {{ $service->created_at->format('d M Y, H:i') }}
                                        </span>
                                        @if($service->estimated_date)
                                        <span class="flex items-center gap-1">
                                            <span class="material-symbols-outlined text-[16px] text-secondary">event_available</span>
                                            Est. Selesai: {{ $service->estimated_date->format('d M Y') }}
                                        </span>
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <!-- Detail Kanan (Biaya & Pelunasan) -->
                            <div class="flex flex-col justify-between items-start lg:items-end border-t lg:border-t-0 lg:border-l border-outline-variant/20 pt-4 lg:pt-0 lg:pl-6 min-w-[210px] shrink-0">
                                <div class="space-y-1 mb-4 lg:mb-0 lg:text-right w-full">
                                    <p class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Estimasi Total Biaya</p>
                                    <p class="font-mono font-bold text-lg text-secondary">{{ $service->formatted_price }}</p>
                                    @if($service->deposit > 0)
                                        <p class="font-mono text-xs text-green-700 font-medium">DP Masuk: {{ $service->formatted_deposit }}</p>
                                        <p class="font-mono text-xs text-on-surface-variant">Sisa Tagihan: <strong class="text-primary">Rp {{ number_format($service->remaining_payment, 0, ',', '.') }}</strong></p>
                                    @endif
                                </div>

                                <div class="flex items-center gap-2 w-full lg:w-auto">
                                    <a href="{{ route('services.receipt', $service->id) }}" target="_blank"
                                        class="w-full lg:w-auto bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary border border-outline-variant/40 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
                                        <span class="material-symbols-outlined text-[16px]">receipt</span>
                                        Nota / Detail
                                    </a>
                                </div>
                            </div>
                        </div>
                    </article>
                    @empty
                    <div class="text-center py-16 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                        <span class="material-symbols-outlined text-5xl text-on-surface-variant opacity-40 mb-2">build_circle</span>
                        <h4 class="font-display font-bold text-base text-primary">Belum Ada Riwayat Servis</h4>
                        <p class="text-xs font-mono text-on-surface-variant mt-1">Anda belum mendaftarkan perbaikan smartphone di TECHCELL NexusCenter.</p>
                        <a href="{{ route('services.booking') }}" class="inline-block mt-4 bg-secondary text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-sm">
                            Booking Servis Sekarang
                        </a>
                    </div>
                    @endforelse
                </div>

                <!-- Pagination -->
                @if($services->hasPages())
                <div class="mt-8 pt-4 border-t border-outline-variant/20 flex justify-center">
                    {{ $services->withQueryString()->links() }}
                </div>
                @endif
            </div>
        </main>
    </div>
</div>
@endsection
