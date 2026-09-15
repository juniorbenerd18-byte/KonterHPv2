import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary-container text-on-primary-fixed w-full border-t border-outline-variant/10 no-print mt-20">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1 flex flex-col items-start">
                        <Link className="font-display text-xl font-extrabold text-secondary-fixed flex items-center gap-2 mb-3" href="/">
                            <span className="material-symbols-outlined text-secondary-fixed text-2xl">memory</span>
                            TECHCELL <span className="text-xs text-secondary-fixed-dim font-mono font-normal">NexusCenter</span>
                        </Link>
                        <p className="text-on-primary-container opacity-80 text-sm mb-4 font-mono">Expert Connectivity & Smart Service Management.</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <h4 className="font-mono text-xs text-secondary-fixed font-bold uppercase tracking-wider mb-1">Layanan</h4>
                        <Link href="/produk?category=smartphone" className="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Smartphone Baru</Link>
                        <Link href="/produk?category=aksesoris" className="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Aksesoris Original</Link>
                        <Link href="/produk?category=pulsa" className="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Pulsa & Paket Data</Link>
                        <Link href="/tukar-tambah/lacak" className="text-on-primary-container text-sm opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-all">Lacak Tukar Tambah</Link>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <h4 className="font-mono text-xs text-secondary-fixed font-bold uppercase tracking-wider mb-1">Bantuan</h4>
                        <span className="text-on-primary-container text-sm opacity-80">WhatsApp: +62 812-3456-7890</span>
                        <span className="text-on-primary-container text-sm opacity-80">Email: support@techcell.id</span>
                        <span className="text-on-primary-container text-sm opacity-80">Buka Setiap Hari: 09.00 - 21.00 WIB</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <h4 className="font-mono text-xs text-secondary-fixed font-bold uppercase tracking-wider mb-1">Lokasi Toko</h4>
                        <p className="text-on-primary-container text-sm opacity-80 leading-relaxed">Fajar Indah, Baturan, Kec. Colomadu, Kab. Karanganyar 57171 (Dekat Hotel Aston Solo)</p>
                    </div>
                </div>
                <div className="border-t border-on-primary-container/20 pt-6 flex flex-col md:flex-row justify-between items-center text-on-primary-container text-xs opacity-70 font-mono">
                    <p>© 2026 TECHCELL NexusCenter. All rights reserved.</p>
                    <div className="flex gap-4 mt-3 md:mt-0 items-center">
                        <span className="material-symbols-outlined text-[20px]">payments</span>
                        <span className="material-symbols-outlined text-[20px]">credit_card</span>
                        <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

