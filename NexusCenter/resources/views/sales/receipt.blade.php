@extends('layouts.app')
@section('title', 'Struk Pembelian #{{ $sale->invoice_number }} — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">

    {{-- Success Banner --}}
    @if(session('success'))
    <div class="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
        <span class="material-symbols-outlined text-green-600 text-2xl icon-filled">check_circle</span>
        <span class="font-mono text-sm font-bold">{{ session('success') }}</span>
    </div>
    @endif

    {{-- Receipt Card --}}
    <div id="receipt-card" class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card overflow-hidden">

        {{-- Header --}}
        <div class="bg-primary px-8 py-6 text-white text-center relative overflow-hidden">
            <div class="absolute inset-0 circuit-pattern opacity-10 pointer-events-none"></div>
            <div class="relative z-10">
                <div class="text-3xl font-display font-extrabold tracking-tight mb-0.5">TECHCELL</div>
                <div class="text-xs font-mono opacity-80 uppercase tracking-widest">NexusCenter — Official Store</div>
                <div class="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5 text-xs font-mono font-bold">
                    <span class="material-symbols-outlined text-[16px] icon-filled">receipt_long</span>
                    Struk / Bukti Pembelian
                </div>
            </div>
        </div>

        {{-- Invoice Info --}}
        <div class="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-low/50">
            <div class="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5">No. Invoice</div>
                    <div class="font-bold text-primary text-sm">#{{ $sale->invoice_number }}</div>
                </div>
                <div class="text-right">
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5">Tanggal</div>
                    <div class="font-bold text-on-surface">{{ $sale->created_at->format('d M Y, H:i') }}</div>
                </div>
                <div>
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5">Nama Pembeli</div>
                    <div class="font-bold text-on-surface">{{ $sale->customer_name ?? '—' }}</div>
                </div>
                <div class="text-right">
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5">No. Telepon</div>
                    <div class="font-bold text-on-surface">{{ $sale->customer_phone ?? '—' }}</div>
                </div>
                <div>
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5">Metode Pembayaran</div>
                    <div class="font-bold text-secondary">{{ $sale->payment_method }}</div>
                </div>
                <div class="text-right">
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5">Kasir / Diproses</div>
                    <div class="font-bold text-on-surface">{{ $sale->cashier_name ?? 'Online' }}</div>
                </div>
                @if($sale->customer_address)
                <div class="col-span-2 mt-1 pt-2 border-t border-outline-variant/15">
                    <div class="text-on-surface-variant uppercase tracking-wider mb-0.5 flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-secondary">local_shipping</span> Alamat Lengkap Pengiriman:</div>
                    <div class="font-bold text-on-surface text-xs bg-surface-container/50 p-2 rounded-lg border border-outline-variant/20">{{ $sale->customer_address }}</div>
                </div>
                @endif
            </div>
        </div>

        {{-- Items --}}
        <div class="px-8 py-5">
            <div class="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider mb-3">Detail Produk</div>
            <div class="divide-y divide-outline-variant/15">
                @foreach($sale->items as $item)
                <div class="py-3 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-xl shrink-0">
                            📱
                        </div>
                        <div>
                            <div class="font-display font-bold text-sm text-primary">{{ $item->product_name }}</div>
                            <div class="font-mono text-xs text-on-surface-variant">
                                {{ $item->quantity }} pcs × Rp {{ number_format($item->price, 0, ',', '.') }}
                            </div>
                        </div>
                    </div>
                    <div class="font-mono font-bold text-sm text-on-surface shrink-0">
                        Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        {{-- Totals --}}
        <div class="px-8 py-5 border-t border-outline-variant/20 bg-surface-container-low/50 space-y-2 font-mono text-sm">
            <div class="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>Rp {{ number_format($sale->subtotal, 0, ',', '.') }}</span>
            </div>
            @if($sale->discount > 0)
            <div class="flex justify-between text-green-700 font-bold">
                <span>Diskon ({{ $sale->discount }}%)</span>
                <span>- Rp {{ number_format($sale->subtotal * $sale->discount / 100, 0, ',', '.') }}</span>
            </div>
            @endif
            <div class="flex justify-between text-on-surface-variant">
                <span>Ongkos Kirim</span>
                <span class="text-green-700 font-bold">GRATIS</span>
            </div>
            <div class="flex justify-between font-bold text-lg text-on-surface border-t border-outline-variant/20 pt-3 mt-3">
                <span>Total Bayar</span>
                <span class="text-secondary text-xl">Rp {{ number_format($sale->total, 0, ',', '.') }}</span>
            </div>
            @if($sale->change_amount > 0)
            <div class="flex justify-between text-on-surface-variant">
                <span>Jumlah Dibayar</span>
                <span>Rp {{ number_format($sale->amount_paid, 0, ',', '.') }}</span>
            </div>
            <div class="flex justify-between text-green-700 font-bold">
                <span>Kembalian</span>
                <span>Rp {{ number_format($sale->change_amount, 0, ',', '.') }}</span>
            </div>
            @endif
        </div>

        {{-- Footer --}}
        <div class="px-8 py-6 text-center border-t border-outline-variant/20">
            <div class="text-xs font-mono text-on-surface-variant leading-relaxed">
                Terima kasih telah berbelanja di <strong class="text-primary">TECHCELL NexusCenter</strong>!<br>
                Barang yang sudah dibeli tidak dapat dikembalikan. Hubungi kami untuk garansi produk.
            </div>
            <div class="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-on-surface-variant opacity-70">
                <span class="material-symbols-outlined text-[14px]">verified</span>
                Transaksi ini terverifikasi dan sah secara digital
            </div>
        </div>
    </div>

    {{-- Action Buttons --}}
    <div class="flex flex-col sm:flex-row gap-3 mt-6 flex-wrap">
        @if(auth()->check() && auth()->user()->isStaff())
        <a href="{{ route('delivery.index', ['sale_id' => $sale->id]) }}" class="w-full flex items-center justify-center gap-2 bg-secondary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">two_wheeler</span>
            🚚 Buat Tugas Pengantaran Kurir
        </a>
        @endif
        <a href="{{ route('home') }}" class="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-mono text-xs font-bold py-3.5 rounded-xl hover:border-secondary hover:text-secondary transition-all shadow-sm">
            <span class="material-symbols-outlined text-[18px]">home</span>
            Kembali ke Beranda
        </a>
        <a href="{{ route('products.index') }}" class="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-mono text-xs font-bold py-3.5 rounded-xl hover:border-secondary hover:text-secondary transition-all shadow-sm">
            <span class="material-symbols-outlined text-[18px]">storefront</span>
            Belanja Lagi
        </a>
        <a href="{{ route('profile.index', ['tab' => 'orders']) }}#orders-section" class="flex-1 flex items-center justify-center gap-2 bg-secondary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            Riwayat Pesanan
        </a>
        <button onclick="window.print()" class="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">print</span>
            Cetak Struk
        </button>
    </div>
</div>

<style>
@media print {
    nav, footer, .no-print, a:not(#receipt-card a) { display: none !important; }
    body { background: white !important; }
    #receipt-card { box-shadow: none; border: 1px solid #ccc; }
}
</style>
@endsection
