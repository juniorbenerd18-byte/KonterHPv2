<!DOCTYPE html>
<html lang="id" class="light scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'TECHCELL — NexusCenter')</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "outline": "#76777d",
                        "secondary-fixed-dim": "#4cd7f6",
                        "on-primary-container": "#7c839b",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary-container": "#3980f4",
                        "secondary-fixed": "#acedff",
                        "tertiary-fixed": "#d8e2ff",
                        "tertiary-fixed-dim": "#adc6ff",
                        "primary-container": "#131b2e",
                        "background": "#f7f9fb",
                        "on-surface": "#191c1e",
                        "secondary": "#00687a",
                        "on-surface-variant": "#45464d",
                        "error": "#ba1a1a",
                        "primary-fixed": "#dae2fd",
                        "on-secondary": "#ffffff",
                        "surface": "#f7f9fb",
                        "inverse-surface": "#2d3133",
                        "primary": "#000000",
                        "inverse-primary": "#bec6e0",
                        "surface-tint": "#565e74",
                        "primary-fixed-dim": "#bec6e0",
                        "on-tertiary-fixed-variant": "#004395",
                        "tertiary-container": "#001a42",
                        "on-secondary-fixed": "#001f26",
                        "surface-dim": "#d8dadc",
                        "on-primary": "#ffffff",
                        "outline-variant": "#c6c6cd",
                        "secondary-container": "#57dffe",
                        "surface-container": "#eceef0",
                        "on-tertiary": "#ffffff",
                        "on-primary-fixed": "#131b2e",
                        "surface-container-high": "#e6e8ea",
                        "surface-variant": "#e0e3e5",
                        "on-primary-fixed-variant": "#3f465c",
                        "on-secondary-container": "#006172",
                        "surface-container-low": "#f2f4f6",
                        "surface-bright": "#f7f9fb",
                        "tertiary": "#000000",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "inverse-on-surface": "#eff1f3",
                        "error-container": "#ffdad6",
                        "on-tertiary-fixed": "#001a42",
                        "on-background": "#191c1e",
                        "on-secondary-fixed-variant": "#004e5c",
                        "surface-container-highest": "#e0e3e5"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "margin-mobile": "20px",
                        "gutter": "24px",
                        "container-max-width": "1280px",
                        "margin-desktop": "80px",
                        "unit": "4px"
                    },
                    fontFamily: {
                        "display": ["Hanken Grotesk", "sans-serif"],
                        "body": ["Inter", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
    </script>

    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.icon-filled {
            font-variation-settings: 'FILL' 1;
        }
        body { font-family: 'Inter', sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Hanken Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        /* Circuit pattern overlay */
        .circuit-pattern {
            background-image: radial-gradient(circle at 2px 2px, rgba(87, 223, 254, 0.1) 1px, transparent 0);
            background-size: 32px 32px;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-nav {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(247, 249, 251, 0.85);
            border-bottom: 1px solid rgba(198, 198, 205, 0.3);
        }

        /* Animations */
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* Toast animations */
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(110%); opacity: 0; } }
        .toast-enter { animation: slideIn 0.3s ease; }
        .toast-exit  { animation: slideOut 0.3s ease forwards; }

        @media print {
            .no-print { display: none !important; }
            body { background: white; }
        }
    </style>
    @stack('styles')
</head>
<body class="bg-background text-on-background font-body antialiased selection:bg-secondary selection:text-white">

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-20 right-4 z-[9999] space-y-2 no-print"></div>

    <!-- Top Navigation Bar -->
    <header class="glass-nav fixed top-0 w-full z-50 no-print transition-colors duration-200">
        <div class="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3.5 max-w-[1440px] mx-auto w-full">
            <!-- Brand -->
            <a href="{{ auth()->check() && auth()->user()->isStaff() ? route('dashboard') : url('/') }}" class="flex items-center gap-2.5 group shrink-0">
                <div class="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shadow-sm">
                    <span class="material-symbols-outlined text-secondary-fixed-dim text-[22px]">memory</span>
                </div>
                <span class="font-display font-extrabold text-[22px] tracking-tight text-primary-container leading-none">
                    TECHCELL <span class="text-secondary font-bold text-sm text-outline tracking-normal font-mono">NexusCenter</span>
                </span>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-4 font-sans">
                @auth
                    @if(auth()->user()->isPengguna())
                        <a href="{{ url('/') }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->is('/') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Home
                        </a>
                        <a href="{{ route('products.index', ['category' => 'smartphone']) }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->fullUrlIs('*category=smartphone*') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Smartphone
                        </a>
                        <a href="{{ route('products.index', ['category' => 'aksesoris']) }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->fullUrlIs('*category=aksesoris*') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Aksesoris
                        </a>
                        <a href="{{ route('pulsa.index') }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('pulsa.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Pulsa & Data
                        </a>
                        <a href="{{ route('services.track') }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('services.track') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Lacak Servis
                        </a>
                        <a href="{{ route('delivery.userIndex') }}" class="whitespace-nowrap flex items-center gap-1 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('delivery.userIndex') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[16px]">two_wheeler</span> Lacak Driver
                        </a>
                        <a href="{{ route('services.booking') }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('services.booking') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Booking Servis
                        </a>
                        <a href="{{ route('promos.index') }}" class="whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('promos.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            Promo
                        </a>
                    @else
                        <a href="{{ route('dashboard') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('dashboard') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">home</span> Dashboard
                        </a>
                        <a href="{{ route('sales.index') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('sales.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">point_of_sale</span> Penjualan POS
                        </a>
                        <a href="{{ route('products.index') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('products.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">inventory_2</span> Produk
                        </a>
                        <a href="{{ route('services.index') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('services.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">build</span> Servis
                        </a>
                        <a href="{{ route('delivery.index') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('delivery.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">two_wheeler</span> Pengantaran
                        </a>
                        <a href="{{ route('history.index') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('history.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">history</span> Riwayat
                        </a>
                        @if(auth()->user()->isAdmin())
                        <a href="{{ route('reports.index') }}" class="whitespace-nowrap flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded text-xs lg:text-sm font-medium transition-all {{ request()->routeIs('reports.index') ? 'text-secondary font-bold bg-secondary/10' : 'text-on-surface-variant hover:text-primary hover:bg-secondary/5' }}">
                            <span class="material-symbols-outlined text-[18px]">bar_chart</span> Laporan
                        </a>
                        @endif
                    @endif
                @endauth
            </nav>

            <!-- Right Controls (Search, Cart with Badge, Profile/Auth) -->
            <div class="flex items-center gap-3">
                <a href="{{ route('products.index') }}" aria-label="Search" class="p-2 text-on-surface-variant hover:text-secondary transition-all rounded-full active:scale-95">
                    <span class="material-symbols-outlined text-[22px]">search</span>
                </a>

                @php
                    $cartCount = count(session('cart', []));
                @endphp
                <a href="{{ route('cart.index') }}" aria-label="Shopping Cart" class="p-2 text-on-surface-variant hover:text-secondary relative transition-all rounded-full active:scale-95" title="Keranjang Belanja">
                    <span class="material-symbols-outlined text-[22px] {{ request()->routeIs('cart.index') ? 'text-secondary font-bold' : '' }}">shopping_cart</span>
                    @if($cartCount > 0)
                        <span class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-mono font-bold text-white shadow-sm">
                            {{ $cartCount }}
                        </span>
                    @else
                        <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary"></span>
                    @endif
                </a>

                @auth
                    @php
                        $unreadNotifications = \App\Models\Notification::where('is_read', false)->latest()->take(6)->get();
                        $unreadCount = \App\Models\Notification::where('is_read', false)->count();
                    @endphp
                    <div class="relative">
                        <button onclick="toggleNotificationDropdown()" class="p-2 text-on-surface-variant hover:text-secondary relative transition-all rounded-full active:scale-95" title="Notifikasi Baru">
                            <span class="material-symbols-outlined text-[22px]">notifications</span>
                            @if($unreadCount > 0)
                                <span class="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-mono font-bold text-white shadow-md animate-pulse">
                                    {{ $unreadCount > 9 ? '9+' : $unreadCount }}
                                </span>
                            @endif
                        </button>
                        <div id="notification-dropdown" class="hidden absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-50 overflow-hidden fade-in">
                            <div class="p-3.5 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
                                <div class="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
                                    <span class="material-symbols-outlined text-[18px] text-secondary icon-filled">notifications</span>
                                    Notifikasi ({{ $unreadCount }})
                                </div>
                                @if($unreadCount > 0)
                                @if(auth()->user()->isStaff())
                                <form method="POST" action="{{ route('notifications.readAll') }}">
                                    @csrf
                                    <button type="submit" class="text-[11px] font-mono text-secondary hover:underline">Tandai Semua Dibaca</button>
                                </form>
                                @endif
                                @endif
                            </div>
                            <div class="divide-y divide-outline-variant/10 max-h-80 overflow-y-auto">
                                @forelse($unreadNotifications as $notif)
                                @if(auth()->user()->isStaff())
                                <form method="POST" action="{{ route('notifications.read', $notif) }}" class="block">
                                    @csrf
                                    <button type="submit" class="w-full text-left p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3">
                                @else
                                <a href="{{ $notif->link ?: '#' }}" class="block p-3.5 hover:bg-secondary/5 transition-colors flex items-start gap-3">
                                @endif
                                        <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 {{ $notif->type === 'sale' ? 'bg-green-100 text-green-700' : ($notif->type === 'delivery' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700') }}">
                                            <span class="material-symbols-outlined text-[18px]">{{ $notif->type === 'sale' ? 'shopping_cart' : ($notif->type === 'delivery' ? 'two_wheeler' : 'build') }}</span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-display font-bold text-xs text-primary truncate">{{ $notif->title }}</p>
                                            <p class="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{{ $notif->message }}</p>
                                            <span class="font-mono text-[10px] text-on-surface-variant opacity-70 block mt-1">{{ $notif->created_at->diffForHumans() }}</span>
                                        </div>
                                @if(auth()->user()->isStaff())
                                    </button>
                                </form>
                                @else
                                </a>
                                @endif
                                @empty
                                <div class="p-6 text-center text-xs font-mono text-on-surface-variant">
                                    Tidak ada notifikasi baru.
                                </div>
                                @endforelse
                            </div>
                        </div>
                    </div>

                    <a href="{{ route('profile.index') }}" class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/30 hover:border-secondary hover:bg-surface-container-high transition-all" title="Lihat Profil & Riwayat Pesanan">
                        @if(auth()->user()->avatar)
                            <img src="{{ Storage::url(auth()->user()->avatar) }}" alt="{{ auth()->user()->name }}" class="w-6 h-6 rounded-full object-cover shadow-sm">
                        @else
                            <div class="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-xs">
                                {{ substr(auth()->user()->name, 0, 1) }}
                            </div>
                        @endif
                        <span class="text-sm font-medium text-on-surface">{{ auth()->user()->name }}</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full {{ auth()->user()->isAdmin() ? 'bg-secondary/15 text-secondary font-bold' : (auth()->user()->isKasir() ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-surface-container-high text-on-surface-variant') }}">
                            {{ ucfirst(auth()->user()->role) }}
                        </span>
                    </a>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="flex items-center gap-1.5 px-3 py-2 text-sm text-on-surface-variant hover:text-error hover:bg-red-50 rounded-lg transition-all" title="Keluar">
                            <span class="material-symbols-outlined text-[20px]">logout</span>
                            <span class="hidden md:inline">Keluar</span>
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="p-2 text-on-surface-variant hover:text-secondary rounded-full active:scale-95" title="Masuk">
                        <span class="material-symbols-outlined text-[22px]">person</span>
                    </a>
                @endauth

                <!-- Mobile Menu Toggle -->
                <button onclick="toggleMobileMenu()" class="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            </div>
        </div>

        <!-- Mobile Nav Menu -->
        <div id="mobile-menu" class="hidden md:hidden border-t border-outline-variant/20 bg-surface-container-lowest px-4 py-3 space-y-2">
            @auth
                @if(auth()->user()->isPengguna())
                    <a href="{{ url('/') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Home</a>
                    <a href="{{ route('products.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Katalog Produk</a>
                    <a href="{{ route('pulsa.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Pulsa & Data</a>
                    <a href="{{ route('services.track') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Lacak Servis HP</a>
                    <a href="{{ route('delivery.userIndex') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface flex items-center gap-1"><span class="material-symbols-outlined text-sm text-secondary">two_wheeler</span> Lacak Driver</a>
                    <a href="{{ route('services.booking') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Booking Servis</a>
                    <a href="{{ route('promos.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Promo Spesial</a>
                    <a href="{{ route('cart.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-secondary font-bold">🛒 Keranjang Belanja</a>
                    <a href="{{ route('profile.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Profil & Pesanan</a>
                @else
                    <a href="{{ route('dashboard') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Dashboard</a>
                    <a href="{{ route('sales.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Penjualan POS</a>
                    <a href="{{ route('products.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Produk</a>
                    <a href="{{ route('services.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Servis HP</a>
                    <a href="{{ route('history.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Riwayat</a>
                    @if(auth()->user()->isAdmin())
                        <a href="{{ route('reports.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Laporan</a>
                    @endif
                @endif
            @else
                <a href="{{ url('/') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Home</a>
                <a href="{{ route('products.index') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Katalog Produk</a>
                <a href="{{ route('services.track') }}" class="block px-3 py-2 rounded text-sm font-medium text-on-surface">Lacak Servis HP</a>
                <a href="{{ route('login') }}" class="block px-3 py-2 rounded text-sm font-semibold text-secondary">Masuk / Login</a>
            @endauth
        </div>
    </header>

    <!-- Main Content -->
    <main class="pt-16 min-h-screen">
        @if(session('success'))
            <script>document.addEventListener('DOMContentLoaded', () => showToast('{{ session('success') }}', 'success'));</script>
        @endif
        @if(session('error'))
            <script>document.addEventListener('DOMContentLoaded', () => showToast('{{ session('error') }}', 'error'));</script>
        @endif
        @if(session('info'))
            <script>document.addEventListener('DOMContentLoaded', () => showToast('{{ session('info') }}', 'info'));</script>
        @endif

        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-primary-container text-on-primary-fixed w-full border-t border-outline-variant/10 no-print mt-20">
        <div class="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
                <div class="col-span-1 md:col-span-1 flex flex-col items-start">
                    <a class="font-display text-xl font-extrabold text-secondary-fixed flex items-center gap-2 mb-3" href="#">
                        <span class="material-symbols-outlined text-secondary-fixed text-2xl">memory</span>
                        TECHCELL <span class="text-xs text-secondary-fixed-dim font-mono font-normal">NexusCenter</span>
                    </a>
                    <p class="text-on-primary-container opacity-80 text-sm mb-4 font-mono">Expert Connectivity & Smart Service Management.</p>
                </div>
                <div class="flex flex-col gap-2.5">
                    <h4 class="font-mono text-xs text-secondary-fixed font-bold uppercase tracking-wider mb-1">Layanan</h4>
                    <a href="{{ route('products.index', ['category' => 'smartphone']) }}" class="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Smartphone Baru</a>
                    <a href="{{ route('products.index', ['category' => 'aksesoris']) }}" class="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Aksesoris Original</a>
                    <a href="{{ route('pulsa.index') }}" class="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Pulsa & Paket Data</a>
                    <a href="{{ route('services.track') }}" class="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Lacak Servis HP</a>
                </div>
                <div class="flex flex-col gap-2.5">
                    <h4 class="font-mono text-xs text-secondary-fixed font-bold uppercase tracking-wider mb-1">Bantuan</h4>
                    <span class="text-on-primary-container text-sm opacity-80">WhatsApp: +62 812-3456-7890</span>
                    <span class="text-on-primary-container text-sm opacity-80">Email: support@techcell.id</span>
                    <span class="text-on-primary-container text-sm opacity-80">Buka Setiap Hari: 09.00 - 21.00 WIB</span>
                </div>
                <div class="flex flex-col gap-2.5">
                    <h4 class="font-mono text-xs text-secondary-fixed font-bold uppercase tracking-wider mb-1">Lokasi Toko</h4>
                    <p class="text-on-primary-container text-sm opacity-80 leading-relaxed">Jl. Raya Counter No. 88, Central Tech City, Indonesia.</p>
                </div>
            </div>
            <div class="border-t border-on-primary-container/20 pt-6 flex flex-col md:flex-row justify-between items-center text-on-primary-container text-xs opacity-70 font-mono">
                <p>© {{ date('Y') }} TECHCELL NexusCenter. All rights reserved.</p>
                <div class="flex gap-4 mt-3 md:mt-0 items-center">
                    <span class="material-symbols-outlined text-[20px]">payments</span>
                    <span class="material-symbols-outlined text-[20px]">credit_card</span>
                    <span class="material-symbols-outlined text-[20px]">qr_code_2</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Global JS -->
    <script>
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };
        const colors = {
            success: 'bg-green-50 border-green-200 text-green-800',
            error:   'bg-red-50 border-red-200 text-red-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            info:    'bg-blue-50 border-blue-200 text-blue-800',
        };
        const toast = document.createElement('div');
        toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-sm toast-enter ${colors[type] || colors.info}`;
        toast.innerHTML = `
            <span class="material-symbols-outlined icon-filled text-xl flex-shrink-0">${icons[type] || icons.info}</span>
            <span class="text-sm font-medium flex-1">${message}</span>
            <button onclick="this.parentElement.remove()" class="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
                <span class="material-symbols-outlined text-base">close</span>
            </button>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function toggleMobileMenu() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    }

    function toggleNotificationDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }

    function formatRupiah(num) {
        return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    </script>
    @stack('scripts')
</body>
</html>
