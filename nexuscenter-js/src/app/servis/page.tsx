'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { ServiceOrder } from '@/types/database';

export default function ServiceManagementPage() {
    const router = useRouter();
    const [services, setServices] = useState<ServiceOrder[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // New Service Form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [device, setDevice] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [status, setStatus] = useState('Diterima');
    const [issue, setIssue] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [deposit, setDeposit] = useState<number | ''>('');
    const [estimatedDate, setEstimatedDate] = useState('');

    // Edit Modal state
    const [editingService, setEditingService] = useState<ServiceOrder | null>(null);

    // Pay / Pelunasan Modal state
    const [payingService, setPayingService] = useState<ServiceOrder | null>(null);

    useEffect(() => {
        if (!DataService.isLoggedIn()) {
            router.push('/login?redirect=/servis');
            return;
        }
        const r = DataService.getCurrentRole();
        if (r === 'pengguna') {
            router.push('/booking-servis');
            return;
        }
        loadServices();
    }, [router]);

    const loadServices = async () => {
        const data = await DataService.getServices();
        setServices(data);
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        const notaNumber = `SRV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

        await DataService.createService({
            nota_number: notaNumber,
            customer_name: customerName,
            customer_phone: customerPhone,
            device,
            service_type: serviceType,
            status,
            issue,
            price: Number(price) || 0,
            deposit: Number(deposit) || 0,
            estimated_date: estimatedDate || undefined
        });

        // Reset form
        setCustomerName('');
        setCustomerPhone('');
        setDevice('');
        setServiceType('');
        setStatus('Diterima');
        setIssue('');
        setPrice('');
        setDeposit('');
        setEstimatedDate('');

        await loadServices();
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        await DataService.updateService(id, { status: newStatus });
        await loadServices();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus data servis ini?')) {
            await DataService.deleteService(id);
            await loadServices();
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        await DataService.updateService(editingService.id, {
            customer_name: editingService.customer_name,
            customer_phone: editingService.customer_phone,
            device: editingService.device,
            service_type: editingService.service_type,
            price: Number(editingService.price) || 0,
            deposit: Number(editingService.deposit) || 0,
            status: editingService.status,
            issue: editingService.issue
        });

        setEditingService(null);
        await loadServices();
    };

    const handleConfirmPelunasan = async () => {
        if (!payingService) return;

        await DataService.updateService(payingService.id, {
            deposit: payingService.price,
            status: 'Diambil'
        });

        setPayingService(null);
        await loadServices();
    };

    const filteredServices = services.filter(s => {
        const matchesQuery = s.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s.nota_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s.device.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const getStatusBadgeClass = (s: string) => {
        switch (s) {
            case 'Diterima': return 'bg-blue-100 text-blue-700';
            case 'Dalam Proses': return 'bg-yellow-100 text-yellow-700';
            case 'Menunggu Sparepart': return 'bg-orange-100 text-orange-700';
            case 'Selesai': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 fade-in font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: Form Penerimaan Servis */}
                <div className="lg:col-span-5">
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card sticky top-24 overflow-hidden">
                        <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container rounded-t-2xl">
                            <h1 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary text-[20px] icon-filled">build_circle</span>
                                Form Penerimaan Servis
                            </h1>
                        </div>
                        <form onSubmit={handleCreateService} className="p-5 space-y-3 font-sans">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        Nama Pelanggan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        No. HP *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                    Merk &amp; Tipe HP *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Samsung Galaxy A54"
                                    value={device}
                                    onChange={e => setDevice(e.target.value)}
                                    className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        Jenis Servis *
                                    </label>
                                    <select
                                        required
                                        value={serviceType}
                                        onChange={e => setServiceType(e.target.value)}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    >
                                        <option value="">-- Pilih --</option>
                                        {['Ganti LCD','Ganti Baterai','Perbaikan Software','Flashing','Service Charging','Ganti Kamera','Service Speaker','Lainnya'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    >
                                        {['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                    Keluhan / Deskripsi
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Deskripsikan masalah..."
                                    value={issue}
                                    onChange={e => setIssue(e.target.value)}
                                    className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        Est. Biaya (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={price}
                                        onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        DP / Muka (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={deposit}
                                        onChange={e => setDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                                        Est. Selesai
                                    </label>
                                    <input
                                        type="date"
                                        value={estimatedDate}
                                        onChange={e => setEstimatedDate(e.target.value)}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(0,104,122,0.3)] active:scale-[0.98] cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Simpan Data Servis
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Service List */}
                <div className="lg:col-span-7">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h2 className="font-display font-bold text-lg text-on-surface">Daftar Servis Aktif</h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama, nota..."
                                    className="pl-9 pr-4 py-2 border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all w-48 font-mono"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            >
                                <option value="all">Semua Status</option>
                                {['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredServices.map(service => {
                            const remaining = Math.max(0, service.price - service.deposit);
                            return (
                                <div
                                    key={service.id}
                                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-card hover:border-secondary/30 transition-all p-5"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-md font-bold">
                                                    {service.nota_number}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(service.status)}`}>
                                                    {service.status}
                                                </span>
                                            </div>
                                            <p className="font-display font-bold text-sm text-on-surface">{service.customer_name}</p>
                                            <p className="text-xs text-on-surface-variant font-mono">{service.customer_phone}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-mono font-bold text-secondary text-sm">
                                                Rp {service.price.toLocaleString('id-ID')}
                                            </p>
                                            {service.deposit > 0 && (
                                                <>
                                                    <p className="text-xs text-green-700 font-medium">
                                                        DP: Rp {service.deposit.toLocaleString('id-ID')}
                                                    </p>
                                                    <p className="text-[11px] text-on-surface-variant font-mono">
                                                        Sisa: Rp {remaining.toLocaleString('id-ID')}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">smartphone</span>
                                            {service.device}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">build</span>
                                            {service.service_type}
                                        </span>
                                        {service.estimated_date && (
                                            <span className="flex items-center gap-1 font-mono">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                {service.estimated_date}
                                            </span>
                                        )}
                                    </div>

                                    {service.issue && (
                                        <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-xl p-2.5 mb-3 line-clamp-2 border border-outline-variant/15">
                                            {service.issue}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-outline-variant/10">
                                        {/* Quick Status Select */}
                                        <select
                                            value={service.status}
                                            onChange={e => handleUpdateStatus(service.id, e.target.value)}
                                            className="flex-1 min-w-0 border border-outline-variant/30 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-secondary transition-all"
                                        >
                                            {['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>

                                        {/* Edit Details Button */}
                                        <button
                                            type="button"
                                            onClick={() => setEditingService(service)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                                            title="Edit Rincian Biaya & Teknisi"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                                        </button>

                                        {/* Pelunasan Button */}
                                        {remaining > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setPayingService(service)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-sm cursor-pointer"
                                                title="Proses Pelunasan & Penyerahan HP"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">payments</span> Pelunasan
                                            </button>
                                        )}

                                        {/* Print Nota */}
                                        <Link
                                            href={`/servis/${service.id}/nota`}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-surface-container border border-outline-variant/30 rounded-xl text-xs text-on-surface-variant hover:border-secondary/50 hover:text-secondary transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">print</span> Nota
                                        </Link>

                                        {/* Antar Kurir */}
                                        <Link
                                            href="/pengantaran"
                                            className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-700 hover:bg-sky-100 transition-all font-semibold"
                                            title="Kirim HP via Kurir GPS"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">two_wheeler</span> Antar Kurir
                                        </Link>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(service.id)}
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                                            title="Hapus"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredServices.length === 0 && (
                            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-16 text-center text-on-surface-variant shadow-card">
                                <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">build_circle</span>
                                <p className="font-display font-semibold">Belum ada data servis</p>
                                <p className="text-sm mt-1">Isi form di sebelah kiri untuk menambah servis baru</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL EDIT SERVIS */}
            {editingService && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                            <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">edit_note</span>
                                Edit Detail Servis <span className="font-mono text-secondary text-sm">{editingService.nota_number}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingService(null)}
                                className="text-on-surface-variant hover:text-primary cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3 font-sans">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        Nama Pelanggan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService.customer_name}
                                        onChange={e => setEditingService({ ...editingService, customer_name: e.target.value })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        No. HP *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService.customer_phone}
                                        onChange={e => setEditingService({ ...editingService, customer_phone: e.target.value })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        Merk &amp; Tipe Device *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService.device}
                                        onChange={e => setEditingService({ ...editingService, device: e.target.value })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        Jenis Servis *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService.service_type}
                                        onChange={e => setEditingService({ ...editingService, service_type: e.target.value })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        Estimasi Biaya (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={editingService.price}
                                        onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        DP (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingService.deposit}
                                        onChange={e => setEditingService({ ...editingService, deposit: Number(e.target.value) })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={editingService.status}
                                        onChange={e => setEditingService({ ...editingService, status: e.target.value })}
                                        className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm"
                                    >
                                        {['Diterima','Dalam Proses','Menunggu Sparepart','Selesai','Diambil'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                                    Catatan Masalah
                                </label>
                                <textarea
                                    rows={2}
                                    value={editingService.issue || ''}
                                    onChange={e => setEditingService({ ...editingService, issue: e.target.value })}
                                    className="w-full border border-outline-variant/30 rounded-xl px-3 py-2 text-sm resize-none"
                                ></textarea>
                            </div>
                            <div className="pt-3 border-t border-outline-variant/20 flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditingService(null)}
                                    className="px-4 py-2 border border-outline-variant/30 rounded-xl text-xs font-mono cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold hover:bg-secondary/90 cursor-pointer"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL PELUNASAN */}
            {payingService && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
                        <span className="material-symbols-outlined text-5xl text-green-600">payments</span>
                        <div>
                            <h3 className="font-display font-bold text-lg text-primary">Konfirmasi Pelunasan Servis</h3>
                            <p className="text-xs font-mono text-secondary mt-0.5">{payingService.nota_number}</p>
                            <p className="text-xs text-on-surface-variant mt-2">
                                {payingService.customer_name} — {payingService.device}
                            </p>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 font-mono text-xs space-y-1.5">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Total Biaya:</span>
                                <strong>Rp {payingService.price.toLocaleString('id-ID')}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">DP Terbayar:</span>
                                <span className="text-green-700">Rp {payingService.deposit.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between pt-1.5 border-t border-outline-variant/20 text-sm font-bold">
                                <span>Sisa Tagihan:</span>
                                <span className="text-secondary font-extrabold">
                                    Rp {(payingService.price - payingService.deposit).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setPayingService(null)}
                                className="w-1/2 py-2.5 border border-outline-variant/30 rounded-xl text-xs font-mono cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmPelunasan}
                                className="w-1/2 py-2.5 bg-green-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-green-700 cursor-pointer shadow-md"
                            >
                                Lunas &amp; Ambil HP
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
