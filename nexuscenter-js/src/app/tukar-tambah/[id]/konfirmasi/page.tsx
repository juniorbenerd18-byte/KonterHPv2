'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { TradeIn } from '@/types/database';

export default function TradeInConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [tradeIn, setTradeIn] = useState<TradeIn | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTradeIn();
    }, [id]);

    const loadTradeIn = async () => {
        try {
            const allTradeIns = await DataService.getTradeIns();
            const found = allTradeIns.find(t => String(t.id) === id);
            if (found) {
                setTradeIn(found);
            } else {
                alert('Data tukar tambah tidak ditemukan!');
                router.push('/');
            }
        } catch (error) {
            console.error('Error loading trade-in:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatRp = (num: number) => {
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            'Pending Taksir': 'bg-amber-100 text-amber-800 border-amber-200',
            'Dalam Taksir': 'bg-blue-100 text-blue-800 border-blue-200',
            'Menunggu Persetujuan': 'bg-purple-100 text-purple-800 border-purple-200',
            'Deal': 'bg-green-100 text-green-800 border-green-200',
            'Selesai': 'bg-gray-100 text-gray-800 border-gray-200',
            'Batal': 'bg-red-100 text-red-800 border-red-200',
        };
        return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!tradeIn) {
        return null;
    }

    return (
        <div className="fade-in min-h-screen bg-surface-container-low py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-8 mb-6 shadow-xl text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <h1 className="font-display font-extrabold text-2xl md:text-3xl mb-2">
                        Booking Tukar Tambah Berhasil!
                    </h1>
                    <p className="text-green-50 text-sm">
                        Booking Anda telah kami terima. Silakan datang ke toko untuk proses taksir dan verifikasi.
                    </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border-2">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 border-b-4 border-secondary">
                        <div className="text-center">
                            <h2 className="font-display font-extrabold text-xl mb-1">TECHCELL NexusCenter</h2>
                            <p className="text-xs text-slate-300 font-mono">Pusat Gadget & Servis Terpercaya</p>
                            <p className="text-xs text-slate-400 mt-2">Fajar Indah, Baturan, Colomadu (Dekat Hotel Aston Solo) | WA: 0812-3456-7890</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20 text-center">
                            <p className="text-xs font-mono text-slate-300 uppercase tracking-wide mb-1">Bukti Booking Tukar Tambah</p>
                            <p className="font-mono font-bold text-lg text-cyan-300">{tradeIn.booking_number}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Status Badge */}
                        <div className="text-center">
                            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold border ${getStatusBadge(tradeIn.status)}`}>
                                <span className="w-2 h-2 rounded-full bg-current"></span>
                                {tradeIn.status}
                            </span>
                        </div>

                        {/* Customer Info */}
                        <div>
                            <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-secondary">person</span>
                                Informasi Pelanggan
                            </h3>
                            <div className="bg-surface-container-low rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Nama:</span>
                                    <span className="font-medium text-on-surface">{tradeIn.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">No. WhatsApp:</span>
                                    <span className="font-mono font-medium text-on-surface">{tradeIn.customer_phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Tanggal Booking:</span>
                                    <span className="font-medium text-on-surface">{formatDate(tradeIn.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Old Device Info */}
                        <div>
                            <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-secondary">smartphone</span>
                                HP Lama yang Ditukar
                            </h3>
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-outline-variant/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-4xl">📱</div>
                                    <div>
                                        <p className="font-bold text-on-surface">{tradeIn.old_device_model}</p>
                                        <p className="text-xs text-on-surface-variant">{tradeIn.old_device_brand}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {tradeIn.old_device_storage && (
                                        <div className="bg-white rounded-lg p-2 border border-outline-variant/20">
                                            <p className="text-on-surface-variant mb-0.5">Storage</p>
                                            <p className="font-mono font-bold text-on-surface">{tradeIn.old_device_storage}</p>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-lg p-2 border border-outline-variant/20">
                                        <p className="text-on-surface-variant mb-0.5">Kondisi</p>
                                        <p className="font-bold text-on-surface">{tradeIn.old_device_condition}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estimated Price */}
                        <div>
                            <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-secondary">calculate</span>
                                Estimasi Harga Tukar Tambah
                            </h3>
                            <div className="bg-gradient-to-r from-secondary/10 to-cyan-500/10 border border-secondary/30 rounded-xl p-4">
                                <div className="flex items-baseline gap-2 justify-center">
                                    <span className="font-mono font-extrabold text-2xl text-secondary">
                                        {formatRp(tradeIn.estimated_price_min)}
                                    </span>
                                    <span className="text-on-surface-variant">—</span>
                                    <span className="font-mono font-extrabold text-2xl text-secondary">
                                        {formatRp(tradeIn.estimated_price_max)}
                                    </span>
                                </div>
                                <p className="text-xs text-center text-on-surface-variant mt-2">
                                    *Harga final akan ditentukan setelah pengecekan fisik di toko
                                </p>
                            </div>
                        </div>

                        {/* New Device Desired */}
                        {tradeIn.new_device_desired && (
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">upgrade</span>
                                    HP Baru yang Diinginkan
                                </h3>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="font-medium text-on-surface">{tradeIn.new_device_desired}</p>
                                </div>
                            </div>
                        )}

                        {/* Appointment Date */}
                        {tradeIn.appointment_date && (
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">calendar_month</span>
                                    Jadwal Kunjungan
                                </h3>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="font-medium text-on-surface">{formatDate(tradeIn.appointment_date)}</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Mohon datang sesuai jadwal atau hubungi kami jika ada perubahan
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {tradeIn.notes && (
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3">Catatan</h3>
                                <div className="bg-surface-container-low rounded-xl p-4 text-sm text-on-surface">
                                    {tradeIn.notes}
                                </div>
                            </div>
                        )}

                        {/* Important Info */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-amber-600 text-[20px]">info</span>
                                <div className="text-xs text-amber-900">
                                    <p className="font-bold mb-1.5">Yang Perlu Dibawa:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                                        <li>HP lama beserta charger & dus (jika ada)</li>
                                        <li>KTP/identitas asli</li>
                                        <li>Nota pembelian (jika masih ada)</li>
                                        <li>Backup data & reset factory sebelumnya</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-surface-container-low border-t border-outline-variant/30 p-6 flex flex-col sm:flex-row gap-3 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-white border border-outline-variant/30 text-on-surface font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-surface-container transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">print</span>
                            Cetak Bukti
                        </button>
                        <a
                            href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20sudah%20booking%20tukar%20tambah%20dengan%20nomor%20${tradeIn.booking_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-emerald-600 text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            Hubungi via WhatsApp
                        </a>
                        <Link
                            href="/"
                            className="flex-1 bg-secondary text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-6 bg-white border border-outline-variant/30 rounded-xl p-5 text-center print:hidden">
                    <p className="text-sm text-on-surface-variant mb-3">
                        <strong className="text-on-surface">Simpan nomor booking ini!</strong> Anda dapat melacak status tukar tambah Anda kapan saja.
                    </p>
                    <Link
                        href="/tukar-tambah/lacak"
                        className="inline-flex items-center gap-2 text-secondary font-mono text-sm font-bold hover:underline"
                    >
                        <span className="material-symbols-outlined text-[16px]">search</span>
                        Lacak Status Tukar Tambah
                    </Link>
                </div>
            </div>
        </div>
    );
}
