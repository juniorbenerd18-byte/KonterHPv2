'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@/lib/store';
import { CartItem, getSelectedCheckoutItems, removeItemsFromCart, getCheckoutPrefs } from '@/lib/cart';
import MapLocationPicker from '@/components/MapLocationPicker';
import { STORE_LAT, STORE_LNG, FREE_DELIVERY_KM, geocodeAddress, haversineKm, parseMapCoords } from '@/lib/geo';

interface SavedAddress {
    id: number;
    label: string;
    address: string;
    lat: number;
    lng: number;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerLat, setCustomerLat] = useState<number>(STORE_LAT);
    const [customerLng, setCustomerLng] = useState<number>(STORE_LNG);
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Transfer' | 'Debit' | 'Tunai'>('QRIS');
    const [distanceKm, setDistanceKm] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        // 1. Check preferences passed from Cart page
        const prefs = getCheckoutPrefs();
        let loadedAddr = '';
        let loadedLat = STORE_LAT;
        let loadedLng = STORE_LNG;
        let locationFound = false;

        if (prefs) {
            if (prefs.deliveryType) setDeliveryType(prefs.deliveryType);
            if (prefs.address && prefs.address.trim()) {
                loadedAddr = prefs.address.trim();
                locationFound = true;
            }
            if (typeof prefs.lat === 'number' && typeof prefs.lng === 'number') {
                loadedLat = prefs.lat;
                loadedLng = prefs.lng;
                locationFound = true;
            }
        }

        // 2. Check saved customer addresses
        try {
            const customerAddrs = DataService.getCustomerAddresses(user?.id);
            if (customerAddrs && customerAddrs.length > 0) {
                setSavedAddresses(customerAddrs);
                if (!locationFound) {
                    loadedAddr = customerAddrs[0].address;
                    loadedLat = customerAddrs[0].lat;
                    loadedLng = customerAddrs[0].lng;
                    locationFound = true;
                }
            }
        } catch {}

        // 3. Fallback to user account address
        if (!locationFound && user?.address && user.address.trim()) {
            loadedAddr = user.address.trim();
            if (typeof user.latitude === 'number' && typeof user.longitude === 'number') {
                loadedLat = user.latitude;
                loadedLng = user.longitude;
            }
            locationFound = true;
        }

        if (locationFound) {
            setCustomerAddress(loadedAddr);
            setCustomerLat(loadedLat);
            setCustomerLng(loadedLng);
            setIsCustomLocation(true);
            const dist = haversineKm(STORE_LAT, STORE_LNG, loadedLat, loadedLng);
            setDistanceKm(dist);
        } else {
            // New user without address: leave empty with placeholder so user knows to input
            setCustomerAddress('');
            setCustomerLat(STORE_LAT);
            setCustomerLng(STORE_LNG);
            setIsCustomLocation(false);
            setDistanceKm(0);
        }
    }, [router]);

    const updateCoords = (lat: number, lng: number, updateAddr = false) => {
        setCustomerLat(lat);
        setCustomerLng(lng);
        const dist = haversineKm(STORE_LAT, STORE_LNG, lat, lng);
        setDistanceKm(dist);
        setIsCustomLocation(true);

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
                    updateCoords(lat, lng, true);
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

        // Check if input contains Google Maps coordinates or URL
        const parsed = parseMapCoords(text);
        if (parsed) {
            updateCoords(parsed.lat, parsed.lng, false);
            return;
        }

        // Debounce search via Nominatim
        if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
        if (text.trim().length >= 4) {
            setIsGeocoding(true);
            geocodeTimerRef.current = setTimeout(async () => {
                try {
                    const found = await geocodeAddress(text);
                    if (found) {
                        updateCoords(found.lat, found.lng, false);
                    }
                } finally {
                    setIsGeocoding(false);
                }
            }, 700);
        }
    };

    const handleSelectSavedAddress = (saved: SavedAddress) => {
        setCustomerAddress(saved.address);
        updateCoords(saved.lat, saved.lng, false);
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Keranjang belanja Anda kosong!');
            return;
        }

        if (deliveryType === 'delivery' && !customerAddress.trim()) {
            alert('Alamat pengiriman wajib diisi jika memilih pengantaran ke rumah!');
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

            // Create sale with complete coordinates and delivery type
            const sale = await DataService.createSale({
                invoice_number: invoiceNumber,
                cashier_name: 'Online Store',
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: deliveryType === 'delivery' ? customerAddress : 'Ambil di Konter (Pickup)',
                customer_lat: deliveryType === 'delivery' ? customerLat : STORE_LAT,
                customer_lng: deliveryType === 'delivery' ? customerLng : STORE_LNG,
                delivery_type: deliveryType,
                total: subtotal,
                payment_method: paymentMethod,
                amount_paid: subtotal,
                change_amount: 0,
                discount: 0,
                items: saleItems
            });

            // Clear only checked out items
            removeItemsFromCart(cart.map(it => it.id));
            window.dispatchEvent(new Event('storage'));

            router.push(`/penjualan/${sale.id}/struk`);
        } catch (err) {
            alert('Gagal memproses checkout pesanan. Silakan coba kembali.');
            setIsSubmitting(false);
        }
    };

    if (!authChecked) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 py-24 text-center font-mono text-sm text-on-surface-variant">
                Memverifikasi sesi login...
            </div>
        );
    }

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

                            {/* Address container - preserved in DOM and toggled via CSS to prevent Leaflet unmount glitches */}
                            <div id="address-field-wrap" className={`space-y-3 ${deliveryType === 'delivery' ? 'block' : 'hidden'}`}>
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

                                {/* Saved addresses quick picker if any */}
                                {savedAddresses.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                                        <span className="text-on-surface-variant text-[11px]">Gunakan Alamat Tersimpan:</span>
                                        {savedAddresses.map(sa => (
                                            <button
                                                key={sa.id}
                                                type="button"
                                                onClick={() => handleSelectSavedAddress(sa)}
                                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                                                    customerAddress === sa.address
                                                        ? 'bg-secondary text-white border-secondary'
                                                        : 'bg-surface-container-low text-primary border-outline-variant/40 hover:border-secondary'
                                                }`}
                                            >
                                                📍 {sa.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <textarea
                                        rows={2}
                                        required={deliveryType === 'delivery'}
                                        value={customerAddress}
                                        onChange={e => handleAddressInput(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                        placeholder="Ketik alamat pengiriman lengkap rumah Anda, atau tempelkan link/koordinat Google Maps..."
                                    ></textarea>
                                    {isGeocoding && (
                                        <span className="absolute right-3 bottom-3 text-xs font-mono text-secondary flex items-center gap-1 bg-surface-container/90 px-2 py-1 rounded-md">
                                            <span className="w-2.5 h-2.5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></span>
                                            Mencari titik peta...
                                        </span>
                                    )}
                                </div>

                                <p className="text-[11px] font-mono text-on-surface-variant/80">
                                    💡 Anda dapat mengetik alamat rumah atau menempelkan (paste) salinan link/koordinat dari Google Maps.
                                </p>

                                {/* Leaflet Map Picker Component */}
                                <div className="border border-outline-variant/30 rounded-xl overflow-hidden shadow-inner">
                                    <div className="bg-surface-container-low px-3 py-2 border-b border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                                        <span className="font-bold text-primary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                                            Peta Pin Lokasi Rumah (Geser pin jika kurang pas)
                                        </span>
                                        <span className="text-[11px] text-secondary font-bold">
                                            {isCustomLocation ? `${customerLat.toFixed(5)}, ${customerLng.toFixed(5)}` : 'Titik belum ditentukan'}
                                        </span>
                                    </div>
                                    <MapLocationPicker
                                        visible={deliveryType === 'delivery'}
                                        lat={customerLat}
                                        lng={customerLng}
                                        height={220}
                                        onLocationChange={(lat, lng) => updateCoords(lat, lng, true)}
                                    />
                                </div>

                                {/* Distance Badge */}
                                <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                                    !isCustomLocation
                                        ? 'bg-blue-50 border border-blue-200 text-blue-800'
                                        : distanceKm <= FREE_DELIVERY_KM
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-amber-50 border border-amber-200 text-amber-800'
                                }`}>
                                    <span className={`material-symbols-outlined text-[18px] ${
                                        !isCustomLocation
                                            ? 'text-blue-600'
                                            : distanceKm <= FREE_DELIVERY_KM
                                                ? 'text-green-600'
                                                : 'text-amber-600'
                                    }`}>
                                        {!isCustomLocation ? 'info' : distanceKm <= FREE_DELIVERY_KM ? 'verified' : 'warning'}
                                    </span>
                                    <div>
                                        {!isCustomLocation ? (
                                            <span>💡 <strong>Silakan tentukan titik lokasi rumah:</strong> Ketik alamat atau geser pin di peta untuk mengukur jarak &amp; gratis ongkir.</span>
                                        ) : (
                                            <>
                                                <strong>Jarak ke Konter Gawok: {distanceKm.toFixed(1)} km</strong> {distanceKm <= FREE_DELIVERY_KM ? (
                                                    <span className="font-bold text-green-700">(≤ {FREE_DELIVERY_KM}km) — GRATIS ONGKIR!</span>
                                                ) : (
                                                    <span>(&gt; {FREE_DELIVERY_KM}km) — Melebihi batas {(distanceKm - FREE_DELIVERY_KM).toFixed(1)} km. Ongkir tambahan dihitung oleh kurir.</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                                {deliveryType === 'pickup' ? (
                                    <span className="text-secondary font-bold">Ambil di Toko (Rp 0)</span>
                                ) : !isCustomLocation ? (
                                    <span className="text-on-surface-variant font-bold">Menunggu Alamat</span>
                                ) : distanceKm <= FREE_DELIVERY_KM ? (
                                    <span className="text-green-700 font-bold">GRATIS (Radius ≤ {FREE_DELIVERY_KM}km)</span>
                                ) : (
                                    <span className="text-amber-700 font-bold">Ongkir Tambahan Kurir</span>
                                )}
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
