import { HourlyForecastProps } from '../types/weatherTypes';
import { getWeatherIcon, formatTemperature, formatTime } from '../utils/weatherUtils';

const HourlyForecast = ({ data, timezone }: HourlyForecastProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Hourly Forecast</h3>
      <div className="flex overflow-x-auto pb-2 -mx-2">
        {data.map((hour, index) => (
          <div key={index} className="flex-shrink-0 px-2">
            <div className="bg-gray-50 rounded-lg p-3 w-20 text-center">
              <p className="text-sm font-medium">{formatTime(hour.dt, timezone)}</p>
              <img 
                src={getWeatherIcon(hour.weather[0].icon)} 
                alt="Weather icon" 
                className="w-10 h-10 mx-auto"
              />
              <p className="font-medium">{formatTemperature(hour.temp)}</p>
              <p className="text-xs text-gray-500">{Math.round(hour.pop * 100)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;