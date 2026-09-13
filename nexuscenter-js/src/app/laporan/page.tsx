'use client';
import { useState, useEffect, useCallback } from 'react';
import { DataService } from '@/lib/store';
import { Sale, ServiceOrder } from '@/types/database';

type Period = 'today' | 'week' | 'month' | 'year';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Hari Ini',
  week: 'Minggu Ini',
  month: 'Bulan Ini',
  year: 'Tahun Ini',
};

function filterByPeriod<T extends { created_at?: string | null }>(
  items: T[],
  period: Period,
): T[] {
  const now = new Date();
  return items.filter((item) => {
    if (!item.created_at) return false;
    const d = new Date(item.created_at);
    if (period === 'today') {
      return d.toDateString() === now.toDateString();
    }
    if (period === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return d >= start;
    }
    if (period === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (period === 'year') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function periodLabel(period: Period) {
  const now = new Date();
  if (period === 'today') return now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  if (period === 'week') {
    const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0);
    return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  if (period === 'month') return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  return now.getFullYear().toString();
}

export default function LaporanPage() {
  const [period, setPeriod] = useState<Period>('month');
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, sv] = await Promise.all([DataService.getSales(), DataService.getServices()]);
    setSales(s);
    setServices(sv);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredSales = filterByPeriod(sales, period);
  const filteredServices = filterByPeriod(services, period);

  const totalSales = filteredSales.reduce((sum, s) => sum + (s.total_price || 0), 0);
  const totalService = filteredServices.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalTransactions = filteredSales.length + filteredServices.length;
  const activeServices = services.filter((s) => s.status?.toLowerCase() !== 'selesai' && s.status?.toLowerCase() !== 'diambil').length;

  // Top Products
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  filteredSales.forEach((sale) => {
    const items: { name?: string; product_name?: string; quantity?: number; qty?: number; price?: number }[] =
      typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items ?? [];
    items.forEach((item) => {
      const key = item.name || item.product_name || 'Unknown';
      if (!productMap[key]) productMap[key] = { name: key, qty: 0, revenue: 0 };
      productMap[key].qty += item.quantity || item.qty || 0;
      productMap[key].revenue += (item.price || 0) * (item.quantity || item.qty || 0);
    });
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
  const maxQty = topProducts[0]?.qty || 1;

  // Top Services
  const serviceMap: Record<string, number> = {};
  filteredServices.forEach((sv) => {
    const key = sv.service_type || 'Lainnya';
    serviceMap[key] = (serviceMap[key] || 0) + 1;
  });
  const topServices = Object.entries(serviceMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = topServices[0]?.[1] || 1;

  const rankColor = (i: number) =>
    i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-surface-container text-on-surface-variant';

  return (
    <div className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-headline-md text-on-surface">Laporan &amp; Statistik Business</h1>
          <p className="text-on-surface-variant text-sm mt-1">Periode: {periodLabel(period)}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-primary text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Cetak Laporan (PDF)
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              period === p
                ? 'bg-secondary text-white border-secondary shadow-[0_0_10px_rgba(0,104,122,0.3)]'
                : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-secondary'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant font-mono text-sm">
          <span className="material-symbols-outlined text-4xl block mb-2 animate-spin">progress_activity</span>
          Memuat data laporan...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Penjualan', value: fmt(totalSales), icon: 'payments', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
              { label: 'Pendapatan Servis', value: fmt(totalService), icon: 'build_circle', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
              { label: 'Total Transaksi', value: totalTransactions.toString(), icon: 'receipt_long', color: 'text-secondary', bg: 'bg-cyan-50', border: 'border-cyan-100' },
              { label: 'Servis Aktif', value: activeServices.toString(), icon: 'pending_actions', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
            ].map((card) => (
              <div key={card.label} className={`bg-surface-container-lowest border ${card.border} rounded-xl p-5 shadow-card card-hover transition-all duration-300`}>
                <div className={`${card.bg} ${card.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined icon-filled text-[22px]">{card.icon}</span>
                </div>
                <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mb-1">{card.label}</p>
                <p className="font-display font-bold text-xl text-on-surface leading-tight">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Grand Total Banner */}
          <div className="bg-primary-container circuit-bg rounded-xl p-6 mb-8 border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-1">Total Pendapatan (Penjualan + Servis)</p>
                <p className="font-display font-extrabold text-3xl text-secondary-fixed-dim">{fmt(totalSales + totalService)}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-white/50 text-xs font-mono mb-1">Penjualan</p>
                  <p className="font-mono font-bold text-lg text-white">{totalSales.toLocaleString('id-ID')}</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-white/50 text-xs font-mono mb-1">Servis</p>
                  <p className="font-mono font-bold text-lg text-white">{totalService.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card">
              <div className="px-6 py-4 border-b border-outline-variant/20">
                <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px] icon-filled">inventory_2</span>
                  Produk Terlaris
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {topProducts.length === 0 ? (
                  <div className="py-10 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">inventory_2</span>
                    <p className="text-sm">Belum ada data penjualan</p>
                  </div>
                ) : topProducts.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 ${rankColor(i)}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${(item.qty / maxQty) * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono text-on-surface-variant flex-shrink-0">{item.qty} pcs</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-bold text-secondary text-sm">{fmt(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Services */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-card">
              <div className="px-6 py-4 border-b border-outline-variant/20">
                <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
                  Jenis Servis Terbanyak
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {topServices.length === 0 ? (
                  <div className="py-10 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">build_circle</span>
                    <p className="text-sm">Belum ada data servis</p>
                  </div>
                ) : topServices.map(([type, count], i) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 ${rankColor(i)}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${(count / maxSvc) * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono text-on-surface-variant flex-shrink-0">{count}x</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
