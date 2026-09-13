'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { Sale, ServiceOrder } from '@/types/database';

export default function HistoryPage() {
    const router = useRouter();
    const [sales, setSales] = useState<Sale[]>([]);
    const [services, setServices] = useState<ServiceOrder[]>([]);

    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'penjualan' | 'servis'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!DataService.isLoggedIn()) {
            router.push('/login?redirect=/riwayat');
            return;
        }
        Promise.all([
            DataService.getSales(),
            DataService.getServices()
        ]).then(([salesData, servicesData]) => {
            setSales(salesData);
            setServices(servicesData);
        });
    }, [router]);

    const resetFilters = () => {
        setDateFrom('');
        setDateTo('');
        setTypeFilter('all');
        setSearchQuery('');
    };

    const filterByDate = (dateStr: string) => {
        const itemDate = dateStr.slice(0, 10);
        if (dateFrom && itemDate < dateFrom) return false;
        if (dateTo && itemDate > dateTo) return false;
        return true;
    };

    const filteredSales = sales.filter(s => {
        if (!filterByDate(s.created_at)) return false;
        const q = searchQuery.toLowerCase();
        if (q) {
            const matchesInv = s.invoice_number.toLowerCase().includes(q);
            const matchesName = (s.customer_name || '').toLowerCase().includes(q);
            const matchesItem = (s.items ?? []).some(it => (it.product_name || it.name || '').toLowerCase().includes(q));
            if (!matchesInv && !matchesName && !matchesItem) return false;
        }
        return true;
    });

    const filteredServices = services.filter(s => {
        if (!filterByDate(s.created_at)) return false;
        const q = searchQuery.toLowerCase();
        if (q) {
            const matchesNota = s.nota_number.toLowerCase().includes(q);
            const matchesName = s.customer_name.toLowerCase().includes(q);
            const matchesDevice = s.device.toLowerCase().includes(q);
            if (!matchesNota && !matchesName && !matchesDevice) return false;
        }
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Diterima': return 'bg-blue-100 text-blue-700';
            case 'Dalam Proses': return 'bg-yellow-100 text-yellow-700';
            case 'Menunggu Sparepart': return 'bg-orange-100 text-orange-700';
            case 'Selesai': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const totalSalesRevenue = filteredSales.reduce((acc, s) => acc + s.total, 0);

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 fade-in font-sans">
            <div className="mb-6">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">Riwayat Transaksi</h1>
                <p className="text-on-surface-variant text-sm mt-1">Semua transaksi penjualan dan servis tercatat di sini</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 mb-6 shadow-card">
                <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap text-xs font-mono">
                    <div>
                        <label className="block uppercase tracking-wider text-on-surface-variant mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>
                    <div>
                        <label className="block uppercase tracking-wider text-on-surface-variant mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>
                    <div>
                        <label className="block uppercase tracking-wider text-on-surface-variant mb-1">Tipe</label>
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value as any)}
                            className="border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary transition-all"
                        >
                            <option value="all">Semua</option>
                            <option value="penjualan">🛒 Penjualan</option>
                            <option value="servis">🔧 Servis</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-48">
                        <label className="block uppercase tracking-wider text-on-surface-variant mb-1">Cari</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Nama, ID, invoice..."
                                className="w-full pl-9 pr-4 py-2 border border-outline-variant/30 rounded-xl text-xs focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="px-4 py-2 border border-outline-variant/30 rounded-xl text-xs text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Penjualan Section */}
            {(typeFilter === 'all' || typeFilter === 'penjualan') && (
                <div className="mb-8">
                    <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-green-600 text-[20px] icon-filled">shopping_bag</span>
                        Penjualan <span className="font-mono text-sm text-on-surface-variant">({filteredSales.length})</span>
                    </h2>
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container border-b border-outline-variant/20">
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Invoice</th>
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Pelanggan</th>
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Item</th>
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">Metode</th>
                                        <th className="px-4 py-3 text-right text-xs font-mono uppercase tracking-wider text-on-surface-variant">Total</th>
                                        <th className="px-4 py-3 text-right text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10 text-xs">
                                    {filteredSales.map(sale => (
                                        <tr key={sale.id} className="hover:bg-surface-container-low transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-sm font-semibold text-on-surface">{sale.invoice_number}</span>
                                                {sale.discount > 0 && (
                                                    <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono">
                                                        -{sale.discount}%
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <p className="font-semibold text-on-surface">{sale.customer_name || 'Umum'}</p>
                                                <p className="text-on-surface-variant text-[11px]">{sale.cashier_name}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell text-on-surface-variant">
                                                {(sale.items || []).map(it => it.product_name || it.name || 'Produk').join(', ')}
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className="bg-surface-container rounded px-2 py-1 font-mono text-on-surface-variant">
                                                    {sale.payment_method}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-mono font-bold text-secondary text-sm block">
                                                    Rp {sale.total.toLocaleString('id-ID')}
                                                </span>
                                                <Link
                                                    href={`/penjualan/${sale.id}/struk`}
                                                    className="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-bold mt-0.5"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">receipt</span> Struk
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-right hidden sm:table-cell font-mono text-on-surface-variant">
                                                <p>{new Date(sale.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                <p>{new Date(sale.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSales.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant text-sm">
                                                <span className="material-symbols-outlined text-3xl mb-2 block opacity-30">shopping_bag</span>
                                                Tidak ada data penjualan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {filteredSales.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-surface-container border-t border-outline-variant/20 font-mono text-xs">
                                            <td colSpan={4} className="px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">
                                                Total Keseluruhan
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-secondary text-sm">
                                                Rp {totalSalesRevenue.toLocaleString('id-ID')}
                                            </td>
                                            <td className="hidden sm:table-cell"></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Servis Section */}
            {(typeFilter === 'all' || typeFilter === 'servis') && (
                <div>
                    <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
                        Riwayat Servis <span className="font-mono text-sm text-on-surface-variant">({filteredServices.length})</span>
                    </h2>
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container border-b border-outline-variant/20">
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">No. Nota</th>
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant">Pelanggan</th>
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden md:table-cell">Perangkat</th>
                                        <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-mono uppercase tracking-wider text-on-surface-variant">Biaya &amp; Nota</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10 text-xs">
                                    {filteredServices.map(service => (
                                        <tr key={service.id} className="hover:bg-surface-container-low transition-colors">
                                            <td className="px-4 py-3 font-mono">
                                                <span className="text-sm font-semibold text-on-surface">{service.nota_number}</span>
                                                <p className="text-on-surface-variant text-[11px]">
                                                    {new Date(service.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-on-surface">{service.customer_name}</p>
                                                <p className="text-on-surface-variant font-mono text-[11px]">{service.customer_phone}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <p className="text-on-surface font-medium">{service.device}</p>
                                                <p className="text-on-surface-variant text-[11px]">{service.service_type}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(service.status)}`}>
                                                    {service.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono">
                                                <span className="font-bold text-secondary text-sm block">
                                                    Rp {service.price.toLocaleString('id-ID')}
                                                </span>
                                                {service.deposit > 0 && (
                                                    <p className="text-[11px] text-on-surface-variant">
                                                        DP: Rp {service.deposit.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                                <Link
                                                    href={`/servis/${service.id}/nota`}
                                                    className="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-bold mt-0.5"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">receipt_long</span> Nota
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredServices.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-on-surface-variant text-sm">
                                                <span className="material-symbols-outlined text-3xl mb-2 block opacity-30">build_circle</span>
                                                Tidak ada data servis
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
