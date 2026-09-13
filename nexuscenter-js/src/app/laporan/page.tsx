'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    if (period === 'today') return d.toDateString() === now.toDateString();
    if (period === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return d >= start;
    }
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === 'year') return d.getFullYear() === now.getFullYear();
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
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  if (period === 'month') return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  return now.getFullYear().toString();
}

export default function LaporanPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('month');
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!DataService.isLoggedIn()) {
      router.push('/login?redirect=/laporan');
      return;
    }
    const r = DataService.getCurrentRole();
    if (r !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setLoading(true);
    const [s, sv] = await Promise.all([DataService.getSales(), DataService.getServices()]);
    setSales(s);
    setServices(sv);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const filteredSales = filterByPeriod(sales, period);
  const filteredServices = filterByPeriod(services, period);

  const totalSales = filteredSales.reduce((sum, s) => sum + (s.total_price || 0), 0);
  const totalService = filteredServices.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalTransactions = filteredSales.length + filteredServices.length;
  const activeServices = services.filter((s) => s.status?.toLowerCase() !== 'selesai' && s.status?.toLowerCase() !== 'diambil').length;
  const grandTotal = totalSales + totalService;

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

  const rankBadge = (i: number) =>
    i === 0 ? { bg: 'bg-yellow-100 text-yellow-700', label: '🥇' }
    : i === 1 ? { bg: 'bg-slate-100 text-slate-500', label: '🥈' }
    : i === 2 ? { bg: 'bg-orange-100 text-orange-700', label: '🥉' }
    : { bg: 'bg-surface-container text-on-surface-variant', label: `${i + 1}` };

  const statCards = [
    {
      label: 'Total Penjualan',
      value: fmt(totalSales),
      icon: 'payments',
      sub: `${filteredSales.length} transaksi`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      bar: 'bg-emerald-400',
    },
    {
      label: 'Pendapatan Servis',
      value: fmt(totalService),
      icon: 'build_circle',
      sub: `${filteredServices.length} servis`,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      bar: 'bg-orange-400',
    },
    {
      label: 'Total Transaksi',
      value: totalTransactions.toString(),
      icon: 'receipt_long',
      sub: 'Semua jenis',
      color: 'text-secondary',
      bg: 'bg-cyan-50',
      border: 'border-cyan-100',
      bar: 'bg-cyan-400',
    },
    {
      label: 'Servis Aktif',
      value: activeServices.toString(),
      icon: 'pending_actions',
      sub: 'Sedang diproses',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      bar: 'bg-violet-400',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 fade-in font-sans">

      {/* Hero Header */}
      <section className="mb-8 rounded-2xl overflow-hidden relative bg-primary-container circuit-pattern shadow-lg border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/95 to-transparent" />
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-secondary/30 to-transparent" />
        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link href="/dashboard" className="text-white/50 text-xs font-mono hover:text-white/80 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">home</span> Dashboard
              </Link>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-secondary-fixed-dim text-xs font-mono font-bold">Laporan</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-[32px] icon-filled">bar_chart</span>
              Laporan &amp; Statistik
            </h1>
            <p className="text-white/60 text-sm md:text-base">
              Periode: <span className="text-secondary-fixed-dim font-semibold">{periodLabel(period)}</span>
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(0,104,122,0.4)] flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak Laporan (PDF)
          </button>
        </div>
      </section>

      {/* Period Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              period === p
                ? 'bg-secondary text-white border-secondary shadow-[0_0_12px_rgba(0,104,122,0.35)]'
                : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-secondary'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-32 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl block mb-3 animate-spin text-secondary">progress_activity</span>
          <p className="font-mono text-sm">Memuat data laporan...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`bg-surface-container-lowest border ${card.border} rounded-2xl p-5 shadow-card hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.bg} ${card.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined icon-filled text-[22px]">{card.icon}</span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-mono">{card.sub}</span>
                </div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-mono mb-1">{card.label}</p>
                <p className="font-display font-bold text-xl text-on-surface leading-tight">{card.value}</p>
                <div className="mt-3 h-1 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div className={`h-full ${card.bar} rounded-full w-full opacity-60`} />
                </div>
              </div>
            ))}
          </div>

          {/* Grand Total Banner */}
          <div className="bg-primary-container circuit-pattern rounded-2xl p-6 mb-8 border border-white/5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-1">
                  Total Pendapatan · {PERIOD_LABELS[period]}
                </p>
                <p className="font-display font-extrabold text-3xl md:text-4xl text-secondary-fixed-dim">
                  {fmt(grandTotal)}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-white/40 text-xs font-mono mb-1 uppercase tracking-wider">Penjualan</p>
                  <p className="font-display font-bold text-lg text-white">{fmt(totalSales)}</p>
                  <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden w-28">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: grandTotal > 0 ? `${(totalSales / grandTotal) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-white/40 text-xs font-mono mb-1 uppercase tracking-wider">Servis</p>
                  <p className="font-display font-bold text-lg text-white">{fmt(totalService)}</p>
                  <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden w-28">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{ width: grandTotal > 0 ? `${(totalService / grandTotal) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Rankings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Top Products */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px] icon-filled">inventory_2</span>
                  Produk Terlaris
                </h2>
                <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-2.5 py-1 rounded-lg">
                  Top {topProducts.length}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {topProducts.length === 0 ? (
                  <div className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-5xl mb-2 block opacity-20">inventory_2</span>
                    <p className="text-sm font-mono">Belum ada data penjualan</p>
                    <p className="text-xs opacity-60 mt-1">pada periode ini</p>
                  </div>
                ) : topProducts.map((item, i) => {
                  const badge = rankBadge(i);
                  return (
                    <div key={item.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 ${badge.bg}`}>
                        {badge.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full transition-all duration-500"
                              style={{ width: `${(item.qty / maxQty) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-on-surface-variant flex-shrink-0">{item.qty} pcs</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono font-bold text-secondary text-sm">{fmt(item.revenue)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Services */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
                  Jenis Servis Terbanyak
                </h2>
                <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-2.5 py-1 rounded-lg">
                  Top {topServices.length}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {topServices.length === 0 ? (
                  <div className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-5xl mb-2 block opacity-20">build_circle</span>
                    <p className="text-sm font-mono">Belum ada data servis</p>
                    <p className="text-xs opacity-60 mt-1">pada periode ini</p>
                  </div>
                ) : topServices.map(([type, count], i) => {
                  const badge = rankBadge(i);
                  return (
                    <div key={type} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 ${badge.bg}`}>
                        {badge.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full transition-all duration-500"
                              style={{ width: `${(count / maxSvc) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-on-surface-variant flex-shrink-0">{count}x</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Back to Dashboard */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-on-surface-variant text-sm font-mono hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali ke Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
