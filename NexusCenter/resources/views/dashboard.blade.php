@extends('layouts.app')
@section('title', 'Dashboard')

@section('content')
<div class="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    {{-- Hero Welcome Banner --}}
    <section class="mb-8 rounded-xl overflow-hidden relative bg-primary-container circuit-bg shadow-lg border border-white/5">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/95 to-transparent"></div>
        <div class="absolute inset-0 opacity-20 bg-gradient-to-br from-secondary/30 to-transparent"></div>
        <div class="relative z-10 px-8 py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
                <span class="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-fixed-dim px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3 border border-secondary/20">
                    <span class="w-1.5 h-1.5 bg-secondary-fixed-dim rounded-full animate-pulse"></span>
                    Sistem Aktif
                </span>
                <h1 class="font-display text-display-md text-white mb-2 leading-tight">
                    Selamat Datang, <span class="text-secondary-fixed-dim">{{ auth()->user()->name }}</span> 👋
                </h1>
                <p class="text-white/60 text-base">{{ now()->isoFormat('dddd, D MMMM Y') }} · Pantau bisnis Anda secara real-time</p>
            </div>
            <div class="flex gap-3 flex-wrap">
                <a href="{{ route('sales.index') }}" class="flex items-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-all hover:shadow-[0_0_15px_rgba(0,104,122,0.4)]">
                    <span class="material-symbols-outlined text-[18px]">shopping_cart</span> POS Penjualan
                </a>
                <a href="{{ route('services.index') }}" class="flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-lg font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all">
                    <span class="material-symbols-outlined text-[18px]">build</span> Servis HP
                </a>
            </div>
        </div>
    </section>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @php
            $stats = [
                ['label' => 'Penjualan Hari Ini', 'value' => 'Rp '.number_format($todaySales,0,',','.'), 'icon' => 'payments', 'color' => 'text-green-600', 'bg' => 'bg-green-50', 'border' => 'border-green-100', 'sub' => $todayTransactions.' transaksi'],
                ['label' => 'Total Transaksi', 'value' => $totalTransactions, 'icon' => 'receipt_long', 'color' => 'text-secondary', 'bg' => 'bg-cyan-50', 'border' => 'border-cyan-100', 'sub' => 'Semua tercatat'],
                ['label' => 'Servis Aktif', 'value' => $activeServices, 'icon' => 'build_circle', 'color' => 'text-orange-600', 'bg' => 'bg-orange-50', 'border' => 'border-orange-100', 'sub' => 'Sedang diproses'],
                ['label' => 'Total Produk', 'value' => $totalProducts, 'icon' => 'inventory_2', 'color' => 'text-purple-600', 'bg' => 'bg-purple-50', 'border' => 'border-purple-100', 'sub' => $lowStockProducts.' stok menipis'],
            ];
        @endphp
        @foreach($stats as $stat)
        <div class="bg-surface-container-lowest border {{ $stat['border'] }} rounded-xl p-5 shadow-card card-hover transition-all duration-300 flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <div class="{{ $stat['bg'] }} {{ $stat['color'] }} w-10 h-10 rounded-lg flex items-center justify-center">
                    <span class="material-symbols-outlined icon-filled text-[22px]">{{ $stat['icon'] }}</span>
                </div>
                <span class="text-xs text-on-surface-variant font-mono">{{ $stat['sub'] }}</span>
            </div>
            <div>
                <p class="text-xs text-on-surface-variant uppercase tracking-wider font-mono mb-1">{{ $stat['label'] }}</p>
                <p class="font-display font-bold text-2xl text-on-surface leading-tight">{{ $stat['value'] }}</p>
            </div>
        </div>
        @endforeach
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {{-- Recent Sales --}}
        <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card">
            <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                <h2 class="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-[20px] icon-filled">receipt_long</span>
                    Transaksi Terbaru
                </h2>
                <a href="{{ route('history.index') }}" class="text-secondary text-sm font-semibold hover:underline flex items-center gap-1">
                    Lihat Semua <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
            </div>
            <div class="divide-y divide-outline-variant/10">
                @forelse($recentSales as $sale)
                <div class="px-6 py-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors">
                    <div class="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-green-600 text-[18px] icon-filled">shopping_bag</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm text-on-surface truncate">{{ $sale->invoice_number }}</p>
                        <p class="text-xs text-on-surface-variant">{{ $sale->customer_name ?: 'Pelanggan Umum' }} · {{ $sale->payment_method }}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="font-mono font-bold text-sm text-secondary">{{ $sale->formatted_total }}</p>
                        <p class="text-xs text-on-surface-variant">{{ $sale->created_at->diffForHumans() }}</p>
                    </div>
                </div>
                @empty
                <div class="px-6 py-10 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-4xl mb-2 block opacity-30">receipt_long</span>
                    <p class="text-sm">Belum ada transaksi</p>
                </div>
                @endforelse
            </div>
        </div>

        {{-- Recent Services --}}
        <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card">
            <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                <h2 class="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
                    Servis Terbaru
                </h2>
                <a href="{{ route('services.index') }}" class="text-secondary text-sm font-semibold hover:underline flex items-center gap-1">
                    Lihat Semua <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
            </div>
            <div class="divide-y divide-outline-variant/10">
                @forelse($recentServices as $service)
                <div class="px-6 py-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors">
                    <div class="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-orange-500 text-[18px] icon-filled">smartphone</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm text-on-surface truncate">{{ $service->customer_name }}</p>
                        <p class="text-xs text-on-surface-variant truncate">{{ $service->device }} · {{ $service->service_type }}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                            @if($service->status === 'Diterima') status-diterima
                            @elseif($service->status === 'Dalam Proses') status-proses
                            @elseif($service->status === 'Menunggu Sparepart') status-sparepart
                            @elseif($service->status === 'Selesai') status-selesai
                            @else status-diambil @endif">
                            {{ $service->status }}
                        </span>
                        <p class="text-xs text-on-surface-variant mt-1">{{ $service->created_at->diffForHumans() }}</p>
                    </div>
                </div>
                @empty
                <div class="px-6 py-10 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-4xl mb-2 block opacity-30">build_circle</span>
                    <p class="text-sm">Belum ada data servis</p>
                </div>
                @endforelse
            </div>
        </div>
    </div>

    {{-- Quick Info --}}
    <div class="mt-6 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-card">
        <h3 class="font-display font-bold text-base text-on-surface mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[18px] icon-filled">info</span>
            Info Sistem
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @php
                $info = [
                    ['label' => 'Total Produk',   'value' => $totalProducts,    'icon' => 'inventory_2'],
                    ['label' => 'Total Transaksi','value' => $totalTransactions, 'icon' => 'receipt_long'],
                    ['label' => 'Total Servis',   'value' => $totalServices,     'icon' => 'build'],
                    ['label' => 'Stok Menipis',   'value' => $lowStockProducts,  'icon' => 'warning'],
                ];
            @endphp
            @foreach($info as $item)
            <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <span class="material-symbols-outlined text-on-surface-variant text-[20px]">{{ $item['icon'] }}</span>
                <div>
                    <p class="text-xs text-on-surface-variant font-mono">{{ $item['label'] }}</p>
                    <p class="font-display font-bold text-xl text-on-surface">{{ $item['value'] }}</p>
                </div>
            </div>
            @endforeach
        </div>
    </div>

</div>
@endsection
