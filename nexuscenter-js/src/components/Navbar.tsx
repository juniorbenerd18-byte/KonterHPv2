'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { DataService } from '@/lib/store';
import { Role, UserProfile, Notification } from '@/types/database';

// Notification Dropdown Component
function NotificationDropdown({ isStaff, newTradeInCount, onClose }: { isStaff: boolean; newTradeInCount: number; onClose: () => void }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const notifs = await DataService.getNotifications();
            setNotifications(notifs);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await DataService.markNotificationRead(id);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getNotifIcon = (type: string) => {
        const icons: Record<string, string> = {
            'service': 'build',
            'sale': 'shopping_cart',
            'system': 'notifications'
        };
        return icons[type] || 'notifications';
    };

    const getNotifColor = (type: string, isRead: boolean) => {
        if (isRead) return 'bg-gray-100 text-gray-600';
        const colors: Record<string, string> = {
            'service': 'bg-purple-100 text-purple-700',
            'sale': 'bg-blue-100 text-blue-700',
            'system': 'bg-amber-100 text-amber-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-600';
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} hari yang lalu`;
    };

    const unreadCustomerNotifs = notifications.filter(n => !n.is_read);

    return (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 overflow-hidden fade-in">
            <div className="p-3.5 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-[18px] text-secondary icon-filled">notifications</span>
                    Notifikasi {isStaff && newTradeInCount > 0 ? `(${newTradeInCount})` : !isStaff && unreadCustomerNotifs.length > 0 ? `(${unreadCustomerNotifs.length})` : ''}
                </div>
                <button onClick={onClose} className="text-[11px] font-mono text-secondary hover:underline cursor-pointer">Tutup</button>
            </div>
            <div className="divide-y divide-outline-variant/10 max-h-80 overflow-y-auto">
                {/* Staff Trade-In Notification */}
                {isStaff && newTradeInCount > 0 && (
                    <Link href="/trade-in-admin" onClick={onClose} className="block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3 bg-amber-50/50">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-amber-100 text-amber-700 animate-pulse">
                            <span className="material-symbols-outlined text-[18px]">autorenew</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-xs text-primary truncate">{newTradeInCount} Booking Tukar Tambah Baru</p>
                            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">Ada booking trade-in yang menunggu taksir dan konfirmasi.</p>
                            <span className="font-mono text-[10px] text-amber-700 font-bold block mt-1">⚠️ Perlu ditindaklanjuti</span>
                        </div>
                    </Link>
                )}

                {/* Customer Notifications */}
                {!isStaff && unreadCustomerNotifs.map(notif => (
                    <Link 
                        key={notif.id} 
                        href={notif.link || '#'} 
                        onClick={() => { handleMarkAsRead(notif.id); onClose(); }}
                        className={`block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3 ${!notif.is_read ? 'bg-cyan-50/30' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getNotifColor(notif.type, notif.is_read)}`}>
                            <span className="material-symbols-outlined text-[18px]">{getNotifIcon(notif.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-xs text-primary truncate">{notif.title}</p>
                            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{notif.message}</p>
                            <span className="font-mono text-[10px] text-on-surface-variant opacity-70 block mt-1">{formatTime(notif.created_at)}</span>
                        </div>
                        {!notif.is_read && (
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0 mt-1"></span>
                        )}
                    </Link>
                ))}

                {/* Fallback Demo Notifications */}
                {!isStaff && unreadCustomerNotifs.length === 0 && (
                    <>
                        <Link href="/pengantaran" onClick={onClose} className="block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-700">
                                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-display font-bold text-xs text-primary truncate">Kurir Bergerak</p>
                                <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">Kurir Budi sedang mengantar pesanan INV-202609-0012.</p>
                                <span className="font-mono text-[10px] text-on-surface-variant opacity-70 block mt-1">5 menit yang lalu</span>
                            </div>
                        </Link>
                        <div className="p-3.5 text-center text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-3xl text-outline-variant block mb-2">notifications_off</span>
                            Tidak ada notifikasi baru
                        </div>
                    </>
                )}

                {/* Staff Demo Notifications */}
                {isStaff && (
                    <>
                        <Link href="/pengantaran" onClick={onClose} className="block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-700">
                                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-display font-bold text-xs text-primary truncate">Kurir Bergerak</p>
                                <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">Kurir Budi sedang mengantar pesanan INV-202609-0012.</p>
                                <span className="font-mono text-[10px] text-on-surface-variant opacity-70 block mt-1">5 menit yang lalu</span>
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<Role>('pengguna');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [tradeInDropdownOpen, setTradeInDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [newTradeInCount, setNewTradeInCount] = useState(0);
    const [customerNotifCount, setCustomerNotifCount] = useState(0);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const adminDropdownRef = useRef<HTMLDivElement>(null);
    const tradeInDropdownRef = useRef<HTMLDivElement>(null);

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

        const updateTradeInCount = async () => {
            const user = DataService.getCurrentUser();
            const userRole = user?.role || 'pengguna';
            if (userRole === 'admin' || userRole === 'kasir') {
                try {
                    const tradeIns = await DataService.getTradeIns();
                    const pendingCount = tradeIns.filter(t => t.status === 'Pending Taksir').length;
                    setNewTradeInCount(pendingCount);
                } catch {
                    setNewTradeInCount(0);
                }
            }
        };

        const updateCustomerNotifCount = async () => {
            const user = DataService.getCurrentUser();
            const userRole = user?.role || 'pengguna';
            if (userRole === 'pengguna') {
                try {
                    const notifs = await DataService.getNotifications();
                    const unreadCount = notifs.filter(n => !n.is_read).length;
                    setCustomerNotifCount(unreadCount);
                } catch {
                    setCustomerNotifCount(0);
                }
            }
        };

        updateCartCount();
        updateTradeInCount();
        updateCustomerNotifCount();
        const handleStorage = () => { syncAuth(); updateCartCount(); updateTradeInCount(); updateCustomerNotifCount(); };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(() => { syncAuth(); updateCartCount(); updateTradeInCount(); updateCustomerNotifCount(); }, 1500);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setNotificationOpen(false);
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(e.target as Node)) setAdminDropdownOpen(false);
            if (tradeInDropdownRef.current && !tradeInDropdownRef.current.contains(e.target as Node)) setTradeInDropdownOpen(false);
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
        `whitespace-nowrap flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isActive(path)
                ? 'text-secondary font-bold bg-secondary/10 shadow-xs'
                : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5'
        }`;

    const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || (role.charAt(0).toUpperCase());
    const userName = currentUser?.name || '';

    return (
        <header className="glass-nav fixed top-0 w-full z-50 no-print transition-colors duration-200">
            <div className="flex items-center justify-between px-3 sm:px-5 lg:px-8 py-3.5 max-w-[1720px] mx-auto w-full gap-2">

                {/* Brand Logo */}
                <Link
                    href={isStaff ? '/dashboard' : '/'}
                    className="flex items-center gap-2.5 group shrink-0 mr-1 lg:mr-3 xl:mr-5"
                >
                    <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-[22px]">memory</span>
                    </div>
                    <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-primary-container leading-none">
                        NexusCenter
                    </span>
                </Link>

                {/* Navigation Links — Clean single line with Admin Dropdown */}
                <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 font-sans flex-1 min-w-0">
                    {!isStaff ? (
                        <>
                            <Link href="/" className={navLinkClass('/')}>
                                <span className="material-symbols-outlined text-[15px]">home</span>
                                <span>Home</span>
                            </Link>
                            <Link href="/produk" className={navLinkClass('/produk')}>
                                <span className="material-symbols-outlined text-[15px]">storefront</span>
                                <span>Produk</span>
                            </Link>
                            <Link href="/pengantaran" className={navLinkClass('/pengantaran')}>
                                <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
                                <span>Lacak Driver</span>
                            </Link>
                            <Link href="/booking-servis" className={navLinkClass('/booking-servis')}>
                                <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                                <span>Booking Servis</span>
                            </Link>
                            
                            {/* Trade-In Dropdown */}
                            <div className="relative" ref={tradeInDropdownRef}>
                                <button
                                    onClick={() => setTradeInDropdownOpen(!tradeInDropdownOpen)}
                                    className={`whitespace-nowrap flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        isActive('/tukar-tambah')
                                            ? 'text-secondary font-bold bg-secondary/10 shadow-xs'
                                            : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[15px]">autorenew</span>
                                    <span>Tukar Tambah</span>
                                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                                </button>

                                {tradeInDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-surface border border-outline-variant/30 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <Link
                                            href="/tukar-tambah"
                                            onClick={() => setTradeInDropdownOpen(false)}
                                            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-secondary/10 transition-colors ${
                                                pathname === '/tukar-tambah' ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-secondary">add_circle</span>
                                            <span>Booking Tukar Tambah</span>
                                        </Link>
                                        <Link
                                            href="/tukar-tambah/lacak"
                                            onClick={() => setTradeInDropdownOpen(false)}
                                            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-secondary/10 transition-colors ${
                                                pathname === '/tukar-tambah/lacak' ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-secondary">search</span>
                                            <span>Lacak Status</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            <Link href="/pulsa" className={navLinkClass('/pulsa')}>
                                <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
                                <span>Pulsa &amp; Data</span>
                            </Link>
                            <Link href="/promo" className={navLinkClass('/promo')}>
                                <span className="material-symbols-outlined text-[15px]">local_offer</span>
                                <span>Promo</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                                <span className="material-symbols-outlined text-[15px]">space_dashboard</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/pos" className={navLinkClass('/pos')}>
                                <span className="material-symbols-outlined text-[15px]">point_of_sale</span>
                                <span>POS</span>
                            </Link>
                            <Link href="/produk" className={navLinkClass('/produk')}>
                                <span className="material-symbols-outlined text-[15px]">inventory_2</span>
                                <span>Produk</span>
                            </Link>
                            <Link href="/servis" className={navLinkClass('/servis')}>
                                <span className="material-symbols-outlined text-[15px]">build</span>
                                <span>Servis</span>
                            </Link>
                            <Link href="/trade-in-admin" className={navLinkClass('/trade-in-admin')}>
                                <span className="material-symbols-outlined text-[15px]">autorenew</span>
                                <span>Tukar</span>
                            </Link>
                            <Link href="/pengantaran" className={navLinkClass('/pengantaran')}>
                                <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
                                <span>Pengantaran</span>
                            </Link>
                            <Link href="/riwayat" className={navLinkClass('/riwayat')}>
                                <span className="material-symbols-outlined text-[15px]">history</span>
                                <span>Riwayat</span>
                            </Link>
                            {isAdmin && (
                                <div className="relative" ref={adminDropdownRef}>
                                    <button
                                        onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                                        className={`whitespace-nowrap flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            isActive('/laporan') || isActive('/manajemen-user')
                                                ? 'text-secondary font-bold bg-secondary/10 shadow-xs'
                                                : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                                        <span>Admin</span>
                                        <span className="material-symbols-outlined text-[14px]">expand_more</span>
                                    </button>

                                    {adminDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-outline-variant/30 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                            <Link
                                                href="/laporan"
                                                onClick={() => setAdminDropdownOpen(false)}
                                                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-secondary/10 transition-colors ${
                                                    isActive('/laporan') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[16px] text-secondary">bar_chart</span>
                                                <span>Laporan Transaksi</span>
                                            </Link>
                                            <Link
                                                href="/manajemen-user"
                                                onClick={() => setAdminDropdownOpen(false)}
                                                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-secondary/10 transition-colors ${
                                                    isActive('/manajemen-user') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
                                                <span>Akun Terdaftar</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            <span className="w-px h-4 bg-outline-variant/30 mx-0.5" />
                            <Link
                                href="/"
                                className="whitespace-nowrap flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all text-on-surface-variant hover:text-primary hover:bg-secondary/5 border border-outline-variant/30 hover:border-secondary/30"
                                title="Lihat tampilan toko seperti customer"
                            >
                                <span className="material-symbols-outlined text-[15px]">storefront</span>
                                <span className="hidden xl:inline">Toko</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Right Controls */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <Link
                        href="/produk"
                        aria-label="Search"
                        className="p-1.5 text-on-surface-variant hover:text-secondary transition-all rounded-full active:scale-95"
                        title="Cari Produk"
                    >
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/keranjang"
                        aria-label="Shopping Cart"
                        className="p-1.5 text-on-surface-variant hover:text-secondary relative transition-all rounded-full active:scale-95"
                        title="Keranjang Belanja"
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isActive('/keranjang') ? 'text-secondary' : ''}`}>
                            shopping_cart
                        </span>
                        {cartCount > 0 ? (
                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-mono font-bold text-white shadow-sm">
                                {cartCount}
                            </span>
                        ) : (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary"></span>
                        )}
                    </Link>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            className="p-1.5 text-on-surface-variant hover:text-secondary relative transition-all rounded-full active:scale-95 cursor-pointer"
                            title="Notifikasi"
                        >
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            {((isStaff && newTradeInCount > 0) || (!isStaff && customerNotifCount > 0)) && (
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-mono font-bold text-white shadow-md animate-pulse">
                                    {isStaff ? newTradeInCount : customerNotifCount}
                                </span>
                            )}
                        </button>

                        {notificationOpen && (
                            <NotificationDropdown 
                                isStaff={isStaff} 
                                newTradeInCount={newTradeInCount}
                                onClose={() => setNotificationOpen(false)}
                            />
                        )}
                    </div>

                    {/* Auth Pill */}
                    {isLoggedIn ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full border border-outline-variant/30 hover:border-secondary hover:bg-surface-container-high transition-all cursor-pointer"
                                title={`Profil: ${userName}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                                    isAdmin ? 'bg-secondary' : role === 'kasir' ? 'bg-amber-500' : 'bg-emerald-600'
                                }`}>
                                    {userInitial}
                                </div>
                                <span className="text-xs font-semibold text-on-surface max-w-[90px] truncate">{userName || ucfirst(role)}</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full hidden lg:inline ${
                                    isAdmin ? 'bg-secondary/15 text-secondary font-bold' :
                                    role === 'kasir' ? 'bg-amber-100 text-amber-800 font-bold' :
                                    'bg-surface-container-high text-on-surface-variant'
                                }`}>
                                    {ucfirst(role)}
                                </span>
                                <span className="material-symbols-outlined text-[15px] text-on-surface-variant">expand_more</span>
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
                                        Profil &amp; Pesanan
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
                        <div className="hidden md:flex items-center gap-1.5">
                            <Link
                                href="/login"
                                className="px-2.5 py-1.5 text-xs font-mono font-bold text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-secondary hover:bg-secondary/90 rounded-lg shadow-sm transition-all"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container"
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
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">home</span> Home
                            </Link>
                            <Link href="/produk" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">storefront</span> Katalog Produk
                            </Link>
                            <Link href="/pengantaran" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">two_wheeler</span> Lacak Driver
                            </Link>
                            <Link href="/booking-servis" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">calendar_month</span> Booking Servis
                            </Link>
                            <Link href="/tukar-tambah" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">autorenew</span> Tukar Tambah HP
                            </Link>
                            <Link href="/tukar-tambah/lacak" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">search</span> Lacak Tukar Tambah
                            </Link>
                            <Link href="/pulsa" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">signal_cellular_alt</span> Pulsa &amp; Data
                            </Link>
                            <Link href="/promo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">local_offer</span> Promo
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">space_dashboard</span> Dashboard
                            </Link>
                            <Link href="/pos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">point_of_sale</span> Penjualan POS
                            </Link>
                            <Link href="/produk" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">inventory_2</span> Produk
                            </Link>
                            <Link href="/servis" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">build</span> Servis HP
                            </Link>
                            <Link href="/trade-in-admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">autorenew</span> Tukar Tambah HP
                            </Link>
                            <Link href="/pengantaran" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">two_wheeler</span> Pengantaran
                            </Link>
                            <Link href="/riwayat" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                <span className="material-symbols-outlined text-base text-secondary">history</span> Riwayat Transaksi
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link href="/laporan" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                        <span className="material-symbols-outlined text-base text-secondary">bar_chart</span> Laporan &amp; Statistik
                                    </Link>
                                    <Link href="/manajemen-user" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-secondary/5">
                                        <span className="material-symbols-outlined text-base text-secondary">group</span> Akun Terdaftar
                                    </Link>
                                </>
                            )}
                            <div className="pt-2 border-t border-outline-variant/20">
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-secondary border border-secondary/20 hover:bg-secondary/5 mb-1"
                                >
                                    <span className="material-symbols-outlined text-base">storefront</span> Lihat Toko (Customer View)
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-red-50 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base">logout</span> Keluar
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
