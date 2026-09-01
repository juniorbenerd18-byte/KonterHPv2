@extends('layouts.app')
@section('title', 'Manajemen Servis')

@section('content')
<div class="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {{-- LEFT: Form Penerimaan Servis --}}
        <div class="lg:col-span-5">
            <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card sticky top-20">
                <div class="px-6 py-4 border-b border-outline-variant/20 bg-surface-container rounded-t-xl">
                    <h1 class="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-[20px] icon-filled">build_circle</span>
                        Form Penerimaan Servis
                    </h1>
                </div>
                <form method="POST" action="{{ route('services.store') }}" class="p-5 space-y-3">
                    @csrf
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Nama Pelanggan *</label>
                            <input type="text" name="customer_name" required
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                        </div>
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">No. HP *</label>
                            <input type="tel" name="customer_phone" required
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Merk & Tipe HP *</label>
                        <input type="text" name="device" required placeholder="Contoh: Samsung Galaxy A54"
                            class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Jenis Servis *</label>
                            <select name="service_type" required
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                                <option value="">-- Pilih --</option>
                                @foreach(['Ganti LCD','Ganti Baterai','Perbaikan Software','Flashing','Service Charging','Ganti Kamera','Service Speaker','Lainnya'] as $type)
                                <option value="{{ $type }}">{{ $type }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
                            <select name="status"
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                                @foreach(['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'] as $s)
                                <option value="{{ $s }}">{{ $s }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Keluhan / Deskripsi</label>
                        <textarea name="issue" rows="2" placeholder="Deskripsikan masalah..."
                            class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"></textarea>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Est. Biaya (Rp)</label>
                            <input type="number" name="price" min="0" placeholder="0"
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">DP / Muka (Rp)</label>
                            <input type="number" name="deposit" min="0" placeholder="0"
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">Est. Selesai</label>
                            <input type="date" name="estimated_date"
                                class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                        </div>
                    </div>
                    <button type="submit"
                        class="w-full bg-secondary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-[0_0_15px_rgba(0,104,122,0.3)] active:scale-[0.98]">
                        <span class="material-symbols-outlined text-[18px]">save</span>
                        Simpan Data Servis
                    </button>
                </form>
            </div>
        </div>

        {{-- RIGHT: Service List --}}
        <div class="lg:col-span-7">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 class="font-display font-bold text-lg text-on-surface">Daftar Servis Aktif</h2>
                <form method="GET" class="flex gap-2">
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                        <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari nama, nota..."
                            class="pl-9 pr-4 py-2 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all w-48">
                    </div>
                    <select name="status" onchange="this.form.submit()"
                        class="border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                        <option value="all" {{ request('status','all')==='all'?'selected':'' }}>Semua Status</option>
                        @foreach(['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'] as $s)
                        <option value="{{ $s }}" {{ request('status')===$s?'selected':'' }}>{{ $s }}</option>
                        @endforeach
                    </select>
                </form>
            </div>

            <div class="space-y-3">
                @forelse($services as $service)
                <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card hover:border-secondary/30 transition-all">
                    <div class="p-4">
                        <div class="flex items-start justify-between gap-3 mb-3">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{{ $service->nota_number }}</span>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                                        @if($service->status === 'Diterima') bg-blue-100 text-blue-700
                                        @elseif($service->status === 'Dalam Proses') bg-yellow-100 text-yellow-700
                                        @elseif($service->status === 'Menunggu Sparepart') bg-orange-100 text-orange-700
                                        @elseif($service->status === 'Selesai') bg-green-100 text-green-700
                                        @else bg-gray-100 text-gray-700 @endif">
                                        {{ $service->status }}
                                    </span>
                                </div>
                                <p class="font-display font-bold text-sm text-on-surface">{{ $service->customer_name }}</p>
                                <p class="text-xs text-on-surface-variant font-mono">{{ $service->customer_phone }}</p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="font-mono font-bold text-secondary text-sm">{{ $service->formatted_price }}</p>
                                @if($service->deposit > 0)
                                <p class="text-xs text-green-700 font-medium">DP: {{ $service->formatted_deposit }}</p>
                                <p class="text-[11px] text-on-surface-variant">Sisa: Rp {{ number_format($service->remaining_payment, 0, ',', '.') }}</p>
                                @endif
                            </div>
                        </div>

                        <div class="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                            <span class="flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">smartphone</span>
                                {{ $service->device }}
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">build</span>
                                {{ $service->service_type }}
                            </span>
                            @if($service->estimated_date)
                            <span class="flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">calendar_today</span>
                                {{ $service->estimated_date->format('d M Y') }}
                            </span>
                            @endif
                        </div>

                        @if($service->issue)
                        <p class="text-xs text-on-surface-variant bg-surface-container rounded p-2 mb-3 line-clamp-2">{{ $service->issue }}</p>
                        @endif

                        <div class="flex items-center gap-2 flex-wrap pt-2 border-t border-outline-variant/10">
                            <!-- Change Status Quick Select -->
                            <select onchange="updateStatus({{ $service->id }}, this.value)"
                                class="flex-1 min-w-0 border border-outline-variant/30 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-secondary transition-all">
                                @foreach(['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'] as $s)
                                <option value="{{ $s }}" {{ $service->status===$s?'selected':'' }}>{{ $s }}</option>
                                @endforeach
                            </select>

                            <!-- Edit Details Button -->
                            <button onclick="openEditModal({{ json_encode($service) }})"
                                class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all" title="Edit Rincian Biaya & Teknisi">
                                <span class="material-symbols-outlined text-[14px]">edit</span> Edit
                            </button>

                            <!-- Pelunasan Button (Tampil jika ada sisa bayar / status Selesai) -->
                            @if($service->status !== 'Diambil' || $service->remaining_payment > 0)
                            <button onclick="openPayModal({{ json_encode($service) }})"
                                class="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm" title="Proses Pelunasan & Penyerahan HP">
                                <span class="material-symbols-outlined text-[14px]">payments</span> Pelunasan
                            </button>
                            @endif

                            <!-- Print Nota -->
                            <a href="{{ route('services.receipt', $service) }}" target="_blank"
                                class="flex items-center gap-1 px-3 py-1.5 bg-surface-container border border-outline-variant/30 rounded-lg text-xs text-on-surface-variant hover:border-secondary/50 hover:text-secondary transition-all">
                                <span class="material-symbols-outlined text-[14px]">print</span> Nota
                            </a>

                            <!-- Delete -->
                            <form method="POST" action="{{ route('services.destroy', $service) }}" onsubmit="return confirm('Hapus data servis ini?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 hover:bg-red-100 transition-all">
                                    <span class="material-symbols-outlined text-[14px]">delete</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                @empty
                <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-16 text-center text-on-surface-variant shadow-card">
                    <span class="material-symbols-outlined text-5xl mb-3 block opacity-30">build_circle</span>
                    <p class="font-display font-semibold">Belum ada data servis</p>
                    <p class="text-sm mt-1">Isi form di sebelah kiri untuk menambah servis</p>
                </div>
                @endforelse
            </div>
        </div>
    </div>
</div>

<!-- MODAL EDIT SERVIS -->
<div id="edit-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center hidden p-4 fade-in">
    <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 class="font-display font-bold text-lg text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">edit_note</span>
                Edit Detail Servis <span id="edit-nota-no" class="font-mono text-secondary text-sm"></span>
            </h3>
            <button onclick="closeEditModal()" class="text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <form id="edit-form" method="POST" action="" class="space-y-3">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Nama Pelanggan *</label>
                    <input type="text" name="customer_name" id="edit-customer-name" required class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">No. HP *</label>
                    <input type="text" name="customer_phone" id="edit-customer-phone" required class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Merk & Tipe Device *</label>
                    <input type="text" name="device" id="edit-device" required class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Jenis Servis *</label>
                    <input type="text" name="service_type" id="edit-service-type" required class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm">
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Estimasi Biaya (Rp)</label>
                    <input type="number" name="price" id="edit-price" min="0" required class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono">
                </div>
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">DP / Muka (Rp)</label>
                    <input type="number" name="deposit" id="edit-deposit" min="0" required class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono">
                </div>
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Status Servis</label>
                    <select name="status" id="edit-status" class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm">
                        @foreach(['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'] as $s)
                        <option value="{{ $s }}">{{ $s }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Nama Teknisi</label>
                    <input type="text" name="technician" id="edit-technician" placeholder="Nama teknisi penanggung jawab" class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Est. Tanggal Selesai</label>
                    <input type="date" name="estimated_date" id="edit-estimated-date" class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm">
                </div>
            </div>
            <div>
                <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Catatan Keluhan / Perbaikan</label>
                <textarea name="issue" id="edit-issue" rows="2" class="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm resize-none"></textarea>
            </div>
            <div class="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                <button type="button" onclick="closeEditModal()" class="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold">Batal</button>
                <button type="submit" class="px-5 py-2 bg-secondary text-white rounded-lg text-xs font-bold shadow-md hover:bg-secondary/90">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL PELUNASAN SERVIS -->
<div id="pay-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center hidden p-4 fade-in">
    <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 class="font-display font-bold text-lg text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-green-600">payments</span>
                Pelunasan Servis <span id="pay-nota-no" class="font-mono text-secondary text-sm"></span>
            </h3>
            <button onclick="closePayModal()" class="text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <form id="pay-form" method="POST" action="" class="space-y-4">
            @csrf
            <div class="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/20 text-xs font-mono">
                <div class="flex justify-between text-on-surface-variant">
                    <span>Perangkat:</span>
                    <strong id="pay-device" class="text-primary"></strong>
                </div>
                <div class="flex justify-between text-on-surface-variant">
                    <span>Pelanggan:</span>
                    <strong id="pay-customer" class="text-primary"></strong>
                </div>
                <div class="border-t border-outline-variant/20 pt-2 flex justify-between">
                    <span>Total Biaya Servis:</span>
                    <strong id="pay-price" class="text-primary font-bold"></strong>
                </div>
                <div class="flex justify-between text-green-700">
                    <span>DP yang Sudah Dibayar:</span>
                    <strong id="pay-deposit"></strong>
                </div>
                <div class="border-t border-outline-variant/20 pt-2 flex justify-between text-sm">
                    <span class="font-bold text-primary">SISA HARUS DIBAYAR:</span>
                    <strong id="pay-remaining" class="text-green-700 font-bold"></strong>
                </div>
            </div>

            <div>
                <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Jumlah Yang Diterima (Rp) *</label>
                <input type="number" name="amount_paid" id="pay-amount-input" min="0" required
                    class="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-base font-mono font-bold text-primary focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20">
            </div>

            <div>
                <label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Metode Pembayaran *</label>
                <select name="payment_method" required class="w-full border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold">
                    <option value="Tunai">Tunai / Cash</option>
                    <option value="QRIS">QRIS / E-Wallet</option>
                    <option value="Transfer">Transfer Bank</option>
                    <option value="Debit">Kartu Debit</option>
                </select>
            </div>

            <div class="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                <button type="button" onclick="closePayModal()" class="px-4 py-2.5 bg-surface-container text-on-surface rounded-xl text-xs font-semibold">Batal</button>
                <button type="submit" class="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-green-700 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[18px]">check_circle</span>
                    Proses Pelunasan & Serahkan HP
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
function updateStatus(id, status) {
    fetch(`/servis/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
        body: JSON.stringify({ status }),
    })
    .then(r => r.json())
    .then(d => { if(d.success) showToast('Status berhasil diperbarui!', 'success'); })
    .catch(() => showToast('Gagal memperbarui status!', 'error'));
}

function openEditModal(service) {
    document.getElementById('edit-form').action = `/servis/${service.id}`;
    document.getElementById('edit-nota-no').textContent = '#' + service.nota_number;
    document.getElementById('edit-customer-name').value = service.customer_name;
    document.getElementById('edit-customer-phone').value = service.customer_phone;
    document.getElementById('edit-device').value = service.device;
    document.getElementById('edit-service-type').value = service.service_type;
    document.getElementById('edit-price').value = service.price || 0;
    document.getElementById('edit-deposit').value = service.deposit || 0;
    document.getElementById('edit-status').value = service.status;
    document.getElementById('edit-technician').value = service.technician || '';
    document.getElementById('edit-issue').value = service.issue || '';
    if (service.estimated_date) {
        document.getElementById('edit-estimated-date').value = service.estimated_date.split('T')[0];
    } else {
        document.getElementById('edit-estimated-date').value = '';
    }
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function openPayModal(service) {
    const remaining = Math.max(0, (service.price || 0) - (service.deposit || 0));
    document.getElementById('pay-form').action = `/servis/${service.id}/pay`;
    document.getElementById('pay-nota-no').textContent = '#' + service.nota_number;
    document.getElementById('pay-device').textContent = service.device + ' (' + service.service_type + ')';
    document.getElementById('pay-customer').textContent = service.customer_name;
    document.getElementById('pay-price').textContent = formatRupiah(service.price || 0);
    document.getElementById('pay-deposit').textContent = formatRupiah(service.deposit || 0);
    document.getElementById('pay-remaining').textContent = formatRupiah(remaining);
    document.getElementById('pay-amount-input').value = remaining;
    document.getElementById('pay-modal').classList.remove('hidden');
}

function closePayModal() {
    document.getElementById('pay-modal').classList.add('hidden');
}
</script>
@endpush
