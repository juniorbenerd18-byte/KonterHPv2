'use client';
import { useState, useEffect, useCallback } from 'react';
import { DataService } from '@/lib/store';
import { UserProfile } from '@/types/database';

type RoleFilter = 'all' | 'pengguna' | 'kasir' | 'admin';

const roleBadge: Record<string, string> = {
  admin: 'px-2.5 py-1 bg-purple-100 text-purple-800 font-mono font-bold text-[10px] rounded-full border border-purple-200 uppercase',
  kasir: 'px-2.5 py-1 bg-amber-100 text-amber-800 font-mono font-bold text-[10px] rounded-full border border-amber-200 uppercase',
  pengguna: 'px-2.5 py-1 bg-cyan-100 text-cyan-800 font-mono font-bold text-[10px] rounded-full border border-cyan-200 uppercase',
};

const roleEmoji: Record<string, string> = { admin: '👑', kasir: '💳', pengguna: '👤' };

function initials(name: string) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  // New user form
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'pengguna', phone: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [allUsers, role] = await Promise.all([
        DataService.getUsers?.() ?? Promise.resolve([]),
        Promise.resolve(DataService.getCurrentRole()),
      ]);
      setUsers(allUsers);
      setCurrentUserRole(role);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active !== false).length,
    pengguna: users.filter((u) => u.role === 'pengguna').length,
    kasir: users.filter((u) => u.role === 'kasir').length,
    admin: users.filter((u) => u.role === 'admin').length,
  };

  async function handleToggle(u: UserProfile) {
    if (!DataService.updateUser) return;
    await DataService.updateUser(u.id, { is_active: !u.is_active });
    load();
  }

  async function handleDelete(u: UserProfile) {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${u.name}?`)) return;
    if (!DataService.deleteUser) return;
    await DataService.deleteUser(u.id);
    load();
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (DataService.createUser) {
        await DataService.createUser({ ...form, is_active: true, created_at: new Date().toISOString() });
      }
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'pengguna', phone: '' });
      load();
    } catch (err) {
      alert('Gagal membuat akun: ' + String(err));
    }
    setSaving(false);
  }

  const currentId = typeof window !== 'undefined' ? localStorage.getItem('nexus_user_id') : null;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-2xl">group</span>
            <h1 className="font-display font-extrabold text-2xl text-on-surface">Manajemen Akun Terdaftar</h1>
          </div>
          <p className="text-xs font-mono text-on-surface-variant">Kelola daftar seluruh pengguna, kasir, dan admin yang terdaftar di sistem.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-secondary hover:bg-secondary/90 text-white px-5 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 w-fit"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          + Tambah Akun Baru
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
          <span className="text-on-surface-variant font-mono text-[11px] uppercase block">Total Akun</span>
          <strong className="font-display font-extrabold text-2xl text-primary block">{stats.total}</strong>
          <span className="text-[10px] font-mono text-emerald-600 block">✓ {stats.active} Aktif</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
          <span className="text-on-surface-variant font-mono text-[11px] uppercase block">Pengguna</span>
          <strong className="font-display font-extrabold text-2xl text-secondary block">{stats.pengguna}</strong>
          <span className="text-[10px] font-mono text-on-surface-variant block">Pelanggan Toko</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
          <span className="text-on-surface-variant font-mono text-[11px] uppercase block">Kasir</span>
          <strong className="font-display font-extrabold text-2xl text-amber-600 block">{stats.kasir}</strong>
          <span className="text-[10px] font-mono text-on-surface-variant block">Staff POS</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1">
          <span className="text-on-surface-variant font-mono text-[11px] uppercase block">Admin</span>
          <strong className="font-display font-extrabold text-2xl text-purple-600 block">{stats.admin}</strong>
          <span className="text-[10px] font-mono text-on-surface-variant block">Akses Penuh</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl space-y-1 col-span-2 md:col-span-1">
          <span className="text-on-surface-variant font-mono text-[11px] uppercase block">Status Sistem</span>
          <strong className="font-display font-extrabold text-xl text-emerald-600 block">Online</strong>
          <span className="text-[10px] font-mono text-on-surface-variant block">Semua User Terhubung</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {([['all', `Semua Role (${stats.total})`], ['pengguna', `Pengguna (${stats.pengguna})`], ['kasir', `Kasir (${stats.kasir})`], ['admin', `Admin (${stats.admin})`]] as [RoleFilter, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setRoleFilter(val)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                roleFilter === val
                  ? val === 'kasir' ? 'bg-amber-600 text-white shadow-sm' : val === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, HP..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 font-mono text-[11px] uppercase text-on-surface-variant">
                <th className="p-4">Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">No. HP</th>
                <th className="p-4">Role</th>
                <th className="p-4">Terdaftar</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono text-xs">Memuat...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono text-xs">
                    Tidak ditemukan akun terdaftar dengan kriteria pencarian ini.
                  </td>
                </tr>
              ) : filtered.map((u) => {
                const isMe = currentId && (u.id === currentId || u.id === parseInt(currentId));
                const isActive = u.is_active !== false;
                return (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Avatar + Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} className="w-9 h-9 rounded-full object-cover border border-outline-variant/30" alt={u.name} />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center font-mono">
                            {initials(u.name || '')}
                          </div>
                        )}
                        <div>
                          <strong className="font-display font-bold text-on-surface text-sm block">{u.name}</strong>
                          <span className="text-[10px] font-mono text-on-surface-variant">ID: #USR-{String(u.id).padStart(4, '0')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-on-surface-variant">{u.email}</td>
                    <td className="p-4 font-mono">{u.phone ?? '-'}</td>
                    <td className="p-4">
                      <span className={roleBadge[u.role || 'pengguna']}>
                        {roleEmoji[u.role || 'pengguna']} {u.role || 'Pengguna'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-on-surface-variant text-[11px]">
                      {u.created_at ? new Date(u.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="p-4">
                      {isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded-full border border-emerald-200">Aktif</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-mono font-bold text-[10px] rounded-full border border-red-200">Nonaktif</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {isMe ? (
                        <span className="text-[10px] font-mono text-gray-400 italic">Akun Anda</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggle(u)}
                            className={`p-1.5 rounded-lg border ${isActive ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                            title={isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            <span className="material-symbols-outlined text-[16px]">{isActive ? 'block' : 'check_circle'}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg"
                            title="Hapus Akun"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low">
          <p className="text-xs font-mono text-on-surface-variant">Menampilkan {filtered.length} dari {users.length} akun</p>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">person_add</span>
                Tambah Akun Pengguna / Staff Baru
              </h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-on-surface-variant mb-1">Nama Lengkap *</label>
                <input type="text" required placeholder="Contoh: Ahmad Kasir" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface" />
              </div>
              <div>
                <label className="block font-mono text-on-surface-variant mb-1">Email *</label>
                <input type="email" required placeholder="nama@nexuscenter.id" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface" />
              </div>
              <div>
                <label className="block font-mono text-on-surface-variant mb-1">Password *</label>
                <input type="password" required placeholder="Minimal 6 karakter" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface" />
              </div>
              <div>
                <label className="block font-mono text-on-surface-variant mb-1">Role Akun *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface">
                  <option value="pengguna">Pengguna (Pelanggan)</option>
                  <option value="kasir">Kasir (Staff POS)</option>
                  <option value="admin">Admin (Akses Penuh)</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-on-surface-variant mb-1">No. HP (Opsional)</label>
                <input type="text" placeholder="081234567890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 text-xs text-on-surface" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl font-mono text-xs font-bold">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-secondary text-white rounded-xl font-mono text-xs font-bold shadow-md hover:bg-secondary/90 disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
