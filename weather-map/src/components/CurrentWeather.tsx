import { CurrentWeatherProps } from '../types/weatherTypes';
import { getWeatherIcon, formatTemperature, formatTime } from '../utils/weatherUtils';

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="flex items-center">
            <img 
              src={getWeatherIcon(data.current.weather[0].icon)} 
              alt={data.current.weather[0].description} 
              className="w-16 h-16"
            />
            <div>
              <p className="text-4xl font-bold">{formatTemperature(data.current.temp)}</p>
              <p className="text-gray-500 capitalize">{data.current.weather[0].description}</p>
              <p className="text-sm text-gray-400">Feels like {formatTemperature(data.current.feels_like)}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Sunrise: {formatTime(data.current.sunrise, 'UTC')}
          </p>
          <p className="text-sm text-gray-500">
            Sunset: {formatTime(data.current.sunset, 'UTC')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;