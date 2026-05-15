import { NextResponse } from "next/server";

const CHARLESTON_LAT = 32.7765;
const CHARLESTON_LON = -79.9311;

const WEATHER_CODES: Record<
  number,
  { description: string; emoji: string }
> = {
  0: { description: "Clear", emoji: "☀️" },
  1: { description: "Mostly clear", emoji: "🌤️" },
  2: { description: "Partly cloudy", emoji: "⛅" },
  3: { description: "Overcast", emoji: "☁️" },
  45: { description: "Fog", emoji: "🌫️" },
  48: { description: "Freezing fog", emoji: "🌫️" },
  51: { description: "Light drizzle", emoji: "🌦️" },
  53: { description: "Drizzle", emoji: "🌦️" },
  55: { description: "Heavy drizzle", emoji: "🌧️" },
  61: { description: "Light rain", emoji: "🌦️" },
  63: { description: "Rain", emoji: "🌧️" },
  65: { description: "Heavy rain", emoji: "🌧️" },
  80: { description: "Showers", emoji: "🌦️" },
  81: { description: "Showers", emoji: "🌧️" },
  82: { description: "Heavy showers", emoji: "⛈️" },
  95: { description: "Thunderstorm", emoji: "⛈️" },
  96: { description: "Thunderstorm", emoji: "⛈️" },
  99: { description: "Thunderstorm", emoji: "⛈️" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(CHARLESTON_LAT));
  url.searchParams.set("longitude", String(CHARLESTON_LON));
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,weathercode",
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "America/New_York");
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream weather error" },
        { status: 502 },
      );
    }
    const json = await res.json();
    const high = json?.daily?.temperature_2m_max?.[0];
    const low = json?.daily?.temperature_2m_min?.[0];
    const code = json?.daily?.weathercode?.[0];
    if (
      typeof high !== "number" ||
      typeof low !== "number" ||
      typeof code !== "number"
    ) {
      return NextResponse.json(
        { error: "Forecast not available" },
        { status: 404 },
      );
    }
    const info = WEATHER_CODES[code] ?? {
      description: "—",
      emoji: "🌡️",
    };
    return NextResponse.json({
      high,
      low,
      code,
      description: info.description,
      emoji: info.emoji,
    });
  } catch {
    return NextResponse.json(
      { error: "Forecast unavailable" },
      { status: 500 },
    );
  }
}
