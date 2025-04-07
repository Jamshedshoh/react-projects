import { useState, useEffect } from 'react';
import { WeatherData } from '../types/weatherTypes';

const useWeatherData = (initialLocation = 'London') => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you would call an actual weather API here
        // This is a mock implementation for demonstration
        const mockWeatherData: WeatherData = {
          location: {
            name: location,
            country: 'GB',
            lat: 51.5074,
            lon: -0.1278,
          },
          current: {
            temp: 18.5,
            feels_like: 17.2,
            humidity: 65,
            wind_speed: 12,
            wind_deg: 230,
            pressure: 1012,
            weather: [{
              main: 'Clouds',
              description: 'scattered clouds',
              icon: '03d',
            }],
            sunrise: 1643684400,
            sunset: 1643719200,
            uv_index: 4,
            visibility: 10000,
          },
          hourly: Array.from({ length: 24 }, (_, i) => ({
            dt: 1643688000 + i * 3600,
            temp: 15 + Math.sin(i / 24 * Math.PI) * 8,
            weather: [{
              main: i < 6 || i > 18 ? 'Clouds' : 'Clear',
              icon: i < 6 || i > 18 ? '03d' : '01d',
            }],
            pop: i > 12 && i < 15 ? 0.3 : 0,
            wind_speed: 10 + Math.random() * 5,
          })),
          daily: Array.from({ length: 7 }, (_, i) => ({
            dt: 1643688000 + i * 86400,
            temp: {
              min: 10 + i,
              max: 18 + i,
            },
            weather: [{
              main: i % 3 === 0 ? 'Rain' : 'Clouds',
              icon: i % 3 === 0 ? '10d' : '03d',
            }],
            pop: i % 3 === 0 ? 0.8 : 0.1,
            wind_speed: 12 + i,
            humidity: 60 + i * 2,
            sunrise: 1643684400 + i * 86400,
            sunset: 1643719200 + i * 86400,
          })),
          alerts: location === 'London' ? [{
            event: 'Wind Advisory',
            description: 'Strong winds expected this afternoon. Gusts up to 40 mph possible.',
          }] : undefined,
        };

        setWeatherData(mockWeatherData);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  return { weatherData, loading, error, setLocation };
};

export default useWeatherData;