@extends('layouts.app')
@section('title', 'POS Penjualan')

@section('content')
<div class="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    <div class="mb-6">
        <h1 class="font-display font-bold text-headline-md text-on-surface">POS Penjualan</h1>
        <p class="text-on-surface-variant text-sm mt-1">Kasir: <span class="font-semibold text-secondary">{{ auth()->user()->name }}</span></p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {{-- LEFT: Product List --}}
        <div class="lg:col-span-7 space-y-4">
            {{-- Search & Category --}}
            <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 shadow-card">
                <div class="relative mb-3">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                    <input type="text" id="search-product" placeholder="Cari produk..."
                        oninput="filterProducts()"
                        class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                </div>
                <div class="flex gap-2 flex-wrap" id="category-filters">
                    @foreach(['all' => 'Semua', 'smartphone' => '📱 Smartphone', 'aksesoris' => '🔌 Aksesoris', 'pulsa' => '📶 Pulsa'] as $val => $label)
                    <button onclick="filterCategory('{{ $val }}')" data-cat="{{ $val }}"
                        class="cat-btn px-3 py-1.5 rounded-lg text-sm font-medium transition-all border {{ $val === 'all' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-secondary/50' }}">
                        {{ $label }}
                    </button>
                    @endforeach
                </div>
            </div>

            {{-- Product Grid --}}
            <div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @foreach($products as $product)
                <div class="product-card bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden cursor-pointer card-hover transition-all duration-300 group flex flex-col"
                     data-name="{{ strtolower($product->name) }} {{ strtolower($product->brand ?? '') }}"
                     data-cat="{{ $product->category }}"
                     onclick="addToCart({{ $product->toJson() }})">
                    <div class="relative h-32 bg-white flex items-center justify-center p-3">
                        @if($product->stock <= 0)
                        <div class="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-10">
                            <span class="text-white font-bold text-xs bg-red-600 px-2 py-1 rounded">STOK HABIS</span>
                        </div>
                        @endif
                        @if($product->stock > 0 && $product->stock <= 5)
                        <span class="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">Stok {{ $product->stock }}</span>
                        @endif
                        @if($product->image)
                            <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}" class="h-full object-contain group-hover:scale-105 transition-transform duration-300">
                        @else
                            <span class="text-5xl group-hover:scale-110 transition-transform duration-300">{{ $product->icon }}</span>
                        @endif
                    </div>
                    <div class="p-3 flex-1 flex flex-col">
                        <p class="font-semibold text-xs text-on-surface leading-tight line-clamp-2 mb-1">{{ $product->name }}</p>
                        @if($product->brand)
                        <p class="text-[11px] text-on-surface-variant mb-1">{{ $product->brand }}</p>
                        @endif
                        <p class="font-mono font-bold text-secondary text-sm mt-auto">Rp {{ number_format($product->price, 0, ',', '.') }}</p>
                    </div>
                </div>
                @endforeach

                <div id="no-products" class="hidden col-span-3 py-16 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-5xl mb-3 block opacity-30">search_off</span>
                    <p>Produk tidak ditemukan</p>
                </div>
            </div>
        </div>

        {{-- RIGHT: Cart --}}
        <div class="lg:col-span-5">
            <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card sticky top-20">
                <div class="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                    <h2 class="font-display font-bold text-base text-on-surface flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-[20px] icon-filled">shopping_cart</span>
                        Keranjang
                        <span id="cart-count" class="bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
                    </h2>
                    <button onclick="clearCart()" class="text-xs text-error hover:underline flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">delete_sweep</span> Kosongkan
                    </button>
                </div>

                {{-- Cart Items --}}
                <div id="cart-items" class="divide-y divide-outline-variant/10 max-h-72 overflow-y-auto">
                    <div id="cart-empty" class="py-12 text-center text-on-surface-variant">
                        <span class="material-symbols-outlined text-4xl mb-2 block opacity-30">shopping_cart</span>
                        <p class="text-sm">Keranjang kosong</p>
                    </div>
                </div>

                {{-- Cart Summary --}}
                <div class="p-5 border-t border-outline-variant/20 space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-on-surface-variant">Subtotal</span>
                        <span id="subtotal" class="font-mono font-semibold text-on-surface">Rp 0</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-on-surface-variant">Diskon</span>
                        <div class="flex items-center gap-2">
                            <input type="number" id="discount" value="0" min="0" max="100"
                                oninput="recalcTotal()"
                                class="w-16 border border-outline-variant/30 rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:border-secondary transition-all">
                            <span class="text-on-surface-variant font-mono">%</span>
                        </div>
                    </div>
                    <div class="border-t border-outline-variant/20 pt-2 flex justify-between">
                        <span class="font-display font-bold text-on-surface">Total</span>
                        <span id="total" class="font-mono font-bold text-lg text-secondary">Rp 0</span>
                    </div>

                    {{-- Customer Info --}}
                    <div class="space-y-2">
                        <input type="text" id="customer-name" placeholder="👤 Nama Pelanggan (opsional)"
                            class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                        <input type="tel" id="customer-phone" placeholder="📞 No. HP (opsional)"
                            class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                    </div>

                    <button onclick="openPaymentModal()"
                        class="w-full bg-secondary text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-[0_0_15px_rgba(0,104,122,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        id="pay-btn" disabled>
                        <span class="material-symbols-outlined text-[18px] icon-filled">payments</span>
                        Proses Pembayaran
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Payment Modal --}}
<div id="payment-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 hidden">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closePaymentModal()"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b border-outline-variant/20">
            <h2 class="font-display font-bold text-xl text-on-surface">💳 Metode Pembayaran</h2>
            <button onclick="closePaymentModal()" class="p-2 rounded-lg hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6 space-y-4">
            <div class="bg-primary-container circuit-bg rounded-xl p-4 text-center">
                <p class="text-white/60 text-xs font-mono uppercase tracking-wider">Total Pembayaran</p>
                <p id="pay-modal-total" class="font-display font-bold text-3xl text-secondary-fixed-dim mt-1">Rp 0</p>
            </div>
            <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">Metode Pembayaran</label>
                <select id="pay-method" class="w-full border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                    <option value="Tunai">💵 Tunai</option>
                    <option value="Transfer">🏦 Transfer Bank</option>
                    <option value="QRIS">📱 QRIS</option>
                    <option value="Debit">💳 Kartu Debit</option>
                </select>
            </div>
            <div id="cash-section">
                <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">Uang Diterima</label>
                <input type="number" id="amount-paid" placeholder="0" min="0" oninput="calcChange()"
                    class="w-full border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                <div class="mt-2 p-3 bg-green-50 rounded-lg flex justify-between items-center">
                    <span class="text-sm text-green-700">Kembalian</span>
                    <span id="change" class="font-mono font-bold text-green-700">Rp 0</span>
                </div>
            </div>
            <button onclick="confirmPayment()"
                class="w-full bg-secondary text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-[0.98]">
                <span class="material-symbols-outlined text-[18px] icon-filled">check_circle</span>
                Konfirmasi Pembayaran
            </button>
        </div>
    </div>
</div>

{{-- Success Modal --}}
<div id="success-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 hidden">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-green-600 text-3xl icon-filled">check_circle</span>
        </div>
        <h2 class="font-display font-bold text-xl text-on-surface mb-1">Transaksi Berhasil!</h2>
        <p id="success-invoice" class="text-on-surface-variant text-sm mb-6"></p>
        <div class="flex gap-3">
            <button onclick="closeSuccessModal()" class="flex-1 border border-outline-variant/30 rounded-lg py-2.5 text-sm font-semibold hover:bg-surface-container transition-all">
                Tutup
            </button>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
let cart = {};
let currentTotal = 0;

function addToCart(product) {
    if (product.stock <= 0) return;
    const key = product.id;
    if (!cart[key]) {
        cart[key] = { ...product, qty: 0 };
    }
    if (cart[key].qty >= product.stock) {
        showToast('Stok tidak cukup!', 'error');
        return;
    }
    cart[key].qty++;
    renderCart();
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const payBtn = document.getElementById('pay-btn');
    const countEl = document.getElementById('cart-count');

    const keys = Object.keys(cart);
    countEl.textContent = keys.reduce((s, k) => s + cart[k].qty, 0);

    if (!keys.length) {
        container.innerHTML = '';
        container.appendChild(empty);
        empty.classList.remove('hidden');
        payBtn.disabled = true;
        document.getElementById('subtotal').textContent = 'Rp 0';
        document.getElementById('total').textContent = 'Rp 0';
        currentTotal = 0;
        return;
    }

    empty.classList.add('hidden');
    let subtotal = 0;
    container.innerHTML = keys.map(k => {
        const item = cart[k];
        const sub = item.price * item.qty;
        subtotal += sub;
        return `
        <div class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors">
            <div class="w-8 h-8 rounded bg-surface-container flex items-center justify-center flex-shrink-0 text-lg">${item.image ? `<img src="${item.image}" class="w-full h-full object-cover rounded">` : item.icon}</div>
            <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-on-surface leading-tight line-clamp-1">${item.name}</p>
                <p class="text-xs font-mono text-secondary">Rp ${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
                <button onclick="changeQty(${k},-1)" class="w-6 h-6 rounded bg-surface-container hover:bg-secondary/10 flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined text-[14px]">remove</span>
                </button>
                <span class="w-6 text-center text-sm font-mono font-bold">${item.qty}</span>
                <button onclick="changeQty(${k},1)" class="w-6 h-6 rounded bg-surface-container hover:bg-secondary/10 flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined text-[14px]">add</span>
                </button>
            </div>
        </div>`;
    }).join('');

    recalcTotal(subtotal);
    payBtn.disabled = false;
}

function recalcTotal(subtotalOverride) {
    const subtotal = subtotalOverride ?? Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
    const disc = Math.min(100, Math.max(0, parseInt(document.getElementById('discount').value) || 0));
    currentTotal = Math.round(subtotal - (subtotal * disc / 100));
    document.getElementById('subtotal').textContent = 'Rp ' + subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    document.getElementById('total').textContent = 'Rp ' + currentTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}

function clearCart() {
    if (!Object.keys(cart).length) return;
    if (!confirm('Kosongkan keranjang?')) return;
    cart = {};
    renderCart();
}

function filterProducts() {
    const q = document.getElementById('search-product').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    const activeCat = document.querySelector('.cat-btn.bg-secondary')?.dataset.cat || 'all';
    let visible = 0;
    cards.forEach(c => {
        const matchQ = c.dataset.name.includes(q);
        const matchC = activeCat === 'all' || c.dataset.cat === activeCat;
        c.style.display = (matchQ && matchC) ? '' : 'none';
        if (matchQ && matchC) visible++;
    });
    document.getElementById('no-products').style.display = visible ? 'none' : 'block';
}

function filterCategory(cat) {
    document.querySelectorAll('.cat-btn').forEach(b => {
        const active = b.dataset.cat === cat;
        b.classList.toggle('bg-secondary', active);
        b.classList.toggle('text-white', active);
        b.classList.toggle('border-secondary', active);
        b.classList.toggle('bg-surface-container', !active);
        b.classList.toggle('text-on-surface-variant', !active);
        b.classList.toggle('border-outline-variant/30', !active);
    });
    filterProducts();
}

function openPaymentModal() {
    if (!Object.keys(cart).length) return;
    document.getElementById('pay-modal-total').textContent = document.getElementById('total').textContent;
    document.getElementById('amount-paid').value = '';
    document.getElementById('change').textContent = 'Rp 0';
    document.getElementById('payment-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function calcChange() {
    const paid = parseInt(document.getElementById('amount-paid').value) || 0;
    const change = Math.max(0, paid - currentTotal);
    document.getElementById('change').textContent = 'Rp ' + change.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}

function confirmPayment() {
    const method = document.getElementById('pay-method').value;
    const paid   = parseInt(document.getElementById('amount-paid').value) || currentTotal;

    if (method === 'Tunai' && paid < currentTotal) {
        showToast('Uang yang diterima kurang!', 'error');
        return;
    }

    const items = Object.values(cart).map(i => ({ id: i.id, qty: i.qty }));
    const payload = {
        items,
        discount:       parseInt(document.getElementById('discount').value) || 0,
        payment_method: method,
        amount_paid:    paid,
        customer_name:  document.getElementById('customer-name').value,
        customer_phone: document.getElementById('customer-phone').value,
        _token:         CSRF_TOKEN,
    };

    fetch('{{ route('sales.store') }}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
        body: JSON.stringify(payload),
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            closePaymentModal();
            document.getElementById('success-modal').classList.remove('hidden');
            document.getElementById('success-invoice').textContent = 'Transaksi berhasil disimpan!';
            cart = {};
            renderCart();
            document.getElementById('customer-name').value = '';
            document.getElementById('customer-phone').value = '';
            document.getElementById('discount').value = 0;
        } else {
            showToast(data.message || 'Gagal menyimpan transaksi!', 'error');
        }
    })
    .catch(() => showToast('Terjadi kesalahan jaringan!', 'error'));
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

document.getElementById('pay-method').addEventListener('change', function() {
    document.getElementById('cash-section').style.display = this.value === 'Tunai' ? '' : 'none';
});
</script>
@endpush
