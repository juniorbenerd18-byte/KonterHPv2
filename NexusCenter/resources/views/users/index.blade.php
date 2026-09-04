@extends('layouts.app')
@section('title', 'Manajemen Akun Terdaftar — TECHCELL NexusCenter')

@section('content')
<div class="space-y-6">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-card">
        <div>
            <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-secondary text-2xl">group</span>
                <h1 class="font-display font-extrabold text-2xl text-on-surface">Manajemen Akun Terdaftar</h1>
            </div>
            <p class="text-xs font-mono text-on-surface-variant">Kelola daftar seluruh pengguna, kasir, dan admin yang terdaftar di sistem.</p>
        </div>

        <button onclick="openAddUserModal()" class="bg-secondary hover:bg-secondary/90 text-white px-5 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 w-fit">
            <span class="material-symbols-outlined text-lg">person_add</span>
            + Tambah Akun Baru
        </button>
    </div>

    <!-- Summary Stats Widgets -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
            <span class="text-on-surface-variant font-mono text-[11px] uppercase block">Total Akun</span>
            <strong class="font-display font-extrabold text-2xl text-primary">{{ $stats['total'] }}</strong>
            <span class="text-[10px] font-mono text-emerald-600 block">✓ {{ $stats['active'] }} Aktif</span>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
            <span class="text-on-surface-variant font-mono text-[11px] uppercase block">Pengguna</span>
            <strong class="font-display font-extrabold text-2xl text-secondary">{{ $stats['pengguna'] }}</strong>
            <span class="text-[10px] font-mono text-on-surface-variant block">Pelanggan Toko</span>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
            <span class="text-on-surface-variant font-mono text-[11px] uppercase block">Kasir</span>
            <strong class="font-display font-extrabold text-2xl text-amber-600">{{ $stats['kasir'] }}</strong>
            <span class="text-[10px] font-mono text-on-surface-variant block">Staff POS</span>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
            <span class="text-on-surface-variant font-mono text-[11px] uppercase block">Admin</span>
            <strong class="font-display font-extrabold text-2xl text-purple-600">{{ $stats['admin'] }}</strong>
            <span class="text-[10px] font-mono text-on-surface-variant block">Akses Penuh</span>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1 col-span-2 md:col-span-1">
            <span class="text-on-surface-variant font-mono text-[11px] uppercase block">Status Sistem</span>
            <strong class="font-display font-extrabold text-xl text-emerald-600">Online</strong>
            <span class="text-[10px] font-mono text-on-surface-variant block">Semua User Terhubung</span>
        </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Role Filter Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <a href="{{ route('users.index', array_merge(request()->query(), ['role' => 'all'])) }}"
               class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all {{ request('role', 'all') === 'all' ? 'bg-secondary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' }}">
                Semua Role ({{ $stats['total'] }})
            </a>
            <a href="{{ route('users.index', array_merge(request()->query(), ['role' => 'pengguna'])) }}"
               class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all {{ request('role') === 'pengguna' ? 'bg-secondary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' }}">
                Pengguna ({{ $stats['pengguna'] }})
            </a>
            <a href="{{ route('users.index', array_merge(request()->query(), ['role' => 'kasir'])) }}"
               class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all {{ request('role') === 'kasir' ? 'bg-amber-600 text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' }}">
                Kasir ({{ $stats['kasir'] }})
            </a>
            <a href="{{ route('users.index', array_merge(request()->query(), ['role' => 'admin'])) }}"
               class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all {{ request('role') === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' }}">
                Admin ({{ $stats['admin'] }})
            </a>
        </div>

        <!-- Search Input -->
        <form method="GET" action="{{ route('users.index') }}" class="flex items-center gap-2 w-full md:w-auto">
            @if(request('role'))
                <input type="hidden" name="role" value="{{ request('role') }}">
            @endif
            <div class="relative w-full md:w-64">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari nama, email, HP..."
                    class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-secondary">
            </div>
            <button type="submit" class="bg-secondary text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold hover:bg-secondary/90 transition-all">
                Cari
            </button>
        </form>
    </div>

    <!-- Users Table -->
    <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container-low border-b border-outline-variant/20 font-mono text-[11px] uppercase text-on-surface-variant">
                        <th class="p-4">Pengguna</th>
                        <th class="p-4">Email</th>
                        <th class="p-4">No. HP</th>
                        <th class="p-4">Role</th>
                        <th class="p-4">Terdaftar</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/10 text-xs">
                    @forelse($users as $user)
                    <tr class="hover:bg-surface-container-low/50 transition-colors">
                        <!-- Name & Avatar -->
                        <td class="p-4">
                            <div class="flex items-center gap-3">
                                @if($user->avatar)
                                    <img src="{{ Storage::url($user->avatar) }}" class="w-9 h-9 rounded-full object-cover border border-outline-variant/30">
                                @else
                                    <div class="w-9 h-9 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center font-mono">
                                        {{ strtoupper(substr($user->name, 0, 1)) }}
                                    </div>
                                @endif
                                <div>
                                    <strong class="font-display font-bold text-on-surface text-sm block">{{ $user->name }}</strong>
                                    <span class="text-[10px] font-mono text-on-surface-variant">ID: #USR-{{ str_pad($user->id, 4, '0', STR_PAD_LEFT) }}</span>
                                </div>
                            </div>
                        </td>

                        <!-- Email -->
                        <td class="p-4 font-mono text-on-surface-variant">
                            {{ $user->email }}
                        </td>

                        <!-- Phone -->
                        <td class="p-4 font-mono">
                            {{ $user->phone ?? '-' }}
                        </td>

                        <!-- Role -->
                        <td class="p-4">
                            @if($user->isAdmin())
                                <span class="px-2.5 py-1 bg-purple-100 text-purple-800 font-mono font-bold text-[10px] rounded-full border border-purple-200 uppercase">
                                    👑 Admin
                                </span>
                            @elseif($user->isKasir())
                                <span class="px-2.5 py-1 bg-amber-100 text-amber-800 font-mono font-bold text-[10px] rounded-full border border-amber-200 uppercase">
                                    💳 Kasir
                                </span>
                            @else
                                <span class="px-2.5 py-1 bg-cyan-100 text-cyan-800 font-mono font-bold text-[10px] rounded-full border border-cyan-200 uppercase">
                                    👤 Pengguna
                                </span>
                            @endif
                        </td>

                        <!-- Registered Date -->
                        <td class="p-4 font-mono text-on-surface-variant text-[11px]">
                            {{ $user->created_at ? $user->created_at->format('d M Y H:i') : '-' }}
                        </td>

                        <!-- Status -->
                        <td class="p-4">
                            @if($user->is_active)
                                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded-full border border-emerald-200">
                                    Aktif
                                </span>
                            @else
                                <span class="px-2 py-0.5 bg-red-100 text-red-800 font-mono font-bold text-[10px] rounded-full border border-red-200">
                                    Nonaktif
                                </span>
                            @endif
                        </td>

                        <!-- Actions -->
                        <td class="p-4 text-center">
                            <div class="flex items-center justify-center gap-1.5">
                                <!-- Toggle Status -->
                                @if(auth()->id() !== $user->id)
                                <form method="POST" action="{{ route('users.toggleStatus', $user) }}">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit" class="p-1.5 rounded-lg border {{ $user->is_active ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' }}"
                                            title="{{ $user->is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun' }}">
                                        <span class="material-symbols-outlined text-[16px]">{{ $user->is_active ? 'block' : 'check_circle' }}</span>
                                    </button>
                                </form>

                                <!-- Delete -->
                                <form method="POST" action="{{ route('users.destroy', $user) }}" onsubmit="return confirm('Apakah Anda yakin ingin menghapus akun {{ $user->name }}?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg" title="Hapus Akun">
                                        <span class="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </form>
                                @else
                                <span class="text-[10px] font-mono text-gray-400 italic">Akun Anda</span>
                                @endif
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="p-8 text-center text-on-surface-variant font-mono text-xs">
                            Tidak ditemukan akun terdaftar dengan kriteria pencarian ini.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="p-4 border-t border-outline-variant/20 bg-surface-container-low">
            {{ $users->links() }}
        </div>
    </div>

</div>

<!-- Modal Tambah Akun Baru oleh Admin -->
<div id="add-user-modal" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-surface-container-lowest rounded-3xl p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 class="font-display font-bold text-base text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">person_add</span>
                Tambah Akun Pengguna / Staff Baru
            </h3>
            <button onclick="closeAddUserModal()" class="text-on-surface-variant hover:text-error">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <form method="POST" action="{{ route('users.store') }}" class="space-y-3 font-sans text-xs">
            @csrf

            <div>
                <label class="block font-mono text-on-surface-variant mb-1">Nama Lengkap *</label>
                <input type="text" name="name" required placeholder="Contoh: Ahmad Kasir"
                       class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface">
            </div>

            <div>
                <label class="block font-mono text-on-surface-variant mb-1">Email *</label>
                <input type="email" name="email" required placeholder="nama@nexuscenter.id"
                       class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface">
            </div>

            <div>
                <label class="block font-mono text-on-surface-variant mb-1">Password *</label>
                <input type="password" name="password" required placeholder="Minimal 6 karakter"
                       class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface">
            </div>

            <div>
                <label class="block font-mono text-on-surface-variant mb-1">Role Akun *</label>
                <select name="role" required class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface">
                    <option value="pengguna">Pengguna (Pelanggan)</option>
                    <option value="kasir">Kasir (Staff POS)</option>
                    <option value="admin">Admin (Akses Penuh)</option>
                </select>
            </div>

            <div>
                <label class="block font-mono text-on-surface-variant mb-1">No. HP (Opsional)</label>
                <input type="text" name="phone" placeholder="081234567890"
                       class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface">
            </div>

            <div class="pt-2 flex justify-end gap-2">
                <button type="button" onclick="closeAddUserModal()" class="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl font-mono text-xs font-bold">
                    Batal
                </button>
                <button type="submit" class="px-4 py-2 bg-secondary text-white rounded-xl font-mono text-xs font-bold shadow-md hover:bg-secondary/90">
                    Simpan Akun
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function openAddUserModal() {
    document.getElementById('add-user-modal').classList.remove('hidden');
}
function closeAddUserModal() {
    document.getElementById('add-user-modal').classList.add('hidden');
}
</script>
@endpush

@endsection
