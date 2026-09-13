'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/store';
import { Sale, ServiceOrder, Product } from '@/types/database';

export default function DashboardPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [services, setServices] = useState<ServiceOrder[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentRole, setCurrentRole] = useState('admin');

    useEffect(() => {
        setCurrentRole(DataService.getCurrentRole());
        Promise.all([
            DataService.getSales(),
            DataService.getServices(),
            DataService.getProducts()
        ]).then(([salesData, servicesData, productsData]) => {
            setSales(salesData);
            setServices(servicesData);
            setProducts(productsData);
        });
    }, []);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter(s => s.created_at.startsWith(todayStr));
    const todaySalesTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const activeServices = services.filter(s => s.status !== 'Diambil' && s.status !== 'Selesai');
    const lowStockProducts = products.filter(p => p.stock <= 5);

    const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

    const stats = [
        {
            label: 'Penjualan Hari Ini',
            value: formatRupiah(todaySalesTotal),
            icon: 'payments',
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-100',
            sub: `${todaySales.length} transaksi`
        },
        {
            label: 'Total Transaksi',
            value: String(sales.length),
            icon: 'receipt_long',
            color: 'text-secondary',
            bg: 'bg-cyan-50',
            border: 'border-cyan-100',
            sub: 'Semua tercatat'
        },
        {
            label: 'Servis Aktif',
            value: String(activeServices.length),
            icon: 'build_circle',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            sub: 'Sedang diproses'
        },
        {
            label: 'Total Produk',
            value: String(products.length),
            icon: 'inventory_2',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            sub: `${lowStockProducts.length} stok menipis`
        }
    ];

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Diterima': return 'bg-blue-100 text-blue-700';
            case 'Dalam Proses': return 'bg-yellow-100 text-yellow-800';
            case 'Menunggu Sparepart': return 'bg-orange-100 text-orange-800';
            case 'Selesai': return 'bg-green-100 text-green-700';
            case 'Diambil': return 'bg-gray-100 text-gray-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const formatDate = () => {
        const d = new Date();
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 fade-in font-sans">
            {/* Hero Welcome Banner */}
            <section className="mb-8 rounded-2xl overflow-hidden relative bg-primary-container circuit-pattern shadow-lg border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/95 to-transparent"></div>
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-secondary/30 to-transparent"></div>
                <div className="relative z-10 px-8 py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-fixed-dim px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3 border border-secondary/20">
                            <span className="w-1.5 h-1.5 bg-secondary-fixed-dim rounded-full animate-pulse"></span>
                            Sistem Aktif
                        </span>
                        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight">
                            Selamat Datang, <span className="text-secondary-fixed-dim">{currentRole === 'admin' ? 'Admin Toko' : 'Staff Kasir'}</span> 👋
                        </h1>
                        <p className="text-white/60 text-sm md:text-base">
                            {formatDate()} · Pantau bisnis Anda secara real-time
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Link
                            href="/pos"
                            className="flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(0,104,122,0.4)]"
                        >
                            <span className="material-symbols-outlined text-[18px]">shopping_cart</span> POS Penjualan
                        </Link>
                        <Link
                            href="/servis"
                            className="flex items-center gap-2 bg-white/10 text-white px-5 py-3 rounded-xl font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">build</span> Servis HP
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`bg-surface-container-lowest border ${stat.border} rounded-2xl p-5 shadow-card hover:shadow-md transition-all flex flex-col gap-3`}
                    >
                        <div className="flex items-center justify-between">
                            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                                <span className="material-symbols-outlined icon-filled text-[22px]">{stat.icon}</span>
                            </div>
                            <span className="text-xs text-on-surface-variant font-mono">{stat.sub}</span>
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-mono mb-1">{stat.label}</p>
                            <p className="font-display font-bold text-2xl text-on-surface leading-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Sales */}
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                        <h2 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[20px] icon-filled">receipt_long</span>
                            Transaksi Terbaru
                        </h2>
                        <Link href="/riwayat" className="text-secondary text-sm font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="divide-y divide-outline-variant/10">
                        {sales.slice(0, 5).map(sale => (
                            <div key={sale.id} className="px-6 py-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors">
                                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-green-600 text-[18px] icon-filled">shopping_bag</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-on-surface truncate">{sale.invoice_number}</p>
                                    <p className="text-xs text-on-surface-variant">
                                        {sale.customer_name || 'Pelanggan Umum'} · {sale.payment_method}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-mono font-bold text-sm text-secondary">
                                        Rp {sale.total.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-xs text-on-surface-variant">
                                        {new Date(sale.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {sales.length === 0 && (
                            <div className="px-6 py-10 text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">receipt_long</span>
                                <p className="text-sm">Belum ada transaksi</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Services */}
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                        <h2 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500 text-[20px] icon-filled">build_circle</span>
                            Servis Terbaru
                        </h2>
                        <Link href="/servis" className="text-secondary text-sm font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="divide-y divide-outline-variant/10">
                        {services.slice(0, 5).map(service => (
                            <div key={service.id} className="px-6 py-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors">
                                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-orange-500 text-[18px] icon-filled">smartphone</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-on-surface truncate">{service.customer_name}</p>
                                    <p className="text-xs text-on-surface-variant truncate">
                                        {service.device} · {service.service_type}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(service.status)}`}>
                                        {service.status}
                                    </span>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        {new Date(service.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {services.length === 0 && (
                            <div className="px-6 py-10 text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">build_circle</span>
                                <p className="text-sm">Belum ada data servis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-card">
                <h3 className="font-display font-bold text-base text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] icon-filled">info</span>
                    Info Sistem
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Produk', value: String(products.length), icon: 'inventory_2' },
                        { label: 'Total Transaksi', value: String(sales.length), icon: 'receipt_long' },
                        { label: 'Total Servis', value: String(services.length), icon: 'build' },
                        { label: 'Stok Menipis', value: String(lowStockProducts.length), icon: 'warning' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
                            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">{item.icon}</span>
                            <div>
                                <p className="text-xs text-on-surface-variant font-mono">{item.label}</p>
                                <p className="font-display font-bold text-xl text-on-surface">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
