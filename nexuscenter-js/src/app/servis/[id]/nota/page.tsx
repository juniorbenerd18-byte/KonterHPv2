'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { ServiceOrder } from '@/types/database';

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function NotaServisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const services = await DataService.getServices();
      const found = services.find((s) => String(s.id) === id);
      setService(found ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="py-20 text-center font-mono text-on-surface-variant">Memuat nota...</div>;
  if (!service) return <div className="py-20 text-center font-mono text-on-surface-variant">Servis tidak ditemukan.</div>;

  const remaining = (service.cost || 0) - (service.deposit || 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#191c1e', background: '#fff', minHeight: '100vh' }}>
      {/* Print Buttons */}
      <div className="print:hidden flex gap-2 justify-center m-4">
        <button
          onClick={() => window.print()}
          style={{ background: '#00687a', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          🖨️ Print Nota
        </button>
        <button
          onClick={() => router.push('/pengantaran')}
          style={{ background: '#0284c7', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          🚚 Antar Kurir
        </button>
        <button
          onClick={() => router.push('/booking-servis')}
          style={{ background: '#f2f4f6', color: '#45464d', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          ✕ Tutup
        </button>
      </div>

      {/* Thermal Receipt */}
      <div style={{ width: 380, margin: '20px auto', padding: 24, border: '1px solid #e0e3e5', borderRadius: 12 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #e0e3e5', paddingBottom: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: '#131b2e', letterSpacing: -0.5 }}>
            Nexus<span style={{ color: '#00687a' }}>Center</span>
          </div>
          <div style={{ fontSize: 10, color: '#76777d', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Smart Counter &amp; Service</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00687a', marginTop: 8, fontWeight: 700 }}>
            {service.nota_number || `SRV-${String(service.id).padStart(6, '0')}`}
          </div>
          <div style={{ fontSize: 11, color: '#76777d', marginTop: 4 }}>
            {service.created_at ? new Date(service.created_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
          </div>
        </div>

        {/* Customer */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#76777d', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, borderBottom: '1px solid #eceef0', paddingBottom: 4 }}>Data Pelanggan</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#45464d' }}>Nama</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{service.customer_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#45464d' }}>No. HP</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{service.customer_phone}</span>
          </div>
        </div>

        {/* Service Details */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#76777d', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, borderBottom: '1px solid #eceef0', paddingBottom: 4 }}>Detail Servis</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#45464d' }}>Perangkat</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{service.device}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#45464d' }}>Jenis Servis</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{service.service_type}</span>
          </div>
          {service.issue && (
            <div style={{ marginTop: 6, padding: 8, background: '#f2f4f6', borderRadius: 6, fontSize: 11, color: '#45464d' }}>
              {service.issue}
            </div>
          )}
        </div>

        {/* Biaya & Status */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#76777d', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, borderBottom: '1px solid #eceef0', paddingBottom: 4 }}>Biaya &amp; Status</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#45464d' }}>Est. Biaya</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(service.cost || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#45464d' }}>DP / Uang Muka</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(service.deposit || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #131b2e', marginTop: 8, paddingTop: 8 }}>
            <span style={{ fontWeight: 700, color: '#45464d' }}>Sisa Pembayaran</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00687a' }}>{fmt(remaining)}</span>
          </div>
          {service.estimated_date && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ color: '#45464d' }}>Est. Selesai</span>
              <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                {new Date(service.estimated_date).toLocaleDateString('id-ID')}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ color: '#45464d' }}>Status</span>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: '#dbeafe', color: '#1d4ed8' }}>
              {service.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 16, borderTop: '2px dashed #e0e3e5', fontSize: 11, color: '#76777d' }}>
          <p>Terima kasih telah mempercayakan servis HP Anda</p>
          <p style={{ marginTop: 4 }}>kepada <strong>NexusCenter</strong></p>
          <p style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
            {service.nota_number || `SRV-${String(service.id).padStart(6, '0')}`}
          </p>
          <p style={{ marginTop: 4, fontSize: 9, color: '#aaa' }}>Simpan nomor nota ini untuk melacak status servis Anda di /lacak-servis</p>
        </div>
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } }`}</style>
    </div>
  );
}
