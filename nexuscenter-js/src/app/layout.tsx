import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'TECHCELL NexusCenter — POS & Toko Ponsel',
    description: 'Sistem All-in-One Manajemen Toko HP, Kasir POS, Servis & GPS Kurir Realtime.',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#131b2e',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <head>
                {/* Google Fonts: Hanken Grotesk, Inter, JetBrains Mono */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                {/* Google Material Symbols */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
                {/* Leaflet Map CSS */}
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    crossOrigin=""
                />
            </head>
            <body className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] antialiased">
                <Navbar />
                <main className="flex-grow pt-20 lg:pt-24 min-h-screen">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
