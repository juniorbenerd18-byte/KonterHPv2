'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/store';
import { ServiceOrder } from '@/types/database';

export default function TrackServicePage() {
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [results, setResults] = useState<ServiceOrder[]>([]);
    const [deliveries, setDeliveries] = useState<any[]>([]);

    useEffect(() => {
        DataService.getDeliveries().then(setDeliveries);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const q = query.trim().toLowerCase();
        if (!q) return;

        setHasSearched(true);
        const allServices = await DataService.getServices();
        const matches = allServices.filter(s =>
            s.nota_number.toLowerCase().includes(q) ||
            s.customer_phone.toLowerCase().includes(q) ||
            s.customer_name.toLowerCase().includes(q)
        );
        setResults(matches);
    };

    const maskName = (name: string) => {
        if (!name || name.length <= 3) return name;
        return name.slice(0, 3) + '***';
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Diterima': return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'Dalam Proses': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Menunggu Sparepart': return 'bg-orange-100 text-orange-800 border border-orange-200';
            case 'Selesai': return 'bg-green-100 text-green-700 border border-green-200';
            case 'Diambil': return 'bg-gray-100 text-gray-700 border border-gray-200';
            default: return 'bg-slate-100 text-slate-700 border border-slate-200';
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 fade-in font-sans">
            {/* Header Card */}
            <div className="max-w-2xl mx-auto bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-card text-center mb-10 space-y-4">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto border border-secondary/20 shadow-sm">
                    <span className="material-symbols-outlined text-[36px]">travel_explore</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface">
                    Lacak Status Servis HP
                </h1>
                <p className="text-on-surface-variant text-sm max-w-lg mx-auto leading-relaxed">
                    Masukkan <strong>Nomor Nota</strong> (contoh: <code className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">SRV-20260831-0001</code>) atau <strong>Nomor HP Pelanggan</strong> untuk mengecek status perbaikan HP Anda.
                </p>

                {/* Form Pencarian */}
                <form onSubmit={handleSearch} className="flex gap-2 pt-2 max-w-lg mx-auto">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">
                            search
                        </span>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Masukkan Nomor Nota / No. HP..."
                            required
                            className="w-full bg-slate-50 border border-outline-variant/40 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all shadow-md active:scale-[0.98] flex items-center gap-2 flex-shrink-0 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">search</span>
                        Lacak
                    </button>
                </form>
            </div>

            {/* Hasil Pencarian */}
            {hasSearched && (
                <div>
                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.length > 1 && (
                                <div className="max-w-xl mx-auto mb-4">
                                    <p className="text-xs text-center text-on-surface-variant font-mono">
                                        Ditemukan <strong>{results.length}</strong> servis untuk kriteria pencarian ini.
                                    </p>
                                </div>
                            )}

                            {results.map(service => {
                                const delivery = deliveries.find(d => d.service_id === service.id);
                                return (
                                    <div
                                        key={service.id}
                                        className="max-w-xl mx-auto bg-surface-container-lowest border border-secondary/30 rounded-2xl p-6 shadow-glass relative overflow-hidden mb-4"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

                                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
                                            <div>
                                                <span className="text-xs font-mono text-on-surface-variant">Nomor Nota</span>
                                                <h3 className="font-mono font-bold text-lg text-secondary">{service.nota_number}</h3>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${getStatusBadgeClass(service.status)}`}>
                                                {service.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                            <div>
                                                <p className="text-xs text-on-surface-variant">Pemilik / Pelanggan</p>
                                                <p className="font-semibold text-on-surface">{maskName(service.customer_name)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-on-surface-variant">Perangkat HP</p>
                                                <p className="font-semibold text-on-surface">{service.device}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-on-surface-variant">Jenis Kerusakan / Servis</p>
                                                <p className="font-medium text-on-surface">{service.service_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-on-surface-variant">Tgl Masuk</p>
                                                <p className="font-mono text-on-surface-variant text-xs">
                                                    {new Date(service.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {delivery && (
                                            <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-xl p-4 mb-4 flex items-center justify-between flex-wrap gap-2 text-xs">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-secondary animate-bounce text-[24px]">
                                                        two_wheeler
                                                    </span>
                                                    <div>
                                                        <strong className="text-primary block font-mono text-sm">
                                                            🚚 HP Anda Sedang Diantar Kurir ({delivery.courier_name})
                                                        </strong>
                                                        <span className="text-on-surface-variant font-mono text-xs">
                                                            Kode PIN Verifikasi Anda:{' '}
                                                            <strong className="text-secondary font-mono font-bold text-sm ml-1">
                                                                {delivery.delivery_pin}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/pengantaran/lacak/${delivery.tracking_code}`}
                                                    className="bg-secondary text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-md"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">map</span>
                                                    Lacak Peta Live &rarr;
                                                </Link>
                                            </div>
                                        )}

                                        {service.issue && (
                                            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 mb-4 text-xs">
                                                <span className="font-semibold text-on-surface block mb-1">Catatan Keluhan:</span>
                                                <p className="text-on-surface-variant">{service.issue}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center bg-secondary/5 border border-secondary/15 rounded-xl p-4">
                                            <div>
                                                <span className="text-xs text-on-surface-variant">Total Biaya Servis</span>
                                                <p className="font-mono font-bold text-lg text-secondary">
                                                    Rp {service.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            {service.deposit > 0 && (
                                                <div className="text-right">
                                                    <span className="text-xs text-on-surface-variant">Uang Muka (DP)</span>
                                                    <p className="font-mono text-sm font-semibold text-green-700">
                                                        Rp {service.deposit.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto bg-surface-container-lowest border border-red-200 rounded-2xl p-8 text-center shadow-card">
                            <span className="material-symbols-outlined text-red-500 text-5xl mb-2">search_off</span>
                            <h3 className="font-display font-bold text-lg text-on-surface">Data Servis Tidak Ditemukan</h3>
                            <p className="text-on-surface-variant text-sm mt-1">
                                Pastikan Nomor Nota (contoh: <code>SRV-20260831-0001</code>) atau Nomor HP yang Anda masukkan sudah benar.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
