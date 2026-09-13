'use client';

import { Product, Sale, Service, Delivery, Notification, Role, UserProfile } from '@/types/database';
import { supabase, isSupabaseConfigured, INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_DELIVERIES, INITIAL_SALES, INITIAL_NOTIFICATIONS } from './supabase';

const STORAGE_KEYS = {
    PRODUCTS: 'nexus_products',
    SALES: 'nexus_sales',
    SERVICES: 'nexus_services',
    DELIVERIES: 'nexus_deliveries',
    NOTIFICATIONS: 'nexus_notifications',
    ROLE: 'nexus_active_role',
    USERS: 'nexus_users',
    LOGIN_STATE: 'nexus_is_logged_in',
    CURRENT_USER: 'nexus_current_user',
};

const INITIAL_USERS: UserProfile[] = [
    {
        id: 1,
        name: 'Super Admin TechCell',
        email: 'admin@techcell.com',
        phone: '081234567890',
        role: 'admin',
        is_active: true,
        created_at: '2026-01-01T08:00:00.000Z'
    },
    {
        id: 2,
        name: 'Ahmad Kasir',
        email: 'kasir@techcell.com',
        phone: '085712345678',
        role: 'kasir',
        is_active: true,
        created_at: '2026-02-15T10:30:00.000Z'
    },
    {
        id: 3,
        name: 'Budi Pelanggan',
        email: 'budi@gmail.com',
        phone: '089876543210',
        role: 'pengguna',
        is_active: true,
        created_at: '2026-03-01T14:15:00.000Z'
    }
];

function getLocal<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
}

function setLocal<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Storage error', e);
    }
}

export const DataService = {
    getCurrentRole(): Role {
        return getLocal<Role>(STORAGE_KEYS.ROLE, 'pengguna');
    },

    setCurrentRole(role: Role) {
        setLocal(STORAGE_KEYS.ROLE, role);
    },

    isLoggedIn(): boolean {
        return getLocal<boolean>(STORAGE_KEYS.LOGIN_STATE, false);
    },

    getCurrentUser(): UserProfile | null {
        return getLocal<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    },

    login(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
        const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
        const user = users.find(u => u.email === email && u.is_active);
        if (!user) {
            return { success: false, error: 'Email tidak ditemukan atau akun tidak aktif.' };
        }
        // Simple demo password check: password = 'admin123' for admin, 'kasir123' for kasir, 'user123' for pengguna
        const validPasswords: Record<string, string> = {
            'admin': 'admin123',
            'kasir': 'kasir123',
            'pengguna': 'user123',
        };
        if (password !== validPasswords[user.role]) {
            return { success: false, error: 'Password salah. Cek kredensial demo di bawah.' };
        }
        setLocal(STORAGE_KEYS.LOGIN_STATE, true);
        setLocal(STORAGE_KEYS.CURRENT_USER, user);
        setLocal(STORAGE_KEYS.ROLE, user.role);
        return { success: true, user };
    },

    logout(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.LOGIN_STATE);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
    },

    async getProducts(): Promise<Product[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase.from('products').select('*').order('id');
            if (!error && data && data.length > 0) return data as Product[];
        }
        return getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    },

    async saveProduct(product: Partial<Product>): Promise<Product> {
        if (isSupabaseConfigured() && supabase) {
            if (product.id) {
                const { data } = await supabase.from('products').update(product).eq('id', product.id).select().single();
                if (data) return data as Product;
            } else {
                const { data } = await supabase.from('products').insert([product]).select().single();
                if (data) return data as Product;
            }
        }
        const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
        let savedProduct: Product;
        if (product.id) {
            savedProduct = { ...products.find(p => p.id === product.id)!, ...product } as Product;
            const idx = products.findIndex(p => p.id === product.id);
            if (idx >= 0) products[idx] = savedProduct;
        } else {
            savedProduct = {
                id: Date.now(),
                name: product.name || '',
                category: product.category || 'smartphone',
                brand: product.brand || '',
                price: product.price || 0,
                stock: product.stock || 0,
                icon: product.icon || '📱',
                description: product.description || '',
                rating: 5.0,
                review_count: 0,
                is_active: true
            };
            products.push(savedProduct);
        }
        setLocal(STORAGE_KEYS.PRODUCTS, products);
        return savedProduct;
    },

    async getSales(): Promise<Sale[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase.from('sales').select('*, items:sale_items(*)').order('created_at', { ascending: false });
            if (!error && data) {
                return (data as any[]).map(s => ({
                    ...s,
                    total_price: s.total ?? s.total_price
                }));
            }
        }
        const local = getLocal<Sale[]>(STORAGE_KEYS.SALES, INITIAL_SALES);
        return local.map(s => ({
            ...s,
            total_price: s.total ?? s.total_price
        }));
    },

    async createSale(saleData: any): Promise<Sale> {
        const rawItems: any[] = saleData.items || [];
        const subtotal = rawItems.reduce((acc, it) => acc + (it.price || 0) * (it.qty || it.quantity || 1), 0);
        const total = Math.round(subtotal - (subtotal * (saleData.discount || 0)) / 100);
        const change_amount = Math.max(0, (saleData.amount_paid || total) - total);
        const invoice_number = saleData.invoice_number || ('INV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000));

        const newSale: Sale = {
            id: Date.now(),
            invoice_number,
            customer_name: saleData.customer_name || 'Pelanggan Toko',
            customer_phone: saleData.customer_phone || '',
            customer_address: saleData.customer_address || '',
            customer_lat: saleData.customer_lat ?? null,
            customer_lng: saleData.customer_lng ?? null,
            subtotal,
            discount: saleData.discount || 0,
            total,
            total_price: total,
            amount_paid: saleData.amount_paid || total,
            change_amount,
            payment_method: saleData.payment_method || 'Tunai',
            cashier_name: saleData.cashier_name || 'Kasir TECHCELL',
            delivery_type: saleData.delivery_type || 'pickup',
            created_at: new Date().toISOString(),
            items: rawItems.map(it => ({
                product_id: it.id ?? it.product_id ?? 0,
                product_name: it.name ?? it.product_name ?? 'Produk',
                name: it.name ?? it.product_name ?? 'Produk',
                price: it.price || 0,
                quantity: it.qty ?? it.quantity ?? 1,
                qty: it.qty ?? it.quantity ?? 1,
                subtotal: it.subtotal ?? ((it.price || 0) * (it.qty ?? it.quantity ?? 1))
            }))
        };

        if (isSupabaseConfigured() && supabase) {
            try {
                const { data: saleRow } = await supabase.from('sales').insert([{
                    invoice_number: newSale.invoice_number,
                    customer_name: newSale.customer_name,
                    customer_phone: newSale.customer_phone,
                    customer_address: newSale.customer_address,
                    subtotal: newSale.subtotal,
                    discount: newSale.discount,
                    total: newSale.total,
                    amount_paid: newSale.amount_paid,
                    change_amount: newSale.change_amount,
                    payment_method: newSale.payment_method,
                    cashier_name: newSale.cashier_name,
                    delivery_type: newSale.delivery_type
                }]).select().single();

                if (saleRow) {
                    newSale.id = saleRow.id;
                    const itemsPayload = (newSale.items || []).map(it => ({
                        sale_id: saleRow.id,
                        product_id: it.product_id,
                        product_name: it.product_name,
                        price: it.price,
                        quantity: it.quantity,
                        subtotal: it.subtotal
                    }));
                    await supabase.from('sale_items').insert(itemsPayload);
                }
            } catch (err) {
                console.warn('Supabase sale insert fallback to local', err);
            }
        }

        const allSales = getLocal<Sale[]>(STORAGE_KEYS.SALES, INITIAL_SALES);
        allSales.unshift(newSale);
        setLocal(STORAGE_KEYS.SALES, allSales);

        const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
        for (const it of rawItems) {
            const pId = it.id ?? it.product_id;
            const p = products.find(prod => prod.id === pId);
            if (p) p.stock = Math.max(0, p.stock - (it.qty ?? it.quantity ?? 1));
        }
        setLocal(STORAGE_KEYS.PRODUCTS, products);

        if (saleData.delivery_type === 'delivery') {
            await this.createDelivery({
                sale_id: newSale.id,
                courier_name: 'Kurir Express TECHCELL',
                courier_phone: '081234567890',
                customer_name: newSale.customer_name || 'Pelanggan',
                customer_phone: newSale.customer_phone || '08xxxxxxxx',
                customer_address: newSale.customer_address || 'Alamat Toko',
                customer_lat: newSale.customer_lat ?? -7.5678,
                customer_lng: newSale.customer_lng ?? 110.8250,
                notes: 'Pengantaran Pesanan Invoice #' + newSale.invoice_number
            });
        }

        return newSale;
    },

    async getServices(): Promise<Service[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                return (data as any[]).map(s => ({
                    ...s,
                    cost: s.cost ?? s.price ?? 0,
                    price: s.price ?? s.cost ?? 0
                }));
            }
        }
        const local = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        return local.map(s => ({
            ...s,
            cost: s.cost ?? s.price ?? 0,
            price: s.price ?? s.cost ?? 0
        }));
    },

    async createServiceBooking(data: {
        customer_name: string;
        customer_phone: string;
        device: string;
        service_type: string;
        issue?: string;
    }): Promise<Service> {
        const nota_number = 'SRV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
        const newService: Service = {
            id: Date.now(),
            nota_number,
            customer_name: data.customer_name,
            customer_phone: data.customer_phone,
            device: data.device,
            service_type: data.service_type,
            issue: data.issue || '',
            price: 0,
            cost: 0,
            deposit: 0,
            status: 'Diterima',
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabase) {
            const { data: srvRow } = await supabase.from('services').insert([newService]).select().single();
            if (srvRow) return srvRow as Service;
        }

        const services = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        services.unshift(newService);
        setLocal(STORAGE_KEYS.SERVICES, services);
        return newService;
    },

    async createService(data: Partial<Service>): Promise<Service> {
        const nota_number = data.nota_number || ('SRV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000));
        const newService: Service = {
            id: data.id || Date.now(),
            nota_number,
            customer_name: data.customer_name || 'Pelanggan',
            customer_phone: data.customer_phone || '',
            device: data.device || '',
            service_type: data.service_type || 'Perbaikan Umum',
            issue: data.issue || '',
            price: data.price ?? data.cost ?? 0,
            cost: data.cost ?? data.price ?? 0,
            deposit: data.deposit || 0,
            status: data.status || 'Diterima',
            estimated_date: data.estimated_date || null,
            technician: data.technician || null,
            notes: data.notes || null,
            created_at: data.created_at || new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabase) {
            const { data: srvRow } = await supabase.from('services').insert([newService]).select().single();
            if (srvRow) return srvRow as Service;
        }

        const services = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        services.unshift(newService);
        setLocal(STORAGE_KEYS.SERVICES, services);
        return newService;
    },

    async updateService(id: number, updates: Partial<Service>): Promise<Service | null> {

        if (isSupabaseConfigured() && supabase) {
            const { data } = await supabase.from('services').update(updates).eq('id', id).select().single();
            if (data) return data as Service;
        }
        const services = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        const idx = services.findIndex(s => s.id === id);
        if (idx >= 0) {
                    const prev = services[idx];
        const updatedPrice = updates.price ?? updates.cost ?? prev.price ?? 0;
        const updatedCost = updates.cost ?? updates.price ?? prev.cost ?? updatedPrice;
        services[idx] = {
            ...prev,
            ...updates,
            price: updatedPrice,
            cost: updatedCost
        };
            setLocal(STORAGE_KEYS.SERVICES, services);
            return services[idx];
        }
        return null;
    },

    async deleteService(id: number): Promise<boolean> {
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('services').delete().eq('id', id);
        }
        const services = getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
        const filtered = services.filter(s => s.id !== id);
        setLocal(STORAGE_KEYS.SERVICES, filtered);
        return true;
    },

    async getDeliveries(): Promise<Delivery[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase.from('deliveries').select('*').order('created_at', { ascending: false });
            if (!error && data) return data as Delivery[];
        }
        return getLocal<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
    },

    async getDeliveryByCode(code: string): Promise<Delivery | null> {
        const deliveries = await this.getDeliveries();
        return deliveries.find(d => d.tracking_code.toLowerCase() === code.toLowerCase()) || null;
    },

    async createDelivery(data: any): Promise<Delivery> {
        const tracking_code = data.tracking_code || ('TRK-' + Math.floor(100000 + Math.random() * 900000));
        const delivery_pin = data.delivery_pin || String(Math.floor(1000 + Math.random() * 9000));
        const newDelivery: Delivery = {
            id: Date.now(),
            tracking_code,
            service_id: data.service_id ?? null,
            sale_id: data.sale_id ?? null,
            courier_name: data.courier_name || 'Kurir Toko',
            courier_phone: data.courier_phone || '',
            customer_name: data.customer_name || 'Pelanggan',
            customer_phone: data.customer_phone || '',
            customer_address: data.customer_address || '',
            customer_lat: data.customer_lat ?? -7.5678,
            customer_lng: data.customer_lng ?? 110.8250,
            courier_lat: data.courier_lat ?? -7.5610,
            courier_lng: data.courier_lng ?? 110.8170,
            delivery_pin,
            status: data.status || 'pending',
            notes: data.notes || '',
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured() && supabase) {
            const { data: delRow } = await supabase.from('deliveries').insert([newDelivery]).select().single();
            if (delRow) return delRow as Delivery;
        }

        const deliveries = getLocal<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
        deliveries.unshift(newDelivery);
        setLocal(STORAGE_KEYS.DELIVERIES, deliveries);
        return newDelivery;
    },

    async updateDelivery(idOrCode: number | string, updates: Partial<Delivery>): Promise<Delivery | null> {
        if (isSupabaseConfigured() && supabase) {
            const q = typeof idOrCode === 'number'
                ? supabase.from('deliveries').update(updates).eq('id', idOrCode)
                : supabase.from('deliveries').update(updates).eq('tracking_code', idOrCode);
            const { data } = await q.select().single();
            if (data) return data as Delivery;
        }
        const deliveries = getLocal<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
        const idx = deliveries.findIndex(d => d.id === idOrCode || d.tracking_code === idOrCode);
        if (idx >= 0) {
            deliveries[idx] = { ...deliveries[idx], ...updates };
            setLocal(STORAGE_KEYS.DELIVERIES, deliveries);
            return deliveries[idx];
        }
        return null;
    },

    async deleteDelivery(id: number): Promise<boolean> {
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('deliveries').delete().eq('id', id);
        }
        const deliveries = getLocal<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
        const filtered = deliveries.filter(d => d.id !== id);
        setLocal(STORAGE_KEYS.DELIVERIES, filtered);
        return true;
    },

    async updateCourierLocation(code: string | number, lat: number, lng: number): Promise<boolean> {
        const codeStr = String(code);
        if (isSupabaseConfigured() && supabase) {
            const channel = supabase.channel(`tracking:${codeStr}`);
            channel.send({
                type: 'broadcast',
                event: 'location_update',
                payload: { lat, lng, time: Date.now() }
            });
            await supabase.from('deliveries').update({ courier_lat: lat, courier_lng: lng }).eq('tracking_code', codeStr);
        }
        const deliveries = getLocal<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
        const item = deliveries.find(d => d.tracking_code === codeStr || String(d.id) === codeStr);
        if (item) {
            item.courier_lat = lat;
            item.courier_lng = lng;
            setLocal(STORAGE_KEYS.DELIVERIES, deliveries);
            return true;
        }
        return false;
    },

    async updateDeliveryLocation(code: string | number, lat: number, lng: number): Promise<boolean> {
        return this.updateCourierLocation(code, lat, lng);
    },

    async completeDelivery(code: string | number, pin: string): Promise<{ success: boolean; message: string }> {
        const codeStr = String(code);
        const deliveries = getLocal<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
        const item = deliveries.find(d => d.tracking_code === codeStr || String(d.id) === codeStr);
        if (!item) return { success: false, message: 'Data pengantaran tidak ditemukan!' };
        if (item.delivery_pin !== pin.trim()) {
            return { success: false, message: 'PIN Verifikasi Salah! Minta 4-digit PIN dari HP Pelanggan.' };
        }

        item.status = 'selesai';
        item.completed_at = new Date().toISOString();
        setLocal(STORAGE_KEYS.DELIVERIES, deliveries);

        if (isSupabaseConfigured() && supabase) {
            await supabase.from('deliveries').update({ status: 'selesai', completed_at: new Date().toISOString() }).eq('tracking_code', codeStr);
        }

        return { success: true, message: 'Pengantaran Berhasil Diselesaikan! HP resmi diterima pelanggan.' };
    },

    async getUsers(): Promise<UserProfile[]> {
        return getLocal<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    },

    async createUser(userData: any): Promise<UserProfile> {
        const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
        const newUser: UserProfile = {
            id: userData.id || Date.now(),
            name: userData.name || 'Pengguna Baru',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || 'pengguna',
            is_active: userData.is_active ?? true,
            created_at: userData.created_at || new Date().toISOString()
        };
        users.unshift(newUser);
        setLocal(STORAGE_KEYS.USERS, users);
        return newUser;
    },

    async updateUser(id: string | number, updates: Partial<UserProfile>): Promise<UserProfile | null> {
        const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
        const idx = users.findIndex(u => String(u.id) === String(id));
        if (idx >= 0) {
            users[idx] = { ...users[idx], ...updates };
            setLocal(STORAGE_KEYS.USERS, users);
            return users[idx];
        }
        return null;
    },

    async deleteUser(id: string | number): Promise<boolean> {
        const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
        const filtered = users.filter(u => String(u.id) !== String(id));
        setLocal(STORAGE_KEYS.USERS, filtered);
        return true;
    },

    async getNotifications(): Promise<Notification[]> {
        return getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    },

    async markNotificationRead(id: number): Promise<void> {
        const notifs = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
        const n = notifs.find(item => item.id === id);
        if (n) {
            n.is_read = true;
            setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
        }
    }
};
