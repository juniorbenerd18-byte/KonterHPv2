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

            {{-- Provider Selection Grid --}}
            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <label class="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-sm">cell_tower</span>
                        Pilih Provider / Operator
                    </label>
                    <span id="selected-provider-info" class="text-xs font-mono font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                        Telkomsel Active
                    </span>
                </div>
                
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-3" id="provider-buttons-grid">
                    <!-- Telkomsel -->
                    <button type="button" onclick="selectProvider('Telkomsel', true)" data-provider="Telkomsel"
                            class="provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border-2 border-red-500 bg-red-500/10 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer">
                        <span class="w-8 h-8 rounded-full bg-red-600 text-white font-mono text-[10px] font-black flex items-center justify-center shadow">TS</span>
                        <span class="font-mono text-[11px] font-bold text-on-surface mt-1.5 group-hover:text-red-600 transition-colors">Telkomsel</span>
                        <span class="absolute top-1 right-1 material-symbols-outlined text-red-600 text-xs check-icon">check_circle</span>
                    </button>

                    <!-- Three (3) -->
                    <button type="button" onclick="selectProvider('Three (3)', true)" data-provider="Three (3)"
                            class="provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 bg-surface hover:border-orange-500/50 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer">
                        <span class="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-mono text-[11px] font-black flex items-center justify-center shadow">3</span>
                        <span class="font-mono text-[11px] font-bold text-on-surface mt-1.5 group-hover:text-orange-600 transition-colors">Tri (3)</span>
                        <span class="absolute top-1 right-1 material-symbols-outlined text-orange-600 text-xs check-icon hidden">check_circle</span>
                    </button>

                    <!-- Indosat -->
                    <button type="button" onclick="selectProvider('Indosat', true)" data-provider="Indosat"
                            class="provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 bg-surface hover:border-amber-500/50 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer">
                        <span class="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-mono text-[10px] font-black flex items-center justify-center shadow">ISAT</span>
                        <span class="font-mono text-[11px] font-bold text-on-surface mt-1.5 group-hover:text-amber-600 transition-colors">Indosat</span>
                        <span class="absolute top-1 right-1 material-symbols-outlined text-amber-600 text-xs check-icon hidden">check_circle</span>
                    </button>

                    <!-- XL Axiata -->
                    <button type="button" onclick="selectProvider('XL Axiata', true)" data-provider="XL Axiata"
                            class="provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 bg-surface hover:border-blue-500/50 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer">
                        <span class="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-[10px] font-black flex items-center justify-center shadow">XL</span>
                        <span class="font-mono text-[11px] font-bold text-on-surface mt-1.5 group-hover:text-blue-600 transition-colors">XL Axiata</span>
                        <span class="absolute top-1 right-1 material-symbols-outlined text-blue-600 text-xs check-icon hidden">check_circle</span>
                    </button>

                    <!-- Smartfren -->
                    <button type="button" onclick="selectProvider('Smartfren', true)" data-provider="Smartfren"
                            class="provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 bg-surface hover:border-pink-500/50 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer">
                        <span class="w-8 h-8 rounded-full bg-pink-600 text-white font-mono text-[10px] font-black flex items-center justify-center shadow">SF</span>
                        <span class="font-mono text-[11px] font-bold text-on-surface mt-1.5 group-hover:text-pink-600 transition-colors">Smartfren</span>
                        <span class="absolute top-1 right-1 material-symbols-outlined text-pink-600 text-xs check-icon hidden">check_circle</span>
                    </button>

                    <!-- Axis -->
                    <button type="button" onclick="selectProvider('Axis', true)" data-provider="Axis"
                            class="provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 bg-surface hover:border-purple-500/50 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer">
                        <span class="w-8 h-8 rounded-full bg-purple-600 text-white font-mono text-[10px] font-black flex items-center justify-center shadow">AX</span>
                        <span class="font-mono text-[11px] font-bold text-on-surface mt-1.5 group-hover:text-purple-600 transition-colors">Axis</span>
                        <span class="absolute top-1 right-1 material-symbols-outlined text-purple-600 text-xs check-icon hidden">check_circle</span>
                    </button>
                </div>
            </div>

            {{-- Phone Number Input --}}
            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card p-6 flex flex-col gap-4">
                <label class="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor Handphone Target</label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">phone_iphone</span>
                    <input id="phone-number" class="w-full pl-12 pr-32 py-4 bg-surface rounded-xl border border-outline-variant/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-mono text-sm text-on-surface outline-none transition-all" placeholder="0812 3456 7890" type="tel" value="0812 3456 7890">
                    <div id="provider-badge" class="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded-lg font-mono text-xs font-bold shadow-sm transition-all">TELKOMSEL</div>
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
                        <span class="text-on-surface-variant">Nomor Target</span>
                        <span id="summary-phone" class="font-bold text-on-surface">0812 3456 7890</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Provider</span>
                        <span id="summary-provider" class="font-bold text-secondary font-extrabold">Telkomsel</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-on-surface-variant">Produk Paket</span>
                        <span id="summary-product" class="font-bold text-on-surface">Pulsa 50.000</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span class="font-mono text-xs font-bold text-on-surface">Total Pembayaran</span>
                    <span id="summary-price" class="font-display font-bold text-lg text-secondary">Rp 51.500</span>
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

<!-- Modal Checkout Pulsa / Data -->
<div id="pulsa-checkout-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] hidden flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-5 fade-in">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <h3 class="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">payments</span>
                Konfirmasi Top-Up &amp; Bayar
            </h3>
            <button onclick="closePulsaModal()" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
                <span class="material-symbols-outlined text-xl">close</span>
            </button>
        </div>

        <div class="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/20 font-mono text-xs">
            <div class="flex justify-between">
                <span class="text-on-surface-variant">Target Nomor:</span>
                <strong id="modal-target-phone" class="text-on-surface"></strong>
            </div>
            <div class="flex justify-between">
                <span class="text-on-surface-variant">Provider:</span>
                <strong id="modal-target-provider" class="text-secondary"></strong>
            </div>
            <div class="flex justify-between">
                <span class="text-on-surface-variant">Paket / Nominal:</span>
                <strong id="modal-target-pkg" class="text-on-surface"></strong>
            </div>
            <div class="flex justify-between pt-2 border-t border-outline-variant/20 text-sm">
                <span class="font-bold text-on-surface">Total Biaya:</span>
                <strong id="modal-target-price" class="text-secondary font-extrabold"></strong>
            </div>
        </div>

        <div class="space-y-2">
            <label class="font-mono text-xs font-bold text-on-surface-variant uppercase">Metode Pembayaran</label>
            <div class="grid grid-cols-2 gap-2">
                <button type="button" onclick="selectPaymentMethod('qris')" id="pay-qris" class="p-3 border-2 border-secondary bg-secondary/10 rounded-xl font-mono text-xs font-bold text-secondary flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-base">qr_code_2</span> QRIS Instant
                </button>
                <button type="button" onclick="selectPaymentMethod('va')" id="pay-va" class="p-3 border border-outline-variant/30 rounded-xl font-mono text-xs font-bold text-on-surface-variant flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-base">account_balance</span> Virtual Account
                </button>
            </div>
        </div>

        <div class="pt-2 flex items-center gap-3">
            <button onclick="closePulsaModal()" class="flex-1 px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-xl font-mono text-xs font-bold text-on-surface-variant">
                Batal
            </button>
            <button onclick="submitPulsaPayment()" class="flex-1 px-4 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-mono text-xs font-bold shadow-md active:scale-95 flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-sm">bolt</span> Bayar Sekarang
            </button>
        </div>
    </div>
</div>

<script>
let selectedPackage = { product: '50.000', price: 'Rp 51.500', type: 'Pulsa' };
let currentProvider = 'Telkomsel';
let currentPayMethod = 'qris';

const providerPrefixes = {
    'Telkomsel': '0812',
    'Three (3)': '0896',
    'Indosat': '0857',
    'XL Axiata': '0818',
    'Smartfren': '0882',
    'Axis': '0838'
};

const providerColors = {
    'Telkomsel': { badge: 'bg-red-600 text-white', border: 'border-red-500 bg-red-500/10', text: 'text-red-600' },
    'Three (3)': { badge: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white', border: 'border-orange-500 bg-orange-500/10', text: 'text-orange-600' },
    'Indosat': { badge: 'bg-amber-400 text-slate-900', border: 'border-amber-500 bg-amber-500/10', text: 'text-amber-600' },
    'XL Axiata': { badge: 'bg-blue-600 text-white', border: 'border-blue-500 bg-blue-500/10', text: 'text-blue-600' },
    'Smartfren': { badge: 'bg-pink-600 text-white', border: 'border-pink-500 bg-pink-500/10', text: 'text-pink-600' },
    'Axis': { badge: 'bg-purple-600 text-white', border: 'border-purple-500 bg-purple-500/10', text: 'text-purple-600' }
};

function selectProvider(providerName, prefillPrefix = false) {
    currentProvider = providerName;
    const providerBadge = document.getElementById('provider-badge');
    const summaryProvider = document.getElementById('summary-provider');
    const infoBadge = document.getElementById('selected-provider-info');
    const phoneInput = document.getElementById('phone-number');

    summaryProvider.textContent = providerName;
    infoBadge.textContent = providerName + ' Active';

    // Reset button styles
    document.querySelectorAll('.provider-btn').forEach(btn => {
        btn.className = 'provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant/30 bg-surface hover:border-secondary/50 transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer';
        const icon = btn.querySelector('.check-icon');
        if (icon) icon.classList.add('hidden');
    });

    // Active button
    const activeBtn = document.querySelector(`.provider-btn[data-provider="${providerName}"]`);
    if (activeBtn) {
        const theme = providerColors[providerName] || { badge: 'bg-secondary text-white', border: 'border-secondary bg-secondary/10', text: 'text-secondary' };
        activeBtn.className = `provider-btn group flex flex-col items-center justify-center p-3 rounded-xl border-2 ${theme.border} transition-all duration-200 shadow-sm relative active:scale-95 cursor-pointer`;
        const icon = activeBtn.querySelector('.check-icon');
        if (icon) {
            icon.className = `absolute top-1 right-1 material-symbols-outlined ${theme.text} text-xs check-icon`;
        }
    }

    // Badge styling
    const theme = providerColors[providerName] || { badge: 'bg-secondary text-white' };
    providerBadge.className = `absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg font-mono text-xs font-bold shadow-sm transition-all ${theme.badge}`;
    providerBadge.textContent = providerName.toUpperCase();

    if (prefillPrefix && (!phoneInput.value || phoneInput.value.length < 5)) {
        const prefix = providerPrefixes[providerName] || '0812';
        phoneInput.value = prefix + ' 3456 7890';
        document.getElementById('summary-phone').textContent = phoneInput.value;
    }
}

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
}

function selectPackage(el, product, price, type) {
    document.querySelectorAll('.package-card').forEach(c => {
        c.classList.remove('border-2', 'border-secondary');
        c.classList.add('border', 'border-outline-variant/30');
        const icon = c.querySelector('.material-symbols-outlined');
        if (icon) { icon.classList.remove('icon-filled'); c.querySelector('div.absolute').classList.add('opacity-0', 'group-hover:opacity-100'); }
    });
    el.classList.remove('border', 'border-outline-variant/30');
    el.classList.add('border-2', 'border-secondary');
    const iconContainer = el.querySelector('div.absolute');
    if (iconContainer) {
        iconContainer.classList.remove('opacity-0', 'group-hover:opacity-100');
        el.querySelector('.material-symbols-outlined').classList.add('icon-filled');
    }

    selectedPackage = { product, price, type };
    document.getElementById('summary-product').textContent = type + ' ' + product;
    document.getElementById('summary-price').textContent = price;
}

// Phone input real-time sync & provider auto detect
document.getElementById('phone-number').addEventListener('input', function() {
    const num = this.value.replace(/\D/g, '');
    document.getElementById('summary-phone').textContent = this.value || '—';

    let detected = null;
    if (/^(0811|0812|0813|0821|0822|0823|0852|0853|0851)/.test(num)) detected = 'Telkomsel';
    else if (/^(0814|0815|0816|0855|0856|0857|0858)/.test(num)) detected = 'Indosat';
    else if (/^(0817|0818|0819|0859|0877|0878)/.test(num)) detected = 'XL Axiata';
    else if (/^(0838|0831|0832|0833)/.test(num)) detected = 'Axis';
    else if (/^(0895|0896|0897|0898|0899)/.test(num)) detected = 'Three (3)';
    else if (/^(0881|0882|0883|0884|0885|0886|0887|0888|0889)/.test(num)) detected = 'Smartfren';

    if (num.length >= 4 && detected) {
        selectProvider(detected, false);
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

    document.getElementById('modal-target-phone').textContent = phone;
    document.getElementById('modal-target-provider').textContent = currentProvider;
    document.getElementById('modal-target-pkg').textContent = selectedPackage.type + ' ' + selectedPackage.product;
    document.getElementById('modal-target-price').textContent = selectedPackage.price;
    document.getElementById('pulsa-checkout-modal').classList.remove('hidden');
}

function closePulsaModal() {
    document.getElementById('pulsa-checkout-modal').classList.add('hidden');
}

function selectPaymentMethod(method) {
    currentPayMethod = method;
    const btnQris = document.getElementById('pay-qris');
    const btnVa = document.getElementById('pay-va');
    if (method === 'qris') {
        btnQris.className = 'p-3 border-2 border-secondary bg-secondary/10 rounded-xl font-mono text-xs font-bold text-secondary flex items-center justify-center gap-2';
        btnVa.className = 'p-3 border border-outline-variant/30 rounded-xl font-mono text-xs font-bold text-on-surface-variant flex items-center justify-center gap-2';
    } else {
        btnVa.className = 'p-3 border-2 border-secondary bg-secondary/10 rounded-xl font-mono text-xs font-bold text-secondary flex items-center justify-center gap-2';
        btnQris.className = 'p-3 border border-outline-variant/30 rounded-xl font-mono text-xs font-bold text-on-surface-variant flex items-center justify-center gap-2';
    }
}

function submitPulsaPayment() {
    closePulsaModal();
    alert('🎉 Transaksi Berhasil Diproses!\n\nNomor: ' + document.getElementById('modal-target-phone').textContent + '\nProvider: ' + currentProvider + '\nPaket: ' + selectedPackage.type + ' ' + selectedPackage.product + '\nTotal: ' + selectedPackage.price + '\nMetode: ' + currentPayMethod.toUpperCase() + '\n\nPulsa / Paket Data akan langsung aktif dalam 1-3 detik!');
}
</script>
@endsection
