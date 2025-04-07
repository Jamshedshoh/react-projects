import { useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import CyclingRecommendation from "./components/CyclingRecommendation";
import WeatherAlerts from "./components/WeatherAlerts";
import LocationSearch from "./components/LocationSearch";
import useWeatherData from "./hooks/useWeatherData";
import { Bike, Sun, CloudRain, Wind, Droplet, Gauge } from "lucide-react";
import { getWindDirection } from "./utils/weatherUtils";

function App() {
  const [selectedTab, setSelectedTab] = useState<
    "current" | "hourly" | "daily"
  >("current");
  const { weatherData, loading, error, setLocation } = useWeatherData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-blue-800">
            Loading weather data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">
            {error || "Failed to load weather data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <LocationSearch onSearch={setLocation} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {weatherData.location.name}, {weatherData.location.country}
            </h1>

            <div className="flex space-x-4 mt-4 border-b">
              <button
                onClick={() => setSelectedTab("current")}
                className={`pb-2 px-1 ${
                  selectedTab === "current"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setSelectedTab("hourly")}
                className={`pb-2 px-1 ${
                  selectedTab === "hourly"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Hourly
              </button>
              <button
                onClick={() => setSelectedTab("daily")}
                className={`pb-2 px-1 ${
                  selectedTab === "daily"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Daily
              </button>
            </div>

            {selectedTab === "current" && <CurrentWeather data={weatherData} />}
            {selectedTab === "hourly" && (
              <HourlyForecast data={weatherData.hourly} timezone="UTC" />
            )}
            {selectedTab === "daily" && (
              <DailyForecast data={weatherData.daily} timezone="UTC" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CyclingRecommendation data={weatherData} />

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Bike className="mr-2" /> Weather Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Sun className="text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">UV Index</p>
                    <p className="font-medium">
                      {weatherData.current.uv_index} (
                      {weatherData.current.uv_index < 3
                        ? "Low"
                        : weatherData.current.uv_index < 6
                        ? "Moderate"
                        : "High"}
                      )
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplet className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="font-medium">
                      {weatherData.current.humidity}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Wind</p>
                    <p className="font-medium">
                      {weatherData.current.wind_speed} km/h{" "}
                      {getWindDirection(weatherData.current.wind_deg)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Gauge className="text-purple-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Pressure</p>
                    <p className="font-medium">
                      {weatherData.current.pressure} hPa
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CloudRain className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Visibility</p>
                    <p className="font-medium">
                      {weatherData.current.visibility / 1000} km
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {weatherData.alerts && <WeatherAlerts alerts={weatherData.alerts} />}
      </div>
    </div>
  );
}

export default App;
