'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { TradeIn, TradeInStatus } from '@/types/database';

export default function TradeInAdminPage() {
    const router = useRouter();
    const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
    const [filteredTradeIns, setFilteredTradeIns] = useState<TradeIn[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<TradeInStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTradeIn, setSelectedTradeIn] = useState<TradeIn | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    // Edit form states
    const [editStatus, setEditStatus] = useState<TradeInStatus>('Pending Taksir');
    const [editFinalPrice, setEditFinalPrice] = useState('');
    const [editAdditionalPayment, setEditAdditionalPayment] = useState('');
    const [editNotes, setEditNotes] = useState('');

    useEffect(() => {
        // Auth check - only staff can access
        if (!DataService.isLoggedIn()) {
            router.replace('/login?redirect=/trade-in-admin');
            return;
        }
        const user = DataService.getCurrentUser();
        const role = user?.role || 'pengguna';
        if (role !== 'admin' && role !== 'kasir') {
            alert('⚠️ Anda tidak memiliki akses ke halaman ini!');
            router.replace('/dashboard');
            return;
        }
        
        loadTradeIns();
    }, []);

    useEffect(() => {
        filterData();
    }, [tradeIns, filterStatus, searchQuery]);

    const loadTradeIns = async () => {
        setLoading(true);
        try {
            const data = await DataService.getTradeIns();
            setTradeIns(data);
        } catch (error) {
            console.error('Error loading trade-ins:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let filtered = [...tradeIns];
        
        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(t => t.status === filterStatus);
        }
        
        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
                t.booking_number.toLowerCase().includes(q) ||
                t.customer_name.toLowerCase().includes(q) ||
                t.customer_phone.includes(q) ||
                t.old_device_model.toLowerCase().includes(q) ||
                t.old_device_brand.toLowerCase().includes(q)
            );
        }
        
        setFilteredTradeIns(filtered);
    };

    const openDetailModal = (tradeIn: TradeIn) => {
        setSelectedTradeIn(tradeIn);
        setShowDetailModal(true);
    };

    const openEditModal = (tradeIn: TradeIn) => {
        setSelectedTradeIn(tradeIn);
        setEditStatus(tradeIn.status);
        setEditFinalPrice(tradeIn.final_trade_in_price?.toString() || '');
        setEditAdditionalPayment(tradeIn.additional_payment?.toString() || '');
        setEditNotes(tradeIn.notes || '');
        setShowEditModal(true);
    };

    const handleUpdateTradeIn = async () => {
        if (!selectedTradeIn) return;
        
        try {
            await DataService.updateTradeIn(selectedTradeIn.id, {
                status: editStatus,
                final_trade_in_price: editFinalPrice ? parseInt(editFinalPrice) : null,
                additional_payment: editAdditionalPayment ? parseInt(editAdditionalPayment) : null,
                notes: editNotes || null
            });
            
            setShowEditModal(false);
            loadTradeIns();
            alert('✅ Data tukar tambah berhasil diupdate!');
        } catch (error) {
            console.error('Error updating trade-in:', error);
            alert('❌ Gagal update data. Silakan coba lagi.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus data tukar tambah ini?')) return;
        
        try {
            await DataService.deleteTradeIn(id);
            loadTradeIns();
            alert('✅ Data berhasil dihapus!');
        } catch (error) {
            console.error('Error deleting trade-in:', error);
            alert('❌ Gagal menghapus data.');
        }
    };

    const formatRp = (num: number | null | undefined) => {
        if (!num) return '-';
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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

    const getNewCount = () => {
        return tradeIns.filter(t => t.status === 'Pending Taksir').length;
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

    return (
        <div className="fade-in min-h-screen bg-surface-container-low py-6 px-4">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 mb-6 shadow-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">autorenew</span>
                                </div>
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl text-on-surface">
                                        Manajemen Tukar Tambah HP
                                    </h1>
                                    <p className="text-sm text-on-surface-variant">Kelola booking & taksir harga trade-in pelanggan</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {getNewCount() > 0 && (
                                <div className="bg-amber-100 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] animate-pulse">notifications_active</span>
                                    <span className="text-sm font-bold">{getNewCount()} Booking Baru</span>
                                </div>
                            )}
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/30 text-on-surface font-mono text-sm px-4 py-2 rounded-xl hover:bg-surface-container-high transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-outline-variant/30 rounded-xl p-4">
                        <p className="text-xs font-mono text-on-surface-variant uppercase mb-1">Total Booking</p>
                        <p className="font-display font-bold text-2xl text-on-surface">{tradeIns.length}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-xs font-mono text-amber-700 uppercase mb-1">Pending Taksir</p>
                        <p className="font-display font-bold text-2xl text-amber-800">
                            {tradeIns.filter(t => t.status === 'Pending Taksir').length}
                        </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs font-mono text-blue-700 uppercase mb-1">Dalam Taksir</p>
                        <p className="font-display font-bold text-2xl text-blue-800">
                            {tradeIns.filter(t => t.status === 'Dalam Taksir').length}
                        </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-xs font-mono text-green-700 uppercase mb-1">Deal</p>
                        <p className="font-display font-bold text-2xl text-green-800">
                            {tradeIns.filter(t => t.status === 'Deal' || t.status === 'Selesai').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-outline-variant/30 rounded-xl p-4 mb-4 shadow-card">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari booking number, nama, HP..."
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            />
                        </div>
                        
                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value as any)}
                            className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        >
                            <option value="all">Semua Status</option>
                            <option value="Pending Taksir">Pending Taksir</option>
                            <option value="Dalam Taksir">Dalam Taksir</option>
                            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                            <option value="Deal">Deal</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Batal">Batal</option>
                        </select>
                        
                        <button
                            onClick={loadTradeIns}
                            className="bg-secondary text-white px-4 py-2.5 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 font-mono text-sm font-bold"
                        >
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-outline-variant/30 rounded-xl shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                <tr>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">Booking #</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">Pelanggan</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">HP Lama</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">Estimasi</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">Status</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">Tanggal</th>
                                    <th className="text-center p-4 text-xs font-mono font-bold text-on-surface-variant uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {filteredTradeIns.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-5xl opacity-20 block mb-2">search_off</span>
                                            Tidak ada data tukar tambah
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTradeIns.map(tradeIn => (
                                        <tr key={tradeIn.id} className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-mono font-bold text-sm text-secondary">{tradeIn.booking_number}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-sm text-on-surface">{tradeIn.customer_name}</p>
                                                <p className="font-mono text-xs text-on-surface-variant">{tradeIn.customer_phone}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-sm text-on-surface">{tradeIn.old_device_model}</p>
                                                <p className="text-xs text-on-surface-variant">{tradeIn.old_device_brand} • {tradeIn.old_device_storage || '-'}</p>
                                                <span className="text-xs bg-surface-container px-2 py-0.5 rounded-md inline-block mt-1">
                                                    {tradeIn.old_device_condition}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-mono text-xs text-on-surface-variant">
                                                    {formatRp(tradeIn.estimated_price_min)} - {formatRp(tradeIn.estimated_price_max)}
                                                </p>
                                                {tradeIn.final_trade_in_price && (
                                                    <p className="font-mono font-bold text-sm text-green-700 mt-1">
                                                        Final: {formatRp(tradeIn.final_trade_in_price)}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${getStatusBadge(tradeIn.status)}`}>
                                                    {tradeIn.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-xs text-on-surface-variant">{formatDate(tradeIn.created_at)}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openDetailModal(tradeIn)}
                                                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                                                        title="Lihat Detail"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(tradeIn)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Edit Status"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tradeIn.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Hapus"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedTradeIn && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 border-b-4 border-secondary">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display font-bold text-xl">Detail Booking Trade-In</h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="font-mono text-cyan-300 text-sm mt-2">{selectedTradeIn.booking_number}</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div>
                                <p className="text-xs font-mono text-on-surface-variant uppercase mb-2">Status Saat Ini</p>
                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold border ${getStatusBadge(selectedTradeIn.status)}`}>
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    {selectedTradeIn.status}
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
                                        <span className="font-medium text-on-surface">{selectedTradeIn.customer_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">No. WhatsApp:</span>
                                        <a href={`https://wa.me/62${selectedTradeIn.customer_phone.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="font-mono font-medium text-secondary hover:underline">
                                            {selectedTradeIn.customer_phone}
                                        </a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Tanggal Booking:</span>
                                        <span className="font-medium text-on-surface">{formatDate(selectedTradeIn.created_at)}</span>
                                    </div>
                                    {selectedTradeIn.appointment_date && (
                                        <div className="flex justify-between">
                                            <span className="text-on-surface-variant">Jadwal Kunjungan:</span>
                                            <span className="font-medium text-on-surface">{formatDate(selectedTradeIn.appointment_date)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Old Device */}
                            <div>
                                <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">smartphone</span>
                                    HP Lama yang Ditukar
                                </h3>
                                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-outline-variant/30">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-on-surface-variant text-xs mb-1">Brand</p>
                                            <p className="font-bold text-on-surface">{selectedTradeIn.old_device_brand}</p>
                                        </div>
                                        <div>
                                            <p className="text-on-surface-variant text-xs mb-1">Model</p>
                                            <p className="font-bold text-on-surface">{selectedTradeIn.old_device_model}</p>
                                        </div>
                                        {selectedTradeIn.old_device_storage && (
                                            <div>
                                                <p className="text-on-surface-variant text-xs mb-1">Storage</p>
                                                <p className="font-mono font-bold text-on-surface">{selectedTradeIn.old_device_storage}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-on-surface-variant text-xs mb-1">Kondisi</p>
                                            <p className="font-bold text-on-surface">{selectedTradeIn.old_device_condition}</p>
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
                                        <p className="text-xs text-on-surface-variant mb-1">Estimasi Harga Trade-In</p>
                                        <p className="font-mono font-bold text-xl text-secondary">
                                            {formatRp(selectedTradeIn.estimated_price_min)} - {formatRp(selectedTradeIn.estimated_price_max)}
                                        </p>
                                    </div>
                                    {selectedTradeIn.final_trade_in_price && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <p className="text-xs text-green-700 mb-1">Harga Final Setelah Taksir</p>
                                            <p className="font-mono font-bold text-xl text-green-800">
                                                {formatRp(selectedTradeIn.final_trade_in_price)}
                                            </p>
                                        </div>
                                    )}
                                    {selectedTradeIn.additional_payment && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <p className="text-xs text-blue-700 mb-1">Selisih yang Dibayar Pelanggan</p>
                                            <p className="font-mono font-bold text-xl text-blue-800">
                                                {formatRp(selectedTradeIn.additional_payment)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* New Device Desired */}
                            {selectedTradeIn.new_device_desired && (
                                <div>
                                    <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-secondary">upgrade</span>
                                        HP Baru yang Diinginkan
                                    </h3>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="font-medium text-on-surface">{selectedTradeIn.new_device_desired}</p>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedTradeIn.notes && (
                                <div>
                                    <h3 className="font-bold text-sm text-on-surface mb-3">Catatan</h3>
                                    <div className="bg-surface-container-low rounded-xl p-4 text-sm text-on-surface">
                                        {selectedTradeIn.notes}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-surface-container-low border-t border-outline-variant/30 p-4 flex gap-3">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="flex-1 bg-white border border-outline-variant/30 text-on-surface font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-surface-container transition-all"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    openEditModal(selectedTradeIn);
                                }}
                                className="flex-1 bg-secondary text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Edit Status & Harga
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedTradeIn && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 border-b-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display font-bold text-xl">Update Status & Harga Trade-In</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="font-mono text-blue-200 text-sm mt-2">{selectedTradeIn.booking_number}</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Status Trade-In *
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value as TradeInStatus)}
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                >
                                    <option value="Pending Taksir">Pending Taksir</option>
                                    <option value="Dalam Taksir">Dalam Taksir</option>
                                    <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                                    <option value="Deal">Deal</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Batal">Batal</option>
                                </select>
                            </div>

                            {/* Final Trade-In Price */}
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Harga Final Trade-In (Setelah Taksir Fisik)
                                </label>
                                <input
                                    type="number"
                                    value={editFinalPrice}
                                    onChange={e => setEditFinalPrice(e.target.value)}
                                    step="10000"
                                    min="0"
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                    placeholder="Contoh: 3500000"
                                />
                                <p className="text-xs text-on-surface-variant mt-1 ml-1">
                                    Kosongkan jika belum ditaksir. Estimasi: {formatRp(selectedTradeIn.estimated_price_min)} - {formatRp(selectedTradeIn.estimated_price_max)}
                                    <br />
                                    💡 Tip: Gunakan tombol ↑↓ atau scroll untuk increment Rp 10.000
                                </p>
                            </div>

                            {/* Additional Payment */}
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Selisih yang Dibayar Pelanggan
                                </label>
                                <input
                                    type="number"
                                    value={editAdditionalPayment}
                                    onChange={e => setEditAdditionalPayment(e.target.value)}
                                    step="10000"
                                    min="0"
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                    placeholder="Contoh: 5000000"
                                />
                                <p className="text-xs text-on-surface-variant mt-1 ml-1">
                                    Harga HP baru dikurangi harga trade-in
                                    <br />
                                    💡 Tip: Gunakan tombol ↑↓ atau scroll untuk increment Rp 10.000
                                </p>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Catatan Internal (Staff)
                                </label>
                                <textarea
                                    rows={4}
                                    value={editNotes}
                                    onChange={e => setEditNotes(e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    placeholder="Catatan kondisi fisik HP, keluhan, atau informasi tambahan..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-surface-container-low border-t border-outline-variant/30 p-4 flex gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-white border border-outline-variant/30 text-on-surface font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-surface-container transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateTradeIn}
                                className="flex-1 bg-secondary text-white font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Simpan Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
