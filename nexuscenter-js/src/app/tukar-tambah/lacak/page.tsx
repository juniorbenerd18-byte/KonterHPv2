'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { TradeIn } from '@/types/database';

export default function TrackTradeInPage() {
    const router = useRouter();
    const [bookingNumber, setBookingNumber] = useState('');
    const [tradeIn, setTradeIn] = useState<TradeIn | null>(null);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingNumber.trim()) {
            alert('Masukkan nomor booking!');
            return;
        }

        setLoading(true);
        setNotFound(false);
        setTradeIn(null);

        try {
            const result = await DataService.getTradeInByBookingNumber(bookingNumber.trim());
            if (result) {
                setTradeIn(result);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error('Error tracking trade-in:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const formatRp = (num: number | null | undefined) => {
        if (!num) return '-';
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const getStatusIcon = (status: string) => {
        const icons: Record<string, string> = {
            'Pending Taksir': '⏳',
            'Dalam Taksir': '🔍',
            'Menunggu Persetujuan': '⏰',
            'Deal': '✅',
            'Selesai': '🎉',
            'Batal': '❌',
        };
        return icons[status] || '📦';
    };

    const getStatusMessage = (status: string) => {
        const messages: Record<string, string> = {
            'Pending Taksir': 'Booking Anda telah kami terima dan menunggu untuk ditaksir. Kami akan segera menghubungi Anda.',
            'Dalam Taksir': 'HP Anda sedang ditaksir oleh teknisi kami. Proses ini biasanya memakan waktu 15-30 menit.',
            'Menunggu Persetujuan': 'Harga trade-in sudah ditentukan. Silakan cek detail harga dan hubungi kami untuk konfirmasi.',
            'Deal': 'Selamat! Trade-in telah disepakati. Silakan datang ke toko untuk menyelesaikan transaksi.',
            'Selesai': 'Transaksi trade-in telah selesai. Terima kasih telah mempercayai TECHCELL NexusCenter!',
            'Batal': 'Trade-in dibatalkan. Silakan hubungi kami jika ada pertanyaan.',
        };
        return messages[status] || 'Status tidak dikenal';
    };

    const getProgressPercentage = (status: string) => {
        const progress: Record<string, number> = {
            'Pending Taksir': 20,
            'Dalam Taksir': 40,
            'Menunggu Persetujuan': 60,
            'Deal': 80,
            'Selesai': 100,
            'Batal': 0,
        };
        return progress[status] || 0;
    };

    return (
        <div className="fade-in min-h-screen bg-surface-container-low py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 mb-6 shadow-card">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">search</span>
                        </div>
                        <div>
                            <h1 className="font-display font-extrabold text-2xl text-on-surface">
                                Lacak Status Tukar Tambah
                            </h1>
                            <p className="text-sm text-on-surface-variant">Masukkan nomor booking untuk melihat status</p>
                        </div>
                    </div>
                </div>

                {/* Search Form */}
                <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 mb-6 shadow-card">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Nomor Booking *
                            </label>
                            <input
                                type="text"
                                value={bookingNumber}
                                onChange={e => setBookingNumber(e.target.value)}
                                placeholder="Contoh: TI-20260914-1234"
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                required
                            />
                            <p className="text-xs text-on-surface-variant mt-1 ml-1">
                                Format: TI-YYYYMMDD-XXXX (cek bukti booking Anda)
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-secondary text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {loading ? 'progress_activity' : 'search'}
                                </span>
                                {loading ? 'Mencari...' : 'Lacak Sekarang'}
                            </button>
                            <Link
                                href="/"
                                className="bg-white border border-outline-variant/30 text-on-surface font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-surface-container transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">home</span>
                                Beranda
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Not Found */}
                {notFound && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <span className="material-symbols-outlined text-6xl text-red-400 block mb-3">search_off</span>
                        <h3 className="font-bold text-lg text-red-900 mb-2">Booking Tidak Ditemukan</h3>
                        <p className="text-sm text-red-700 mb-4">
                            Nomor booking <strong className="font-mono">{bookingNumber}</strong> tidak ada dalam sistem kami.
                        </p>
                        <div className="space-y-2 text-xs text-red-800">
                            <p>Pastikan nomor booking benar dan sesuai dengan bukti booking Anda.</p>
                            <p>Jika masih bermasalah, silakan hubungi kami via WhatsApp.</p>
                        </div>
                        <a
                            href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tidak%20bisa%20melacak%20booking%20trade-in%20saya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-emerald-500 transition-all mt-4"
                        >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            Hubungi via WhatsApp
                        </a>
                    </div>
                )}

                {/* Result */}
                {tradeIn && (
                    <div className="bg-white border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
                        {/* Status Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs font-mono text-slate-400 uppercase mb-1">Booking Number</p>
                                    <p className="font-mono font-bold text-xl text-cyan-300">{tradeIn.booking_number}</p>
                                </div>
                                <span className={`text-5xl`}>{getStatusIcon(tradeIn.status)}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono text-slate-300">Progress</span>
                                    <span className="text-xs font-mono text-cyan-300 font-bold">{getProgressPercentage(tradeIn.status)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-secondary to-cyan-400 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${getProgressPercentage(tradeIn.status)}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            {/* Current Status */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <p className="text-xs text-slate-300 mb-1">Status Saat Ini</p>
                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold border ${getStatusBadge(tradeIn.status)}`}>
                                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                    {tradeIn.status}
                                </span>
                                <p className="text-sm text-white mt-3 leading-relaxed">
                                    {getStatusMessage(tradeIn.status)}
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-6">
                            {/* HP Lama */}
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">smartphone</span>
                                    HP yang Ditukar
                                </h3>
                                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-outline-variant/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">📱</span>
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

                            {/* Price Info */}
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">calculate</span>
                                    Informasi Harga
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-secondary/10 to-cyan-500/10 border border-secondary/30 rounded-xl p-4">
                                        <p className="text-xs text-on-surface-variant mb-1">Estimasi Awal</p>
                                        <p className="font-mono font-bold text-lg text-secondary">
                                            {formatRp(tradeIn.estimated_price_min)} - {formatRp(tradeIn.estimated_price_max)}
                                        </p>
                                    </div>
                                    
                                    {tradeIn.final_trade_in_price && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <p className="text-xs text-green-700 mb-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                Harga Final Setelah Taksir
                                            </p>
                                            <p className="font-mono font-bold text-2xl text-green-800">
                                                {formatRp(tradeIn.final_trade_in_price)}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {tradeIn.additional_payment && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <p className="text-xs text-blue-700 mb-1">Selisih yang Perlu Dibayar</p>
                                            <p className="font-mono font-bold text-xl text-blue-800">
                                                {formatRp(tradeIn.additional_payment)}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-2">
                                                Untuk mendapatkan {tradeIn.new_device_desired || 'HP baru'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                                    Timeline
                                </h3>
                                <div className="bg-surface-container-low rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Tanggal Booking:</span>
                                        <span className="font-medium text-on-surface">{formatDate(tradeIn.created_at)}</span>
                                    </div>
                                    {tradeIn.appointment_date && (
                                        <div className="flex justify-between">
                                            <span className="text-on-surface-variant">Jadwal Kunjungan:</span>
                                            <span className="font-medium text-on-surface">{formatDate(tradeIn.appointment_date)}</span>
                                        </div>
                                    )}
                                    {tradeIn.updated_at && (
                                        <div className="flex justify-between">
                                            <span className="text-on-surface-variant">Update Terakhir:</span>
                                            <span className="font-medium text-on-surface">{formatDate(tradeIn.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-surface-container-low border-t border-outline-variant/30 p-4 flex flex-col sm:flex-row gap-3">
                            <a
                                href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20tanya%20tentang%20booking%20${tradeIn.booking_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-emerald-600 text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">chat</span>
                                Hubungi via WhatsApp
                            </a>
                            <Link
                                href={`/tukar-tambah/${tradeIn.id}/konfirmasi`}
                                className="flex-1 bg-white border border-outline-variant/30 text-on-surface font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-surface-container transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                Lihat Bukti Booking
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
