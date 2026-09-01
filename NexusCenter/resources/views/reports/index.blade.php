@extends('layouts.app')
@section('title', 'Laporan & Statistik')

@section('content')
<div class="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 class="font-display font-bold text-headline-md text-on-surface">Laporan & Statistik Business</h1>
            <p class="text-on-surface-variant text-sm mt-1">Periode: {{ $from->isoFormat('D MMMM Y') }} — {{ $to->isoFormat('D MMMM Y') }}</p>
        </div>
        <button onclick="window.print()" class="bg-primary text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md">
            <span class="material-symbols-outlined text-[18px]">print</span>
            Cetak Laporan (PDF)
        </button>
    </div>

    {{-- Period Selector --}}
    <div class="flex gap-2 flex-wrap mb-6">
        @foreach(['today' => 'Hari Ini', 'week' => 'Minggu Ini', 'month' => 'Bulan Ini', 'year' => 'Tahun Ini'] as $val => $label)
        <a href="{{ route('reports.index', ['period' => $val]) }}"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all border {{ $period === $val ? 'bg-secondary text-white border-secondary shadow-[0_0_10px_rgba(0,104,122,0.3)]' : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-secondary' }}">
            {{ $label }}
        </a>
        @endforeach
    </div>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @php
            $cards = [
                ['label' => 'Total Penjualan', 'value' => 'Rp '.number_format($totalSales,0,',','.'), 'icon' => 'payments', 'color' => 'text-green-600', 'bg' => 'bg-green-50', 'border' => 'border-green-100'],
                ['label' => 'Pendapatan Servis', 'value' => 'Rp '.number_format($totalService,0,',','.'), 'icon' => 'build_circle', 'color' => 'text-orange-600', 'bg' => 'bg-orange-50', 'border' => 'border-orange-100'],
                ['label' => 'Total Transaksi', 'value' => $totalTransactions, 'icon' => 'receipt_long', 'color' => 'text-secondary', 'bg' => 'bg-cyan-50', 'border' => 'border-cyan-100'],
                ['label' => 'Servis Aktif', 'value' => $activeServices, 'icon' => 'pending_actions', 'color' => 'text-purple-600', 'bg' => 'bg-purple-50', 'border' => 'border-purple-100'],
            ];
        @endphp
        @foreach($cards as $card)
        <div class="bg-surface-container-lowest border {{ $card['border'] }} rounded-xl p-5 shadow-card card-hover transition-all duration-300">
            <div class="{{ $card['bg'] }} {{ $card['color'] }} w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <span class="material-symbols-outlined icon-filled text-[22px]">{{ $card['icon'] }}</span>
            </div>
            <p class="text-xs text-on-surface-variant font-mono uppercase tracking-wider mb-1">{{ $card['label'] }}</p>
            <p class="font-display font-bold text-xl text-on-surface leading-tight">{{ $card['value'] }}</p>
        </div>
        @endforeach
    </div>

    {{-- Grand Total --}}
    <div class="bg-primary-container circuit-bg rounded-xl p-6 mb-8 border border-white/5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <p class="text-white/50 text-xs font-mono uppercase tracking-wider mb-1">Total Pendapatan (Penjualan + Servis)</p>
                <p class="font-display font-extrabold text-3xl text-secondary-fixed-dim">Rp {{ number_format($totalSales + $totalService, 0, ',', '.') }}</p>
            </div>
            <div class="flex gap-4">
                <div class="text-center">
                    <p class="text-white/50 text-xs font-mono mb-1">Penjualan</p>
                    <p class="font-mono font-bold text-lg text-white">{{ number_format($totalSales, 0, ',', '.') }}</p>
                </div>
                <div class="w-px bg-white/10"></div>
                <div class="text-center">
                    <p class="text-white/50 text-xs font-mono mb-1">Servis</p>
                    <p class="font-mono font-bold text-lg text-white">{{ number_format($totalService, 0, ',', '.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {{-- Top Products --}}
        <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card">
            <div class="px-6 py-4 border-b border-outline-variant/20">
                <h2 class="font-display font-bold text-base text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-[20px] icon-filled">inventory_2</span>
                    Produk Terlaris
                </h2>
            </div>
            <div class="p-4 space-y-3">
                @forelse($topProducts as $i => $item)
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold font-mono flex-shrink-0
                        {{ $i === 0 ? 'bg-yellow-100 text-yellow-700' : ($i === 1 ? 'bg-gray-100 text-gray-600' : ($i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-surface-container text-on-surface-variant')) }}">
                        {{ $i + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-on-surface truncate">{{ $item->product_name }}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <div class="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                <div class="h-full bg-secondary rounded-full transition-all"
                                    style="width: {{ $topProducts->max('total_qty') > 0 ? ($item->total_qty / $topProducts->max('total_qty') * 100) : 0 }}%"></div>
                            </div>
                            <span class="text-xs font-mono text-on-surface-variant flex-shrink-0">{{ $item->total_qty }} pcs</span>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="font-mono font-bold text-secondary text-sm">Rp {{ number_format($item->total_revenue,0,',','.') }}</p>
                    </div>
                </div>
                @empty
                <div class="py-10 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-4xl mb-2 block opacity-30">inventory_2</span>
                    <p class="text-sm">Belum ada data penjualan</p>
                </div>
                @endforelse
            </div>
        </div>

        {{-- Top Services --}}
        <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card">
            <div class="px-6 py-4 border-b border-outline-variant/20">
                <h2 class="font-display font-bold text-base text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
                    Jenis Servis Terbanyak
                </h2>
            </div>
            <div class="p-4 space-y-3">
                @forelse($topServices as $i => $item)
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold font-mono flex-shrink-0
                        {{ $i === 0 ? 'bg-yellow-100 text-yellow-700' : ($i === 1 ? 'bg-gray-100 text-gray-600' : ($i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-surface-container text-on-surface-variant')) }}">
                        {{ $i + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-on-surface truncate">{{ $item->service_type }}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <div class="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                <div class="h-full bg-orange-400 rounded-full transition-all"
                                    style="width: {{ $topServices->max('total') > 0 ? ($item->total / $topServices->max('total') * 100) : 0 }}%"></div>
                            </div>
                            <span class="text-xs font-mono text-on-surface-variant flex-shrink-0">{{ $item->total }}x</span>
                        </div>
                    </div>
                </div>
                @empty
                <div class="py-10 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-4xl mb-2 block opacity-30">build_circle</span>
                    <p class="text-sm">Belum ada data servis</p>
                </div>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection
