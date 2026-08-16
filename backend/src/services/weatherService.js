// weather.service.js
export async function getCoordinates(cityName) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
    );
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }
    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name
    };
}

export async function getWeather({ latitude, longitude }) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    return {
        current: {
            temperature: data.current.temperature_2m,
            windSpeed: data.current.wind_speed_10m,
            weatherCode: data.current.weather_code
        },
        forecast: data.daily.time.map((date, i) => ({
            date,
            maxTemp: data.daily.temperature_2m_max[i],
            minTemp: data.daily.temperature_2m_min[i],
            weatherCode: data.daily.weather_code[i]
        }))
    };
}

export async function getWeatherByCity({ cityName }) {
    try {
        const { latitude, longitude, name } = await getCoordinates(cityName);
        const weather = await getWeather({ latitude, longitude });
        return { city: name, ...weather };
    } catch (err) {
        return { error: `Could not find weather for "${cityName}". ${err.message}` };
    }
}