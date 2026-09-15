'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/store';
import { TRADE_IN_DB, scoreMatch, TradeInEntry, TradeInVariant } from '@/lib/tradeInDb';

function TradeInBookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get pre-filled data from URL params (dari kalkulator di home)
    const prefilledDevice = searchParams.get('device') || '';
    const prefilledMinPrice = searchParams.get('min') || '';
    const prefilledMaxPrice = searchParams.get('max') || '';
    const prefilledStorage = searchParams.get('storage') || '';
    
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [oldDeviceBrand, setOldDeviceBrand] = useState('');
    const [oldDeviceModel, setOldDeviceModel] = useState('');
    const [oldDeviceStorage, setOldDeviceStorage] = useState(prefilledStorage);
    const [oldDeviceCondition, setOldDeviceCondition] = useState<'Sangat Baik' | 'Baik' | 'Cukup' | 'Rusak'>('Baik');
    const [estimatedPriceMin, setEstimatedPriceMin] = useState(prefilledMinPrice);
    const [estimatedPriceMax, setEstimatedPriceMax] = useState(prefilledMaxPrice);
    const [newDeviceDesired, setNewDeviceDesired] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-search functionality
    const [deviceSearchQuery, setDeviceSearchQuery] = useState(prefilledDevice);
    const [searchResults, setSearchResults] = useState<TradeInEntry[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        // Pre-fill from profile if logged in
        const user = DataService.getCurrentUser();
        if (user) {
            setCustomerName(user.name || '');
            setCustomerPhone(user.phone || '');
        }

        // Parse prefilled device to extract brand and model
        if (prefilledDevice) {
            const match = TRADE_IN_DB.find(entry => 
                entry.keywords.some(kw => kw.toLowerCase() === prefilledDevice.toLowerCase())
            );
            if (match) {
                setOldDeviceBrand(match.brand);
                setOldDeviceModel(match.name);
            }
        }
    }, [prefilledDevice]);

    const handleDeviceSearch = (query: string) => {
        setDeviceSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const results: TradeInEntry[] = [];
        for (const entry of TRADE_IN_DB) {
            const score = scoreMatch(query, entry);
            if (score > 0.3) {
                results.push(entry);
            }
        }
        setSearchResults(results.slice(0, 10));
        setShowSearchResults(results.length > 0);
    };

    const selectDevice = (entry: TradeInEntry, variant?: TradeInVariant) => {
        setOldDeviceBrand(entry.brand);
        setOldDeviceModel(entry.name);
        setDeviceSearchQuery(entry.name);
        
        if (variant) {
            setOldDeviceStorage(variant.storage);
            setEstimatedPriceMin(String(variant.min));
            setEstimatedPriceMax(String(variant.max));
        } else if (entry.variants.length > 0) {
            const firstVariant = entry.variants[0];
            setOldDeviceStorage(firstVariant.storage);
            setEstimatedPriceMin(String(firstVariant.min));
            setEstimatedPriceMax(String(firstVariant.max));
        }
        
        setShowSearchResults(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!DataService.isLoggedIn()) {
            alert('⚠️ Silakan login terlebih dahulu untuk booking tukar tambah!');
            router.push('/login?redirect=/tukar-tambah');
            return;
        }

        setIsSubmitting(true);

        try {
            const newTradeIn = await DataService.createTradeIn({
                customer_name: customerName,
                customer_phone: customerPhone,
                old_device_brand: oldDeviceBrand,
                old_device_model: oldDeviceModel,
                old_device_storage: oldDeviceStorage,
                old_device_condition: oldDeviceCondition,
                estimated_price_min: parseInt(estimatedPriceMin) || 0,
                estimated_price_max: parseInt(estimatedPriceMax) || 0,
                new_device_desired: newDeviceDesired,
                appointment_date: appointmentDate,
                notes: notes
            });

            // Redirect to confirmation/receipt page
            router.push(`/tukar-tambah/${newTradeIn.id}/konfirmasi`);
        } catch (error) {
            console.error('Trade-in booking error:', error);
            alert('Gagal memproses booking tukar tambah. Silakan coba kembali.');
            setIsSubmitting(false);
        }
    };

    const formatRp = (num: number) => {
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="fade-in max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 font-sans">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-white/10 rounded-2xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4cd7f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="max-w-2xl relative z-10">
                    <span className="inline-block px-3.5 py-1 bg-secondary/30 text-cyan-300 font-mono text-xs font-bold rounded-full mb-3 border border-secondary/40">
                        🔄 Program Tukar Tambah Resmi
                    </span>
                    <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-3 tracking-tight">
                        Booking Tukar Tambah HP Lama Anda
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                        Dapatkan harga taksir terbaik untuk HP lama Anda dan upgrade ke smartphone impian dengan selisih harga paling fair. 
                        Tim penaksir profesional kami siap memberikan penilaian transparan dan instant di toko.
                    </p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white border border-outline-variant/30 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-on-surface">Harga Terbaik</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Taksir transparan sesuai kondisi pasar</p>
                    </div>
                </div>
                <div className="bg-white border border-outline-variant/30 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">speed</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-on-surface">Proses Kilat 15 Menit</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Cek fisik & deal langsung di toko</p>
                    </div>
                </div>
                <div className="bg-white border border-outline-variant/30 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">security</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-on-surface">Aman & Terpercaya</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Data pribadi dijamin kerahasiaannya</p>
                    </div>
                </div>
            </div>

            {/* Booking Form Container */}
            <div className="max-w-4xl mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 shadow-card">
                <h2 className="font-display font-bold text-xl text-on-surface mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">autorenew</span>
                    Formulir Booking Tukar Tambah
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            Informasi Pelanggan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Nama Lengkap *
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
                                    Nomor WhatsApp *
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
                    </div>

                    {/* Old Device Info */}
                    <div>
                        <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">smartphone</span>
                            HP Lama yang Akan Ditukar
                        </h3>
                        
                        {/* Device Search with Autocomplete */}
                        <div className="mb-4 relative">
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Cari HP Lama Anda *
                            </label>
                            <input
                                type="text"
                                value={deviceSearchQuery}
                                onChange={e => handleDeviceSearch(e.target.value)}
                                onFocus={() => deviceSearchQuery.length >= 2 && setShowSearchResults(true)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                placeholder="Ketik merk dan tipe HP... (contoh: iPhone 13, Samsung S22)"
                            />
                            
                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-outline-variant/30 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                                    {searchResults.map((entry, idx) => (
                                        <div key={idx} className="border-b border-outline-variant/10 last:border-0">
                                            <div 
                                                className="px-4 py-3 hover:bg-secondary/5 cursor-pointer transition-colors"
                                                onClick={() => selectDevice(entry)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold text-sm text-on-surface">{entry.name}</p>
                                                        <p className="text-xs text-on-surface-variant font-mono">{entry.brand}</p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-secondary text-[16px]">chevron_right</span>
                                                </div>
                                                {/* Variants */}
                                                {entry.variants.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {entry.variants.map((variant, vIdx) => (
                                                            <button
                                                                key={vIdx}
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); selectDevice(entry, variant); }}
                                                                className="text-[10px] font-mono bg-secondary/10 text-secondary px-2 py-1 rounded-md hover:bg-secondary hover:text-white transition-colors"
                                                            >
                                                                {variant.storage}: {formatRp(variant.min)} - {formatRp(variant.max)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Merk/Brand *
                                </label>
                                <input
                                    type="text"
                                    value={oldDeviceBrand}
                                    onChange={e => setOldDeviceBrand(e.target.value)}
                                    required
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    placeholder="Contoh: Apple, Samsung"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Model/Tipe *
                                </label>
                                <input
                                    type="text"
                                    value={oldDeviceModel}
                                    onChange={e => setOldDeviceModel(e.target.value)}
                                    required
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                    placeholder="Contoh: iPhone 13"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Kapasitas Storage
                                </label>
                                <input
                                    type="text"
                                    value={oldDeviceStorage}
                                    onChange={e => setOldDeviceStorage(e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                    placeholder="Contoh: 128GB"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                Kondisi HP Lama *
                            </label>
                            <select
                                value={oldDeviceCondition}
                                onChange={e => setOldDeviceCondition(e.target.value as any)}
                                required
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            >
                                <option value="Sangat Baik">Sangat Baik (Fullset, Mulus, No Minus)</option>
                                <option value="Baik">Baik (Berfungsi Normal, Lecet Wajar)</option>
                                <option value="Cukup">Cukup (Ada Goresan, Shadow LCD)</option>
                                <option value="Rusak">Rusak (Bootloop, LCD Pecah, dll)</option>
                            </select>
                            <p className="text-xs text-on-surface-variant mt-1 ml-1">
                                *Kondisi akan diverifikasi saat pengecekan fisik di toko
                            </p>
                        </div>
                    </div>

                    {/* Estimated Price Range */}
                    {estimatedPriceMin && estimatedPriceMax && (
                        <div className="bg-gradient-to-r from-secondary/10 to-cyan-500/10 border border-secondary/30 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">calculate</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-on-surface">Estimasi Harga Tukar Tambah</h3>
                                    <p className="text-xs text-on-surface-variant">Berdasarkan data pasar terkini</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono font-extrabold text-2xl text-secondary">
                                    {formatRp(parseInt(estimatedPriceMin))}
                                </span>
                                <span className="text-on-surface-variant">—</span>
                                <span className="font-mono font-extrabold text-2xl text-secondary">
                                    {formatRp(parseInt(estimatedPriceMax))}
                                </span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-2">
                                *Harga final akan ditentukan setelah pengecekan fisik lengkap di toko TECHCELL NexusCenter
                            </p>
                        </div>
                    )}

                    {/* New Device Desired (Optional) */}
                    <div>
                        <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">upgrade</span>
                            HP Baru yang Diinginkan (Opsional)
                        </h3>
                        <input
                            type="text"
                            value={newDeviceDesired}
                            onChange={e => setNewDeviceDesired(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Contoh: iPhone 15 Pro 256GB, Samsung S24 Ultra"
                        />
                        <p className="text-xs text-on-surface-variant mt-1 ml-1">
                            Kosongkan jika belum tahu atau ingin konsultasi langsung di toko
                        </p>
                    </div>

                    {/* Appointment Date */}
                    <div>
                        <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                            Jadwal Kunjungan ke Toko (Opsional)
                        </h3>
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={e => setAppointmentDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                        />
                        <p className="text-xs text-on-surface-variant mt-1 ml-1">
                            Tentukan jadwal kunjungan atau langsung datang tanpa appointment (walk-in)
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                            Catatan Tambahan (Opsional)
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Misalnya: kondisi khusus HP, aksesori yang ikut ditukar, dll..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                        <Link href="/" className="text-xs font-mono text-on-surface-variant hover:text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Kembali ke Beranda
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-secondary text-white font-mono text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            {isSubmitting ? 'Mengirim...' : 'Kirim Booking Tukar Tambah'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Info */}
            <div className="mt-10 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 text-[24px]">info</span>
                        <div className="text-xs text-amber-900">
                            <p className="font-bold mb-1">Informasi Penting:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                                <li>Silakan bawa HP lama beserta charger dan dus (jika ada) saat datang ke toko</li>
                                <li>Backup data pribadi Anda terlebih dahulu sebelum tukar tambah</li>
                                <li>Reset Factory untuk menghapus akun Google/iCloud sebelum diserahkan</li>
                                <li>Proses taksir & deal rata-rata 15-30 menit</li>
                                <li>Harga final dapat berbeda dari estimasi tergantung kondisi fisik aktual</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TradeInBookingPage() {
    return (
        <Suspense fallback={<div className="max-w-[1440px] mx-auto px-4 py-24 text-center font-mono text-sm text-on-surface-variant">Memuat halaman tukar tambah...</div>}>
            <TradeInBookingContent />
        </Suspense>
    );
}
