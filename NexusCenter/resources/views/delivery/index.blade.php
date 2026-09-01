@extends('layouts.app')
@section('title', 'Manajemen Pengantaran Kurir — TECHCELL')

@section('content')
<div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- KIRI: Form Buat Tugas Pengantaran -->
        <div class="lg:col-span-5">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card sticky top-20 overflow-hidden">
                <div class="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
                    <h1 class="font-display font-bold text-lg text-primary flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary">two_wheeler</span>
                        Buat Tugas Pengantaran
                    </h1>
                </div>

                <form method="POST" action="{{ route('delivery.store') }}" class="p-6 space-y-4">
                    @csrf

                    <!-- Pilih Invoice Penjualan atau Nota Servis -->
                    <div>
                        <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Pilih Nota Servis / Invoice Penjualan</label>
                        <input type="hidden" name="service_id" id="service_id_hidden">
                        <input type="hidden" name="sale_id" id="sale_id_hidden">
                        <select id="source_select" onchange="autofillSource(this)"
                            class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary">
                            <option value="">-- Pilih Nota Servis / Invoice Penjualan --</option>
                            
                            @if(count($readySales) > 0)
                            <optgroup label="🛒 Invoice Penjualan (Produk / Online)">
                                @foreach($readySales as $sale)
                                @php
                                    $isSelected = request('sale_id') == $sale->id;
                                @endphp
                                <option value="sale_{{ $sale->id }}"
                                    data-type="sale"
                                    data-id="{{ $sale->id }}"
                                    data-name="{{ $sale->customer_name }}"
                                    data-phone="{{ $sale->customer_phone }}"
                                    data-address="{{ $sale->customer_address }}"
                                    {{ $isSelected ? 'selected' : '' }}>
                                    #{{ $sale->invoice_number }} — {{ $sale->customer_name ?: 'Pelanggan' }} ({{ $sale->formatted_total }})
                                </option>
                                @endforeach
                            </optgroup>
                            @endif

                            @if(count($readyServices) > 0)
                            <optgroup label="🔧 Nota Servis (Perbaikan HP)">
                                @foreach($readyServices as $srv)
                                @php
                                    $isSelected = request('service_id') == $srv->id;
                                @endphp
                                <option value="srv_{{ $srv->id }}"
                                    data-type="service"
                                    data-id="{{ $srv->id }}"
                                    data-name="{{ $srv->customer_name }}"
                                    data-phone="{{ $srv->customer_phone }}"
                                    data-address=""
                                    {{ $isSelected ? 'selected' : '' }}>
                                    #{{ $srv->nota_number }} — {{ $srv->customer_name }} ({{ $srv->device }})
                                </option>
                                @endforeach
                            </optgroup>
                            @endif
                        </select>
                    </div>

                    <!-- Informasi Kurir -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Nama Kurir *</label>
                            <input type="text" name="courier_name" value="Mas Budi Kurir" required
                                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary">
                        </div>
                        <div>
                            <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">No. WA Kurir *</label>
                            <input type="text" name="courier_phone" value="081234567890" required placeholder="Contoh: 081234567890"
                                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary">
                        </div>
                    </div>

                    <!-- Informasi Pelanggan -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Nama Pelanggan *</label>
                            <input type="text" name="customer_name" id="customer_name" required
                                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary">
                        </div>
                        <div>
                            <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">No. WA Pelanggan *</label>
                            <input type="text" name="customer_phone" id="customer_phone" required
                                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Alamat Lengkap Pengantaran *</label>
                        <textarea name="customer_address" required rows="2" placeholder="Jl. Raya No. XX, Kelurahan, Kecamatan, Patokan..."
                            class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-secondary resize-none"></textarea>
                    </div>

                    <button type="submit"
                        class="w-full bg-secondary text-white font-mono text-xs font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95">
                        <span class="material-symbols-outlined text-[18px]">send</span>
                        Buat Tugas & Generate PIN
                    </button>
                </form>
            </div>
        </div>

        <!-- KANAN: Daftar Pengantaran Aktif -->
        <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="font-display font-bold text-lg text-primary">Daftar Pengantaran Realtime</h2>
                <form method="GET" class="flex gap-2">
                    <select name="status" onchange="this.form.submit()"
                        class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-secondary">
                        <option value="all">Semua Status</option>
                        <option value="pending" {{ request('status')==='pending'?'selected':'' }}>Pending</option>
                        <option value="diantar" {{ request('status')==='diantar'?'selected':'' }}>Sedang Diantar</option>
                        <option value="selesai" {{ request('status')==='selesai'?'selected':'' }}>Selesai</option>
                    </select>
                </form>
            </div>

            <div class="space-y-4">
                @forelse($deliveries as $del)
                @php
                    $waCourierMsg = rawurlencode("Halo " . $del->courier_name . ", ada tugas pengantaran HP ke " . $del->customer_name . " (" . $del->customer_address . "). Klik link ini untuk aktifkan GPS & jalan: " . route('delivery.courier.task', $del->tracking_code));
                @endphp
                <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-card hover:border-secondary/40 transition-all space-y-3">
                    <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg border border-secondary/20">
                                #{{ $del->tracking_code }}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider {{ $del->status_badge_class }}">
                                {{ $del->status }}
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-[11px] font-mono text-on-surface-variant">PIN Pelanggan:</span>
                            <strong class="font-mono text-sm text-secondary font-bold block">{{ $del->delivery_pin }}</strong>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span class="text-on-surface-variant text-[11px] font-mono">Penerima / Alamat:</span>
                            <p class="font-bold text-primary">{{ $del->customer_name }} ({{ $del->customer_phone }})</p>
                            <p class="text-on-surface-variant text-[11px] line-clamp-2 mt-0.5">{{ $del->customer_address }}</p>
                        </div>
                        <div>
                            <span class="text-on-surface-variant text-[11px] font-mono">Kurir Penanggung Jawab:</span>
                            <p class="font-bold text-primary">{{ $del->courier_name }} (<span class="font-mono text-secondary">{{ $del->courier_phone }}</span>)</p>
                            @if($del->service)
                            <p class="text-secondary font-mono text-[11px] mt-0.5">Nota: {{ $del->service->nota_number }} — {{ $del->service->device }}</p>
                            @elseif($del->sale)
                            <p class="text-secondary font-mono text-[11px] mt-0.5">Invoice: #{{ $del->sale->invoice_number }} — {{ $del->sale->formatted_total }}</p>
                            @endif
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-2 border-t border-outline-variant/20 flex-wrap">
                        <!-- Kirim WA ke Kurir -->
                        <a href="https://wa.me/{{ $del->formatted_courier_wa_phone }}?text={{ $waCourierMsg }}" target="_blank"
                            class="bg-green-600 hover:bg-green-700 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm" title="Kirim Link Tugas ke WA Kurir">
                            <span class="material-symbols-outlined text-[16px]">send</span> WA Kurir
                        </a>

                        <!-- Edit Delivery Modal Opener -->
                        <button onclick="openEditDeliveryModal({{ json_encode($del) }})"
                            class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all" title="Ganti Nama / Nomor WA Kurir">
                            <span class="material-symbols-outlined text-[16px]">edit</span> Edit Kurir
                        </button>

                        <!-- Link Layar Kurir -->
                        <a href="{{ route('delivery.courier.task', $del->tracking_code) }}" target="_blank"
                            class="bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary border border-outline-variant/30 font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <span class="material-symbols-outlined text-[16px]">smartphone</span> HP Kurir
                        </a>

                        <!-- Link Lacak Pelanggan -->
                        <a href="{{ route('delivery.track', $del->tracking_code) }}" target="_blank"
                            class="bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary border border-outline-variant/30 font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <span class="material-symbols-outlined text-[16px]">map</span> Peta Pelanggan
                        </a>

                        <!-- Delete Delivery -->
                        <form method="POST" action="{{ route('delivery.destroy', $del->id) }}" onsubmit="return confirm('Hapus pengantaran ini?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1.5 rounded-lg text-xs flex items-center justify-center" title="Hapus">
                                <span class="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                        </form>
                    </div>
                </div>
                @empty
                <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-12 text-center text-on-surface-variant font-mono text-xs shadow-card">
                    <span class="material-symbols-outlined text-4xl text-on-surface-variant opacity-30 mb-2">two_wheeler</span>
                    <p>Belum ada pengantaran kurir aktif.</p>
                </div>
                @endforelse
            </div>

            @if($deliveries->hasPages())
            <div class="mt-4">
                {{ $deliveries->withQueryString()->links() }}
            </div>
            @endif
        </div>
    </div>
</div>

<!-- MODAL EDIT PENGANTARAN / GANTI NOMOR KURIR -->
<div id="edit-delivery-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center hidden p-4 fade-in">
    <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 class="font-display font-bold text-lg text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">edit</span>
                Edit Data Kurir / Pengantaran <span id="edit-delivery-code" class="font-mono text-secondary text-sm"></span>
            </h3>
            <button onclick="closeEditDeliveryModal()" class="text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <form id="edit-delivery-form" method="POST" action="" class="space-y-4">
            @csrf
            @method('PUT')

            <!-- Informasi Kurir -->
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Nama Kurir *</label>
                    <input type="text" name="courier_name" id="edit-courier-name" required
                        class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary">
                </div>
                <div>
                    <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">No. WA Kurir *</label>
                    <input type="text" name="courier_phone" id="edit-courier-phone" required
                        class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary">
                </div>
            </div>

            <!-- Informasi Pelanggan -->
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Nama Pelanggan *</label>
                    <input type="text" name="customer_name" id="edit-customer-name" required
                        class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary">
                </div>
                <div>
                    <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">No. WA Pelanggan *</label>
                    <input type="text" name="customer_phone" id="edit-customer-phone" required
                        class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary">
                </div>
            </div>

            <div>
                <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Alamat Pengantaran *</label>
                <textarea name="customer_address" id="edit-customer-address" required rows="2"
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-secondary resize-none"></textarea>
            </div>

            <div>
                <label class="block text-xs font-mono font-bold uppercase text-on-surface-variant mb-1">Status Pengantaran *</label>
                <select name="status" id="edit-status" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono">
                    <option value="pending">pending</option>
                    <option value="diantar">diantar</option>
                    <option value="selesai">selesai</option>
                    <option value="batal">batal</option>
                </select>
            </div>

            <div class="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                <button type="button" onclick="closeEditDeliveryModal()" class="px-4 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-mono font-bold">Batal</button>
                <button type="submit" class="px-5 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold shadow-md hover:bg-secondary/90">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</div>

<script>
function autofillSource(select) {
    const opt = select.options[select.selectedIndex];
    const type = opt.getAttribute('data-type');
    const id = opt.getAttribute('data-id');
    const srvHidden = document.getElementById('service_id_hidden');
    const saleHidden = document.getElementById('sale_id_hidden');
    const addrInput = document.getElementsByName('customer_address')[0];

    srvHidden.value = '';
    saleHidden.value = '';

    if (type === 'service') {
        srvHidden.value = id;
    } else if (type === 'sale') {
        saleHidden.value = id;
    }

    if (opt.value) {
        document.getElementById('customer_name').value = opt.getAttribute('data-name') || '';
        document.getElementById('customer_phone').value = opt.getAttribute('data-phone') || '';
        if (addrInput && opt.getAttribute('data-address')) {
            addrInput.value = opt.getAttribute('data-address');
        }
    }
}

// Auto-trigger autofill if preselected via URL
document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('source_select');
    if (select && select.value) {
        autofillSource(select);
    }
});

function openEditDeliveryModal(del) {
    document.getElementById('edit-delivery-form').action = `/manajemen-pengantaran/${del.id}`;
    document.getElementById('edit-delivery-code').textContent = '#' + del.tracking_code;
    document.getElementById('edit-courier-name').value = del.courier_name || '';
    document.getElementById('edit-courier-phone').value = del.courier_phone || '';
    document.getElementById('edit-customer-name').value = del.customer_name || '';
    document.getElementById('edit-customer-phone').value = del.customer_phone || '';
    document.getElementById('edit-customer-address').value = del.customer_address || '';
    document.getElementById('edit-status').value = del.status || 'pending';
    document.getElementById('edit-delivery-modal').classList.remove('hidden');
}

function closeEditDeliveryModal() {
    document.getElementById('edit-delivery-modal').classList.add('hidden');
}
</script>
@endsection
