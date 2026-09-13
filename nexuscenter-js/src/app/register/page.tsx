'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Pendaftaran akun ${name} berhasil! Silakan login.`);
        router.push('/login');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-mono text-xs">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-card space-y-6">
                <div className="text-center space-y-2 border-b border-slate-100 pb-5">
                    <div className="w-12 h-12 bg-[#00687a] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                        <span className="material-symbols-outlined text-2xl">person_add</span>
                    </div>
                    <h1 className="font-display font-black text-2xl text-slate-900">Daftar Akun Baru</h1>
                    <p className="text-slate-500 text-xs">Bergabung dengan TECHCELL NexusCenter</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-slate-600 mb-1 font-bold">Nama Lengkap:</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama Anda"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00687a]"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-600 mb-1 font-bold">Email:</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@domain.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00687a]"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-600 mb-1 font-bold">Nomor WhatsApp:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00687a]"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-600 mb-1 font-bold">Password:</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00687a]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00687a] hover:bg-[#00687a]/90 text-white font-bold py-3.5 rounded-xl shadow-md shadow-[#00687a]/30 transition-all text-sm mt-2"
                    >
                        Daftar Sekarang
                    </button>
                </form>

                <div className="text-center text-slate-500 text-[11px] pt-2">
                    Sudah memiliki akun?{' '}
                    <Link href="/login" className="text-[#00687a] font-bold hover:underline">
                        Masuk di Sini
                    </Link>
                </div>
            </div>
        </div>
    );
}
