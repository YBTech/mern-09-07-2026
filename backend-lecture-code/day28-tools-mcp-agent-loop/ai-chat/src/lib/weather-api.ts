// Open-Meteo: free, no API key. Forecasts up to 16 days ahead.
const WEATHER_CODES: Record<number, string> = {
  0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast", 45: "fog", 48: "fog",
  51: "light drizzle", 53: "drizzle", 55: "heavy drizzle", 61: "light rain", 63: "rain",
  65: "heavy rain", 71: "light snow", 73: "snow", 75: "heavy snow", 80: "rain showers",
  81: "rain showers", 82: "violent rain showers", 95: "thunderstorm", 96: "thunderstorm with hail",
};

export async function getWeather({ city, date }: { city: string; date: string }) {
  const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
  const place = ((await geo.json()) as any).results?.[0];
  if (!place) return { error: `Unknown city: ${city}` };

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&start_date=${date}&end_date=${date}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (!data.daily) return { error: data.reason ?? "No forecast for that date" };

  return {
    city: place.name,
    date,
    summary: WEATHER_CODES[data.daily.weather_code[0]] ?? "unknown",
    high: `${data.daily.temperature_2m_max[0]}°C`,
    low: `${data.daily.temperature_2m_min[0]}°C`,
    chanceOfRain: `${data.daily.precipitation_probability_max[0]}%`,
  };
}
