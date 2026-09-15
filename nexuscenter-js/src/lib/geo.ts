// Lokasi Toko/Konter: FQ2W+XGM, Fajar Indah, Baturan, Kec. Colomadu, Karanganyar, Jawa Tengah 57171
export const STORE_LAT = -7.547621;
export const STORE_LNG = 110.796252;
export const FREE_DELIVERY_KM = 4;

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isSamePoint(lat1: number, lng1: number, lat2: number, lng2: number, epsilonKm = 0.05): boolean {
    return haversineKm(lat1, lng1, lat2, lng2) <= epsilonKm;
}

export function parseMapCoords(text: string): { lat: number; lng: number } | null {
    const match =
        text.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/) ||
        text.match(/q=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/) ||
        text.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
    if (!match) return null;
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return { lat, lng };
}

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
    const q = query.trim();
    if (q.length < 8) return null;

    const coords = parseMapCoords(q);
    if (coords) return coords;

    let searchQuery = q;
    if (!/sukoharjo|surakarta|solo|jawa\s+tengah|colomadu|karanganyar|baturan|kartasura/i.test(searchQuery)) {
        searchQuery += ', Colomadu, Karanganyar, Jawa Tengah';
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=id`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.length) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
}
