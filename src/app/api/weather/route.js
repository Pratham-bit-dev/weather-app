import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const apiKey = "c1d6bb4fd283ba4afe1d2d3c2090ddbf"; // Use your actual key

  try {
    // Step 1: Get coordinates
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${address}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const { lat, lon } = geoData[0];

    // Step 2: Get weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      return NextResponse.json({ error: weatherData.message }, { status: weatherData.cod });
    }

    return NextResponse.json(weatherData);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
