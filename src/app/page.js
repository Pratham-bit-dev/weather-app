'use client';

import { useEffect, useState } from 'react';

function getCurrentDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Home() {
  const date = getCurrentDate();
  const [city, setCity] = useState('Nagpur');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData(cityName) {
    try {
      setLoading(true);
      const response = await fetch(`/api/weather?address=${cityName}`);
      const jsonData = await response.json();

      if (jsonData.error) {
        console.error(jsonData.error);
        setWeatherData(null);
      } else {
        setWeatherData(jsonData);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(city);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    fetchData(city);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-400 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">🌦 Weather App</h1>
        <p className="text-center text-gray-500 mb-6">{date}</p>

        <form onSubmit={handleSubmit} className="flex mb-6 gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className=" text-black flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-center text-blue-600 font-medium">Loading weather data...</p>
        ) : weatherData ? (
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">{weatherData.name}</h2>
            <p className="text-5xl font-bold text-blue-600">{weatherData.main?.temp}°C</p>
            <p className="text-lg capitalize text-gray-600">
              {weatherData.weather?.[0]?.description}
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💧 Humidity: {weatherData.main?.humidity}%</p>
              <p>🌬 Wind: {weatherData.wind?.speed} m/s</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">No weather data found.</p>
        )}
      </div>
    </div>
  );
}
