'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { DataService } from '@/lib/store';
import { Role, UserProfile } from '@/types/database';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<Role>('pengguna');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const profileRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const syncAuth = () => {
            const loggedIn = DataService.isLoggedIn();
            const user = DataService.getCurrentUser();
            const r = DataService.getCurrentRole();
            setIsLoggedIn(loggedIn);
            setCurrentUser(user);
            setRole(r);
        };
        syncAuth();

        // Check cart count
        const updateCartCount = () => {
            try {
                const stored = localStorage.getItem('nexus_cart');
                if (stored) {
                    const items = JSON.parse(stored);
                    const count = Array.isArray(items) ? items.reduce((acc: number, item: any) => acc + (item.qty || 1), 0) : 0;
                    setCartCount(count);
                } else {
                    setCartCount(0);
                }
            } catch {
                setCartCount(0);
            }
        };

        updateCartCount();
        window.addEventListener('storage', () => { syncAuth(); updateCartCount(); });
        const interval = setInterval(() => { syncAuth(); updateCartCount(); }, 1500);
        return () => {
            window.removeEventListener('storage', () => { syncAuth(); updateCartCount(); });
            clearInterval(interval);
        };
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        DataService.logout();
        setIsLoggedIn(false);
        setCurrentUser(null);
        setRole('pengguna');
        setProfileOpen(false);
        router.push('/');
    };

    const isStaff = isLoggedIn && (role === 'admin' || role === 'kasir');
    const isAdmin = isLoggedIn && role === 'admin';

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const navLinkClass = (path: string) =>
        `whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
            isActive(path) ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5'
        }`;

    const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || (role.charAt(0).toUpperCase());
    const userName = currentUser?.name || '';

    return (
        <header className="glass-nav fixed top-0 w-full z-50 no-print transition-colors duration-200">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 max-w-[1720px] mx-auto w-full">

                {/* Brand Logo */}
                <Link
                    href={isStaff ? '/pos' : '/'}
                    className="flex items-center gap-3 group shrink-0 mr-3 md:mr-4 lg:mr-6 xl:mr-10"
                >
                    <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-[26px]">memory</span>
                    </div>
                    <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-primary-container leading-none">
                        NexusCenter
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-2 font-sans flex-1 min-w-0 overflow-hidden">
                    {!isStaff ? (
                        <>
                            <Link href="/" className={navLinkClass('/')}>Home</Link>
                            <Link href="/produk" className={navLinkClass('/produk')}>Produk</Link>
                            <Link href="/lacak-servis" className={navLinkClass('/lacak-servis')}>Lacak Servis</Link>
                            <Link href="/pengantaran" className={navLinkClass('/pengantaran')}>
                                <span className="material-symbols-outlined text-[14px]">two_wheeler</span> Driver
                            </Link>
                            <Link href="/booking-servis" className={navLinkClass('/booking-servis')}>Booking</Link>
                            <Link href="/promo" className={navLinkClass('/promo')}>Promo</Link>
                        </>
                    ) : (
                        <>
                            {/* Staff/Admin main nav items */}
                            <Link href="/" className={navLinkClass('/')}>
                                <span className="material-symbols-outlined text-[16px]">home</span>
                                <span className="hidden lg:inline">Dashboard</span>
                            </Link>
                            <Link href="/pos" className={navLinkClass('/pos')}>
                                <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                <span className="hidden lg:inline">POS</span>
                            </Link>
                            <Link href="/produk" className={navLinkClass('/produk')}>
                                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                                <span className="hidden lg:inline">Produk</span>
                            </Link>
                            <Link href="/servis" className={navLinkClass('/servis')}>
                                <span className="material-symbols-outlined text-[16px]">build</span>
                                <span className="hidden lg:inline">Servis</span>
                            </Link>
                            <Link href="/pengantaran" className={navLinkClass('/pengantaran')}>
                                <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                                <span className="hidden lg:inline">Antar</span>
                            </Link>

                            {/* "Lainnya" dropdown — absorbs Riwayat + Admin-only links to prevent overflow */}
                            <div className="relative" ref={moreRef}>
                                <button
                                    onClick={() => setMoreOpen(!moreOpen)}
                                    className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                                        moreOpen ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">apps</span>
                                    <span className="hidden lg:inline">Lainnya</span>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {moreOpen ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>

                                {moreOpen && (
                                    <div className="absolute left-0 top-full mt-1.5 w-52 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 p-1.5 fade-in">
                                        <Link
                                            href="/riwayat"
                                            onClick={() => setMoreOpen(false)}
                                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-secondary/10 hover:text-secondary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">history</span>
                                            Riwayat Transaksi
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href="/laporan"
                                                    onClick={() => setMoreOpen(false)}
                                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-secondary/10 hover:text-secondary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                                                    Laporan & Statistik
                                                </Link>
                                                <Link
                                                    href="/manajemen-user"
                                                    onClick={() => setMoreOpen(false)}
                                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-secondary/10 hover:text-secondary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                                    Akun Terdaftar
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </nav>

                {/* Right Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Link
                        href="/produk"
                        aria-label="Search"
                        className="p-2 text-on-surface-variant hover:text-secondary transition-all rounded-full active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[22px]">search</span>
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/keranjang"
                        aria-label="Shopping Cart"
                        className="p-2 text-on-surface-variant hover:text-secondary relative transition-all rounded-full active:scale-95"
                        title="Keranjang Belanja"
                    >
                        <span className={`material-symbols-outlined text-[22px] ${isActive('/keranjang') ? 'text-secondary' : ''}`}>
                            shopping_cart
                        </span>
                        {cartCount > 0 ? (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-mono font-bold text-white shadow-sm">
                                {cartCount}
                            </span>
                        ) : (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary"></span>
                        )}
                    </Link>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            className="p-2 text-on-surface-variant hover:text-secondary relative transition-all rounded-full active:scale-95"
                            title="Notifikasi"
                        >
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-mono font-bold text-white shadow-md animate-pulse">
                                2
                            </span>
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 overflow-hidden fade-in">
                                <div className="p-3.5 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
                                        <span className="material-symbols-outlined text-[18px] text-secondary icon-filled">notifications</span>
                                        Notifikasi (2)
                                    </div>
                                    <button onClick={() => setNotificationOpen(false)} className="text-[11px] font-mono text-secondary hover:underline">Tutup</button>
                                </div>
                                <div className="divide-y divide-outline-variant/10 max-h-80 overflow-y-auto">
                                    <Link href="/pengantaran" onClick={() => setNotificationOpen(false)} className="block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-700">
                                            <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display font-bold text-xs text-primary truncate">Kurir Bergerak</p>
                                            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">Kurir Budi sedang mengantar pesanan INV-202609-0012.</p>
                                            <span className="font-mono text-[10px] text-on-surface-variant opacity-70 block mt-1">5 menit yang lalu</span>
                                        </div>
                                    </Link>
                                    <Link href="/lacak-servis" onClick={() => setNotificationOpen(false)} className="block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-700">
                                            <span className="material-symbols-outlined text-[18px]">build</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display font-bold text-xs text-primary truncate">Servis Siap Diambil</p>
                                            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">iPhone 13 Pro (SRV-001) ganti LCD sudah selesai.</p>
                                            <span className="font-mono text-[10px] text-on-surface-variant opacity-70 block mt-1">20 menit yang lalu</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auth: Profile pill (logged in) OR Login/Daftar (guest) */}
                    {isLoggedIn ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/30 hover:border-secondary hover:bg-surface-container-high transition-all"
                                title={`Profil: ${userName}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                                    isAdmin ? 'bg-secondary' : role === 'kasir' ? 'bg-amber-500' : 'bg-emerald-600'
                                }`}>
                                    {userInitial}
                                </div>
                                <span className="text-sm font-medium text-on-surface max-w-[80px] truncate">{userName || ucfirst(role)}</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full hidden lg:inline ${
                                    isAdmin ? 'bg-secondary/15 text-secondary font-bold' :
                                    role === 'kasir' ? 'bg-amber-100 text-amber-800 font-bold' :
                                    'bg-surface-container-high text-on-surface-variant'
                                }`}>
                                    {ucfirst(role)}
                                </span>
                                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 p-1.5 fade-in">
                                    <div className="px-3 py-2.5 border-b border-outline-variant/20 mb-1">
                                        <p className="text-xs font-bold text-on-surface truncate">{userName}</p>
                                        <p className={`text-[10px] font-mono mt-0.5 ${
                                            isAdmin ? 'text-secondary font-bold' : role === 'kasir' ? 'text-amber-600 font-bold' : 'text-on-surface-variant'
                                        }`}>{ucfirst(role)}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-secondary/10 hover:text-secondary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">person</span>
                                        Profil & Pesanan
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-red-50 transition-colors mt-0.5 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">logout</span>
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-3 py-1.5 text-xs font-mono font-bold text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-3.5 py-1.5 text-xs font-mono font-bold text-white bg-secondary hover:bg-secondary/90 rounded-lg shadow-sm transition-all"
                            >
                                Daftar Akun
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container"
                        aria-label="Toggle Mobile Menu"
                    >
                        <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-outline-variant/20 bg-surface-container-lowest px-4 py-3 space-y-1 fade-in">
                    {!isStaff ? (
                        <>
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Home</Link>
                            <Link href="/produk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Katalog Produk</Link>
                            <Link href="/lacak-servis" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Lacak Servis HP</Link>
                            <Link href="/pengantaran" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-sm text-secondary">two_wheeler</span> Lacak Driver
                            </Link>
                            <Link href="/booking-servis" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Booking Servis</Link>
                            <Link href="/promo" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Promo Spesial</Link>
                            <Link href="/keranjang" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-secondary font-bold">
                                🛒 Keranjang ({cartCount})
                            </Link>
                            {isLoggedIn ? (
                                <>
                                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Profil & Pesanan</Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-red-50 cursor-pointer">Keluar</button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-secondary">Masuk / Login</Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Dashboard</Link>
                            <Link href="/pos" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Penjualan POS</Link>
                            <Link href="/produk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Produk</Link>
                            <Link href="/servis" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Servis HP</Link>
                            <Link href="/pengantaran" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Pengantaran</Link>
                            <Link href="/riwayat" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Riwayat</Link>
                            {isAdmin && (
                                <>
                                    <Link href="/laporan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Laporan</Link>
                                    <Link href="/manajemen-user" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">Akun Terdaftar</Link>
                                </>
                            )}
                            <div className="pt-2 border-t border-outline-variant/20">
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-red-50 cursor-pointer"
                                >
                                    Keluar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

function ucfirst(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
