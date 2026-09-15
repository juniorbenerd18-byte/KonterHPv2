'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { DataService } from '@/lib/store';
import { Product, PaymentMethod, Sale } from '@/types/database';
import MapLocationPicker from '@/components/MapLocationPicker';
import { STORE_LAT, STORE_LNG, FREE_DELIVERY_KM, geocodeAddress, haversineKm, parseMapCoords } from '@/lib/geo';

interface CartItem {
    product: Product;
    qty: number;
}

export default function POSPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Customer & payment state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('Jl. Ahmad Yani No. 88, Kartasura, Sukoharjo');
    const [customerLat, setCustomerLat] = useState<number>(STORE_LAT);
    const [customerLng, setCustomerLng] = useState<number>(STORE_LNG);
    const [distanceKm, setDistanceKm] = useState<number>(0);
    const [isDelivery, setIsDelivery] = useState(false);
    const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [discount, setDiscount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
    const [amountPaid, setAmountPaid] = useState<number>(0);

    // Modals & feedback
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [lastSale, setLastSale] = useState<Sale | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!DataService.isLoggedIn()) {
            router.push('/login?redirect=/pos');
            return;
        }
        const r = DataService.getCurrentRole();
        if (r === 'pengguna') {
            router.push('/');
            return;
        }
        DataService.getProducts().then((data) => setProducts(data.filter(p => p.is_active)));
    }, [router]);

    const updateCoords = (lat: number, lng: number, updateAddr = false) => {
        setCustomerLat(lat);
        setCustomerLng(lng);
        setDistanceKm(haversineKm(STORE_LAT, STORE_LNG, lat, lng));

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
                    alert('Gagal membaca lokasi GPS. Pastikan izin lokasi aktif.');
                }
            );
        } else {
            alert('Browser tidak mendukung GPS.');
        }
    };

    const handleAddressInput = (text: string) => {
        setCustomerAddress(text);
        const parsed = parseMapCoords(text);
        if (parsed) {
            updateCoords(parsed.lat, parsed.lng, false);
            return;
        }
        if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
        geocodeTimerRef.current = setTimeout(() => {
            geocodeAddress(text).then(found => {
                if (found) updateCoords(found.lat, found.lng, false);
            }).catch(() => {});
        }, 700);
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Filter products
    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Cart operations
    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                if (existing.qty >= product.stock) {
                    showToast(`Stok ${product.name} hanya tersisa ${product.stock}!`);
                    return prev;
                }
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { product, qty: 1 }];
        });
    };

    const changeQty = (id: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.product.id === id) {
                        const newQty = item.qty + delta;
                        if (newQty > item.product.stock) {
                            showToast(`Stok maksimal ${item.product.name} adalah ${item.product.stock}`);
                            return item;
                        }
                        return newQty > 0 ? { ...item, qty: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const clearCart = () => {
        if (!cart.length) return;
        if (confirm('Kosongkan keranjang?')) {
            setCart([]);
        }
    };

    // Calculations
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const validDiscount = Math.min(100, Math.max(0, discount || 0));
    const total = Math.max(0, Math.round(subtotal - (subtotal * validDiscount) / 100));
    const change = Math.max(0, (amountPaid || 0) - total);

    const openPaymentModal = () => {
        if (!cart.length) return;
        setAmountPaid(total);
        setPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setPaymentModalOpen(false);
    };

    const confirmPayment = async () => {
        if (paymentMethod === 'Tunai' && amountPaid < total) {
            showToast('Uang yang diterima kurang dari total pembayaran!');
            return;
        }

        if (isDelivery && !customerAddress.trim()) {
            showToast('Alamat pengiriman wajib diisi jika antar kurir.');
            return;
        }

        try {
            const sale = await DataService.createSale({
                customer_name: customerName.trim() || 'Pelanggan POS',
                customer_phone: customerPhone.trim() || null,
                customer_address: isDelivery ? customerAddress.trim() || null : null,
                customer_lat: isDelivery ? customerLat : null,
                customer_lng: isDelivery ? customerLng : null,
                items: cart.map((item) => ({
                    id: item.product.id,
                    qty: item.qty,
                    price: item.product.price,
                    name: item.product.name,
                })),
                discount: validDiscount,
                payment_method: paymentMethod,
                amount_paid: paymentMethod === 'Tunai' ? amountPaid : total,
                delivery_type: isDelivery ? 'delivery' : 'pickup',
                cashier_name: 'Kasir TECHCELL',
            });

            setLastSale(sale);
            setPaymentModalOpen(false);
            setSuccessModalOpen(true);

            // Reset cart
            setCart([]);
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('Jl. Ahmad Yani No. 88, Kartasura, Sukoharjo');
            setCustomerLat(STORE_LAT);
            setCustomerLng(STORE_LNG);
            setDistanceKm(0);
            setIsDelivery(false);
            setDiscount(0);
        } catch (err: any) {
            showToast(err.message || 'Gagal menyimpan transaksi!');
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 fade-in">
            {/* Toast feedback */}
            {toastMessage && (
                <div className="fixed top-24 right-4 z-[9999] bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 fade-in">
                    <span className="material-symbols-outlined icon-filled text-xl text-red-600">error</span>
                    <span className="text-sm font-medium">{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-gray-700">
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
            )}

            {/* Header POS matching Blade */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">POS Penjualan</h1>
                    <p className="text-on-surface-variant text-sm mt-1">
                        Kasir: <span className="font-semibold text-secondary">Kasir TECHCELL</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={clearCart}
                        disabled={!cart.length}
                        className="text-xs font-mono text-error hover:underline flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[16px]">delete_sweep</span> Kosongkan Keranjang
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: Product List (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                    {/* Search & Category Tabs */}
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 shadow-sm">
                        <div className="relative mb-3">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap" id="category-filters">
                            {[
                                { val: 'all', label: 'Semua' },
                                { val: 'smartphone', label: '📱 Smartphone' },
                                { val: 'aksesoris', label: '🔌 Aksesoris' },
                                { val: 'pulsa', label: '📶 Pulsa' },
                            ].map((cat) => (
                                <button
                                    key={cat.val}
                                    onClick={() => setSelectedCategory(cat.val)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                        selectedCategory === cat.val
                                            ? 'bg-secondary text-white border-secondary'
                                            : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-secondary/50'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid matching Blade */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="product-card bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-32 bg-white flex items-center justify-center p-3">
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-10">
                                            <span className="text-white font-bold text-xs bg-red-600 px-2 py-1 rounded">
                                                STOK HABIS
                                            </span>
                                        </div>
                                    )}
                                    {product.stock > 0 && product.stock <= 5 && (
                                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                                            Stok {product.stock}
                                        </span>
                                    )}
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                            {product.icon}
                                        </span>
                                    )}
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <p className="font-semibold text-xs text-on-surface leading-tight line-clamp-2 mb-1">
                                        {product.name}
                                    </p>
                                    {product.brand && (
                                        <p className="text-[11px] text-on-surface-variant mb-1 font-mono">{product.brand}</p>
                                    )}
                                    <p className="font-mono font-bold text-secondary text-sm mt-auto">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-3 py-16 text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">search_off</span>
                                <p className="font-mono text-sm">Produk tidak ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sticky Cart Panel (5 cols) */}
                <div className="lg:col-span-5">
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm sticky top-24">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                            <h2 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary text-[20px] icon-filled">
                                    shopping_cart
                                </span>
                                Keranjang
                                <span className="bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                                    {cartCount}
                                </span>
                            </h2>
                            <button
                                onClick={clearCart}
                                disabled={!cart.length}
                                className="text-xs text-error hover:underline flex items-center gap-1 disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete_sweep</span> Kosongkan
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="divide-y divide-outline-variant/10 max-h-72 overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="py-12 text-center text-on-surface-variant">
                                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">shopping_cart</span>
                                    <p className="text-sm font-mono">Keranjang kosong</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors">
                                        <div className="w-9 h-9 rounded bg-surface-container flex items-center justify-center flex-shrink-0 text-lg overflow-hidden">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                                            ) : (
                                                item.product.icon
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-on-surface leading-tight line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs font-mono text-secondary">Rp {item.product.price.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => changeQty(item.product.id, -1)}
                                                className="w-6 h-6 rounded bg-surface-container hover:bg-secondary/10 flex items-center justify-center transition-colors text-slate-700 font-bold"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">remove</span>
                                            </button>
                                            <span className="w-6 text-center text-sm font-mono font-bold">{item.qty}</span>
                                            <button
                                                onClick={() => changeQty(item.product.id, 1)}
                                                className="w-6 h-6 rounded bg-surface-container hover:bg-secondary/10 flex items-center justify-center transition-colors text-slate-700 font-bold"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">add</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Summary & Customer Info */}
                        <div className="p-5 border-t border-outline-variant/20 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-on-surface-variant">Subtotal</span>
                                <span className="font-mono font-semibold text-on-surface">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-on-surface-variant">Diskon</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={discount}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                                        className="w-16 border border-outline-variant/30 rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:border-secondary transition-all"
                                    />
                                    <span className="text-on-surface-variant font-mono">%</span>
                                </div>
                            </div>
                            <div className="border-t border-outline-variant/20 pt-2 flex justify-between">
                                <span className="font-display font-bold text-on-surface">Total</span>
                                <span className="font-mono font-bold text-lg text-secondary">Rp {total.toLocaleString('id-ID')}</span>
                            </div>

                            {/* Customer Info Form */}
                            <div className="space-y-2 pt-1">
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="👤 Nama Pelanggan (opsional)"
                                    className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                />
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="📞 No. HP (opsional)"
                                    className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                />

                                {/* Delivery Checkbox Toggle */}
                                <div className="pt-1">
                                    <label className="flex items-center gap-2 text-xs font-mono text-on-surface cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={isDelivery}
                                            onChange={(e) => setIsDelivery(e.target.checked)}
                                            className="rounded text-secondary focus:ring-secondary"
                                        />
                                        <span className="flex items-center gap-1 font-bold text-[#00687a]">
                                            <span className="material-symbols-outlined text-[16px]">two_wheeler</span> Antar dengan Kurir (Radius 4KM Gratis)
                                        </span>
                                    </label>
                                    <div className={isDelivery ? 'mt-3 space-y-3' : 'hidden'}>
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-mono font-bold text-on-surface-variant">Alamat Lengkap / Google Maps</label>
                                                <button
                                                    type="button"
                                                    onClick={detectGPS}
                                                    className="text-xs font-mono text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">my_location</span> GPS
                                                </button>
                                            </div>
                                            <textarea
                                                value={customerAddress}
                                                onChange={(e) => handleAddressInput(e.target.value)}
                                                placeholder="Alamat lengkap atau paste link Google Maps..."
                                                rows={2}
                                                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-mono"
                                            />
                                            <p className="text-[10px] font-mono text-on-surface-variant">💡 Alamat ini otomatis update saat Anda geser pin di peta di bawah</p>
                                            <div className="border border-outline-variant/30 rounded-lg overflow-hidden shadow-sm">
                                                <div className="bg-surface-container-low px-2.5 py-1.5 border-b border-outline-variant/20 flex items-center justify-between text-[10px] font-mono">
                                                    <span className="font-bold text-primary flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                                                        Pin Lokasi (Geser/Klik Map)
                                                    </span>
                                                    <span className="text-[10px] text-secondary font-bold">
                                                        {customerLat.toFixed(4)}, {customerLng.toFixed(4)}
                                                    </span>
                                                </div>
                                                <MapLocationPicker
                                                    visible={isDelivery}
                                                    lat={customerLat}
                                                    lng={customerLng}
                                                    height={180}
                                                    onLocationChange={(lat, lng) => updateCoords(lat, lng, true)}
                                                />
                                            </div>

                                            <div className={`p-2 rounded-lg text-[10px] font-mono flex items-center gap-1.5 ${
                                                distanceKm <= FREE_DELIVERY_KM
                                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                                    : 'bg-amber-50 border border-amber-200 text-amber-800'
                                            }`}>
                                                <span className={`material-symbols-outlined text-[14px] ${distanceKm <= FREE_DELIVERY_KM ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {distanceKm <= FREE_DELIVERY_KM ? 'verified' : 'warning'}
                                                </span>
                                                <div>
                                                    <strong>Jarak: {distanceKm.toFixed(1)} km</strong>
                                                    {distanceKm <= FREE_DELIVERY_KM ? (
                                                        <span className="font-bold text-green-700"> — GRATIS ONGKIR!</span>
                                                    ) : (
                                                        <span> (&gt;{FREE_DELIVERY_KM}km) Tambah ongkir +{(distanceKm - FREE_DELIVERY_KM).toFixed(1)}km</span>
                                                    )}
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={openPaymentModal}
                                disabled={cart.length === 0}
                                className="w-full bg-secondary text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-[0_0_15px_rgba(0,104,122,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[18px] icon-filled">payments</span>
                                Proses Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal matching Blade */}
            {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePaymentModal}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
                            <h2 className="font-display font-bold text-xl text-on-surface">💳 Metode Pembayaran</h2>
                            <button onClick={closePaymentModal} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-primary-container circuit-pattern rounded-xl p-4 text-center">
                                <p className="text-white/60 text-xs font-mono uppercase tracking-wider">Total Pembayaran</p>
                                <p className="font-display font-bold text-3xl text-secondary-fixed-dim mt-1">
                                    Rp {total.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">Metode Pembayaran</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                    className="w-full border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                                >
                                    <option value="Tunai">💵 Tunai</option>
                                    <option value="Transfer">🏦 Transfer Bank</option>
                                    <option value="QRIS">📱 QRIS</option>
                                    <option value="Debit">💳 Kartu Debit</option>
                                </select>
                            </div>

                            {paymentMethod === 'Tunai' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">Uang Diterima</label>
                                        <input
                                            type="number"
                                            value={amountPaid || ''}
                                            onChange={(e) => setAmountPaid(parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                            min={0}
                                            className="w-full border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-bold text-lg"
                                        />
                                    </div>

                                    {/* Quick Money Buttons */}
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => setAmountPaid(total)}
                                            className="text-xs font-mono px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
                                        >
                                            Uang Pas
                                        </button>
                                        {[50000, 100000, 200000, 500000, 1000000].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setAmountPaid(val)}
                                                className="text-xs font-mono px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                            >
                                                Rp {(val / 1000).toLocaleString('id-ID')}rb
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-2 p-3 bg-green-50 rounded-lg flex justify-between items-center">
                                        <span className="text-sm text-green-700 font-medium">Kembalian</span>
                                        <span className="font-mono font-bold text-green-700 text-lg">
                                            Rp {change.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={confirmPayment}
                                className="w-full bg-secondary text-white py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-md"
                            >
                                <span className="material-symbols-outlined text-[18px] icon-filled">check_circle</span>
                                Konfirmasi Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal matching Blade */}
            {successModalOpen && lastSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSuccessModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-green-600 text-3xl icon-filled">check_circle</span>
                        </div>
                        <h2 className="font-display font-bold text-xl text-on-surface mb-1">Transaksi Berhasil!</h2>
                        <p className="text-on-surface-variant text-sm mb-6 font-mono">
                            No. Invoice: <strong className="text-secondary">{lastSale.invoice_number}</strong>
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href={`/penjualan/${lastSale.id}/struk`}
                                className="flex-1 bg-secondary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-all flex items-center justify-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">receipt_long</span> Cetak Struk
                            </Link>
                            <button
                                onClick={() => setSuccessModalOpen(false)}
                                className="flex-1 border border-outline-variant/30 rounded-lg py-2.5 text-sm font-semibold hover:bg-surface-container transition-all"
                            >
                                Transaksi Baru
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
