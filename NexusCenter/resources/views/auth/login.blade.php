<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — NexusCenter</title>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    'primary-container': '#131b2e',
                    'secondary': '#00687a',
                    'secondary-fixed-dim': '#4cd7f6',
                    'outline-variant': '#c6c6cd',
                    'surface-container': '#eceef0',
                    'on-surface-variant': '#45464d',
                },
                fontFamily: {
                    'display': ['Hanken Grotesk', 'sans-serif'],
                    'body': ['Inter', 'sans-serif'],
                    'mono': ['JetBrains Mono', 'monospace'],
                }
            }
        }
    }
    </script>
    <style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { font-family: 'Inter', sans-serif; }
        .circuit-bg {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234cd7f6' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 3s ease-in-out infinite; }
    </style>
</head>
<body class="min-h-screen bg-primary-container circuit-bg flex items-center justify-center p-4">

    <!-- Decorative blobs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-fixed-dim/5 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
        <!-- Logo & Brand -->
        <div class="text-center mb-8 float">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-2xl border border-secondary/30 mb-4">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">smartphone</span>
            </div>
            <h1 class="font-display text-4xl font-extrabold text-white tracking-tight">
                Nexus<span class="text-secondary-fixed-dim">Center</span>
            </h1>
            <p class="text-white/50 mt-1 font-mono text-xs tracking-wider uppercase">Smart POS & Service Management</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
            <h2 class="font-display text-xl font-bold text-white mb-1">Selamat Datang</h2>
            <p class="text-white/50 text-sm mb-6">Masuk ke akun Anda untuk melanjutkan</p>

            <form method="POST" action="{{ route('login.post') }}" class="space-y-4">
                @csrf

                <!-- Name -->
                <div>
                    <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">person</span>
                        <input type="text" name="name" id="name" value="{{ old('name') }}" required
                            placeholder="Masukkan nama Anda"
                            class="w-full bg-white/10 border {{ $errors->has('name') ? 'border-red-400' : 'border-white/20' }} rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                    </div>
                    @error('name')
                        <p class="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <span class="material-symbols-outlined text-base">error</span>{{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Password</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">lock</span>
                        <input type="password" name="password" id="password" required
                            placeholder="Masukkan password"
                            class="w-full bg-white/10 border {{ $errors->has('password') ? 'border-red-400' : 'border-white/20' }} rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                        <button type="button" onclick="togglePw()" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                            <span class="material-symbols-outlined text-[20px]" id="pw-icon">visibility_off</span>
                        </button>
                    </div>
                    @error('password')
                        <p class="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <span class="material-symbols-outlined text-base">error</span>{{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Remember Me -->
                <div class="flex items-center gap-2">
                    <input type="checkbox" name="remember" id="remember" class="w-4 h-4 rounded bg-white/10 border-white/20 text-secondary-fixed-dim focus:ring-secondary-fixed-dim/30">
                    <label for="remember" class="text-white/60 text-sm">Ingat saya</label>
                </div>

                <!-- Submit -->
                <button type="submit"
                    class="w-full bg-secondary hover:bg-secondary/90 text-white font-display font-bold py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,104,122,0.4)] active:scale-[0.98] mt-2 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">login</span>
                    Masuk ke Sistem
                </button>
            </form>

            <!-- Register link & Hint -->
            <div class="mt-6 pt-6 border-t border-white/10 text-center space-y-2">
                <p class="text-white/70 text-xs">
                    Belum punya akun?
                    <a href="{{ route('register') }}" class="text-secondary-fixed-dim font-bold hover:underline ml-1">
                        Daftar Akun Baru (Gratis) &rarr;
                    </a>
                </p>
                <p class="text-white/40 text-[11px] font-mono">
                    Admin atau Staff masuk dengan akun masing-masing
                </p>
            </div>
        </div>

        <!-- Footer hint -->
        <p class="text-center text-white/30 text-xs mt-6 font-mono">NexusCenter v1.0 · Smart Counter & Service</p>
    </div>

    <script>
    function togglePw() {
        const input = document.getElementById('password');
        const icon  = document.getElementById('pw-icon');
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility_off';
        }
    }
    </script>
</body>
</html>
