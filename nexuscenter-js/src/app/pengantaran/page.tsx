'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { DeliveryOrder, Sale, ServiceOrder } from '@/types/database';

export default function DeliveryManagementPage() {
    const router = useRouter();
    const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
    const [readySales, setReadySales] = useState<Sale[]>([]);
    const [readyServices, setReadyServices] = useState<ServiceOrder[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');

    // Form state
    const [selectedSource, setSelectedSource] = useState('');
    const [courierName, setCourierName] = useState('Mas Budi Kurir');
    const [courierPhone, setCourierPhone] = useState('081234567890');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');

    // Edit modal state
    const [editingDelivery, setEditingDelivery] = useState<DeliveryOrder | null>(null);

    useEffect(() => {
        if (!DataService.isLoggedIn()) {
            router.push('/login?redirect=/pengantaran');
            return;
        }
        const r = DataService.getCurrentRole();
        if (r === 'pengguna') {
            router.push('/lacak-driver');
            return;
        }
        loadData();
    }, [router]);

    const loadData = async () => {
        const [delivData, salesData, srvData] = await Promise.all([
            DataService.getDeliveries(),
            DataService.getSales(),
            DataService.getServices()
        ]);
        setDeliveries(delivData);
        setReadySales(salesData);
        setReadyServices(srvData.filter(s => s.status === 'Selesai'));
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedSource(val);
        if (!val) return;

        if (val.startsWith('sale_')) {
            const saleId = Number(val.replace('sale_', ''));
            const sale = readySales.find(s => s.id === saleId);
            if (sale) {
                setCustomerName(sale.customer_name || '');
                setCustomerPhone(sale.customer_phone || '');
                setCustomerAddress(sale.customer_address || '');
            }
        } else if (val.startsWith('srv_')) {
            const srvId = Number(val.replace('srv_', ''));
            const srv = readyServices.find(s => s.id === srvId);
            if (srv) {
                setCustomerName(srv.customer_name || '');
                setCustomerPhone(srv.customer_phone || '');
                setCustomerAddress('Alamat dihubungi via WA: ' + srv.customer_phone);
            }
        }
    };

    const handleCreateDelivery = async (e: React.FormEvent) => {
        e.preventDefault();
        const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
        const pin = String(Math.floor(1000 + Math.random() * 9000));

        let saleId: number | undefined;
        let srvId: number | undefined;

        if (selectedSource.startsWith('sale_')) {
            saleId = Number(selectedSource.replace('sale_', ''));
        } else if (selectedSource.startsWith('srv_')) {
            srvId = Number(selectedSource.replace('srv_', ''));
        }

        await DataService.createDelivery({
            tracking_code: trackingCode,
            delivery_pin: pin,
            sale_id: saleId,
            service_id: srvId,
            courier_name: courierName,
            courier_phone: courierPhone,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: customerAddress,
            courier_lat: -7.588800,
            courier_lng: 110.748300,
            customer_lat: -7.588800 + (Math.random() - 0.5) * 0.02,
            customer_lng: 110.748300 + (Math.random() - 0.5) * 0.02,
            status: 'pending'
        });

        // Reset form
        setSelectedSource('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('');

        await loadData();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus pengantaran ini?')) {
            await DataService.deleteDelivery(id);
            await loadData();
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDelivery) return;

        await DataService.updateDelivery(editingDelivery.id, {
            courier_name: editingDelivery.courier_name,
            courier_phone: editingDelivery.courier_phone,
            customer_name: editingDelivery.customer_name,
            customer_phone: editingDelivery.customer_phone,
            customer_address: editingDelivery.customer_address
        });

        setEditingDelivery(null);
        await loadData();
    };

    const filteredDeliveries = deliveries.filter(d => {
        if (statusFilter === 'all') return true;
        return d.status === statusFilter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'diantar': return 'bg-blue-100 text-blue-700 border border-blue-200 animate-pulse';
            case 'selesai': return 'bg-green-100 text-green-700 border border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 fade-in font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* KIRI: Form Buat Tugas Pengantaran */}
                <div className="lg:col-span-5">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card sticky top-24 overflow-hidden">
                        <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
                            <h1 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">two_wheeler</span>
                                Buat Tugas Pengantaran
                            </h1>
                        </div>

                        <form onSubmit={handleCreateDelivery} className="p-6 space-y-4 font-sans text-xs">
                            <div>
                                <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                    Pilih Nota Servis / Invoice Penjualan
                                </label>
                                <select
                                    value={selectedSource}
                                    onChange={handleSourceChange}
                                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary"
                                >
                                    <option value="">-- Pilih Nota Servis / Invoice Penjualan --</option>
                                    {readySales.length > 0 && (
                                        <optgroup label="🛒 Invoice Penjualan (Produk / Online)">
                                            {readySales.map(sale => (
                                                <option key={sale.id} value={`sale_${sale.id}`}>
                                                    #{sale.invoice_number} — {sale.customer_name || 'Pelanggan'} (Rp {sale.total.toLocaleString('id-ID')})
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                    {readyServices.length > 0 && (
                                        <optgroup label="🔧 Nota Servis (Perbaikan HP)">
                                            {readyServices.map(srv => (
                                                <option key={srv.id} value={`srv_${srv.id}`}>
                                                    #{srv.nota_number} — {srv.customer_name} ({srv.device})
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                            </div>

                            {/* Info Kurir */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        Nama Kurir *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={courierName}
                                        onChange={e => setCourierName(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        No. WA Kurir *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={courierPhone}
                                        onChange={e => setCourierPhone(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary"
                                    />
                                </div>
                            </div>

                            {/* Info Pelanggan */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        Nama Pelanggan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        No. WA Pelanggan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                    Alamat Lengkap Pengantaran *
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="Jl. Raya No. XX, Kelurahan, Kecamatan, Patokan..."
                                    value={customerAddress}
                                    onChange={e => setCustomerAddress(e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-secondary resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-secondary text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">send</span>
                                Buat Tugas &amp; Generate PIN
                            </button>
                        </form>
                    </div>
                </div>

                {/* KANAN: Daftar Pengantaran Aktif */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display font-bold text-lg text-primary">Daftar Pengantaran Realtime</h2>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-secondary"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="diantar">Sedang Diantar</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        {filteredDeliveries.map(del => {
                            const waCourierMsg = encodeURIComponent(
                                `Halo ${del.courier_name}, ada tugas pengantaran HP ke ${del.customer_name} (${del.customer_address}). Buka link ini untuk aktifkan GPS: ${window?.location?.origin || ''}/tugas-kurir`
                            );
                            return (
                                <div
                                    key={del.id}
                                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-card hover:border-secondary/40 transition-all space-y-3"
                                >
                                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg border border-secondary/20">
                                                #{del.tracking_code}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${getStatusBadge(del.status)}`}>
                                                {del.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] font-mono text-on-surface-variant">PIN Pelanggan:</span>
                                            <strong className="font-mono text-sm text-secondary font-bold block">{del.delivery_pin}</strong>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-on-surface-variant text-[11px] font-mono">Penerima / Alamat:</span>
                                            <p className="font-bold text-primary">{del.customer_name} ({del.customer_phone})</p>
                                            <p className="text-on-surface-variant text-[11px] line-clamp-2 mt-0.5">{del.customer_address}</p>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant text-[11px] font-mono">Kurir Penanggung Jawab:</span>
                                            <p className="font-bold text-primary">
                                                {del.courier_name} (<span className="font-mono text-secondary">{del.courier_phone}</span>)
                                            </p>
                                            {del.sale_id && (
                                                <p className="text-secondary font-mono text-[11px] mt-0.5">Ref Invoice: #{del.sale_id}</p>
                                            )}
                                            {del.service_id && (
                                                <p className="text-secondary font-mono text-[11px] mt-0.5">Ref Servis: #{del.service_id}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20 flex-wrap">
                                        {/* WA Kurir Link */}
                                        <a
                                            href={`https://wa.me/${(del.courier_phone || '').replace(/^0/, '62')}?text=${waCourierMsg}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-green-600 hover:bg-green-700 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">send</span> WA Kurir
                                        </a>

                                        {/* Edit Kurir */}
                                        <button
                                            type="button"
                                            onClick={() => setEditingDelivery(del)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span> Edit Kurir
                                        </button>

                                        {/* Layar Kurir Link */}
                                        <Link
                                            href="/tugas-kurir"
                                            className="bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary border border-outline-variant/30 font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">smartphone</span> HP Kurir
                                        </Link>

                                        {/* Peta Pelanggan Link */}
                                        <Link
                                            href={`/pengantaran/lacak/${del.tracking_code}`}
                                            className="bg-surface-container hover:bg-secondary/10 text-on-surface hover:text-secondary border border-outline-variant/30 font-mono text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">map</span> Peta Pelanggan
                                        </Link>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(del.id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1.5 rounded-lg text-xs flex items-center justify-center cursor-pointer"
                                            title="Hapus"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredDeliveries.length === 0 && (
                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-12 text-center text-on-surface-variant font-mono text-xs shadow-card">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30 mb-2">two_wheeler</span>
                                <p>Belum ada pengantaran kurir aktif.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL EDIT PENGANTARAN */}
            {editingDelivery && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                            <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">edit</span>
                                Edit Data Kurir / Pengantaran
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingDelivery(null)}
                                className="text-on-surface-variant hover:text-primary cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4 font-sans text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        Nama Kurir *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingDelivery.courier_name}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, courier_name: e.target.value })}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        No. WA Kurir *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingDelivery.courier_phone || ''}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, courier_phone: e.target.value })}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        Nama Pelanggan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingDelivery.customer_name}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, customer_name: e.target.value })}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                        No. WA Pelanggan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingDelivery.customer_phone}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, customer_phone: e.target.value })}
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-secondary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-mono font-bold uppercase text-on-surface-variant mb-1">
                                    Alamat Pengantaran *
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={editingDelivery.customer_address}
                                    onChange={e => setEditingDelivery({ ...editingDelivery, customer_address: e.target.value })}
                                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-secondary resize-none"
                                ></textarea>
                            </div>
                            <div className="pt-2 border-t border-outline-variant/20 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingDelivery(null)}
                                    className="px-4 py-2 border border-outline-variant/30 rounded-xl text-xs font-mono cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold hover:bg-secondary/90 cursor-pointer"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
