<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Nota Servis {{ $service->nota_number }}</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; font-size: 13px; color: #191c1e; background: #fff; }
        .receipt { width: 380px; margin: 20px auto; padding: 24px; border: 1px solid #e0e3e5; border-radius: 12px; }
        .header { text-align: center; border-bottom: 2px dashed #e0e3e5; padding-bottom: 16px; margin-bottom: 16px; }
        .brand { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: #131b2e; letter-spacing: -0.5px; }
        .brand span { color: #00687a; }
        .subtitle { font-size: 10px; color: #76777d; margin-top: 4px; letter-spacing: 2px; text-transform: uppercase; }
        .nota-no { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #00687a; margin-top: 8px; font-weight: 700; }
        .section { margin-bottom: 14px; }
        .section-title { font-size: 10px; font-weight: 600; color: #76777d; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #eceef0; padding-bottom: 4px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .row .label { color: #45464d; }
        .row .value { font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
        .status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .total-row { border-top: 2px solid #131b2e; margin-top: 8px; padding-top: 8px; }
        .total-row .label { font-weight: 700; }
        .total-row .value { color: #00687a; font-size: 15px; }
        .footer { text-align: center; margin-top: 16px; padding-top: 16px; border-top: 2px dashed #e0e3e5; font-size: 11px; color: #76777d; }
        .print-btn { display: flex; gap: 8px; justify-content: center; margin: 16px 0; }
        .print-btn button { padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
        .btn-primary { background: #00687a; color: white; }
        .btn-secondary { background: #f2f4f6; color: #45464d; }
        @media print { .print-btn { display: none; } body { margin: 0; } .receipt { border: none; } }
    </style>
</head>
<body>
    <div class="print-btn no-print">
        <button class="btn-primary" onclick="window.print()">🖨️ Print Nota</button>
        @if(auth()->check() && auth()->user()->isStaff())
        <a href="{{ route('delivery.index', ['service_id' => $service->id]) }}" class="btn-primary" style="background:#0284c7;text-decoration:none;display:inline-flex;align-items:center;">🚚 Antar Kurir</a>
        @endif
        <a href="{{ route('services.booking') }}" class="btn-secondary" style="display:inline-flex;align-items:center;text-decoration:none;">✕ Tutup</a>
    </div>

    <div class="receipt">
        <div class="header">
            <div class="brand">Nexus<span>Center</span></div>
            <div class="subtitle">Smart Counter & Service</div>
            <div class="nota-no">{{ $service->nota_number }}</div>
            <div style="font-size:11px;color:#76777d;margin-top:4px;">{{ $service->created_at->format('d/m/Y H:i') }}</div>
        </div>

        <div class="section">
            <div class="section-title">Data Pelanggan</div>
            <div class="row"><span class="label">Nama</span><span class="value">{{ $service->customer_name }}</span></div>
            <div class="row"><span class="label">No. HP</span><span class="value">{{ $service->customer_phone }}</span></div>
        </div>

        <div class="section">
            <div class="section-title">Detail Servis</div>
            <div class="row"><span class="label">Perangkat</span><span class="value">{{ $service->device }}</span></div>
            <div class="row"><span class="label">Jenis Servis</span><span class="value">{{ $service->service_type }}</span></div>
            @if($service->issue)
            <div style="margin-top:6px;padding:8px;background:#f2f4f6;border-radius:6px;font-size:11px;color:#45464d;">
                {{ $service->issue }}
            </div>
            @endif
        </div>

        <div class="section">
            <div class="section-title">Biaya & Status</div>
            <div class="row"><span class="label">Est. Biaya</span><span class="value">Rp {{ number_format($service->price,0,',','.') }}</span></div>
            <div class="row"><span class="label">DP / Uang Muka</span><span class="value">Rp {{ number_format($service->deposit,0,',','.') }}</span></div>
            <div class="row total-row">
                <span class="label">Sisa Pembayaran</span>
                <span class="value">Rp {{ number_format($service->remaining_payment,0,',','.') }}</span>
            </div>
            @if($service->estimated_date)
            <div class="row" style="margin-top:8px;">
                <span class="label">Est. Selesai</span>
                <span class="value">{{ $service->estimated_date->format('d/m/Y') }}</span>
            </div>
            @endif
            <div class="row" style="margin-top:6px;">
                <span class="label">Status</span>
                <span class="status" style="background:#dbeafe;color:#1d4ed8;">{{ $service->status }}</span>
            </div>
        </div>

        <div class="footer">
            <p>Terima kasih telah mempercayakan servis HP Anda</p>
            <p style="margin-top:4px;">kepada <strong>NexusCenter</strong></p>
            {{-- FIX #2: Format contoh diubah ke SRV- --}}
            <p style="margin-top:8px;font-family:'JetBrains Mono',monospace;font-size:10px;">{{ $service->nota_number }}</p>
            <p style="margin-top:4px;font-size:9px;color:#aaa;">Simpan nomor nota ini untuk melacak status servis Anda di /lacak-servis</p>
        </div>
    </div>
</body>
</html>
