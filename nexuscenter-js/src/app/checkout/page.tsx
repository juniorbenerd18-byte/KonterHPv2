'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { CartItem, getSelectedCheckoutItems, removeItemsFromCart } from '@/lib/cart';



export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
    const [customerAddress, setCustomerAddress] = useState('Jl. Raya Gawok No. 12, Sukoharjo');
    const [customerLat, setCustomerLat] = useState<number>(-7.588800);
    const [customerLng, setCustomerLng] = useState<number>(110.748300);
    const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Transfer' | 'Debit' | 'Tunai'>('QRIS');
    const [distanceKm, setDistanceKm] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const STORE_LAT = -7.588800;
    const STORE_LNG = 110.748300;

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        // Auth guard: must be logged in to checkout
        if (!DataService.isLoggedIn()) {
            router.replace('/login?redirect=/checkout');
            return;
        }
        setAuthChecked(true);

        const items = getSelectedCheckoutItems();
        setCart(items);

        // Pre-fill user info
        const user = DataService.getCurrentUser();
        if (user) {
            setCustomerName(user.name || '');
            setCustomerPhone(user.phone || '');
        }

        calcDistance(STORE_LAT, STORE_LNG, customerLat, customerLng);
    }, []);


    // Initialize Leaflet Map dynamically
    useEffect(() => {
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        let isMounted = true;

        import('leaflet').then(L => {
            if (!isMounted || !mapContainerRef.current) return;

            // If already initialized, return
            if (mapInstanceRef.current) return;

            // Fix leaflet icon default path issue
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const map = L.map(mapContainerRef.current).setView([customerLat, customerLng], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            const marker = L.marker([customerLat, customerLng], { draggable: true }).addTo(map);

            marker.on('dragend', function (e: any) {
                const position = e.target.getLatLng();
                updateCoords(position.lat, position.lng, false, true, L);
            });

            map.on('click', function (e: any) {
                marker.setLatLng(e.latlng);
                updateCoords(e.latlng.lat, e.latlng.lng, false, true, L);
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;
        });

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        setDistanceKm(dist);
        return dist;
    };

    const updateCoords = (lat: number, lng: number, moveMap = true, updateAddr = false, L?: any) => {
        setCustomerLat(lat);
        setCustomerLng(lng);
        calcDistance(STORE_LAT, STORE_LNG, lat, lng);

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        }
        if (moveMap && mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 15);
        }

        if (updateAddr) {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(r => r.json())
                .then(data => {
                    if (data && data.display_name) {
                        setCustomerAddress(data.display_name);
                    }
                })
                .catch(() => {});
        }
    };

    const detectGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    updateCoords(lat, lng, true, true);
                },
                () => {
                    alert('Gagal membaca lokasi GPS. Pastikan izin lokasi aktif pada browser Anda.');
                }
            );
        } else {
            alert('Browser Anda tidak mendukung deteksi GPS.');
        }
    };

    const handleAddressInput = (text: string) => {
        setCustomerAddress(text);
        // Match coordinates or Google Maps format
        const coordMatch = text.match(/@?(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/) || text.match(/q=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
        if (coordMatch) {
            const lat = parseFloat(coordMatch[1]);
            const lng = parseFloat(coordMatch[2]);
            updateCoords(lat, lng, true, false);
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Keranjang belanja Anda kosong!');
            return;
        }

        setIsSubmitting(true);

        try {
            const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
            const saleItems = cart.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.qty,
                price: item.price,
                subtotal: item.price * item.qty
            }));

            const sale = await DataService.createSale({
                invoice_number: invoiceNumber,
                cashier_name: 'Online Store',
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: deliveryType === 'delivery' ? customerAddress : 'Ambil di Konter (Pickup)',
                total: subtotal,
                payment_method: paymentMethod,
                amount_paid: subtotal,
                change_amount: 0,
                discount: 0,
                items: saleItems
            });

            // Create automatic delivery task if delivery was chosen
            if (deliveryType === 'delivery') {
                const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
                const pin = String(Math.floor(1000 + Math.random() * 9000));
                await DataService.createDelivery({
                    sale_id: sale.id,
                    tracking_code: trackingCode,
                    delivery_pin: pin,
                    courier_name: 'Mas Budi Kurir',
                    courier_phone: '081234567890',
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    customer_lat: customerLat,
                    customer_lng: customerLng,
                    courier_lat: STORE_LAT,
                    courier_lng: STORE_LNG,
                    status: 'pending'
                });
            }

            // Clear only checked out items
            removeItemsFromCart(cart.map(it => it.id));
            window.dispatchEvent(new Event('storage'));

            router.push(`/penjualan/${sale.id}/struk`);
        } catch (err) {
            alert('Gagal memproses checkout pesanan. Silakan coba kembali.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fade-in max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 font-sans">
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-3xl">payments</span>
                Checkout Pesanan
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Info Pembeli & Pembayaran */}
                <div className="lg:col-span-7">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-card">
                        <h3 className="font-display font-bold text-lg text-on-surface mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">person</span>
                            Informasi Pembeli &amp; Alamat Pengiriman
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Nomor Telepon / WhatsApp *
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

                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Metode Pengiriman *
                                </label>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                                        deliveryType === 'delivery'
                                            ? 'border-secondary bg-secondary/5 font-bold'
                                            : 'border-outline-variant/40 bg-surface-container-low'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="delivery_type"
                                            value="delivery"
                                            checked={deliveryType === 'delivery'}
                                            onChange={() => setDeliveryType('delivery')}
                                            className="text-secondary focus:ring-secondary accent-secondary"
                                        />
                                        <span className="font-mono text-xs text-on-surface flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
                                            Diantar ke Rumah
                                        </span>
                                    </label>
                                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                                        deliveryType === 'pickup'
                                            ? 'border-secondary bg-secondary/5 font-bold'
                                            : 'border-outline-variant/40 bg-surface-container-low'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="delivery_type"
                                            value="pickup"
                                            checked={deliveryType === 'pickup'}
                                            onChange={() => setDeliveryType('pickup')}
                                            className="text-secondary focus:ring-secondary accent-secondary"
                                        />
                                        <span className="font-mono text-xs text-on-surface flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
                                            Ambil di Konter
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {deliveryType === 'delivery' && (
                                <div id="address-field-wrap" className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase">
                                            Alamat Lengkap / Salinan Google Maps *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={detectGPS}
                                            className="text-xs font-mono text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">my_location</span> Deteksi GPS Saya
                                        </button>
                                    </div>
                                    <textarea
                                        rows={2}
                                        required
                                        value={customerAddress}
                                        onChange={e => handleAddressInput(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                        placeholder="Jl. Raya Gawok No. XX, Sukoharjo... (Bisa juga tempelkan link/teks dari Google Maps)"
                                    ></textarea>

                                    <p className="text-[11px] font-mono text-on-surface-variant/80">
                                        💡 Anda dapat mengetik alamat atau menempelkan (paste) salinan link/koordinat dari Google Maps.
                                    </p>

                                    {/* Leaflet Map Container */}
                                    <div className="border border-outline-variant/30 rounded-xl overflow-hidden shadow-inner">
                                        <div className="bg-surface-container-low px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                                            <span className="font-bold text-primary flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                                                Peta Pin Lokasi Rumah (Geser pin jika kurang pas)
                                            </span>
                                            <span className="text-[11px] text-secondary font-bold">
                                                {customerLat.toFixed(5)}, {customerLng.toFixed(5)}
                                            </span>
                                        </div>
                                        <div ref={mapContainerRef} className="w-full h-[220px] bg-surface-container z-10"></div>
                                    </div>

                                    {/* Distance Badge */}
                                    <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                                        distanceKm <= 4.0
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-amber-50 border border-amber-200 text-amber-800'
                                    }`}>
                                        <span className={`material-symbols-outlined text-[18px] ${
                                            distanceKm <= 4.0 ? 'text-green-600' : 'text-amber-600'
                                        }`}>
                                            {distanceKm <= 4.0 ? 'verified' : 'warning'}
                                        </span>
                                        <div>
                                            <strong>Jarak ke Konter Gawok: {distanceKm.toFixed(1)} km</strong> {distanceKm <= 4.0 ? (
                                                <span className="font-bold text-green-700">(≤ 4km) — GRATIS ONGKIR!</span>
                                            ) : (
                                                <span>(&gt; 4km) — Melebihi batas {(distanceKm - 4.0).toFixed(1)} km. Ongkir tambahan dihitung oleh kurir.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-mono font-bold text-on-surface-variant uppercase mb-2">
                                    Metode Pembayaran *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'QRIS', label: 'QRIS / E-Wallet' },
                                        { id: 'Transfer', label: 'Transfer Bank' },
                                        { id: 'Debit', label: 'Kartu Debit' },
                                        { id: 'Tunai', label: 'Bayar di Kasir / COD' }
                                    ].map(method => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                paymentMethod === method.id
                                                    ? 'border-secondary bg-secondary/5 font-bold'
                                                    : 'border-outline-variant/40 bg-surface-container-low'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id as any)}
                                                className="text-secondary focus:ring-secondary accent-secondary"
                                            />
                                            <span className="font-mono text-xs text-on-surface">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-outline-variant/20">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || cart.length === 0}
                                    className="w-full bg-secondary text-white font-mono text-sm font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Proses Pesanan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Ringkasan Produk Checkout */}
                <div className="lg:col-span-5">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card sticky top-28">
                        <h3 className="font-display font-bold text-lg text-on-surface mb-4 border-b border-outline-variant/20 pb-3">
                            Detail Pesanan
                        </h3>
                        <div className="divide-y divide-outline-variant/15 mb-6 max-h-80 overflow-y-auto pr-1">
                            {cart.map(item => (
                                <div key={item.id} className="py-3 flex items-center gap-3 text-sm">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/20 flex items-center justify-center">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl">{item.icon || '📱'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-on-surface truncate">{item.name}</p>
                                        <p className="text-xs font-mono text-on-surface-variant">
                                            {item.qty} x Rp {item.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <span className="font-mono font-bold text-on-surface shrink-0">
                                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 text-sm font-mono border-t border-outline-variant/20 pt-4">
                            <div className="flex justify-between text-on-surface-variant">
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-on-surface-variant">
                                <span>Ongkos Kirim</span>
                                <span className="text-green-700 font-bold">GRATIS</span>
                            </div>
                            <div className="flex justify-between font-bold text-base text-on-surface pt-2 border-t border-outline-variant/15">
                                <span>Total Pembayaran</span>
                                <span className="text-secondary text-lg">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
