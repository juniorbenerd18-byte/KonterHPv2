'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { Sale } from '@/types/database';

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function StrukPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const sales = await DataService.getSales();
      const found = sales.find((s) => String(s.id) === id);
      setSale(found ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="py-20 text-center font-mono text-on-surface-variant">Memuat struk...</div>;
  if (!sale) return <div className="py-20 text-center font-mono text-on-surface-variant">Transaksi tidak ditemukan.</div>;

  const items: { product_name?: string; name?: string; quantity?: number; qty?: number; price: number; subtotal?: number }[] =
    typeof sale.items === 'string' ? JSON.parse(sale.items) : (sale.items ?? []);
  const subtotal = items.reduce((s, i) => s + (i.subtotal ?? (i.price * (i.quantity || i.qty || 1))), 0);
  const discountAmt = sale.discount ? subtotal * sale.discount / 100 : 0;
  const total = sale.total_price ?? (subtotal - discountAmt);
  const invoiceNo = sale.invoice_number || `INV-${String(sale.id).padStart(6, '0')}`;
  const method = sale.payment_method || 'Tunai';
  const vaNumber = `88012${String(sale.id).padStart(8, '0')}`;

  return (
    <div className="fade-in max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
      {/* Receipt Card */}
      <div id="receipt-card" className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-8 py-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-3xl font-display font-extrabold tracking-tight mb-0.5">TECHCELL</div>
            <div className="text-xs font-mono opacity-80 uppercase tracking-widest">NexusCenter — Official Store</div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5 text-xs font-mono font-bold">
              <span className="material-symbols-outlined text-[16px] icon-filled">receipt_long</span>
              Struk / Bukti Pembelian
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <div className="text-on-surface-variant uppercase tracking-wider mb-0.5">No. Invoice</div>
              <div className="font-bold text-primary text-sm">#{invoiceNo}</div>
            </div>
            <div className="text-right">
              <div className="text-on-surface-variant uppercase tracking-wider mb-0.5">Tanggal</div>
              <div className="font-bold text-on-surface">
                {sale.created_at ? new Date(sale.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </div>
            </div>
            <div>
              <div className="text-on-surface-variant uppercase tracking-wider mb-0.5">Nama Pembeli</div>
              <div className="font-bold text-on-surface">{sale.customer_name || '—'}</div>
            </div>
            <div className="text-right">
              <div className="text-on-surface-variant uppercase tracking-wider mb-0.5">No. Telepon</div>
              <div className="font-bold text-on-surface">{sale.customer_phone || '—'}</div>
            </div>
            <div>
              <div className="text-on-surface-variant uppercase tracking-wider mb-0.5">Metode Pembayaran</div>
              <div className="font-bold text-secondary">{method}</div>
            </div>
            <div className="text-right">
              <div className="text-on-surface-variant uppercase tracking-wider mb-0.5">Kasir / Diproses</div>
              <div className="font-bold text-on-surface">{sale.cashier_name || 'Online'}</div>
            </div>
            {sale.customer_address && (
              <div className="col-span-2 mt-1 pt-2 border-t border-outline-variant/15">
                <div className="text-on-surface-variant uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">local_shipping</span>
                  Alamat Lengkap Pengiriman:
                </div>
                <div className="font-bold text-on-surface text-xs bg-surface-container/50 p-2 rounded-lg border border-outline-variant/20">{sale.customer_address}</div>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="px-8 py-5">
          <div className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider mb-3">Detail Produk</div>
          <div className="divide-y divide-outline-variant/15">
            {items.map((item, i) => {
              const name = item.product_name || item.name || 'Produk';
              const qty = item.quantity || item.qty || 1;
              const sub = item.subtotal ?? item.price * qty;
              return (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-xl shrink-0">📱</div>
                    <div>
                      <div className="font-display font-bold text-sm text-primary">{name}</div>
                      <div className="font-mono text-xs text-on-surface-variant">{qty} pcs × {fmt(item.price)}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-on-surface shrink-0">{fmt(sub)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 py-5 border-t border-outline-variant/20 bg-surface-container-low/50 space-y-2 font-mono text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          {sale.discount && sale.discount > 0 && (
            <div className="flex justify-between text-green-700 font-bold">
              <span>Diskon ({sale.discount}%)</span>
              <span>- {fmt(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between text-on-surface-variant">
            <span>Ongkos Kirim</span>
            <span className="text-green-700 font-bold">GRATIS</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-on-surface border-t border-outline-variant/20 pt-3 mt-3">
            <span>Total Bayar</span>
            <span className="text-secondary text-xl">{fmt(total)}</span>
          </div>
          {sale.change_amount && sale.change_amount > 0 && (
            <>
              <div className="flex justify-between text-on-surface-variant">
                <span>Jumlah Dibayar</span>
                <span>{fmt(sale.amount_paid || 0)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold">
                <span>Kembalian</span>
                <span>{fmt(sale.change_amount)}</span>
              </div>
            </>
          )}
        </div>

        {/* Payment Channel */}
        <div className="px-8 py-6 bg-gradient-to-r from-slate-900 via-primary-container to-slate-900 text-white border-t border-outline-variant/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-2xl animate-pulse">account_balance_wallet</span>
              <div>
                <h4 className="font-display font-extrabold text-sm text-white">Status Pembayaran: {method.toUpperCase()}</h4>
                <p className="text-[11px] font-mono text-cyan-300">Selesaikan pembayaran menggunakan channel di bawah ini</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              ✓ LUNAS
            </span>
          </div>

          {method === 'QRIS' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center space-y-3">
              <p className="font-mono text-xs text-cyan-200">Scan Kode QRIS di bawah ini dengan OVO, GoPay, DANA, atau ShopeePay:</p>
              <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=qris://nexuscenter/pay/${invoiceNo}/${total}`}
                  alt="QRIS Code Pembayaran"
                  className="w-40 h-40 mx-auto"
                />
                <span className="font-mono text-[10px] font-bold text-slate-800 block mt-1">NEXUSCENTER QRIS OFFICIAL</span>
              </div>
              <div className="flex justify-center items-center gap-3 text-[11px] font-mono text-gray-300 flex-wrap">
                <span>📱 GoPay</span> · <span>💜 OVO</span> · <span>💙 DANA</span> · <span>🧡 ShopeePay</span> · <span>🔴 LinkAja</span>
              </div>
            </div>
          )}

          {method === 'Transfer' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3 font-mono text-xs">
              <p className="text-cyan-200">Transfer ke Nomor Virtual Account berikut:</p>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">BANK BCA VIRTUAL ACCOUNT:</span>
                  <strong className="text-cyan-300 text-base tracking-widest">{vaNumber}</strong>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(vaNumber); alert('Nomor Virtual Account disalin!'); }}
                  className="bg-cyan-500 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-400 transition-all"
                >
                  Salin VA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 text-center border-t border-outline-variant/20">
          <div className="text-xs font-mono text-on-surface-variant leading-relaxed">
            Terima kasih telah berbelanja di <strong className="text-primary">TECHCELL NexusCenter</strong>!<br />
            Barang yang sudah dibeli tidak dapat dikembalikan. Hubungi kami untuk garansi produk.
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-on-surface-variant opacity-70">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Transaksi ini terverifikasi dan sah secara digital
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 flex-wrap">
        {sale.delivery_type === 'delivery' && (
          DataService.getCurrentRole() === 'pengguna' ? (
            <button
              onClick={() => router.push(`/lacak-driver?sale_id=${sale.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              🛵 Lacak Lokasi Pengantaran Kurir Realtime
            </button>
          ) : (
            <button
              onClick={() => router.push('/pengantaran')}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              🚚 Kelola Tugas Pengantaran Kurir
            </button>
          )
        )}
        {sale.delivery_type === 'pickup' && (
          <div className="w-full p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-center font-mono text-xs text-secondary font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Pesanan ini disiapkan untuk diambil di Toko (Pickup)
          </div>
        )}
        <button onClick={() => router.push('/')} className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-mono text-xs font-bold py-3.5 rounded-xl hover:border-secondary hover:text-secondary transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">home</span>
          Kembali ke Beranda
        </button>
        <button onClick={() => router.push('/produk')} className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-mono text-xs font-bold py-3.5 rounded-xl hover:border-secondary hover:text-secondary transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          Belanja Lagi
        </button>
        <button onClick={() => router.push('/riwayat')} className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md">
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          Riwayat Pesanan
        </button>
        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md">
          <span className="material-symbols-outlined text-[18px]">print</span>
          Cetak Struk
        </button>
      </div>

      <style>{`@media print { nav, footer { display: none !important; } body { background: white !important; } #receipt-card { box-shadow: none; border: 1px solid #ccc; } }`}</style>
    </div>
  );
}
