-- ==============================================================================
-- TECHCELL NEXUSCENTER - SUPABASE DATABASE SCHEMA
-- Arsitektur Database PostgreSQL Cloud untuk Toko HP, POS, Servis & GPS Kurir
-- Jalankan skrip ini langsung di menu SQL Editor pada Dashboard Supabase Anda
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Ekstensi auth.users untuk Role Admin, Kasir, Pengguna)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'kasir', 'pengguna')) DEFAULT 'kasir',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PRODUCTS (Katalog & Stok HP / Aksesoris / Pulsa)
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('smartphone', 'aksesoris', 'pulsa')),
    brand TEXT,
    price BIGINT NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    icon TEXT DEFAULT '📱',
    description TEXT,
    image TEXT,
    rating NUMERIC(3, 1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL SALES (Transaksi Kasir & Online)
CREATE TABLE IF NOT EXISTS public.sales (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    customer_lat NUMERIC(10, 7),
    customer_lng NUMERIC(10, 7),
    subtotal BIGINT NOT NULL,
    discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    total BIGINT NOT NULL,
    amount_paid BIGINT NOT NULL DEFAULT 0,
    change_amount BIGINT NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Tunai', 'Transfer', 'QRIS', 'Debit')) DEFAULT 'Tunai',
    delivery_type TEXT DEFAULT 'pickup',
    cashier_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL SALE_ITEMS (Rincian Barang yang Dibeli)
CREATE TABLE IF NOT EXISTS public.sale_items (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL SERVICES (Manajemen Servis HP & Nota)
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nota_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    device TEXT NOT NULL,
    service_type TEXT NOT NULL,
    issue TEXT,
    price BIGINT NOT NULL DEFAULT 0,
    deposit BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('Diterima', 'Dalam Proses', 'Menunggu Sparepart', 'Selesai', 'Diambil')) DEFAULT 'Diterima',
    estimated_date DATE,
    technician TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL DELIVERIES (Pengantaran GPS Kurir Realtime)
CREATE TABLE IF NOT EXISTS public.deliveries (
    id BIGSERIAL PRIMARY KEY,
    tracking_code TEXT UNIQUE NOT NULL,
    service_id BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
    sale_id BIGINT REFERENCES public.sales(id) ON DELETE SET NULL,
    courier_name TEXT NOT NULL,
    courier_phone TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_lat NUMERIC(10, 7),
    customer_lng NUMERIC(10, 7),
    courier_lat NUMERIC(10, 7),
    courier_lng NUMERIC(10, 7),
    delivery_pin VARCHAR(6) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'diantar', 'selesai', 'batal')) DEFAULT 'pending',
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL NOTIFICATIONS (In-app Alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    type TEXT DEFAULT 'service',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INDEKS UNTUK PERFORMA
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON public.sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at);
CREATE INDEX IF NOT EXISTS idx_services_nota ON public.services(nota_number);
CREATE INDEX IF NOT EXISTS idx_services_phone ON public.services(customer_phone);
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking ON public.deliveries(tracking_code);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy Products
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Policy Sales & Items
CREATE POLICY "Public Read Own Sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Insert Sales" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Update Sales" ON public.sales FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Public Read Sale Items" ON public.sale_items FOR SELECT USING (true);
CREATE POLICY "Insert Sale Items" ON public.sale_items FOR INSERT WITH CHECK (true);

-- Policy Services
CREATE POLICY "Public Search Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Booking Service" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff Manage Services" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Policy Deliveries
CREATE POLICY "Public Track Delivery" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "Courier & Staff Update Delivery" ON public.deliveries FOR UPDATE USING (true);
CREATE POLICY "Staff Insert Delivery" ON public.deliveries FOR INSERT WITH CHECK (true);

-- Realtime: Aktifkan Supabase Realtime publication untuk deliveries
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;

-- 11. INITIAL SEED DATA (Produk Toko HP Awal)
INSERT INTO public.products (name, category, brand, price, stock, icon, description, rating, review_count, is_active)
VALUES
('Samsung Galaxy S24 Ultra 5G', 'smartphone', 'Samsung', 21999000, 8, '📱', 'Snapdragon 8 Gen 3, Layar 6.8 inch Dynamic AMOLED 2X, S-Pen included, Kamera 200MP.', 4.9, 32, true),
('iPhone 15 Pro Max 256GB', 'smartphone', 'Apple', 23499000, 5, '📱', 'Titanium design, A17 Pro Chip, Action button, USB-C 3.0, 5x Telephoto optical zoom.', 5.0, 48, true),
('Xiaomi Redmi Note 13 Pro+ 5G', 'smartphone', 'Xiaomi', 5999000, 14, '📱', 'Dimensity 7200 Ultra, Kamera 200MP OIS, 120W HyperCharge, IP68 tahan air.', 4.8, 19, true),
('Infinix Note 40 Pro 8/256GB', 'smartphone', 'Infinix', 3499000, 10, '📱', 'All-Round FastCharge 2.0 70W + 20W Wireless MagCharge, Layar Lengkung 3D AMOLED 120Hz.', 4.7, 15, true),
('Charger GaN 65W Fast Charging Type-C', 'aksesoris', 'Baseus', 249000, 35, '🔌', 'Teknologi Gallium Nitride (GaN), triple port (2C+1A), support Power Delivery 3.0 & QC 4+.', 4.9, 56, true),
('TWS Earbuds ANC Low Latency Gaming', 'aksesoris', 'Anker', 499000, 22, '🎧', 'Active Noise Cancelling hingga 35dB, baterai tahan 32 jam, driver audio 11mm bass mantap.', 4.8, 27, true),
('Kabel Data Type-C Braided 100W 1.2m', 'aksesoris', 'UGreen', 65000, 60, '🔌', 'Nylon braided super kuat, chip E-marker, mendukung charging laptop & HP hingga 100 watt.', 4.9, 120, true),
('Hydrogel Screen Protector Full Cover', 'aksesoris', 'NexusArmor', 45000, 80, '🛡️', 'Self-healing screen protector, jernih HD, tahan goresan kuku & benda tajam, anti-fingerprint.', 4.7, 43, true),
('Paket Data Telkomsel 50GB 30 Hari', 'pulsa', 'Telkomsel', 115000, 999, '📶', 'Kuota Nasional 50GB 24 Jam di semua jaringan 2G/3G/4G/5G, masa aktif 30 hari.', 5.0, 88, true),
('Pulsa Reguler Indosat 100.000', 'pulsa', 'Indosat', 98000, 999, '📶', 'Pulsa reguler menambah masa aktif kartu Indosat Ooredoo IM3 hingga 60 hari.', 5.0, 64, true)
ON CONFLICT DO NOTHING;
