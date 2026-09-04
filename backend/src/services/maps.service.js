import axios from "axios";

async function geocode(place) {
    const res = await axios.get("https://api.openrouteservice.org/geocode/search", {
        params: {
            api_key: process.env.ORS_API_KEY,
            text: place,
        },
    });
    const coords = res.data.features[0]?.geometry?.coordinates;
    if (!coords) throw new Error(`Could not find location: ${place}`);
    return coords;
}

export async function getDirections({ origin, destination }) {
    try {
        const originCoords = await geocode(origin);
        const destCoords = await geocode(destination);

        const routeRes = await axios.get("https://api.openrouteservice.org/v2/directions/driving-car", {
            params: {
                api_key: process.env.ORS_API_KEY,
                start: `${originCoords[0]},${originCoords[1]}`,
                end: `${destCoords[0]},${destCoords[1]}`,
            },
        });

        const summary = routeRes.data.features[0].properties.summary;

        return {
            distance: (summary.distance / 1000).toFixed(1) + " km",
            duration: (summary.duration / 3600).toFixed(1) + " hours",
            startLocation: { lat: originCoords[1], lng: originCoords[0] },
            endLocation: { lat: destCoords[1], lng: destCoords[0] },
            startName: origin,
            endName: destination,
        };
    } catch (err) {
        return { error: `Could not get directions from ${origin} to ${destination}: ${err.message}` };
    }
}