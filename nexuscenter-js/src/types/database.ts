export type Role = 'admin' | 'kasir' | 'pengguna';

export type ProductCategory = 'smartphone' | 'aksesoris' | 'pulsa';

export interface Product {
    id: number;
    name: string;
    category: ProductCategory;
    brand?: string | null;
    price: number;
    stock: number;
    icon: string;
    description?: string | null;
    image?: string | null;
    rating: number;
    review_count: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export type PaymentMethod = 'Tunai' | 'Transfer' | 'QRIS' | 'Debit';

export interface SaleItem {
    id?: number;
    sale_id?: number;
    product_id?: number | null;
    product_name?: string;
    name?: string;
    price: number;
    quantity?: number;
    qty?: number;
    subtotal: number;
    total_price?: number;
}

export interface Sale {
    id: number;
    user_id?: string | null;
    invoice_number: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_address?: string | null;
    customer_lat?: number | null;
    customer_lng?: number | null;
    subtotal: number;
    total_price?: number;
    discount: number;
    total: number;
    amount_paid: number;
    change_amount: number;
    payment_method: PaymentMethod;
    delivery_type?: 'pickup' | 'delivery';
    cashier_name?: string | null;
    created_at: string;
    items?: SaleItem[];
    delivery?: Delivery | null;
}

export type ServiceStatus = 'Diterima' | 'Dalam Proses' | 'Menunggu Sparepart' | 'Selesai' | 'Diambil' | string;

export interface Service {
    id: number;
    user_id?: string | null;
    nota_number: string;
    customer_name: string;
    customer_phone: string;
    device: string;
    service_type: string;
    issue?: string | null;
    price: number;
    cost?: number;
    deposit: number;
    status: ServiceStatus;
    estimated_date?: string | null;
    technician?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at?: string;
    delivery?: Delivery | null;
}

export type DeliveryStatus = 'pending' | 'diantar' | 'selesai' | 'batal';

export interface Delivery {
    id: number;
    tracking_code: string;
    service_id?: number | null;
    sale_id?: number | null;
    courier_name: string;
    courier_phone?: string | null;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_lat?: number | null;
    customer_lng?: number | null;
    courier_lat?: number | null;
    courier_lng?: number | null;
    delivery_pin: string;
    status: DeliveryStatus;
    notes?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
    created_at: string;
    updated_at?: string;
    service?: Service | null;
    sale?: Sale | null;
}

export type ServiceOrder = Service;
export type DeliveryOrder = Delivery;

export interface Notification {
    id: number;
    type: 'service' | 'sale' | 'system';
    title: string;
    message: string;
    link?: string | null;
    is_read: boolean;
    created_at: string;
}

export interface UserProfile {
    id: string | number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    role: Role;
    is_active: boolean;
    avatar?: string | null;
    created_at: string;
}
