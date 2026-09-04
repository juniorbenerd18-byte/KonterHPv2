<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Akun Baru — NexusCenter</title>
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
<body class="min-h-screen bg-primary-container circuit-bg flex items-center justify-center p-4 py-12">

    <!-- Decorative blobs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-fixed-dim/5 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-lg relative z-10">
        <!-- Logo & Brand -->
        <div class="text-center mb-6 float">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-2xl border border-secondary/30 mb-3">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">person_add</span>
            </div>
            <h1 class="font-display text-3xl font-extrabold text-white tracking-tight">
                Nexus<span class="text-secondary-fixed-dim">Center</span>
            </h1>
            <p class="text-white/50 mt-1 font-mono text-xs tracking-wider uppercase">Registrasi Akun Pelanggan Baru</p>
        </div>

        <!-- Register Card -->
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 space-y-5">
            <div>
                <h2 class="font-display text-xl font-bold text-white mb-1">Buat Akun Baru</h2>
                <p class="text-white/50 text-xs">Daftar sekarang untuk kemudahan pemesanan, lacak servis & belanja online.</p>
            </div>

            <form method="POST" action="{{ route('register.post') }}" class="space-y-4">
                @csrf

                <!-- Name -->
                <div>
                    <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Nama Lengkap *</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">person</span>
                        <input type="text" name="name" value="{{ old('name') }}" required
                            placeholder="Contoh: Budi Santoso"
                            class="w-full bg-white/10 border {{ $errors->has('name') ? 'border-red-400' : 'border-white/20' }} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                    </div>
                    @error('name')
                        <p class="text-red-400 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Alamat Email *</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">mail</span>
                        <input type="email" name="email" value="{{ old('email') }}" required
                            placeholder="nama@email.com"
                            class="w-full bg-white/10 border {{ $errors->has('email') ? 'border-red-400' : 'border-white/20' }} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                    </div>
                    @error('email')
                        <p class="text-red-400 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password & Confirm Password -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Password *</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">lock</span>
                            <input type="password" name="password" required placeholder="Minimal 6 karakter"
                                class="w-full bg-white/10 border {{ $errors->has('password') ? 'border-red-400' : 'border-white/20' }} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                        </div>
                        @error('password')
                            <p class="text-red-400 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                    <div>
                        <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Konfirmasi Password *</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">lock_reset</span>
                            <input type="password" name="password_confirmation" required placeholder="Ulangi password"
                                class="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                        </div>
                    </div>
                </div>

                <!-- Phone (Optional) -->
                <div>
                    <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">No. HP / WhatsApp (Opsional)</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">call</span>
                        <input type="text" name="phone" value="{{ old('phone') }}"
                            placeholder="081234567890"
                            class="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">
                    </div>
                </div>

                <!-- Address (Optional) -->
                <div>
                    <label class="block text-white/70 text-xs font-mono uppercase tracking-wider mb-1.5">Alamat Lengkap (Opsional)</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-3 text-white/40 text-[20px]">location_on</span>
                        <textarea name="address" rows="2" placeholder="Alamat rumah / pengiriman..."
                            class="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-secondary-fixed-dim focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all text-sm">{{ old('address') }}</textarea>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                    class="w-full bg-secondary hover:bg-secondary/90 text-white font-display font-bold py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,104,122,0.4)] active:scale-[0.98] mt-2 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
                    Daftar Sekarang
                </button>
            </form>

            <div class="pt-4 border-t border-white/10 text-center">
                <p class="text-white/60 text-xs">
                    Sudah mempunyai akun?
                    <a href="{{ route('login') }}" class="text-secondary-fixed-dim font-bold hover:underline ml-1">
                        Masuk di Sini &rarr;
                    </a>
                </p>
            </div>
        </div>

        <p class="text-center text-white/30 text-xs mt-6 font-mono">NexusCenter v1.0 · Smart Counter & Service</p>
    </div>
</body>
</html>
