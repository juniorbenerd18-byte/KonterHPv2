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

        {{-- Payment Channel Box (QRIS / Virtual Account / Payment Confirmation) --}}
        <div class="px-8 py-6 bg-gradient-to-r from-slate-900 via-primary-container to-slate-900 text-white border-t border-outline-variant/20 space-y-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-cyan-400 text-2xl animate-pulse">account_balance_wallet</span>
                    <div>
                        <h4 class="font-display font-extrabold text-sm text-white">Status Pembayaran: {{ strtoupper($sale->payment_method) }}</h4>
                        <p class="text-[11px] font-mono text-cyan-300">
                            {{ $sale->delivery ? '🟢 Pembayaran Terkonfirmasi Lunas & Pengantaran Aktif' : 'Selesaikan pembayaran menggunakan channel di bawah ini' }}
                        </p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase {{ $sale->delivery || session('success') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse' }}">
                    {{ $sale->delivery || session('success') ? '✓ LUNAS' : 'MENUNGGU BAYAR' }}
                </span>
            </div>

            @if($sale->payment_method === 'QRIS')
            <!-- QRIS Simulator Box -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center space-y-3">
                <p class="font-mono text-xs text-cyan-200">Scan Kode QRIS di bawah ini dengan OVO, GoPay, DANA, atau ShopeePay:</p>
                <div class="bg-white p-3 rounded-xl inline-block shadow-lg">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data={{ urlencode('qris://nexuscenter/pay/' . $sale->invoice_number . '/' . $sale->total) }}"
                         alt="QRIS Code Pembayaran" class="w-40 h-40 mx-auto">
                    <span class="font-mono text-[10px] font-bold text-slate-800 block mt-1">NEXUSCENTER QRIS OFFICIAL</span>
                </div>
                <div class="flex justify-center items-center gap-3 text-[11px] font-mono text-gray-300 flex-wrap">
                    <span>📱 GoPay</span> · <span>💜 OVO</span> · <span>💙 DANA</span> · <span>🧡 ShopeePay</span> · <span>🔴 LinkAja</span>
                </div>
            </div>

            @elseif($sale->payment_method === 'Transfer')
            <!-- Bank Virtual Account Transfer Box -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3 font-mono text-xs">
                <p class="text-cyan-200">Transfer ke Nomor Virtual Account berikut:</p>
                <div class="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/40 flex items-center justify-between">
                    <div>
                        <span class="text-[10px] text-gray-400 block">BANK BCA VIRTUAL ACCOUNT:</span>
                        <strong class="text-cyan-300 text-base tracking-widest" id="va-number">88012{{ str_pad($sale->id, 8, '0', STR_PAD_LEFT) }}</strong>
                    </div>
                    <button onclick="navigator.clipboard.writeText('88012{{ str_pad($sale->id, 8, '0', STR_PAD_LEFT) }}'); alert('Nomor Virtual Account disalin!')"
                        class="bg-cyan-500 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-400 transition-all">
                        Salin VA
                    </button>
                </div>
            </div>
            @endif

            <!-- Live Delivery Status & Tracking Link if exists -->
            @if($sale->delivery)
            <div class="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-emerald-400 text-xl animate-bounce">two_wheeler</span>
                    <div>
                        <strong class="text-emerald-300 block">Kurir Pengantaran Ditugaskan!</strong>
                        <span class="text-gray-300">Kode Tracking: #{{ $sale->delivery->tracking_code }} | PIN: {{ $sale->delivery->delivery_pin }}</span>
                    </div>
                </div>
                <a href="{{ route('delivery.track', $sale->delivery->tracking_code) }}"
                   class="bg-emerald-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg hover:bg-emerald-400 transition-all">
                    🗺️ Lacak Peta Kurir
                </a>
            </div>
            @endif

            <!-- Instant Payment Confirmation Button -->
            <form method="POST" action="{{ route('sales.confirmPayment', $sale) }}">
                @csrf
                <button type="submit"
                    class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-extrabold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-95 text-xs flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-lg">verified_user</span>
                    ⚡ KONFIRMASI BAYAR INSTANT (UJI PEMBAYARAN LUNAS)
                </button>
            </form>
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
