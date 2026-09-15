'use client';

import { Product } from '@/types/database';
import { DataService } from '@/lib/store';

export interface CartItem {
    id: number;
    name: string;
    brand: string;
    price: number;
    qty: number;
    image?: string;
    icon?: string;
    product?: Product;
}

const STORAGE_KEY = 'nexus_cart';
const CHECKOUT_KEY = 'nexus_checkout_cart';
const CHECKOUT_PREFS_KEY = 'nexus_checkout_prefs';

export type CheckoutDeliveryType = 'delivery' | 'pickup';

export interface CheckoutPrefs {
    deliveryType: CheckoutDeliveryType;
    address?: string;
    lat?: number;
    lng?: number;
}

export function parsePrice(val: any): number {
    if (typeof val === 'number') {
        return isNaN(val) ? 0 : val;
    }
    if (!val) return 0;
    // Extract only digits from string like "Rp 19.999.000" or "19999000"
    const cleaned = String(val).replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
}

export function normalizeCart(rawItems: any[]): CartItem[] {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map((it, idx) => {
        const p = it.product || it;
        const id = Number(p.id ?? it.id ?? (idx + 1));
        const name = String(p.name ?? it.name ?? 'Produk Smartphone');
        const brand = String(p.brand ?? it.brand ?? 'TECHCELL');
        const price = parsePrice(p.price ?? it.price);
        const qty = Math.max(1, Number(it.qty ?? it.quantity ?? 1) || 1);
        const image = p.image ?? it.image ?? undefined;
        const icon = p.icon ?? it.icon ?? '📱';

        return {
            id,
            name,
            brand,
            price,
            qty,
            image,
            icon,
            product: p
        };
    }).filter(it => it.id > 0);
}

export function getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        const normalized = normalizeCart(parsed);
        // If normalization changed anything, re-save silently to heal localStorage
        if (JSON.stringify(normalized) !== stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
        return normalized;
    } catch {
        return [];
    }
}

export function saveCart(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
        const normalized = normalizeCart(items);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error('Failed to save cart', e);
    }
}

export function addToCart(product: Product, qty: number = 1): CartItem[] {
    if (typeof window !== 'undefined' && !DataService.isLoggedIn()) {
        throw new Error('LOGIN_REQUIRED');
    }

    const cart = getCart();
    const existingIndex = cart.findIndex(it => it.id === product.id);
    const price = parsePrice(product.price);

    if (existingIndex >= 0) {
        cart[existingIndex].qty += qty;
        if (!cart[existingIndex].name) cart[existingIndex].name = product.name;
        if (!cart[existingIndex].price) cart[existingIndex].price = price;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand || 'TECHCELL',
            price,
            qty,
            image: product.image ?? undefined,
            icon: product.icon || '📱',
            product
        });
    }

    saveCart(cart);
    return cart;
}

export function getSelectedCheckoutItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CHECKOUT_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const items = normalizeCart(parsed);
            if (items.length > 0) return items;
        }
    } catch {}
    // Fallback to all items in cart
    return getCart();
}

export function setSelectedCheckoutItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CHECKOUT_KEY, JSON.stringify(normalizeCart(items)));
    } catch {}
}

export function setCheckoutPrefs(prefs: CheckoutPrefs): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CHECKOUT_PREFS_KEY, JSON.stringify(prefs));
    } catch {}
}

export function getCheckoutPrefs(): CheckoutPrefs | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(CHECKOUT_PREFS_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        if (parsed?.deliveryType === 'delivery' || parsed?.deliveryType === 'pickup') {
            return {
                deliveryType: parsed.deliveryType,
                address: typeof parsed.address === 'string' ? parsed.address : undefined,
                lat: typeof parsed.lat === 'number' ? parsed.lat : undefined,
                lng: typeof parsed.lng === 'number' ? parsed.lng : undefined,
            };
        }
    } catch {}
    return null;
}

export function removeItemsFromCart(itemIdsToRemove: number[]): void {
    const current = getCart();
    const remaining = current.filter(it => !itemIdsToRemove.includes(it.id));
    saveCart(remaining);
    try {
        localStorage.removeItem(CHECKOUT_KEY);
        localStorage.removeItem(CHECKOUT_PREFS_KEY);
    } catch {}
}
