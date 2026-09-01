@extends('layouts.app')
@section('title', 'Riwayat Transaksi')

@section('content')
<div class="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    <div class="mb-6">
        <h1 class="font-display font-bold text-headline-md text-on-surface">Riwayat Transaksi</h1>
        <p class="text-on-surface-variant text-sm mt-1">Semua transaksi penjualan dan servis tercatat di sini</p>
    </div>

    {{-- Filter Bar --}}
    <form method="GET" class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 mb-6 shadow-card">
        <div class="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
            <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Dari Tanggal</label>
                <input type="date" name="date_from" value="{{ request('date_from') }}"
                    class="border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
            </div>
            <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Sampai Tanggal</label>
                <input type="date" name="date_to" value="{{ request('date_to') }}"
                    class="border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
            </div>
            <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Tipe</label>
                <select name="type" class="border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                    <option value="all" {{ request('type','all')==='all'?'selected':'' }}>Semua</option>
                    <option value="penjualan" {{ request('type')==='penjualan'?'selected':'' }}>🛒 Penjualan</option>
                    <option value="servis" {{ request('type')==='servis'?'selected':'' }}>🔧 Servis</option>
                </select>
            </div>
            <div class="flex-1 min-w-48">
                <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Cari</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                    <input type="text" name="q" value="{{ request('q') }}" placeholder="Nama, ID, invoice..."
                        class="w-full pl-9 pr-4 py-2 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                </div>
            </div>
            <button type="submit" class="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-secondary/90 transition-all">
                <span class="material-symbols-outlined text-[18px]">filter_list</span> Filter
            </button>
            <a href="{{ route('history.index') }}" class="px-4 py-2 border border-outline-variant/30 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container transition-all">
                Reset
            </a>
        </div>
    </form>

    {{-- Penjualan --}}
    @if($type === 'all' || $type === 'penjualan')
    <div class="mb-6">
        <h2 class="font-display font-bold text-base text-on-surface flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-green-600 text-[20px] icon-filled">shopping_bag</span>
            Penjualan <span class="font-mono text-sm text-on-surface-variant">({{ $sales->count() }})</span>
        </h2>
        <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-surface-container border-b border-outline-variant/20">
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Invoice</th>
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Pelanggan</th>
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Item</th>
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">Metode</th>
                            <th class="text-right px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Total</th>
                            <th class="text-right px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-outline-variant/10">
                        @forelse($sales as $sale)
                        <tr class="hover:bg-surface-container-low transition-colors">
                            <td class="px-4 py-3">
                                <span class="font-mono text-sm font-semibold text-on-surface">{{ $sale->invoice_number }}</span>
                                @if($sale->discount > 0)
                                <span class="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono">-{{ $sale->discount }}%</span>
                                @endif
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell">
                                <p class="text-sm text-on-surface">{{ $sale->customer_name ?: 'Umum' }}</p>
                                <p class="text-xs text-on-surface-variant">{{ $sale->cashier_name }}</p>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell">
                                <p class="text-xs text-on-surface-variant line-clamp-2">
                                    {{ $sale->items->pluck('product_name')->implode(', ') }}
                                </p>
                            </td>
                            <td class="px-4 py-3 hidden sm:table-cell">
                                <span class="text-xs bg-surface-container rounded px-2 py-1 font-mono text-on-surface-variant">{{ $sale->payment_method }}</span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span class="font-mono font-bold text-secondary text-sm block">{{ $sale->formatted_total }}</span>
                                <a href="{{ route('sales.receipt', $sale->id) }}" class="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-bold mt-0.5" title="Lihat Struk">
                                    <span class="material-symbols-outlined text-[14px]">receipt</span> Struk
                                </a>
                            </td>
                            <td class="px-4 py-3 text-right hidden sm:table-cell">
                                <p class="text-xs text-on-surface-variant">{{ $sale->created_at->format('d M Y') }}</p>
                                <p class="text-xs text-on-surface-variant">{{ $sale->created_at->format('H:i') }}</p>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="px-4 py-10 text-center text-on-surface-variant text-sm">
                                <span class="material-symbols-outlined text-3xl mb-2 block opacity-30">shopping_bag</span>
                                Tidak ada data penjualan
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                    @if($sales->count())
                    <tfoot>
                        <tr class="bg-surface-container border-t border-outline-variant/20">
                            <td colspan="4" class="px-4 py-3 text-sm font-semibold text-on-surface-variant hidden md:table-cell">Total Keseluruhan</td>
                            <td class="px-4 py-3 text-right">
                                <span class="font-mono font-bold text-secondary">Rp {{ number_format($sales->sum('total'),0,',','.') }}</span>
                            </td>
                            <td class="hidden sm:table-cell"></td>
                        </tr>
                    </tfoot>
                    @endif
                </table>
            </div>
        </div>
    </div>
    @endif

    {{-- Servis --}}
    @if($type === 'all' || $type === 'servis')
    <div>
        <h2 class="font-display font-bold text-base text-on-surface flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
            Riwayat Servis <span class="font-mono text-sm text-on-surface-variant">({{ $services->count() }})</span>
        </h2>
        <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-surface-container border-b border-outline-variant/20">
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">No. Nota</th>
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Pelanggan</th>
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Perangkat</th>
                            <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">Status</th>
                            <th class="text-right px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Biaya & Nota</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-outline-variant/10">
                        @forelse($services as $service)
                        <tr class="hover:bg-surface-container-low transition-colors">
                            <td class="px-4 py-3">
                                <span class="font-mono text-sm font-semibold text-on-surface">{{ $service->nota_number }}</span>
                                <p class="text-xs text-on-surface-variant">{{ $service->created_at->format('d M Y') }}</p>
                            </td>
                            <td class="px-4 py-3">
                                <p class="text-sm font-semibold text-on-surface">{{ $service->customer_name }}</p>
                                <p class="text-xs text-on-surface-variant font-mono">{{ $service->customer_phone }}</p>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell">
                                <p class="text-sm text-on-surface">{{ $service->device }}</p>
                                <p class="text-xs text-on-surface-variant">{{ $service->service_type }}</p>
                            </td>
                            <td class="px-4 py-3 hidden sm:table-cell">
                                <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold
                                    @if($service->status === 'Diterima') status-diterima
                                    @elseif($service->status === 'Dalam Proses') status-proses
                                    @elseif($service->status === 'Menunggu Sparepart') status-sparepart
                                    @elseif($service->status === 'Selesai') status-selesai
                                    @else status-diambil @endif">
                                    {{ $service->status }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span class="font-mono font-bold text-secondary text-sm block">{{ $service->formatted_price }}</span>
                                @if($service->deposit > 0)
                                <p class="text-xs text-on-surface-variant">DP: Rp {{ number_format($service->deposit,0,',','.') }}</p>
                                @endif
                                <a href="{{ route('services.receipt', $service->id) }}" class="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-bold mt-0.5" title="Lihat Nota Servis">
                                    <span class="material-symbols-outlined text-[14px]">receipt_long</span> Nota
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="px-4 py-10 text-center text-on-surface-variant text-sm">
                                <span class="material-symbols-outlined text-3xl mb-2 block opacity-30">build_circle</span>
                                Tidak ada data servis
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    @endif
</div>
@endsection
