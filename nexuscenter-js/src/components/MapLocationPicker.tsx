'use client';

import { useEffect, useRef } from 'react';
import { STORE_LAT, STORE_LNG } from '@/lib/geo';

interface MapLocationPickerProps {
    visible?: boolean;
    lat: number;
    lng: number;
    height?: number | string;
    className?: string;
    interactive?: boolean;
    circleRadiusKm?: number;
    label?: string;
    onLocationChange?: (lat: number, lng: number) => void;
}

export default function MapLocationPicker({
    visible = true,
    lat,
    lng,
    height = 220,
    className = '',
    interactive = true,
    circleRadiusKm,
    label,
    onLocationChange,
}: MapLocationPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);
    const callbackRef = useRef(onLocationChange);

    // Keep callback ref updated to avoid stale closures
    useEffect(() => {
        callbackRef.current = onLocationChange;
    }, [onLocationChange]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;

        let isMounted = true;

        import('leaflet').then((L) => {
            if (!isMounted || !containerRef.current || mapInstanceRef.current) return;

            // Fix leaflet default marker icon asset paths
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const initialLat = Number.isFinite(lat) ? lat : STORE_LAT;
            const initialLng = Number.isFinite(lng) ? lng : STORE_LNG;

            const map = L.map(containerRef.current, {
                center: [initialLat, initialLng],
                zoom: circleRadiusKm ? 13 : 15,
                zoomControl: true,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            // Custom stylish pin icon
            const pinIcon = L.divIcon({
                className: 'custom-map-pin',
                html: `<div style="background-color:#00687a;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.35);cursor:${interactive ? 'grab' : 'default'};font-size:18px;">📍</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 34],
            });

            const marker = L.marker([initialLat, initialLng], {
                icon: pinIcon,
                draggable: interactive,
            }).addTo(map);

            if (label) {
                marker.bindPopup(`<b>${label}</b>`).openPopup();
            }

            if (circleRadiusKm && circleRadiusKm > 0) {
                const circle = L.circle([initialLat, initialLng], {
                    radius: circleRadiusKm * 1000,
                    color: '#00687a',
                    fillColor: '#00687a',
                    fillOpacity: 0.12,
                    weight: 2,
                    dashArray: '5, 5'
                }).addTo(map);
                circleRef.current = circle;
            }

            if (interactive) {
                marker.on('dragend', (e: any) => {
                    const pos = e.target.getLatLng();
                    if (circleRef.current) {
                        circleRef.current.setLatLng(pos);
                    }
                    if (callbackRef.current) {
                        callbackRef.current(pos.lat, pos.lng);
                    }
                });

                map.on('click', (e: any) => {
                    marker.setLatLng(e.latlng);
                    if (circleRef.current) {
                        circleRef.current.setLatLng(e.latlng);
                    }
                    if (callbackRef.current) {
                        callbackRef.current(e.latlng.lat, e.latlng.lng);
                    }
                });
            }

            mapInstanceRef.current = map;
            markerRef.current = marker;

            // Invalidate size immediately once loaded
            setTimeout(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                }
            }, 100);
        });

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    // Sync marker & map center when lat/lng change from outside (e.g. GPS or geocoding)
    useEffect(() => {
        if (!mapInstanceRef.current || !markerRef.current) return;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const currentPos = markerRef.current.getLatLng();
        const dist = Math.abs(currentPos.lat - lat) + Math.abs(currentPos.lng - lng);

        // Only update if difference is meaningful to prevent jumpiness
        if (dist > 0.00005) {
            markerRef.current.setLatLng([lat, lng]);
            if (circleRef.current) {
                circleRef.current.setLatLng([lat, lng]);
            }
            mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom() || 15);
        }
    }, [lat, lng]);

    // Handle visibility changes and automatic resize observation
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        if (visible) {
            // Trigger size invalidation on visible
            const timer = setTimeout(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                    if (Number.isFinite(lat) && Number.isFinite(lng)) {
                        mapInstanceRef.current.setView([lat, lng]);
                    }
                }
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [visible, lat, lng]);

    // ResizeObserver ensures map redraws correctly when container changes from hidden (0px) to visible (>0px)
    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.invalidateSize();
                    }
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const styleHeight = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            ref={containerRef}
            style={{ height: styleHeight, width: '100%' }}
            className={`bg-surface-container relative z-10 transition-all ${className}`}
        />
    );
}
