'use client';

import { useState, useEffect, useRef } from 'react';
import { DataService } from '@/lib/store';
import { DeliveryOrder } from '@/types/database';

export default function CourierTaskPage() {
    const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrder | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [gpsText, setGpsText] = useState('GPS Belum Aktif. Klik "Mulai Pengantaran" untuk melacak.');
    const [pinModalOpen, setPinModalOpen] = useState(false);
    const [inputPin, setInputPin] = useState('');
    const [pinError, setPinError] = useState('');

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        const data = await DataService.getDeliveries();
        setDeliveries(data);
        if (data.length > 0 && !selectedDelivery) {
            setSelectedDelivery(data[0]);
        }
    };

    useEffect(() => {
        if (!selectedDelivery || typeof window === 'undefined' || !mapContainerRef.current) return;

        import('leaflet').then(L => {
            if (!mapContainerRef.current) return;

            const dLat = selectedDelivery.customer_lat || -7.588800;
            const dLng = selectedDelivery.customer_lng || 110.748300;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            const map = L.map(mapContainerRef.current).setView([dLat, dLng], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            const redIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#dc2626;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);'><span class='material-symbols-outlined' style='font-size:20px;'>home</span></div>",
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });

            L.marker([dLat, dLng], { icon: redIcon })
                .addTo(map)
                .bindPopup(`<b>Tujuan: ${selectedDelivery.customer_name}</b><br><small>${selectedDelivery.customer_address}</small>`)
                .openPopup();

            mapInstanceRef.current = map;
        });
    }, [selectedDelivery]);

    const startTracking = () => {
        if (!selectedDelivery) return;

        if (navigator.geolocation) {
            setIsTracking(true);
            setGpsText('📡 GPS Aktif. Mengirimkan koordinat posisi kurir secara realtime...');

            DataService.updateDelivery(selectedDelivery.id, { status: 'diantar' });

            watchIdRef.current = navigator.geolocation.watchPosition(
                pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    DataService.updateDeliveryLocation(selectedDelivery.tracking_code, lat, lng);
                },
                () => {
                    setGpsText('⚠️ Gagal membaca koordinat GPS perangkat kurir.');
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        } else {
            alert('Browser perangkat tidak mendukung Geolocation GPS.');
        }
    };

    const handleVerifyPin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDelivery) return;

        if (inputPin.trim() === selectedDelivery.delivery_pin.trim()) {
            await DataService.updateDelivery(selectedDelivery.id, { status: 'selesai' });
            setPinModalOpen(false);
            setInputPin('');
            setPinError('');

            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            setIsTracking(false);

            alert('Selamat! PIN Valid. Pengantaran berhasil diselesaikan.');
            await loadDeliveries();
        } else {
            setPinError('Kode PIN salah! Minta 4 digit PIN yang tampil pada layar HP pelanggan.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between font-sans">
            {/* Header */}
            <header className="bg-primary-container text-white p-4 sticky top-0 z-40 shadow-md">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-2xl">two_wheeler</span>
                        <div>
                            <h1 className="font-display font-extrabold text-base leading-tight">Layar Pengantaran Kurir</h1>
                            <p className="font-mono text-[11px] text-gray-300">
                                Ref: {selectedDelivery?.tracking_code || '--'}
                            </p>
                        </div>
                    </div>
                    <select
                        value={selectedDelivery?.id || ''}
                        onChange={e => {
                            const found = deliveries.find(d => d.id === Number(e.target.value));
                            if (found) setSelectedDelivery(found);
                        }}
                        className="text-xs font-mono bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/20 text-white outline-none"
                    >
                        {deliveries.map(d => (
                            <option key={d.id} value={d.id} className="text-gray-900">
                                #{d.tracking_code} ({d.customer_name})
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Main Container */}
            {selectedDelivery && (
                <main className="max-w-md mx-auto p-4 w-full flex-grow space-y-4">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-500 uppercase">Status Pengantaran</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                                selectedDelivery.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                selectedDelivery.status === 'diantar' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {selectedDelivery.status.toUpperCase()}
                            </span>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-xl space-y-1.5 text-xs font-mono border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Penerima:</span>
                                <strong className="text-gray-900">{selectedDelivery.customer_name}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">No. HP WA:</span>
                                <a
                                    href={`https://wa.me/${selectedDelivery.customer_phone.replace(/^0/, '62')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-secondary font-bold hover:underline"
                                >
                                    {selectedDelivery.customer_phone} 📱
                                </a>
                            </div>
                            <div className="pt-1 border-t border-gray-200">
                                <span className="text-gray-500 block mb-0.5">Alamat Tujuan:</span>
                                <p className="text-gray-900 font-sans font-medium text-xs leading-relaxed">
                                    {selectedDelivery.customer_address}
                                </p>
                            </div>
                        </div>

                        {/* Signal & GPS Status Indicator */}
                        <div className={`flex items-center gap-2 p-3 border rounded-xl text-xs font-mono ${
                            isTracking ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}>
                            <span className={`material-symbols-outlined text-lg ${isTracking ? 'animate-spin' : ''}`}>
                                {isTracking ? 'sync' : 'location_off'}
                            </span>
                            <span>{gpsText}</span>
                        </div>

                        {/* Actions */}
                        {selectedDelivery.status !== 'selesai' ? (
                            <div className="space-y-2 pt-2">
                                {/* Navigasi Google Maps */}
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDelivery.customer_lat || -7.588800},${selectedDelivery.customer_lng || 110.748300}&travelmode=driving`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition-all"
                                >
                                    <span className="material-symbols-outlined text-xl">near_me</span>
                                    🗺️ NAVIGASI RUTE (GOOGLE MAPS)
                                </a>

                                <button
                                    type="button"
                                    onClick={startTracking}
                                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-mono font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-xl">navigation</span>
                                    🚀 MULAI PENGANTARAN (AKTIFKAN GPS)
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPinModalOpen(true)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-mono font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-xl">verified</span>
                                    ✅ INPUT PIN &amp; SELESAIKAN
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-mono text-xs space-y-1">
                                <span className="material-symbols-outlined text-3xl text-green-600">check_circle</span>
                                <p className="font-bold">PENGANTARAN TELAH SELESAI</p>
                                <p className="text-[11px] text-gray-500">
                                    HP / Barang resmi diserahkan ke {selectedDelivery.customer_name}.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Preview Map */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-2">
                        <h3 className="font-mono text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-secondary">map</span> Preview Peta Lokasi
                        </h3>
                        <div ref={mapContainerRef} className="h-[240px] w-full rounded-xl border border-gray-200 z-10"></div>
                    </div>
                </main>
            )}

            {/* Modal Input PIN */}
            {pinModalOpen && selectedDelivery && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xs w-full p-6 space-y-4 shadow-2xl text-center">
                        <span className="material-symbols-outlined text-4xl text-green-600">phonelink_lock</span>
                        <div>
                            <h3 className="font-display font-bold text-lg text-gray-900">Verifikasi PIN Pelanggan</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Minta 4 digit Kode PIN yang tampil pada HP {selectedDelivery.customer_name}.
                            </p>
                        </div>

                        <form onSubmit={handleVerifyPin} className="space-y-4">
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="0 0 0 0"
                                required
                                value={inputPin}
                                onChange={e => setInputPin(e.target.value)}
                                className="w-full text-center text-3xl font-mono tracking-[0.5em] font-bold border-2 border-gray-300 rounded-xl py-3 focus:border-green-600 focus:outline-none"
                            />

                            {pinError && (
                                <div className="text-xs text-red-600 font-mono font-semibold">
                                    {pinError}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPinModalOpen(false)}
                                    className="w-1/2 bg-gray-200 text-gray-800 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-green-600 text-white py-2.5 rounded-xl text-xs font-mono font-bold hover:bg-green-700 cursor-pointer shadow-md"
                                >
                                    Verifikasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
