import { DailyForecastProps } from '../types/weatherTypes';
import { getWeatherIcon, formatTemperature, formatDate } from '../utils/weatherUtils';

const DailyForecast = ({ data, timezone }: DailyForecastProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">7-Day Forecast</h3>
      <div className="space-y-3">
        {data.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <div className="w-24">
              <p className="font-medium">{formatDate(day.dt, timezone)}</p>
            </div>
            <div className="flex items-center">
              <img 
                src={getWeatherIcon(day.weather[0].icon)} 
                alt="Weather icon" 
                className="w-10 h-10"
              />
            </div>
            <div className="text-right">
              <p className="font-medium">{formatTemperature(day.temp.max)}</p>
              <p className="text-sm text-gray-500">{formatTemperature(day.temp.min)}</p>
            </div>
            <div className="w-16 text-right">
              <p className="text-sm text-gray-500">{Math.round(day.pop * 100)}%</p>
              <p className="text-xs text-gray-400">{day.wind_speed} km/h</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;