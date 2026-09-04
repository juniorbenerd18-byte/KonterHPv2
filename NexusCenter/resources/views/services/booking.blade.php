@extends('layouts.app')
@section('title', 'Booking Servis HP — TECHCELL NexusCenter')

@section('content')
<div class="fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
    <!-- Header Banner -->
    <div class="bg-white border border-outline-variant/30 rounded-2xl p-8 md:p-12 mb-10 shadow-card">
        <div class="max-w-2xl">
            <span class="inline-block px-3.5 py-1 bg-secondary/10 text-secondary font-mono text-xs font-bold rounded-full mb-3 border border-secondary/20">
                🔧 Booking Servis HP Online
            </span>
            <h1 class="font-display font-extrabold text-3xl md:text-4xl text-on-surface mb-3 tracking-tight">
                Servis HP Profesional &amp; Garansi Resmi
            </h1>
            <p class="text-sm md:text-base text-on-surface-variant leading-relaxed">
                Isi formulir pendaftaran servis HP di bawah ini. Teknisi bersertifikat kami siap memeriksa dan memperbaiki HP Anda dengan sparepart berkualitas.
            </p>
        </div>
    </div>

    <!-- Booking Form Container -->
    <div class="max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 shadow-card">
        <h2 class="font-display font-bold text-xl text-on-surface mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary">assignment</span>
            Formulir Booking Perbaikan
        </h2>

        @if ($errors->any())
        <div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 text-sm">
            <ul class="list-disc list-inside space-y-1">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <form method="POST" action="{{ route('services.booking.store') }}" class="space-y-6">
            @csrf
            <!-- Customer Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Nama Lengkap Pelanggan *</label>
                    <input type="text" name="customer_name" value="{{ old('customer_name', auth()->check() ? auth()->user()->name : '') }}" required
                        class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        placeholder="Contoh: Budi Santoso">
                </div>
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Nomor WhatsApp / HP *</label>
                    <input type="text" name="customer_phone" value="{{ old('customer_phone') }}" required
                        class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                        placeholder="Contoh: 081234567890">
                </div>
            </div>

            <!-- Device Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Tipe & Merek Smartphone *</label>
                    <input type="text" name="device" value="{{ old('device') }}" required
                        class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        placeholder="Contoh: iPhone 13 / Samsung S22">
                </div>
                <div>
                    <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Jenis Kerusakan / Servis *</label>
                    <select name="service_type" required
                        class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all">
                        <option value="">-- Pilih Jenis Kerusakan --</option>
                        <option value="Ganti LCD / Touchscreen">Ganti LCD / Touchscreen</option>
                        <option value="Ganti Baterai">Ganti Baterai Original</option>
                        <option value="Servis Port Charger">Servis Port Charger / Connector</option>
                        <option value="Mati Total / Flash IC">Mati Total / Flash IC / CPU</option>
                        <option value="Kena Air (Water Damage)">Kena Air (Water Damage)</option>
                        <option value="Kerusakan Kamera & Speaker">Kerusakan Kamera & Speaker</option>
                        <option value="Lain-Lain">Kerusakan Lainnya</option>
                    </select>
                </div>
            </div>

            <!-- Issue Description -->
            <div>
                <label class="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">Deskripsi Keluhan / Gejala Kerusakan</label>
                <textarea name="issue" rows="3"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Jelaskan detail kendala pada HP Anda..."></textarea>
            </div>

            <input type="hidden" name="status" value="Diterima">

            <!-- Submit Button -->
            <div class="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                <a href="{{ route('services.track') }}" class="text-xs font-mono text-on-surface-variant hover:text-secondary">
                    &larr; Lacak Servis Lainnya
                </a>
                <button type="submit"
                    class="bg-secondary text-white font-mono text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">send</span>
                    Kirim Booking Servis
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
