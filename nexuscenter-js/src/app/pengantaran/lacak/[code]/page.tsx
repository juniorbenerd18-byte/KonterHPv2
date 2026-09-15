'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DataService } from '@/lib/store';
import { DeliveryOrder } from '@/types/database';
import { STORE_LAT, STORE_LNG, haversineKm } from '@/lib/geo';

export default function DeliveryTrackPage() {
    const params = useParams();
    const code = params.code as string;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [delivery, setDelivery] = useState<DeliveryOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const courierMarkerRef = useRef<any>(null);
    const routeLineRef = useRef<any>(null);

    useEffect(() => {
        setIsLoggedIn(DataService.isLoggedIn());
        loadDelivery();
        const interval = setInterval(loadDelivery, 4000);
        return () => clearInterval(interval);
    }, [code]);

    const loadDelivery = async () => {
        const deliveries = await DataService.getDeliveries();
        const found = deliveries.find(d => d.tracking_code === code || String(d.id) === code) || deliveries[0];
        setDelivery(found || null);
        setLoading(false);

        if (found && found.courier_lat && found.customer_lat) {
            const d = calcDistanceMeters(found.courier_lat!, found.courier_lng!, found.customer_lat!, found.customer_lng!);
            setDistanceMeters(Math.round(d));
            updateMap(found);
        }
    };

    const calcDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        return haversineKm(lat1, lon1, lat2, lon2) * 1000;
    };

    // Initialize & update Leaflet
    const updateMap = (del: DeliveryOrder) => {
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        import('leaflet').then(L => {
            if (!mapContainerRef.current) return;

            const cLat = del.courier_lat || STORE_LAT;
            const cLng = del.courier_lng || STORE_LNG;
            const dLat = del.customer_lat || STORE_LAT;
            const dLng = del.customer_lng || STORE_LNG;

            if (!mapInstanceRef.current) {
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });

                const map = L.map(mapContainerRef.current).setView([dLat, dLng], 14);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);

                // Customer House Icon
                const houseIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: "<div style='background-color:#00687a;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);'><span class='material-symbols-outlined' style='font-size:18px;'>home</span></div>",
                    iconSize: [34, 34],
                    iconAnchor: [17, 17]
                });

                L.marker([dLat, dLng], { icon: houseIcon })
                    .addTo(map)
                    .bindPopup(`<b>Rumah Anda: ${del.customer_name}</b><br><small>${del.customer_address}</small>`)
                    .openPopup();

                // Courier Icon
                const motorIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: "<div style='background-color:#16a34a;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.4);'><span class='material-symbols-outlined' style='font-size:22px;'>two_wheeler</span></div>",
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                });

                const courierMarker = L.marker([cLat, cLng], { icon: motorIcon })
                    .addTo(map)
                    .bindPopup(`<b>Kurir: ${del.courier_name}</b>`);

                const routeLine = L.polyline([[cLat, cLng], [dLat, dLng]], {
                    color: '#00687a',
                    weight: 5,
                    opacity: 0.85
                }).addTo(map);

                map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

                mapInstanceRef.current = map;
                courierMarkerRef.current = courierMarker;
                routeLineRef.current = routeLine;
            } else {
                if (courierMarkerRef.current) {
                    courierMarkerRef.current.setLatLng([cLat, cLng]);
                }
                if (routeLineRef.current) {
                    routeLineRef.current.setLatLngs([[cLat, cLng], [dLat, dLng]]);
                }
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'diantar': return 'bg-blue-100 text-blue-700 border border-blue-200 animate-pulse';
            case 'selesai': return 'bg-green-100 text-green-700 border border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto py-20 text-center font-mono text-sm text-on-surface-variant">
                Memuat data pelacakan kurir...
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white border border-outline-variant/30 rounded-3xl text-center space-y-4 shadow-card">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                    <span className="material-symbols-outlined text-[36px]">lock</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-on-surface">Login Diperlukan</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                    Silakan login ke akun TECHCELL Anda terlebih dahulu untuk mengecek dan melacak lokasi kurir secara live.
                </p>
                <div className="pt-2">
                    <Link
                        href={`/login?redirect=/pengantaran/lacak/${code}`}
                        className="inline-flex items-center gap-2 bg-primary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md"
                    >
                        <span className="material-symbols-outlined text-base">login</span>
                        <span>Masuk ke Akun Saya &rarr;</span>
                    </Link>
                </div>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-red-500">wrong_location</span>
                <h2 className="text-xl font-bold font-display text-on-surface">Data Pengantaran Tidak Ditemukan</h2>
                <p className="text-sm text-on-surface-variant">Periksa kembali kode pelacakan pengantaran Anda.</p>
                <Link href="/" className="inline-block bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-xs font-mono">
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    const distKm = distanceMeters !== null ? (distanceMeters / 1000).toFixed(1) : '--';

    return (
        <div className="fade-in max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 font-sans">
            {/* Header & Info */}
            <div className="max-w-3xl mx-auto bg-white border border-outline-variant/30 rounded-3xl p-6 md:p-8 text-center mb-8 space-y-2 shadow-card">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto border border-secondary/20 shadow-sm">
                    <span className="material-symbols-outlined text-3xl">two_wheeler</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface">
                    Live Tracking Kurir Pengantaran
                </h1>
                <p className="font-mono text-xs text-on-surface-variant">
                    Nomor Pelacakan: <strong className="text-secondary font-bold">#{delivery.tracking_code}</strong>
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* KIRI: Peta Live Leaflet */}
                <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-card space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                            Posisi Kurir Realtime
                        </div>
                        <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                            delivery.status === 'selesai'
                                ? 'text-green-700 bg-green-100 border-green-300'
                                : 'text-secondary bg-secondary/10 border-secondary/20'
                        }`}>
                            {delivery.status === 'selesai' ? 'PENGANTARAN SELESAI 🎉' : `Jarak Sisa: ${distanceMeters || '--'} m (${distKm} km)`}
                        </span>
                    </div>

                    {/* Leaflet Map Container */}
                    <div ref={mapContainerRef} className="w-full h-[400px] md:h-[450px] rounded-xl border border-outline-variant/30 shadow-inner z-10"></div>

                    <p className="text-[11px] font-mono text-on-surface-variant text-center opacity-70">
                        Peta diperbarui secara otomatis setiap 4 detik. Pastikan Kurir mengaktifkan lokasi HP.
                    </p>
                </div>

                {/* KANAN: Detail & PIN Khusus Pelanggan */}
                <div className="lg:col-span-4 space-y-6">
                    {/* PIN Card */}
                    <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 relative overflow-hidden text-center space-y-4">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-50 text-cyan-800 font-mono text-[11px] font-bold rounded-full border border-cyan-200 shadow-sm">
                            <span>🔐</span> KODE PIN VERIFIKASI ANDA
                        </div>
                        <h3 className="font-display font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                            Berikan Kode Ini Kepada Kurir Saat HP Tiba:
                        </h3>
                        <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-cyan-50 rounded-2xl py-4 border-2 border-dashed border-cyan-400/60 shadow-inner">
                            <span className="font-mono font-black text-4xl tracking-[0.4em] text-cyan-700 pl-3 drop-shadow-sm">
                                {delivery.delivery_pin}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            Jangan berikan PIN ini sebelum Anda menerima dan memeriksa HP/barang secara langsung.
                        </p>
                    </div>

                    {/* Detail Pengantaran Card */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card space-y-4 font-sans text-xs">
                        <h3 className="font-display font-bold text-base text-primary border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">info</span>
                            Detail Pengantaran
                        </h3>

                        <div className="space-y-3 font-mono">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Status:</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${getStatusBadge(delivery.status)}`}>
                                    {delivery.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Nama Kurir:</span>
                                <strong className="text-primary">{delivery.courier_name}</strong>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">No. WA Kurir:</span>
                                <a
                                    href={`https://wa.me/${(delivery.courier_phone || '').replace(/^0/, '62')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-secondary font-bold hover:underline"
                                >
                                    {delivery.courier_phone} 💬
                                </a>
                            </div>

                            <div className="pt-2 border-t border-outline-variant/20">
                                <span className="text-on-surface-variant block mb-1">Alamat Penerima:</span>
                                <p className="font-sans font-medium text-xs text-primary leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                                    {delivery.customer_address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
