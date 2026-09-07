@extends('layouts.app')
@section('title', 'Katalog Produk — TECHCELL NexusCenter')

@section('content')
<div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 class="font-display font-bold text-2xl md:text-3xl text-on-surface">Katalog & Manajemen Produk</h1>
            <p class="text-on-surface-variant text-sm mt-1">Cari smartphone, aksesoris original, pulsa, dan atur ketersediaan stok.</p>
        </div>
        @if(auth()->check() && auth()->user()->isAdmin())
        <button onclick="openModal('add')"
            class="flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-mono text-sm font-bold hover:bg-secondary/90 transition-all shadow-md active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add</span>
            + Tambah Produk Baru
        </button>
        @endif
    </div>

    {{-- Toolbar: Search + Category Filters --}}
    <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 mb-8 shadow-card">
        <form method="GET" action="{{ route('products.index') }}" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari produk, merek, atau spesifikasi..."
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
            </div>
            <div class="flex gap-2 flex-wrap">
                @foreach(['all' => 'Semua', 'smartphone' => '📱 Smartphone', 'aksesoris' => '🔌 Aksesoris', 'pulsa' => '📶 Pulsa & Data'] as $val => $label)
                <a href="{{ route('products.index', array_merge(request()->query(), ['category' => $val])) }}"
                   class="px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border {{ request('category', 'all') === $val ? 'bg-secondary text-white border-secondary' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-secondary' }}">
                    {{ $label }}
                </a>
                @endforeach
            </div>
        </form>
    </div>

    {{-- View for Pengguna / Customer (Product Grid Cards) --}}
    @if(!auth()->check() || auth()->user()->isPengguna())
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        @forelse($products as $product)
        <div class="product-card bg-surface-container-lowest border border-outline-variant/25 rounded-2xl overflow-hidden hover:border-secondary transition-all duration-300 hover:shadow-lg flex flex-col justify-between group cursor-pointer"
             data-product="{{ json_encode($product) }}"
             data-image="{{ $product->image ? Storage::url($product->image) : '' }}"
             onclick="triggerCardModal(this, event)">
            <div class="bg-surface-container-low flex justify-center items-center h-48 relative overflow-hidden">
                @if($product->image)
                    <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                @else
                    <span class="text-6xl group-hover:scale-110 transition-transform duration-300">{{ $product->icon }}</span>
                @endif
                <span class="absolute top-3 left-3 bg-secondary/15 text-secondary text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase border border-secondary/20 backdrop-blur">
                    {{ $product->category }}
                </span>
                <button type="button" onclick="triggerCardModal(this, event)" class="absolute top-3 right-3 bg-surface-container-lowest/90 text-on-surface-variant hover:text-secondary text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur flex items-center gap-1 shadow-sm border border-outline-variant/30 active:scale-95 z-10">
                    <span class="material-symbols-outlined text-[14px]">info</span> Detail
                </button>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <div class="flex items-center justify-between gap-1 mb-1">
                    <span class="text-xs font-mono text-on-surface-variant">{{ $product->brand ?? 'TECHCELL' }}</span>
                    <span class="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                        <span class="material-symbols-outlined text-xs">star</span> {{ number_format($product->rating ?: 4.9, 1) }} ({{ $product->review_count ?: 128 }})
                    </span>
                </div>
                <h3 class="font-display font-bold text-base text-on-surface mb-2 line-clamp-2 hover:text-secondary transition-colors">{{ $product->name }}</h3>
                <p class="text-xs text-on-surface-variant mb-4 line-clamp-2">{{ $product->description }}</p>
                <div class="mt-auto pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                    <div>
                        <p class="font-mono font-bold text-lg text-secondary">{{ $product->formatted_price }}</p>
                        <p class="text-[11px] font-mono {{ $product->stock > 0 ? 'text-green-700' : 'text-red-600' }}">
                            {{ $product->stock > 0 ? 'Stok: ' . $product->stock : 'Stok Habis' }}
                        </p>
                    </div>

                    <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                        <button type="button" onclick="triggerCardModal(this, event)" class="p-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary transition-all cursor-pointer" title="Lihat Deskripsi & Spesifikasi">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        @if($product->stock > 0)
                        <form method="POST" action="{{ route('cart.add', $product) }}">
                            @csrf
                            <button type="submit" class="bg-secondary text-white p-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-sm active:scale-95" title="Tambah ke Keranjang">
                                <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                            </button>
                        </form>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full text-center py-12 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
            <p class="font-display font-bold text-base text-on-surface">Produk Tidak Ditemukan</p>
        </div>
        @endforelse
    </div>

    {{-- View for Staff / Admin / Kasir (Management Table) --}}
    @else
    <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-surface-container border-b border-outline-variant/20">
                        <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant w-12">Foto</th>
                        <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Nama Produk</th>
                        <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Kategori</th>
                        <th class="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Harga</th>
                        <th class="text-center px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Stok</th>
                        <th class="text-center px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/10">
                    @forelse($products as $product)
                    <tr class="hover:bg-surface-container-low transition-colors group">
                        <td class="px-4 py-3">
                            <div class="w-10 h-10 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center border border-outline-variant/20">
                                @if($product->image)
                                    <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}" class="w-full h-full object-cover">
                                @else
                                    <span class="text-xl">{{ $product->icon }}</span>
                                @endif
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <p class="font-semibold text-sm text-on-surface">{{ $product->name }}</p>
                            @if($product->brand)
                            <p class="text-xs text-on-surface-variant">{{ $product->brand }}</p>
                            @endif
                        </td>
                        <td class="px-4 py-3 hidden md:table-cell">
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container rounded-full text-xs font-mono text-on-surface-variant">
                                {{ $product->category_label }}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <span class="font-mono font-bold text-sm text-secondary">{{ $product->formatted_price }}</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <span class="inline-block px-2.5 py-1 rounded-full text-xs font-bold font-mono
                                {{ $product->stock <= 0 ? 'bg-red-100 text-red-700' : ($product->stock <= 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700') }}">
                                {{ $product->stock }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <div class="flex items-center justify-center gap-1">
                                @if(auth()->user()->isAdmin())
                                <button onclick="openModal('edit', {{ $product->toJson() }})"
                                    class="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-secondary/10 transition-all" title="Edit">
                                    <span class="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <form method="POST" action="{{ route('products.destroy', $product) }}" onsubmit="return confirm('Hapus produk ini?')">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-red-50 transition-all" title="Hapus">
                                        <span class="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </form>
                                @else
                                <span class="text-xs text-on-surface-variant italic">Lihat saja</span>
                                @endif
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="px-4 py-8 text-center text-on-surface-variant text-sm">Belum ada data produk.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @endif
</div>

{{-- Product Modal (Add & Edit) for Admin --}}
@if(auth()->check() && auth()->user()->isAdmin())
<div id="product-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] hidden flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl fade-in">
        <div class="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
            <h3 id="modal-title" class="font-display font-bold text-lg text-on-surface">Tambah Produk Baru</h3>
            <button onclick="closeModal()" class="text-on-surface-variant hover:text-on-surface">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <form id="product-form" method="POST" action="{{ route('products.store') }}" enctype="multipart/form-data" class="space-y-4">
            @csrf
            <input type="hidden" id="form-method" name="_method" value="POST">

            <div>
                <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Nama Produk *</label>
                <input type="text" id="input-name" name="name" required class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Kategori *</label>
                    <select id="input-category" name="category" required class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary">
                        <option value="smartphone">📱 Smartphone</option>
                        <option value="aksesoris">🔌 Aksesoris</option>
                        <option value="pulsa">📶 Pulsa & Data</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Merek</label>
                    <input type="text" id="input-brand" name="brand" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Harga (Rp) *</label>
                    <input type="number" id="input-price" name="price" min="0" required class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary font-mono">
                </div>
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Stok *</label>
                    <input type="number" id="input-stock" name="stock" min="0" required class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary font-mono">
                </div>
            </div>

            <div>
                <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Icon Emoji (Opsional)</label>
                <input type="text" id="input-icon" name="icon" placeholder="📱" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary">
            </div>

            <div>
                <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Deskripsi</label>
                <textarea id="input-description" name="description" rows="2" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary"></textarea>
            </div>

            <div>
                <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-1">Foto Produk <span class="text-[10px] normal-case text-on-surface-variant/70">(JPG/PNG/WebP, maks 2MB)</span></label>
                <div id="image-preview-wrap" class="hidden mb-2">
                    <img id="image-preview" src="" alt="preview" class="h-24 rounded-xl object-contain border border-outline-variant/30 bg-surface-container">
                </div>
                <input type="file" id="input-image" name="image" accept="image/*"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 transition-all"
                    onchange="previewImage(this)">
            </div>

            <div class="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-xs font-mono rounded-xl border border-outline-variant/30 text-on-surface-variant">Batal</button>
                <button type="submit" class="px-6 py-2 text-xs font-mono font-bold rounded-xl bg-secondary text-white">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endif

{{-- Detail Product Modal for Customer --}}
<div id="detail-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] hidden flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 md:p-8 border border-outline-variant/30 shadow-2xl fade-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-6">
            <div class="flex items-center gap-2">
                <span id="detail-icon" class="text-3xl">📱</span>
                <div>
                    <span id="detail-category-badge" class="bg-secondary/15 text-secondary font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">SMARTPHONE</span>
                    <h3 id="detail-name" class="font-display font-bold text-xl text-primary">Galaxy S24 Ultra</h3>
                </div>
            </div>
            <button onclick="closeDetailModal()" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div class="space-y-6">
            {{-- Product Image --}}
            <div id="detail-image-container" class="hidden w-full rounded-xl overflow-hidden border border-outline-variant/20" style="max-height:220px;">
                <img id="detail-image" src="" alt="" class="w-full h-full object-cover" style="max-height:220px;object-fit:contain;background:#f5f5f5;">
            </div>

            <div class="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                <div>
                    <span class="font-mono text-xs text-on-surface-variant block uppercase">Harga Produk</span>
                    <span id="detail-price" class="font-mono font-bold text-2xl text-secondary">Rp 19.999.000</span>
                </div>
                <div class="text-right">
                    <span class="font-mono text-xs text-on-surface-variant block uppercase">Ketersediaan Stok</span>
                    <span id="detail-stock" class="font-mono text-sm font-bold text-green-700">5 Unit Tersedia</span>
                </div>
            </div>

            {{-- Warranty Tag --}}
            <div class="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-secondary/20">
                <span class="material-symbols-outlined text-[16px] icon-filled">verified</span>
                Official Warranty — Garansi Resmi TECHCELL
            </div>

            {{-- Description Section --}}
            <div>
                <h4 class="font-display font-bold text-sm text-primary uppercase tracking-wider mb-2">Deskripsi Produk</h4>
                <p id="detail-description" class="text-sm font-body text-on-surface-variant leading-relaxed bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/15">
                    Deskripsi detail produk...
                </p>
            </div>

            {{-- Tech Specs Bento Grid (From Deskripsi folder design) --}}
            <div>
                <h4 class="font-display font-bold text-sm text-primary uppercase tracking-wider mb-3">Spesifikasi Utama (Tech Specs)</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="bg-surface-container-low border border-outline-variant/30 p-3 rounded-xl flex flex-col gap-1">
                        <div class="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center text-secondary">
                            <span class="material-symbols-outlined text-[18px]">memory</span>
                        </div>
                        <span class="font-mono text-[10px] text-on-surface-variant uppercase">Processor</span>
                        <span id="spec-chipset" class="font-mono text-xs font-bold text-primary">High-End Spec</span>
                    </div>
                    <div class="bg-surface-container-low border border-outline-variant/30 p-3 rounded-xl flex flex-col gap-1">
                        <div class="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center text-secondary">
                            <span class="material-symbols-outlined text-[18px]">photo_camera</span>
                        </div>
                        <span class="font-mono text-[10px] text-on-surface-variant uppercase">Kamera Utama</span>
                        <span id="spec-camera" class="font-mono text-xs font-bold text-primary">Pro Camera</span>
                    </div>
                    <div class="bg-surface-container-low border border-outline-variant/30 p-3 rounded-xl flex flex-col gap-1">
                        <div class="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center text-secondary">
                            <span class="material-symbols-outlined text-[18px]">smartphone</span>
                        </div>
                        <span class="font-mono text-[10px] text-on-surface-variant uppercase">Display</span>
                        <span id="spec-display" class="font-mono text-xs font-bold text-primary">AMOLED 120Hz</span>
                    </div>
                    <div class="bg-surface-container-low border border-outline-variant/30 p-3 rounded-xl flex flex-col gap-1">
                        <div class="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center text-secondary">
                            <span class="material-symbols-outlined text-[18px]">battery_charging_full</span>
                        </div>
                        <span class="font-mono text-[10px] text-on-surface-variant uppercase">Baterai</span>
                        <span id="spec-battery" class="font-mono text-xs font-bold text-primary">5000mAh / Fast</span>
                    </div>
                </div>
            </div>

            {{-- Delivery Feature Box (From Deskripsi/code.html) --}}
            <div class="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
                <span class="material-symbols-outlined text-secondary text-[24px]">local_shipping</span>
                <div>
                    <h5 class="font-mono text-xs font-bold text-primary mb-0.5">Bisa Antar ke Rumah — Gratis Ongkir</h5>
                    <p class="text-xs text-on-surface-variant">Pengiriman instan & aman untuk area terdekat. Terverifikasi oleh TECHCELL Official Store.</p>
                </div>
            </div>

            {{-- Rating & Review Submission Form --}}
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold text-amber-600 uppercase flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">star_rate</span> Rating & Ulasan Pelanggan
                    </span>
                    <span id="detail-rating-text" class="font-mono text-xs font-bold text-on-surface">4.9 ★ (128 ulasan)</span>
                </div>
                <form id="detail-review-form" method="POST" action="" class="flex items-center gap-2 pt-1">
                    @csrf
                    <select name="rating" class="bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-secondary flex-1">
                        <option value="5">⭐⭐⭐⭐⭐ (5/5) Sangat Puas</option>
                        <option value="4">⭐⭐⭐⭐ (4/5) Bagus</option>
                        <option value="3">⭐⭐⭐ (3/5) Cukup</option>
                        <option value="2">⭐⭐ (2/5) Kurang</option>
                        <option value="1">⭐ (1/5) Buruk</option>
                    </select>
                    <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">send</span> Ulas
                    </button>
                </form>
            </div>

            {{-- Action Form --}}
            <div id="detail-action-container" class="pt-4 border-t border-outline-variant/20 flex justify-end gap-3">
                <button type="button" onclick="closeDetailModal()" class="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant font-mono text-xs font-bold">Tutup</button>
                <form id="detail-cart-form" method="POST" action="">
                    @csrf
                    <button type="submit" class="bg-secondary text-white font-mono text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-md">
                        <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
                        + Tambah ke Keranjang
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function triggerCardModal(el, event) {
    if (event) event.stopPropagation();
    const card = el.closest('.product-card');
    if (!card) return;
    try {
        const product = typeof card.dataset.product === 'string' ? JSON.parse(card.dataset.product) : card.dataset.product;
        const imageUrl = card.dataset.image || '';
        openDetailModal(product, imageUrl);
    } catch(e) {
        console.error('Error opening detail modal:', e);
    }
}

function openDetailModal(product, imageUrl = '') {
    document.getElementById('detail-icon').innerText = product.icon || '📱';
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-category-badge').innerText = (product.category || 'smartphone').toUpperCase();
    document.getElementById('detail-price').innerText = 'Rp ' + Number(product.price).toLocaleString('id-ID');
    document.getElementById('detail-stock').innerText = product.stock > 0 ? product.stock + ' Unit Tersedia' : 'Stok Habis';
    document.getElementById('detail-description').innerText = product.description || 'Tidak ada deskripsi rinci.';

    const rating = product.rating ? Number(product.rating).toFixed(1) : '4.9';
    const reviews = product.review_count || 128;
    const ratingEl = document.getElementById('detail-rating-text');
    if (ratingEl) ratingEl.innerText = `${rating} ★ (${reviews} ulasan)`;

    const reviewForm = document.getElementById('detail-review-form');
    if (reviewForm) reviewForm.action = `/produk/${product.id}/ulasan`;

    // Foto produk
    const imgContainer = document.getElementById('detail-image-container');
    const imgEl = document.getElementById('detail-image');
    if (imageUrl) {
        imgEl.src = imageUrl;
        imgEl.alt = product.name;
        imgContainer.classList.remove('hidden');
        document.getElementById('detail-icon').style.display = 'none';
    } else {
        imgContainer.classList.add('hidden');
        document.getElementById('detail-icon').style.display = '';
    }

    // Dynamic specs
    if (product.name.includes('S24 Ultra')) {
        document.getElementById('spec-chipset').innerText = 'Snapdragon 8 Gen 3';
        document.getElementById('spec-camera').innerText = '200MP Main AI';
        document.getElementById('spec-display').innerText = '6.8" AMOLED 2X';
        document.getElementById('spec-battery').innerText = '5000mAh 45W';
    } else if (product.category === 'smartphone') {
        document.getElementById('spec-chipset').innerText = 'Octa-Core Pro';
        document.getElementById('spec-camera').innerText = '50MP Ultra-HD';
        document.getElementById('spec-display').innerText = 'AMOLED 120Hz';
        document.getElementById('spec-battery').innerText = '5000mAh Fast';
    } else {
        document.getElementById('spec-chipset').innerText = 'Original Chip';
        document.getElementById('spec-camera').innerText = 'Compact Specs';
        document.getElementById('spec-display').innerText = 'Official Product';
        document.getElementById('spec-battery').innerText = 'High Endurance';
    }

    const cartForm = document.getElementById('detail-cart-form');
    cartForm.action = `/keranjang/tambah/${product.id}`;

    document.getElementById('detail-modal').classList.remove('hidden');
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview-wrap').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

@if(auth()->check() && auth()->user()->isAdmin())
function openModal(mode, product = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');
    const method = document.getElementById('form-method');

    modal.classList.remove('hidden');
    if (mode === 'edit' && product) {
        title.innerText = 'Edit Produk: ' + product.name;
        form.action = `/produk/${product.id}`;
        method.value = 'PUT';
        document.getElementById('input-name').value = product.name;
        document.getElementById('input-category').value = product.category;
        document.getElementById('input-brand').value = product.brand || '';
        document.getElementById('input-price').value = product.price;
        document.getElementById('input-stock').value = product.stock;
        document.getElementById('input-icon').value = product.icon || '';
        document.getElementById('input-description').value = product.description || '';
        if (product.image) {
            document.getElementById('image-preview').src = `/storage/${product.image}`;
            document.getElementById('image-preview-wrap').classList.remove('hidden');
        } else {
            document.getElementById('image-preview-wrap').classList.add('hidden');
        }
    } else {
        title.innerText = 'Tambah Produk Baru';
        form.action = "{{ route('products.store') }}";
        method.value = 'POST';
        form.reset();
        document.getElementById('image-preview-wrap').classList.add('hidden');
    }
}
function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
}
@endif
</script>
@endsection
