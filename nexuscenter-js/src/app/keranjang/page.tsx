'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem, getCart, saveCart, setSelectedCheckoutItems, setCheckoutPrefs } from '@/lib/cart';
import { DataService } from '@/lib/store';
import { STORE_LAT, STORE_LNG, FREE_DELIVERY_KM, haversineKm, parseMapCoords } from '@/lib/geo';

function fmt(n: number) {
    if (isNaN(n) || n < 0) return 'Rp 0';
    return 'Rp ' + n.toLocaleString('id-ID');
}

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [address, setAddress] = useState('');
    const [distanceResult, setDistanceResult] = useState<{ text: string; type: 'success' | 'warning' | 'error' | 'loading' | '' }>({ text: '', type: '' });
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(DataService.isLoggedIn());
        // Load and automatically normalize/repair any corrupted items from localStorage
        const items = getCart();
        setCart(items);
        setSelectedIds(items.map(it => it.id));
        setIsLoaded(true);

        const handleStorage = () => {
            const updated = getCart();
            setCart(updated);
            setIsLoggedIn(DataService.isLoggedIn());
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const updateQty = (id: number, delta: number) => {
        const updated = cart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : null;
            }
            return item;
        }).filter(Boolean) as CartItem[];
        setCart(updated);
        saveCart(updated);
    };

    const removeItem = (id: number) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        saveCart(updated);
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    };

    const clearCart = () => {
        if (confirm('Kosongkan semua barang dari keranjang belanja?')) {
            setCart([]);
            saveCart([]);
            setSelectedIds([]);
        }
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(cart.map(i => i.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const checkDistance = () => {
        const addr = address.trim();
        if (!addr) {
            setDistanceResult({ text: 'Harap masukkan alamat Anda terlebih dahulu.', type: 'error' });
            return;
        }

        setDistanceResult({ text: '📡 Menghitung jarak dari konter...', type: 'loading' });

        const parsed = parseMapCoords(addr);
        if (parsed) {
            calcHaversine(parsed.lat, parsed.lng);
            return;
        }

        let searchQuery = addr;
        if (!/sukoharjo|surakarta|solo|jawa\s+tengah|colomadu|karanganyar|baturan|kartasura/i.test(searchQuery)) {
            searchQuery += ', Colomadu, Karanganyar, Jawa Tengah';
        }

        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=id`)
            .then(r => r.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);
                    calcHaversine(lat, lng);
                } else {
                    setDistanceResult({ text: `✓ Alamat terdaftar. Estimasi jarak ≤ ${FREE_DELIVERY_KM}km — Gratis Ongkir.`, type: 'success' });
                }
            })
            .catch(() => {
                setDistanceResult({ text: `✓ Estimasi jarak ≤ ${FREE_DELIVERY_KM}km — Gratis Ongkir.`, type: 'success' });
            });
    };

    const calcHaversine = (lat: number, lng: number) => {
        const distKm = haversineKm(STORE_LAT, STORE_LNG, lat, lng);

        if (distKm <= FREE_DELIVERY_KM) {
            setDistanceResult({
                text: `✓ Jarak ke Konter: ${distKm.toFixed(1)} km (≤ ${FREE_DELIVERY_KM}km). Selamat! Anda mendapatkan Gratis Ongkir.`,
                type: 'success'
            });
        } else {
            setDistanceResult({
                text: `⚠️ Jarak ke Konter: ${distKm.toFixed(1)} km (> ${FREE_DELIVERY_KM}km). Melebihi batas gratis ongkir (${(distKm - FREE_DELIVERY_KM).toFixed(1)} km).`,
                type: 'warning'
            });
        }
    };

    const selectedItems = cart.filter(it => selectedIds.includes(it.id));
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

    const handleProceedCheckout = () => {
        if (selectedItems.length === 0) return;
        // Auth guard: must be logged in to checkout
        if (!isLoggedIn) {
            router.push('/login?redirect=/keranjang');
            return;
        }
        // Save only the selected items so checkout processes precisely what the user checked
        setSelectedCheckoutItems(selectedItems);
        // Persist delivery preferences and address entered in cart to checkout
        setCheckoutPrefs({
            deliveryType: deliveryMethod,
            address: deliveryMethod === 'delivery' && address.trim() ? address.trim() : undefined
        });
        router.push('/checkout');
    };

    if (!isLoaded) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 py-24 text-center font-mono text-sm text-on-surface-variant">
                Memuat keranjang belanja...
            </div>
        );
    }

    return (
        <div className="fade-in max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-16 w-full font-sans">
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary border-l-4 border-secondary pl-4 tracking-tight">
                    Keranjang Belanja
                </h1>
                <p className="text-xs font-mono text-on-surface-variant pl-4 mt-1">
                    Kelola barang belanjaan Anda dan pilih opsi pengiriman.
                </p>
            </div>

            {/* Delivery Banner */}
            <div className="bg-primary-container text-on-primary-container p-5 rounded-2xl mb-8 flex items-start gap-4 border border-secondary/30 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none"></div>
                <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl mt-0.5 relative z-10 icon-filled">
                    local_shipping
                </span>
                <div className="relative z-10">
                    <h3 className="font-mono text-sm font-bold text-secondary-fixed-dim mb-1">
                        Gratis Ongkir untuk pengantaran ke rumah (Maksimal radius 4km dari Gawok)
                    </h3>
                    <p className="text-xs text-on-primary-container opacity-90 leading-relaxed font-body">
                        Berlaku untuk pembelian produk baru dan HP yang telah diservis. Pengiriman presisi langsung ke lokasi Anda.
                    </p>
                </div>
            </div>

            {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {/* Select All Header */}
                        <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === cart.length && cart.length > 0}
                                    onChange={e => toggleSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-secondary border-outline-variant focus:ring-secondary rounded accent-secondary cursor-pointer"
                                />
                                <span className="font-mono text-sm font-bold text-primary">
                                    Pilih Semua Item ({selectedIds.length}/{cart.length})
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={clearCart}
                                className="text-xs font-mono text-error hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">delete_sweep</span> Kosongkan Keranjang
                            </button>
                        </div>

                        {/* Items */}
                        {cart.map(item => {
                            const itemTotal = (item.price || 0) * (item.qty || 1);
                            const isChecked = selectedIds.includes(item.id);
                            return (
                                <div
                                    key={item.id}
                                    className={`bg-surface-container-lowest border rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 shadow-sm hover:shadow-md transition-all duration-300 relative group ${
                                        isChecked ? 'border-secondary/60' : 'border-outline-variant/30 opacity-80'
                                    }`}
                                >
                                    <div className="flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleSelectItem(item.id)}
                                            className="w-4 h-4 text-secondary border-outline-variant focus:ring-secondary rounded accent-secondary cursor-pointer"
                                        />
                                    </div>

                                    <div className="w-full sm:w-28 h-28 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/20 relative overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                                {item.icon || '📱'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <h3 className="font-display font-bold text-base sm:text-lg text-primary mb-1 line-clamp-2">
                                                    {item.name || 'Produk Smartphone'}
                                                </h3>
                                                <p className="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-wider">
                                                    {item.brand || 'TECHCELL'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Remove item"
                                                className="text-on-surface-variant hover:text-error transition-colors p-1"
                                                title="Hapus dari Keranjang"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center border border-outline-variant/50 rounded-xl bg-surface overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.id, -1)}
                                                    className="px-3 py-1.5 text-on-surface hover:text-secondary transition-colors font-mono font-bold text-sm bg-surface-container-low hover:bg-surface-container cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1.5 font-mono text-xs font-bold text-primary border-x border-outline-variant/30">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="px-3 py-1.5 text-on-surface hover:text-secondary transition-colors font-mono font-bold text-sm bg-surface-container-low hover:bg-surface-container cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-mono text-on-surface-variant">
                                                    {item.qty} × {fmt(item.price)}
                                                </div>
                                                <div className="font-mono font-bold text-secondary text-lg">
                                                    {fmt(itemTotal)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card sticky top-28 space-y-6">
                            {/* Delivery Options */}
                            <div className="p-4 bg-primary-container/5 border border-secondary/30 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 circuit-pattern opacity-5 pointer-events-none"></div>
                                <h3 className="font-mono text-xs text-secondary font-bold mb-3 uppercase tracking-wider">
                                    Metode Pengiriman
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="delivery-method"
                                            value="pickup"
                                            checked={deliveryMethod === 'pickup'}
                                            onChange={() => setDeliveryMethod('pickup')}
                                            className="w-4 h-4 text-secondary focus:ring-secondary accent-secondary"
                                        />
                                        <span className="font-body text-sm text-on-surface group-hover:text-secondary transition-colors">
                                            Ambil di Konter NexusCenter
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="delivery-method"
                                            value="delivery"
                                            checked={deliveryMethod === 'delivery'}
                                            onChange={() => setDeliveryMethod('delivery')}
                                            className="w-4 h-4 text-secondary focus:ring-secondary accent-secondary"
                                        />
                                        <span className="font-body text-sm text-on-surface group-hover:text-secondary transition-colors">
                                            Diantar ke Rumah (Kurir Toko)
                                        </span>
                                    </label>
                                </div>

                                {deliveryMethod === 'delivery' && (
                                    <div className="mt-4 pt-3 border-t border-outline-variant/20 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={e => setAddress(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && checkDistance()}
                                                placeholder="Masukkan alamat Anda untuk cek jarak..."
                                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={checkDistance}
                                            className="w-full bg-secondary text-white font-mono text-xs font-bold py-2 rounded-lg hover:bg-secondary/90 transition-all shadow-sm"
                                        >
                                            Cek Jarak Ongkir
                                        </button>
                                        {distanceResult.text && (
                                            <p className={`text-xs font-mono mt-2 p-2 rounded-lg ${
                                                distanceResult.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                distanceResult.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                distanceResult.type === 'loading' ? 'bg-cyan-50 text-secondary border border-cyan-200 animate-pulse' :
                                                'bg-red-50 text-error border border-red-200'
                                            }`}>
                                                {distanceResult.text}
                                            </p>
                                        )}
                                        <p className="text-[11px] font-mono text-on-surface-variant opacity-70">
                                            Gratis antar jika jarak &lt; 4km dari konter Gawok.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Summary Breakdown */}
                            <div>
                                <h2 className="font-display font-bold text-xl text-primary mb-4 border-b border-outline-variant/20 pb-3">
                                    Order Summary
                                </h2>
                                <div className="space-y-3 font-mono text-xs text-on-surface-variant mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({selectedItems.length} items)</span>
                                        <span className="font-bold text-primary">{fmt(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-bold text-secondary">
                                            {deliveryMethod === 'pickup' ? 'Ambil Sendiri (Rp 0)' : 'Gratis / Free (s/d 4km)'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (Included)</span>
                                        <span className="text-primary">Termasuk PPN</span>
                                    </div>
                                </div>

                                <div className="border-t border-outline-variant/20 pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-display font-bold text-lg text-primary">Total</span>
                                        <span className="font-mono font-bold text-xl text-secondary">
                                            {fmt(subtotal)}
                                        </span>
                                    </div>

                                    {/* Login required banner for guests */}
                                    {!isLoggedIn && (
                                        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                                            <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">info</span>
                                            <div>
                                                <p className="text-xs font-mono font-bold text-amber-800">Login diperlukan untuk checkout</p>
                                                <p className="text-[11px] text-amber-700 mt-0.5">Silakan masuk atau daftar akun terlebih dahulu.</p>
                                                <Link href="/login?redirect=/keranjang" className="inline-flex items-center gap-1 mt-2 text-[11px] font-mono font-bold text-secondary hover:underline">
                                                    <span className="material-symbols-outlined text-[14px]">login</span>
                                                    Masuk sekarang →
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        disabled={selectedItems.length === 0}
                                        onClick={handleProceedCheckout}
                                        className={`w-full font-mono text-sm font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer ${
                                            selectedItems.length > 0
                                                ? 'bg-secondary text-white hover:bg-secondary/90'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined icon-filled text-[20px]">
                                            {isLoggedIn ? 'lock' : 'login'}
                                        </span>
                                        {isLoggedIn ? `Checkout Securely (${selectedItems.length})` : 'Masuk untuk Checkout'}
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant text-[11px] font-mono opacity-80">
                                    <span className="material-symbols-outlined text-[16px] text-green-700">verified</span>
                                    Secure 256-bit SSL Encryption
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card p-8">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 block mb-3">
                        shopping_cart
                    </span>
                    <h3 className="font-display font-bold text-xl text-on-surface mb-2">Keranjang Belanja Masih Kosong</h3>
                    <p className="text-sm font-mono text-on-surface-variant mb-6 max-w-md mx-auto">
                        Anda belum menambahkan produk apa pun ke keranjang. Jelajahi katalog produk kami dan dapatkan promo menarik!
                    </p>
                    <Link
                        href="/produk"
                        className="inline-flex items-center gap-2 bg-secondary text-white font-mono text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:bg-secondary/90 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">storefront</span>
                        Mulai Belanja Sekarang
                    </Link>
                </div>
            )}
        </div>
    );
}
