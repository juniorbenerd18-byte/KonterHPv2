'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/store';
import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Small delay for UX feel
        setTimeout(() => {
            const result = DataService.login(email, password);
            setIsLoading(false);

            if (result.success && result.user) {
                const user = result.user;
                // Redirect based on role
                if (user.role === 'pengguna') {
                    router.push(redirectTo === '/' ? '/' : redirectTo);
                } else {
                    router.push('/pos');
                }
            } else {
                setError(result.error || 'Login gagal. Silakan coba lagi.');
            }
        }, 400);
    };

    const fillDemo = (email: string, pass: string) => {
        setEmail(email);
        setPassword(pass);
        setError('');
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
            <div className="max-w-md w-full space-y-5">
                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2 border-b border-slate-100 pb-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#00687a] to-cyan-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-200 mb-3">
                            <span className="material-symbols-outlined text-2xl">lock</span>
                        </div>
                        <h1 className="font-display font-black text-2xl text-slate-900">Masuk Akun</h1>
                        <p className="text-slate-500 text-xs font-mono">TECHCELL NexusCenter Management System</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-mono animate-shake">
                            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-slate-600 text-xs font-mono font-bold mb-1.5 uppercase tracking-wide">Email:</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email Anda"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00687a] focus:ring-2 focus:ring-[#00687a]/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-600 text-xs font-mono font-bold mb-1.5 uppercase tracking-wide">Password:</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00687a] focus:ring-2 focus:ring-[#00687a]/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#00687a] hover:bg-[#00687a]/90 text-white font-bold py-3.5 rounded-xl shadow-md shadow-[#00687a]/30 transition-all text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Memverifikasi...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">login</span>
                                    Masuk ke Sistem
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center text-slate-500 text-[11px] font-mono pt-1">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-[#00687a] font-bold hover:underline">
                            Daftar Akun Baru
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials Helper */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 text-white">
                    <p className="text-xs font-mono font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        AKUN DEMO — Klik untuk isi otomatis:
                    </p>
                    <div className="space-y-2">
                        {[
                            { label: '👑 Admin', email: 'admin@techcell.com', pass: 'admin123', color: 'hover:bg-cyan-900/60 border-cyan-700/40' },
                            { label: '💳 Kasir', email: 'kasir@techcell.com', pass: 'kasir123', color: 'hover:bg-amber-900/40 border-amber-700/40' },
                            { label: '👤 Pelanggan', email: 'budi@gmail.com', pass: 'user123', color: 'hover:bg-emerald-900/40 border-emerald-700/40' },
                        ].map(cred => (
                            <button
                                key={cred.email}
                                type="button"
                                onClick={() => fillDemo(cred.email, cred.pass)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl border border-white/10 ${cred.color} transition-all cursor-pointer flex items-center justify-between gap-2 group`}
                            >
                                <div>
                                    <span className="text-xs font-mono font-bold text-white">{cred.label}</span>
                                    <span className="text-[10px] font-mono text-slate-400 ml-2">{cred.email}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                                    pw: {cred.pass}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00687a]/30 border-t-[#00687a] rounded-full animate-spin"></div></div>}>
            <LoginForm />
        </Suspense>
    );
}
