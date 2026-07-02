import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("लोकेशन उपलब्ध नहीं है");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await apiClient.get("/weather", {
            params: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          setWeather(data);
        } catch (err) {
          setError("मौसम जानकारी लोड नहीं हो सकी");
        }
      },
      () => setError("लोकेशन अनुमति आवश्यक है")
    );
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
      <h4 className="font-display font-bold mb-2">☁️ मौसम</h4>
      {error && <p className="text-xs text-gray-500">{error}</p>}
      {weather ? (
        <div>
          <p className="text-2xl font-bold">{Math.round(weather.temp)}°C</p>
          <p className="text-sm text-gray-600">{weather.location} • {weather.description}</p>
          <p className="text-xs text-gray-400 mt-1">नमी: {weather.humidity}% • हवा: {weather.windSpeed} मी/से</p>
        </div>
      ) : (
        !error && <p className="text-xs text-gray-400">लोड हो रहा है...</p>
      )}
    </div>
  );
}
