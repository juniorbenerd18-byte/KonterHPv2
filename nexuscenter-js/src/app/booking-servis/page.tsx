'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';

export default function BookingServicePage() {
    const router = useRouter();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [device, setDevice] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [issue, setIssue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Auth guard: must be logged in to book a service
        if (!DataService.isLoggedIn()) {
            router.replace('/login?redirect=/booking-servis');
            return;
        }
        // Pre-fill from profile
        const user = DataService.getCurrentUser();
        if (user) {
            setCustomerName(user.name || '');
            setCustomerPhone(user.phone || '');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const notaNumber = `SRV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

            const estimatedCost = serviceType === 'Ganti LCD / Touchscreen' ? 450000 :
                                  serviceType === 'Ganti Baterai' ? 250000 :
                                  serviceType === 'Servis Port Charger' ? 150000 : 200000;

            const newService = await DataService.createService({
                nota_number: notaNumber,
                customer_name: customerName,
                customer_phone: customerPhone,
                device: device,
                service_type: serviceType,
                issue: issue,
                price: estimatedCost,
                deposit: 0,
                status: 'Diterima',
                estimated_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
            });

            router.push(`/servis/${newService.id}/nota`);
        } catch {
            alert('Gagal memproses booking servis. Silakan coba kembali.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fade-in max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 font-sans">
            {/* Header Banner */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-8 md:p-12 mb-10 shadow-card">
                <div className="max-w-2xl">
                    <span className="inline-block px-3.5 py-1 bg-secondary/10 text-secondary font-mono text-xs font-bold rounded-full mb-3 border border-secondary/20">
                        🔧 Booking Servis HP Online
                    </span>
                    <h1 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface mb-3 tracking-tight">
                        Servis HP Profesional &amp; Garansi Resmi
                    </h1>
                    <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                        Isi formulir pendaftaran servis HP di bawah ini. Teknisi bersertifikat kami siap memeriksa dan memperbaiki HP Anda dengan sparepart berkualitas.
                    </p>
                </div>
            </div>

            {/* Booking Form Container */}
            <div className="max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 shadow-card">
                <h2 className="font-display font-bold text-xl text-on-surface mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">assignment</span>
                    Formulir Booking Perbaikan
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Nama Lengkap Pelanggan *
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                required
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                placeholder="Contoh: Budi Santoso"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Nomor WhatsApp / HP *
                            </label>
                            <input
                                type="text"
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value)}
                                required
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                placeholder="Contoh: 081234567890"
                            />
                        </div>
                    </div>

                    {/* Device Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Tipe &amp; Merek Smartphone *
                            </label>
                            <input
                                type="text"
                                value={device}
                                onChange={e => setDevice(e.target.value)}
                                required
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                placeholder="Contoh: iPhone 13 / Samsung S22"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Jenis Kerusakan / Servis *
                            </label>
                            <select
                                value={serviceType}
                                onChange={e => setServiceType(e.target.value)}
                                required
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            >
                                <option value="">-- Pilih Jenis Kerusakan --</option>
                                <option value="Ganti LCD / Touchscreen">Ganti LCD / Touchscreen</option>
                                <option value="Ganti Baterai">Ganti Baterai Original</option>
                                <option value="Servis Port Charger">Servis Port Charger / Connector</option>
                                <option value="Mati Total / Flash IC">Mati Total / Flash IC / CPU</option>
                                <option value="Kena Air (Water Damage)">Kena Air (Water Damage)</option>
                                <option value="Kerusakan Kamera & Speaker">Kerusakan Kamera &amp; Speaker</option>
                                <option value="Lain-Lain">Kerusakan Lainnya</option>
                            </select>
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                            Deskripsi Keluhan / Gejala Kerusakan
                        </label>
                        <textarea
                            rows={3}
                            value={issue}
                            onChange={e => setIssue(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Jelaskan detail kendala pada HP Anda..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                        <Link href="/lacak-servis" className="text-xs font-mono text-on-surface-variant hover:text-secondary">
                            &larr; Lacak Servis Lainnya
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-secondary text-white font-mono text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            {isSubmitting ? 'Mengirim...' : 'Kirim Booking Servis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
