'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapTrackingProps {
    courierLat: number | null;
    courierLng: number | null;
    destLat: number | null;
    destLng: number | null;
    destAddress: string;
}

export default function MapTracking({
    courierLat,
    courierLng,
    destLat,
    destLng,
    destAddress
}: MapTrackingProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const courierMarkerRef = useRef<L.Marker | null>(null);
    const destMarkerRef = useRef<L.Marker | null>(null);
    const routeLineRef = useRef<L.Polyline | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const defaultLat = destLat || -7.5678;
        const defaultLng = destLng || 110.8250;

        const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        mapRef.current = map;

        // Custom House Icon
        const houseIcon = L.divIcon({
            className: 'custom-house-icon',
            html: `<div style="background-color:#00687a;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);font-size:18px;">🏠</div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        const houseMarker = L.marker([defaultLat, defaultLng], { icon: houseIcon })
            .addTo(map)
            .bindPopup(`<b>Alamat Tujuan:</b><br>${destAddress || 'Rumah Pelanggan'}`);
        destMarkerRef.current = houseMarker;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Update Courier Marker & OSRM Route when courier coords change
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        if (courierLat && courierLng) {
            const motorIcon = L.divIcon({
                className: 'custom-motor-icon',
                html: `<div style="background-color:#16a34a;color:white;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.4);font-size:20px;">🛵</div>`,
                iconSize: [38, 38],
                iconAnchor: [19, 19]
            });

            if (!courierMarkerRef.current) {
                courierMarkerRef.current = L.marker([courierLat, courierLng], { icon: motorIcon })
                    .addTo(map)
                    .bindPopup('<b>Posisi Kurir TECHCELL</b>');
            } else {
                courierMarkerRef.current.setLatLng([courierLat, courierLng]);
            }

            // Fetch OSRM Road Route
            if (destLat && destLng) {
                fetch(`https://router.project-osrm.org/route/v1/driving/${courierLng},${courierLat};${destLng},${destLat}?overview=full&geometries=geojson`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.routes && data.routes.length > 0) {
                            const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
                            if (routeLineRef.current) map.removeLayer(routeLineRef.current);
                            routeLineRef.current = L.polyline(coords, {
                                color: '#00687a',
                                weight: 5,
                                opacity: 0.85
                            }).addTo(map);
                            map.fitBounds(routeLineRef.current.getBounds(), { padding: [40, 40] });
                        }
                    })
                    .catch(() => {
                        // Fallback straight line
                        if (routeLineRef.current) map.removeLayer(routeLineRef.current);
                        routeLineRef.current = L.polyline([[courierLat, courierLng], [destLat, destLng]], {
                            color: '#00687a',
                            dashArray: '8, 8',
                            weight: 3
                        }).addTo(map);
                    });
            }
        }
    }, [courierLat, courierLng, destLat, destLng]);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-[400px] md:h-[450px] rounded-2xl border border-slate-200 shadow-inner z-10"
        />
    );
}
