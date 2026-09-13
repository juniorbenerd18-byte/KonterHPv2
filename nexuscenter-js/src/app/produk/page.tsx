'use client';

import { addToCart } from '@/lib/cart';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DataService } from '@/lib/store';
import { Product, ProductCategory, Role } from '@/types/database';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentRole, setCurrentRole] = useState<Role>('pengguna');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [category, setCategory] = useState<ProductCategory>('smartphone');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [icon, setIcon] = useState('📱');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    const loadData = () => {
        DataService.getProducts().then(setProducts);
        setCurrentRole(DataService.getCurrentRole());
    };

    useEffect(() => {
        loadData();
    }, []);

    const isStaff = currentRole === 'admin' || currentRole === 'kasir';
    const isAdmin = currentRole === 'admin';

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const filtered = products.filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            addToCart(product, 1);
            showToast(`"${product.name}" berhasil ditambahkan ke keranjang!`);
        } catch {
            showToast('Gagal menambahkan ke keranjang');
        }
    };

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setName('');
        setCategory('smartphone');
        setBrand('');
        setPrice(0);
        setStock(10);
        setIcon('📱');
        setImage('');
        setDescription('');
        setModalOpen(true);
    };

    const handleOpenEdit = (p: Product) => {
        setEditingProduct(p);
        setName(p.name);
        setCategory(p.category);
        setBrand(p.brand || '');
        setPrice(p.price);
        setStock(p.stock);
        setIcon(p.icon);
        setImage(p.image || '');
        setDescription(p.description || '');
        setModalOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || price <= 0) {
            showToast('Nama produk dan harga wajib diisi dengan benar!');
            return;
        }

        await DataService.saveProduct({
            id: editingProduct ? editingProduct.id : undefined,
            name: name.trim(),
            category,
            brand: brand.trim() || 'TECHCELL',
            price,
            stock,
            icon,
            image: image.trim() || null,
            description: description.trim() || null,
            is_active: true,
        });

        setModalOpen(false);
        loadData();
        showToast(`Produk "${name}" berhasil disimpan!`);
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 fade-in">
            {/* Toast feedback */}
            {toastMessage && (
                <div className="fixed top-24 right-4 z-[9999] bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 fade-in">
                    <span className="material-symbols-outlined icon-filled text-xl text-green-600">check_circle</span>
                    <span className="text-sm font-medium">{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-gray-700">
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface">Katalog & Manajemen Produk</h1>
                    <p className="text-on-surface-variant text-sm mt-1">Cari smartphone, aksesoris original, pulsa, dan atur ketersediaan stok.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-mono text-sm font-bold hover:bg-secondary/90 transition-all shadow-md active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        + Tambah Produk Baru
                    </button>
                )}
            </div>

            {/* Toolbar: Search + Category Filters */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari produk, merek, atau spesifikasi..."
                            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-mono"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { val: 'all', label: 'Semua' },
                            { val: 'smartphone', label: '📱 Smartphone' },
                            { val: 'aksesoris', label: '🔌 Aksesoris' },
                            { val: 'pulsa', label: '📶 Pulsa & Data' },
                        ].map((cat) => (
                            <button
                                key={cat.val}
                                onClick={() => setSelectedCategory(cat.val)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                                    selectedCategory === cat.val
                                        ? 'bg-secondary text-white border-secondary'
                                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:text-secondary'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* View for Pengguna / Customer: Product Grid Cards matching Blade */}
            {!isStaff ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {filtered.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedDetailProduct(product)}
                            className="product-card bg-surface-container-lowest border border-outline-variant/25 rounded-2xl overflow-hidden hover:border-secondary transition-all duration-300 hover:shadow-lg flex flex-col justify-between group cursor-pointer"
                        >
                            <div className="bg-surface-container-low flex justify-center items-center h-48 relative overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.icon}</span>
                                )}
                                <span className="absolute top-3 left-3 bg-secondary/15 text-secondary text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase border border-secondary/20 backdrop-blur">
                                    {product.category}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setSelectedDetailProduct(product); }}
                                    className="absolute top-3 right-3 bg-surface-container-lowest/90 text-on-surface-variant hover:text-secondary text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur flex items-center gap-1 shadow-sm border border-outline-variant/30 active:scale-95 z-10"
                                >
                                    <span className="material-symbols-outlined text-[14px]">info</span> Detail
                                </button>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-xs font-mono text-on-surface-variant">{product.brand || 'TECHCELL'}</span>
                                    <span className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                                        <span className="material-symbols-outlined text-xs">star</span> {Number(product.rating || 4.9).toFixed(1)} ({product.review_count || 128})
                                    </span>
                                </div>
                                <h3 className="font-display font-bold text-base text-on-surface mb-2 line-clamp-2 hover:text-secondary transition-colors">{product.name}</h3>
                                <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">{product.description}</p>
                                <div className="mt-auto pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                                    <div>
                                        <p className="font-mono font-bold text-lg text-secondary">Rp {product.price.toLocaleString('id-ID')}</p>
                                        <p className={`text-[11px] font-mono ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setSelectedDetailProduct(product); }}
                                            className="p-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary transition-all cursor-pointer"
                                            title="Lihat Deskripsi & Spesifikasi"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                        {product.stock > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className="bg-secondary text-white p-2.5 rounded-xl hover:bg-secondary/90 transition-all shadow-sm active:scale-95"
                                                title="Tambah ke Keranjang"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
                            <p className="font-display font-bold text-base text-on-surface">Produk Tidak Ditemukan</p>
                        </div>
                    )}
                </div>
            ) : (
                /* View for Staff / Admin (Management Table) */
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-on-surface-variant text-xs font-mono uppercase tracking-wider">
                                    <th className="p-4">Produk</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Merek</th>
                                    <th className="p-4">Harga</th>
                                    <th className="p-4">Stok</th>
                                    {isAdmin && <th className="p-4 text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/15 text-sm">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-xl overflow-hidden">
                                                    {p.image ? (
                                                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        p.icon
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-on-surface">{p.name}</div>
                                                    <div className="text-xs text-on-surface-variant font-mono">ID: #{p.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-secondary/10 text-secondary">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-xs">{p.brand || '-'}</td>
                                        <td className="p-4 font-mono font-bold text-secondary">Rp {p.price.toLocaleString('id-ID')}</td>
                                        <td className="p-4 font-mono">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.stock > 5 ? 'bg-green-100 text-green-800' : p.stock > 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                                                {p.stock} Unit
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleOpenEdit(p)}
                                                    className="px-3 py-1.5 bg-surface-container hover:bg-secondary/10 text-secondary rounded-lg font-mono text-xs font-bold transition-all"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Product Detail Modal matching Blade */}
            {selectedDetailProduct && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/30 relative max-h-[90vh] overflow-y-auto space-y-6">
                        <button
                            onClick={() => setSelectedDetailProduct(null)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-surface-container transition-colors z-20"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-5 flex flex-col items-center justify-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 relative">
                                {selectedDetailProduct.image ? (
                                    <div className="w-full h-48 md:h-56 flex items-center justify-center">
                                        <img src={selectedDetailProduct.image} alt={selectedDetailProduct.name} className="w-full h-full object-contain rounded-xl shadow-md" />
                                    </div>
                                ) : (
                                    <div className="text-7xl py-6">{selectedDetailProduct.icon}</div>
                                )}
                                <span className="mt-3 px-3 py-1 bg-secondary/15 text-secondary text-[11px] font-mono font-bold rounded-full uppercase border border-secondary/30">
                                    {selectedDetailProduct.category}
                                </span>
                            </div>

                            <div className="md:col-span-7 space-y-4">
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                                        <span className="material-symbols-outlined text-base">star</span>
                                        <span className="font-mono text-xs font-bold text-on-surface">
                                            {Number(selectedDetailProduct.rating || 4.9).toFixed(1)} ★ ({selectedDetailProduct.review_count || 128} ulasan)
                                        </span>
                                    </div>
                                    <h3 className="font-display font-extrabold text-2xl text-on-surface leading-tight">{selectedDetailProduct.name}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="font-mono font-extrabold text-secondary text-2xl">
                                            Rp {Number(selectedDetailProduct.price).toLocaleString('id-ID')}
                                        </span>
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold text-xs rounded-full border border-emerald-200">
                                            {selectedDetailProduct.stock > 0 ? `${selectedDetailProduct.stock} Unit Tersedia` : 'Stok Habis'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-mono text-on-surface-variant font-bold uppercase block mb-1">Deskripsi:</span>
                                    <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                                        {selectedDetailProduct.description || 'Produk original bergaransi resmi dari TECHCELL NexusCenter.'}
                                    </p>
                                </div>

                                <div className="pt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleAddToCart(selectedDetailProduct);
                                            setSelectedDetailProduct(null);
                                        }}
                                        className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="font-display font-bold text-lg text-on-surface">
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-3 font-mono text-xs">
                            <div>
                                <label className="block text-slate-700 mb-1 font-bold">Nama Produk *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1 font-bold">Kategori</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as ProductCategory)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="smartphone">Smartphone</option>
                                        <option value="aksesoris">Aksesoris</option>
                                        <option value="pulsa">Pulsa & Data</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-700 mb-1 font-bold">Merek</label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="Samsung, Apple, dll"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 mb-1 font-bold">Harga (Rp) *</label>
                                    <input
                                        type="number"
                                        value={price || ''}
                                        onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                                        required
                                        min={0}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 mb-1 font-bold">Stok</label>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                        min={0}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-bold">URL / Path Gambar (Opsional)</label>
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="/storage/products/... atau https://..."
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 mb-1 font-bold">Deskripsi</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90"
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
