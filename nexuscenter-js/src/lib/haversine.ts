export function calculateDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const earthRadius = 6371000; // Radius Bumi dalam meter

    const latFrom = (lat1 * Math.PI) / 180;
    const lonFrom = (lon1 * Math.PI) / 180;
    const latTo = (lat2 * Math.PI) / 180;
    const lonTo = (lon2 * Math.PI) / 180;

    const latDelta = latTo - latFrom;
    const lonDelta = lonTo - lonFrom;

    const angle =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(latDelta / 2), 2) +
                Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)
            )
        );

    return Math.round(angle * earthRadius);
}
