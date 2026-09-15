import { createClient } from '@supabase/supabase-js';
import { Product, Sale, Service, Delivery, Notification, UserProfile } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
    return (
        supabaseUrl.startsWith('https://') &&
        !supabaseUrl.includes('placeholder') &&
        supabaseAnonKey.length > 20 &&
        !supabaseAnonKey.includes('placeholder')
    );
};

export const supabase = isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ==============================================================================
// INITIAL SEED DATA (Mencerminkan data nyata toko NexusCenter Laravel)
// ==============================================================================
export const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Samsung Galaxy S24 Ultra',
        category: 'smartphone',
        brand: 'Samsung',
        price: 19999000,
        stock: 5,
        icon: '📱',
        image: '/storage/products/b68BRBuwTQTBjrTFjiD9ZQn5vGSgqCebxAD1ylMX.jpg',
        description: 'Experience the new era of mobile AI. The Galaxy S24 Ultra empowers you to unleash your creativity, productivity and possibilities – starting with the most important device in your life. (Snapdragon 8 Gen 3, Kamera 200MP Main, Display 6.8" Dynamic AMOLED 2X, Battery 5000mAh, Garansi Resmi Official Warranty)',
        rating: 4.9,
        review_count: 128,
        is_active: true
    },
    {
        id: 2,
        name: 'iPhone 15 Pro 256GB',
        category: 'smartphone',
        brand: 'Apple',
        price: 20999000,
        stock: 3,
        icon: '🍎',
        image: '/storage/products/jZ9NEPyB669ZtZ1DYW4Wve88AG7jPxl4H6lmGXNi.jpg',
        description: 'Desain titanium yang tangguh dan ringan kelas penerbangan. Chipset A17 Pro revolusioner dengan GPU 6-core pro, tombol Tindakan yang dapat disesuaikan, dan sistem kamera pro serbaguna.',
        rating: 5.0,
        review_count: 89,
        is_active: true
    },
    {
        id: 3,
        name: 'Xiaomi 14 Leica Camera',
        category: 'smartphone',
        brand: 'Xiaomi',
        price: 11999000,
        stock: 8,
        icon: '📱',
        description: 'Optik Leica Generasi Baru dengan Lensa Summilux. Ditenagai Snapdragon 8 Gen 3, pengisian daya super cepat 90W HyperCharge, dan layar CrystalRes AMOLED 120Hz.',
        rating: 4.8,
        review_count: 56,
        is_active: true
    },
    {
        id: 4,
        name: 'Oppo Reno 11 Pro 5G',
        category: 'smartphone',
        brand: 'Oppo',
        price: 8499000,
        stock: 10,
        icon: '📱',
        description: 'Sistem Kamera Potret Kelas Unggulan dengan Sensor Sony IMX890. Desain 3D Dual-Curved ultra elegan, baterai besar dengan 80W SUPERVOOC Flash Charge.',
        rating: 4.7,
        review_count: 210,
        is_active: true
    },
    {
        id: 5,
        name: 'Samsung Galaxy A55',
        category: 'smartphone',
        brand: 'Samsung',
        price: 5499000,
        stock: 15,
        icon: '📱',
        description: 'Desain metalik ikonik dengan proteksi air dan debu IP67. Kamera 50MP Nightography dengan OIS, layar Super AMOLED FHD+ 120Hz yang sangat jernih.',
        rating: 4.6,
        review_count: 304,
        is_active: true
    },
    {
        id: 6,
        name: 'Vivo V30 Pro',
        category: 'smartphone',
        brand: 'Vivo',
        price: 7499000,
        stock: 7,
        icon: '📱',
        description: 'ZEISS Professional Portrait Camera dengan Aura Light Portrait pintar. Bodi super tipis dengan baterai besar 5000mAh & 80W FlashCharge.',
        rating: 4.5,
        review_count: 78,
        is_active: true
    },
    {
        id: 7,
        name: 'Realme GT 6',
        category: 'smartphone',
        brand: 'Realme',
        price: 6999000,
        stock: 4,
        icon: '📱',
        description: 'Flagship Killer bertenaga Snapdragon 8s Gen 3. Layar Ultra Bright 6000 nits termutakhir dan pengisian kilat 120W SUPERVOOC Charge.',
        rating: 4.7,
        review_count: 91,
        is_active: true
    },
    {
        id: 71,
        name: 'Infinix Note 40 Pro 8/256GB',
        category: 'smartphone',
        brand: 'Infinix',
        price: 3499000,
        stock: 12,
        icon: '📱',
        description: 'All-Round FastCharge 2.0 70W + 20W Wireless MagCharge, Layar Lengkung 3D AMOLED 120Hz, Kamera 108MP OIS.',
        rating: 4.8,
        review_count: 64,
        is_active: true
    },
    {
        id: 72,
        name: 'Xiaomi Redmi Note 13 Pro+ 5G',
        category: 'smartphone',
        brand: 'Xiaomi',
        price: 5999000,
        stock: 10,
        icon: '📱',
        description: 'Dimensity 7200 Ultra, Kamera 200MP OIS, 120W HyperCharge, IP68 tahan air dan debu.',
        rating: 4.8,
        review_count: 95,
        is_active: true
    },
    {
        id: 8,
        name: 'Charger 65W GaN USB-C',
        category: 'aksesoris',
        brand: 'Anker',
        price: 299000,
        stock: 20,
        icon: '🔌',
        description: 'Teknologi GaN Prime ukuran ringkas dengan efisiensi tinggi. Pengisian daya cepat multi-port untuk laptop, smartphone, dan tablet secara bersamaan.',
        rating: 4.8,
        review_count: 521,
        is_active: true
    },
    {
        id: 9,
        name: 'TWS Earbuds Pro ANC',
        category: 'aksesoris',
        brand: 'Xiaomi',
        price: 499000,
        stock: 12,
        icon: '🎧',
        description: 'Active Noise Cancellation hingga 40dB dengan audio resolusi tinggi Hi-Res Wireless. Daya tahan baterai hingga 28 jam dengan cangkang pengisi daya.',
        rating: 4.6,
        review_count: 187,
        is_active: true
    },
    {
        id: 10,
        name: 'Tempered Glass iPhone 15',
        category: 'aksesoris',
        brand: 'Spigen',
        price: 89000,
        stock: 30,
        icon: '📱',
        description: 'Kekuatan kaca 9H hardness anti-gores, lapisan oleophobic anti-sidik jari, dan transmisi cahaya tinggi presisi edge-to-edge.',
        rating: 4.7,
        review_count: 445,
        is_active: true
    },
    {
        id: 11,
        name: 'Powerbank 20000mAh 65W',
        category: 'aksesoris',
        brand: 'Baseus',
        price: 549000,
        stock: 9,
        icon: '🔋',
        description: 'Kapasitas raksasa 20000mAh dengan pengisian cepat PD 65W dua arah. Dilengkapi layar LCD indikator persentase baterai real-time.',
        rating: 4.8,
        review_count: 238,
        is_active: true
    },
    {
        id: 12,
        name: 'Case Samsung S24 Ultra',
        category: 'aksesoris',
        brand: 'Spigen',
        price: 149000,
        stock: 25,
        icon: '📦',
        description: 'Perlindungan jatuh standar militer (Military Grade Drop Protection) dengan teknologi Air Cushion di setiap sudutnya.',
        rating: 4.5,
        review_count: 312,
        is_active: true
    },
    {
        id: 13,
        name: 'Pulsa Telkomsel 50.000',
        category: 'pulsa',
        brand: 'Telkomsel',
        price: 50000,
        stock: 999,
        icon: '📶',
        description: 'Isi ulang pulsa reguler Telkomsel instant 24 jam untuk memperpanjang masa aktif dan transaksi layanan.',
        rating: 5.0,
        review_count: 1000,
        is_active: true
    },
    {
        id: 14,
        name: 'Paket Data XL 30GB 30hr',
        category: 'pulsa',
        brand: 'XL',
        price: 65000,
        stock: 999,
        icon: '📡',
        description: 'Kuota utama 30GB berlaku 24 jam di semua jaringan + bonus kuota lokal 10GB untuk masa aktif 30 hari.',
        rating: 4.6,
        review_count: 678,
        is_active: true
    },
    {
        id: 15,
        name: 'Paket Data Indosat 25GB',
        category: 'pulsa',
        brand: 'Indosat',
        price: 55000,
        stock: 999,
        icon: '📡',
        description: 'IM3 Ooredoo 25GB kuota utama tanpa pembagian waktu, berlaku selama 30 hari.',
        rating: 4.5,
        review_count: 423,
        is_active: true
    }
];

export const INITIAL_SERVICES: Service[] = [
    {
        id: 1,
        nota_number: 'SRV-20260901-0001',
        customer_name: 'Budi Pratama',
        customer_phone: '081234567890',
        device: 'Samsung Galaxy A52',
        service_type: 'Ganti LCD / Touchscreen',
        issue: 'Layar bergaris hijau dan touchscreen bagian atas kadang ghost touch setelah jatuh.',
        price: 650000,
        deposit: 200000,
        status: 'Dalam Proses',
        estimated_date: '2026-09-14',
        technician: 'Rian Teknisi',
        notes: 'Sparepart LCD original sudah datang, proses pemasangan.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 2,
        nota_number: 'SRV-20260902-0002',
        customer_name: 'Siti Rahma',
        customer_phone: '085712345678',
        device: 'iPhone 11',
        service_type: 'Ganti Baterai Health 100%',
        issue: 'Baterai health sisa 68%, cepat panas dan drop dari 40% langsung mati.',
        price: 450000,
        deposit: 450000,
        status: 'Selesai',
        estimated_date: '2026-09-12',
        technician: 'Rian Teknisi',
        notes: 'Baterai Hippo Pro terpasang rapi, BH terbaca 100%, siap diambil.',
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
];

export const INITIAL_DELIVERIES: Delivery[] = [
    {
        id: 1,
        tracking_code: 'TRK-982341',
        courier_name: 'Doni Express',
        courier_phone: '082198765432',
        customer_name: 'Ahmad Fauzi',
        customer_phone: '081399887766',
        customer_address: 'Jl. Slamet Riyadi No. 142, Solo, Jawa Tengah',
        customer_lat: -7.5678,
        customer_lng: 110.8250,
        courier_lat: -7.5620,
        courier_lng: 110.8190,
        delivery_pin: '4821',
        status: 'diantar',
        notes: 'Antar paket smartphone Samsung A54 + tempered glass.',
        started_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 3600000).toISOString()
    }
];

export const INITIAL_SALES: Sale[] = [
    {
        id: 1,
        invoice_number: 'INV-20260912-0001',
        customer_name: 'Ahmad Fauzi',
        customer_phone: '081399887766',
        customer_address: 'Jl. Slamet Riyadi No. 142, Solo, Jawa Tengah',
        subtotal: 350000,
        discount: 5,
        total: 332500,
        amount_paid: 350000,
        change_amount: 17500,
        payment_method: 'Tunai',
        cashier_name: 'Kasir Utama',
        delivery_type: 'pickup',
        created_at: new Date().toISOString(),
        items: [
            { id: 1, sale_id: 1, product_id: 5, product_name: 'Charger GaN 65W Fast Charging Type-C', price: 249000, quantity: 1, subtotal: 249000 },
            { id: 2, sale_id: 1, product_id: 7, product_name: 'Kabel Data Type-C Braided 100W 1.2m', price: 65000, quantity: 1, subtotal: 65000 }
        ]
    }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        type: 'service',
        title: '🔧 Booking Servis Baru #SRV-20260902-0002',
        message: 'iPhone 11 (Ganti Baterai) oleh Siti Rahma siap diambil.',
        link: '/servis',
        is_read: false,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        type: 'service',
        title: '🚚 Kurir Doni Mulai Mengantar!',
        message: 'Pengantaran #TRK-982341 ke Ahmad Fauzi sedang bergerak.',
        link: '/pengantaran/lacak/TRK-982341',
        is_read: false,
        created_at: new Date().toISOString()
    }
];
