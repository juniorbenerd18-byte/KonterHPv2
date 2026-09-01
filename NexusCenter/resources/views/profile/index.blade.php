@extends('layouts.app')
@section('title', 'My Profile — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-20 w-full">
    <div class="flex flex-col md:flex-row gap-8">

        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-1/4 shrink-0">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 sticky top-28 shadow-card space-y-4">
                <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    @if($user->avatar)
                        <img src="{{ Storage::url($user->avatar) }}" alt="{{ $user->name }}" class="w-12 h-12 rounded-full object-cover shadow-sm shrink-0 border border-outline-variant/30">
                    @else
                        <div class="w-12 h-12 rounded-full bg-secondary text-white font-display font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
                            {{ substr($user->name, 0, 1) }}
                        </div>
                    @endif
                    <div class="overflow-hidden">
                        <h4 class="font-display font-bold text-sm text-primary truncate">{{ $user->name }}</h4>
                        <p class="font-mono text-[11px] text-on-surface-variant truncate">{{ $user->email }}</p>
                    </div>
                </div>

                <nav class="flex flex-col gap-1.5 pt-2">
                    <a href="#account-section" onclick="switchProfileTab('account')" id="sidebar-tab-account" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-secondary font-mono text-xs font-bold border-l-4 border-secondary transition-all">
                        <span class="material-symbols-outlined icon-filled">person</span>
                        Akun Saya
                    </a>
                    <a href="#orders-section" onclick="switchProfileTab('orders')" id="sidebar-tab-orders" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">receipt_long</span>
                        Riwayat Pesanan
                    </a>
                    <a href="{{ route('profile.services') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">build</span>
                        Riwayat Servis
                    </a>
                    <a href="{{ route('cart.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-mono text-xs font-bold">
                        <span class="material-symbols-outlined">shopping_cart</span>
                        Keranjang Belanja
                    </a>
                </nav>
            </div>
        </aside>

        <!-- Profile Form & Canvas -->
        <div class="w-full md:w-3/4 flex flex-col gap-8">

            <form id="profile-form" method="POST" action="{{ route('profile.update') }}" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <input type="file" id="avatar-file-input" name="avatar" class="hidden" accept="image/*" onchange="previewAndSubmitAvatar()">

                <!-- User Header & Status Card -->
                <section class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden shadow-card mb-8">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div class="relative shrink-0 group cursor-pointer" onclick="document.getElementById('avatar-file-input').click()">
                        @if($user->avatar)
                            <img id="avatar-preview-img" src="{{ Storage::url($user->avatar) }}" alt="{{ $user->name }}" class="w-28 h-28 rounded-full object-cover border-4 border-surface shadow-md">
                        @else
                            <div id="avatar-preview-placeholder" class="w-28 h-28 rounded-full bg-secondary text-white font-display font-bold text-4xl flex items-center justify-center border-4 border-surface shadow-md">
                                {{ substr($user->name, 0, 1) }}
                            </div>
                        @endif
                        <button type="button" class="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg hover:bg-secondary transition-colors group-hover:scale-110" title="Ganti Foto Profil">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                    </div>
                    <div class="flex-grow text-center md:text-left flex flex-col gap-2 z-10">
                        <h1 class="font-display font-bold text-2xl md:text-3xl text-primary">{{ $user->name }}</h1>
                        <div class="flex flex-col gap-1 text-on-surface-variant font-mono text-xs">
                            <span class="flex items-center justify-center md:justify-start gap-2">
                                <span class="material-symbols-outlined text-[16px] text-secondary">mail</span> {{ $user->email }}
                            </span>
                            <span class="flex items-center justify-center md:justify-start gap-2">
                                <span class="material-symbols-outlined text-[16px] text-secondary">badge</span> Role: {{ ucfirst($user->role) }}
                            </span>
                        </div>
                    </div>
                    <div class="bg-gradient-to-br from-surface-container-low to-surface border border-outline-variant/30 p-6 rounded-2xl min-w-[200px] flex flex-col items-center justify-center text-center shadow-sm z-10 shrink-0">
                        <span class="material-symbols-outlined icon-filled text-secondary text-[36px] mb-1">workspace_premium</span>
                        <span class="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Status Akun</span>
                        <span class="font-display font-bold text-lg text-primary mt-0.5">{{ ucfirst($user->role) }} Member</span>
                        <span class="text-secondary font-mono text-xs font-bold mt-1">12.450 Points</span>
                    </div>
                </section>

                <!-- Account Details Tab Content -->
                <div id="content-account" class="space-y-8">
                    <section class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                            <h2 class="font-display font-bold text-xl text-primary flex items-center gap-2">
                                <span class="material-symbols-outlined text-secondary">badge</span>
                                Informasi Pribadi
                            </h2>
                            <span class="text-xs font-mono text-on-surface-variant">Klik untuk mengubah data profil</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Nama Lengkap *</label>
                                <input type="text" name="name" value="{{ old('name', $user->name) }}" required class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-body text-sm text-primary font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Alamat Email *</label>
                                <input type="email" name="email" value="{{ old('email', $user->email) }}" required class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-mono text-sm text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Password Baru (Opsional)</label>
                                <input type="password" name="password" placeholder="Kosongkan jika tidak ingin diubah" class="bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 font-mono text-sm text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Tipe Akun / Hak Akses</label>
                                <input type="text" readonly value="{{ ucfirst($user->role) }}" class="bg-surface-container-low/60 border border-outline-variant/20 rounded-xl p-3 font-mono text-sm text-on-surface-variant outline-none cursor-not-allowed">
                            </div>
                        </div>

                        <div class="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end">
                            <button type="submit" class="bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md flex items-center gap-2 active:scale-95">
                                <span class="material-symbols-outlined text-[18px]">save</span>
                                Simpan Perubahan Profil
                            </button>
                        </div>
                    </section>
                </div>
            </form>

            <!-- Orders Tab Content -->
            <div id="content-orders" class="space-y-8">
                <section id="orders-section" class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                    <header class="mb-6 border-b border-outline-variant/20 pb-4 flex items-center justify-between">
                        <div>
                            <h2 class="font-display font-bold text-2xl text-primary">Riwayat Pesanan</h2>
                            <p class="font-mono text-xs text-on-surface-variant mt-1">Daftar transaksi dan hasil checkout Anda di TECHCELL NexusCenter.</p>
                        </div>
                        <a href="{{ route('cart.index') }}" class="bg-secondary text-white font-mono text-xs font-bold px-4 py-2 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-sm">
                            <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
                            Keranjang ({{ count(session('cart', [])) }})
                        </a>
                    </header>

                    <div class="space-y-6">
                        @forelse($orders as $order)
                        <div class="border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary transition-all duration-300 bg-surface-container-lowest shadow-sm">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-outline-variant/20 gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-secondary icon-filled">local_shipping</span>
                                    <span class="font-mono text-xs font-bold text-secondary uppercase tracking-wider">Lunas / Completed</span>
                                    <span class="text-outline-variant mx-1">•</span>
                                    <span class="font-mono text-xs font-bold text-on-surface-variant">#{{ $order->invoice_number }}</span>
                                </div>
                                <span class="font-mono text-xs text-on-surface-variant">{{ $order->created_at->format('d M Y H:i') }}</span>
                            </div>

                            @foreach($order->items as $item)
                            <div class="flex flex-col sm:flex-row gap-4 mb-3 items-center justify-between border-b border-outline-variant/10 pb-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-2xl shrink-0">
                                        📱
                                    </div>
                                    <div>
                                        <h4 class="font-display font-bold text-base text-primary">{{ $item->product_name }}</h4>
                                        <p class="font-mono text-xs text-on-surface-variant">{{ $item->quantity }} x Rp {{ number_format($item->price, 0, ',', '.') }}</p>
                                    </div>
                                </div>
                                <span class="font-mono font-bold text-sm text-secondary">
                                    Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                                </span>
                            </div>
                            @endforeach

                            <div class="flex flex-col sm:flex-row justify-between items-center pt-3 gap-3">
                                <div class="text-xs font-mono text-on-surface-variant">
                                    Metode Pembayaran: <span class="font-bold text-on-surface">{{ $order->payment_method }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="font-mono text-sm font-bold text-primary">Total: Rp {{ number_format($order->total, 0, ',', '.') }}</span>
                                    <a href="{{ route('sales.receipt', $order->id) }}" class="bg-surface-container text-on-surface font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-secondary/10 hover:text-secondary transition-all">
                                        Struk / Receipt &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                        @empty
                        <div class="text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-2">receipt_long</span>
                            <h4 class="font-display font-bold text-base text-on-surface">Belum Ada Pesanan</h4>
                            <p class="text-xs text-on-surface-variant mt-1">Anda belum melakukan checkout pesanan produk.</p>
                            <a href="{{ route('products.index') }}" class="inline-block mt-4 bg-secondary text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-sm">
                                Mulai Belanja Sekarang
                            </a>
                        </div>
                        @endforelse
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>

<script>
function switchProfileTab(tab) {
    const tabAccount = document.getElementById('sidebar-tab-account');
    const tabOrders = document.getElementById('sidebar-tab-orders');
    const contentAccount = document.getElementById('content-account');
    const contentOrders = document.getElementById('content-orders');

    if (tab === 'account') {
        tabAccount.classList.add('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabAccount.classList.remove('text-on-surface-variant');
        tabOrders.classList.remove('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabOrders.classList.add('text-on-surface-variant');
        contentAccount.classList.remove('hidden');
        contentOrders.classList.remove('hidden');
    } else {
        tabOrders.classList.add('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabOrders.classList.remove('text-on-surface-variant');
        tabAccount.classList.remove('bg-secondary/10', 'text-secondary', 'border-l-4', 'border-secondary');
        tabAccount.classList.add('text-on-surface-variant');
        document.getElementById('orders-section').scrollIntoView({ behavior: 'smooth' });
    }
}

function previewAndSubmitAvatar() {
    const fileInput = document.getElementById('avatar-file-input');
    if (fileInput.files && fileInput.files[0]) {
        // Automatically submit the profile form to save avatar
        document.getElementById('profile-form').submit();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'orders' || window.location.hash === '#orders-section') {
        switchProfileTab('orders');
    }
});
</script>
@endsection
