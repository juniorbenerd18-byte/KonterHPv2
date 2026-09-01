@extends('layouts.app')
@section('title', 'Pulsa & Data — TECHCELL NexusCenter')

@section('content')
<div class="fade-in">

    {{-- Hero Section --}}
    <section class="w-full bg-primary-container text-on-primary-container rounded-2xl overflow-hidden relative mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop mt-6">
        <div class="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent pointer-events-none"></div>
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle, #4cd7f6 1px, transparent 1px); background-size: 20px 20px;"></div>
        <div class="relative z-10 p-8 md:p-16 flex flex-col gap-4 max-w-2xl">
            <div class="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 text-secondary-fixed font-mono text-xs font-bold rounded-full px-3 py-1 w-fit">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary-container"></span>
                </span>
                Layanan Digital
            </div>
            <h1 class="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">Isi Ulang Cepat, Koneksi Tanpa Batas</h1>
            <p class="font-body text-sm md:text-base text-inverse-primary leading-relaxed">
                Beli pulsa dan paket data dengan mudah. Transaksi aman, langsung masuk dalam hitungan detik.
            </p>
        </div>
    </section>

    {{-- Input & Grid Section --}}
    <section class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {{-- Left Column: Input & Packages --}}
        <div class="lg:col-span-8 flex flex-col gap-8">

            {{-- Phone Number Input --}}
            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 flex flex-col gap-4">
                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor Handphone</label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">phone_iphone</span>
                    <input id="phone-number" class="w-full pl-12 pr-28 py-4 bg-surface rounded-xl border border-outline-variant/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-mono text-sm text-on-surface outline-none transition-all" placeholder="0812 3456 7890" type="tel">
                    <div id="provider-badge" class="absolute right-4 top-1/2 -translate-y-1/2 bg-surface-container-high px-2 py-1 rounded font-mono text-xs font-bold text-on-surface-variant">PROVIDER</div>
                </div>
            </div>

            {{-- Tabs --}}
            <div class="flex gap-0 border-b border-outline-variant/30">
                <button onclick="switchTab('pulsa')" id="tab-pulsa" class="px-6 py-3 font-mono text-sm font-bold text-secondary border-b-2 border-secondary transition-all">Pulsa</button>
                <button onclick="switchTab('data')" id="tab-data" class="px-6 py-3 font-mono text-sm font-bold text-on-surface-variant hover:text-primary transition-all">Paket Data</button>
            </div>

            {{-- Pulsa Package Grid --}}
            <div id="grid-pulsa" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                @php
                $pulsaPackages = [
                    ['amount' => '10.000', 'validity' => '+7 Hari', 'price' => 'Rp 11.000'],
                    ['amount' => '25.000', 'validity' => '+14 Hari', 'price' => 'Rp 26.500'],
                    ['amount' => '50.000', 'validity' => '+30 Hari', 'price' => 'Rp 51.500', 'selected' => true],
                    ['amount' => '100.000', 'validity' => '+60 Hari', 'price' => 'Rp 100.000'],
                    ['amount' => '150.000', 'validity' => '+90 Hari', 'price' => 'Rp 149.000'],
                    ['amount' => '200.000', 'validity' => '+120 Hari', 'price' => 'Rp 198.500'],
                ];
                @endphp
                @foreach($pulsaPackages as $pkg)
                <div onclick="selectPackage(this, '{{ $pkg['amount'] }}', '{{ $pkg['price'] }}', 'Pulsa')"
                    class="package-card bg-surface-container-lowest border {{ isset($pkg['selected']) ? 'border-2 border-secondary shadow-[0_0_15px_rgba(0,104,122,0.1)]' : 'border-outline-variant/30 hover:border-secondary hover:shadow-[0_0_15px_rgba(0,104,122,0.1)]' }} rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer relative group">
                    <div class="absolute top-3 right-3 {{ isset($pkg['selected']) ? '' : 'opacity-0 group-hover:opacity-100' }} transition-opacity">
                        <span class="material-symbols-outlined text-secondary {{ isset($pkg['selected']) ? 'icon-filled' : '' }}">check_circle</span>
                    </div>
                    <h3 class="font-display font-bold text-xl text-on-surface">{{ $pkg['amount'] }}</h3>
                    <p class="font-mono text-xs text-on-surface-variant">Masa aktif {{ $pkg['validity'] }}</p>
                    <div class="mt-2 pt-3 border-t border-outline-variant/20">
                        <span class="font-mono font-bold text-sm text-secondary">{{ $pkg['price'] }}</span>
                    </div>
                </div>
                @endforeach
            </div>

            {{-- Data Package Grid (hidden by default) --}}
            <div id="grid-data" class="hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                @php
                $dataPackages = [
                    ['amount' => '1 GB', 'validity' => '7 Hari', 'price' => 'Rp 12.000', 'desc' => 'YouTube & TikTok'],
                    ['amount' => '5 GB', 'validity' => '30 Hari', 'price' => 'Rp 45.000', 'desc' => 'All Apps', 'selected' => true],
                    ['amount' => '10 GB', 'validity' => '30 Hari', 'price' => 'Rp 85.000', 'desc' => 'Gaming & Stream'],
                    ['amount' => '25 GB', 'validity' => '30 Hari', 'price' => 'Rp 150.000', 'desc' => 'Heavy User'],
                    ['amount' => '50 GB', 'validity' => '30 Hari', 'price' => 'Rp 280.000', 'desc' => 'Premium Unlimited'],
                    ['amount' => '100 GB', 'validity' => '30 Hari', 'price' => 'Rp 450.000', 'desc' => 'Ultra Plus'],
                ];
                @endphp
                @foreach($dataPackages as $pkg)
                <div onclick="selectPackage(this, '{{ $pkg['amount'] }} — {{ $pkg['desc'] }}', '{{ $pkg['price'] }}', 'Paket Data')"
                    class="package-card bg-surface-container-lowest border {{ isset($pkg['selected']) ? 'border-2 border-secondary shadow-[0_0_15px_rgba(0,104,122,0.1)]' : 'border-outline-variant/30 hover:border-secondary hover:shadow-[0_0_15px_rgba(0,104,122,0.1)]' }} rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer relative group">
                    <div class="absolute top-3 right-3 {{ isset($pkg['selected']) ? '' : 'opacity-0 group-hover:opacity-100' }} transition-opacity">
                        <span class="material-symbols-outlined text-secondary {{ isset($pkg['selected']) ? 'icon-filled' : '' }}">check_circle</span>
                    </div>
                    <h3 class="font-display font-bold text-xl text-on-surface">{{ $pkg['amount'] }}</h3>
                    <p class="font-mono text-xs text-on-surface-variant">{{ $pkg['desc'] }} • {{ $pkg['validity'] }}</p>
                    <div class="mt-2 pt-3 border-t border-outline-variant/20">
                        <span class="font-mono font-bold text-sm text-secondary">{{ $pkg['price'] }}</span>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        {{-- Right Column: Order Summary --}}
        <div class="lg:col-span-4">
            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 sticky top-28 flex flex-col gap-6">
                <h2 class="font-display font-bold text-lg text-on-surface border-b border-outline-variant/20 pb-4">Ringkasan Pesanan</h2>

                <div class="flex flex-col gap-3 font-mono text-xs">
                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Nomor</span>
                        <span id="summary-phone" class="font-bold text-on-surface">—</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Provider</span>
                        <span id="summary-provider" class="font-bold text-on-surface">—</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Produk</span>
                        <span id="summary-product" class="font-bold text-on-surface">—</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span class="font-mono text-xs font-bold text-on-surface">Total Pembayaran</span>
                    <span id="summary-price" class="font-display font-bold text-lg text-secondary">—</span>
                </div>

                <button onclick="processTopup()" class="w-full bg-secondary text-white font-mono text-sm font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md">
                    Lanjut Pembayaran
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <p class="text-[11px] text-center text-secondary font-semibold flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">local_shipping</span>
                    Tersedia layanan antar ke rumah (Free Ongkir, maks. 4km).
                </p>
                <p class="text-[11px] text-center text-on-surface-variant flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">lock</span>
                    Transaksi dijamin aman dan terenkripsi
                </p>
            </div>
        </div>
    </section>
</div>

<script>
let selectedPackage = null;

function switchTab(tab) {
    const tabPulsa = document.getElementById('tab-pulsa');
    const tabData = document.getElementById('tab-data');
    const gridPulsa = document.getElementById('grid-pulsa');
    const gridData = document.getElementById('grid-data');

    if (tab === 'pulsa') {
        tabPulsa.classList.add('text-secondary', 'border-b-2', 'border-secondary');
        tabPulsa.classList.remove('text-on-surface-variant');
        tabData.classList.remove('text-secondary', 'border-b-2', 'border-secondary');
        tabData.classList.add('text-on-surface-variant');
        gridPulsa.classList.remove('hidden');
        gridData.classList.add('hidden');
    } else {
        tabData.classList.add('text-secondary', 'border-b-2', 'border-secondary');
        tabData.classList.remove('text-on-surface-variant');
        tabPulsa.classList.remove('text-secondary', 'border-b-2', 'border-secondary');
        tabPulsa.classList.add('text-on-surface-variant');
        gridData.classList.remove('hidden');
        gridPulsa.classList.add('hidden');
    }
    selectedPackage = null;
    document.getElementById('summary-product').textContent = '—';
    document.getElementById('summary-price').textContent = '—';
}

function selectPackage(el, product, price, type) {
    // Reset all cards
    document.querySelectorAll('.package-card').forEach(c => {
        c.classList.remove('border-2', 'border-secondary');
        c.classList.add('border', 'border-outline-variant/30');
        const icon = c.querySelector('.material-symbols-outlined');
        if (icon) { icon.classList.remove('icon-filled'); c.querySelector('div.absolute').classList.add('opacity-0', 'group-hover:opacity-100'); }
    });
    // Activate selected
    el.classList.remove('border', 'border-outline-variant/30');
    el.classList.add('border-2', 'border-secondary');
    const iconContainer = el.querySelector('div.absolute');
    iconContainer.classList.remove('opacity-0', 'group-hover:opacity-100');
    el.querySelector('.material-symbols-outlined').classList.add('icon-filled');

    selectedPackage = { product, price, type };
    document.getElementById('summary-product').textContent = type + ' ' + product;
    document.getElementById('summary-price').textContent = price;
}

// Phone number input: detect provider
document.getElementById('phone-number').addEventListener('input', function() {
    const num = this.value.replace(/\D/g, '');
    const badge = document.getElementById('summary-phone');
    const provider = document.getElementById('summary-provider');
    const providerBadge = document.getElementById('provider-badge');
    badge.textContent = num ? this.value : '—';

    // Simple prefix detection
    let detected = 'UNKNOWN';
    if (/^(0811|0812|0813|0821|0822|0823|0852|0853|0851)/.test(num)) detected = 'Telkomsel';
    else if (/^(0814|0815|0816|0855|0856|0857|0858)/.test(num)) detected = 'Indosat';
    else if (/^(0817|0818|0819|0859|0877|0878)/.test(num)) detected = 'XL Axiata';
    else if (/^(0838|0831|0832|0833)/.test(num)) detected = 'Axis';
    else if (/^(0895|0896|0897|0898|0899)/.test(num)) detected = 'Three (3)';
    else if (/^(0881|0882|0883|0884|0885|0886|0887|0888|0889)/.test(num)) detected = 'Smartfren';

    if (num.length >= 4) {
        provider.textContent = detected;
        providerBadge.textContent = detected.toUpperCase();
    } else {
        provider.textContent = '—';
        providerBadge.textContent = 'PROVIDER';
    }
});

function processTopup() {
    const phone = document.getElementById('phone-number').value.trim();
    if (!phone) {
        alert('Harap masukkan nomor handphone terlebih dahulu.');
        return;
    }
    if (!selectedPackage) {
        alert('Harap pilih paket pulsa atau data terlebih dahulu.');
        return;
    }
    alert('Fitur pembayaran segera hadir! Transaksi: ' + selectedPackage.type + ' ' + selectedPackage.product + ' untuk nomor ' + phone + '\nTotal: ' + selectedPackage.price);
}
</script>
@endsection
