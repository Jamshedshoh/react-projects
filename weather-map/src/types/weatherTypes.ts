export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    pressure: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    sunrise: number;
    sunset: number;
    uv_index: number;
    visibility: number;
  };
  hourly: {
    dt: number;
    temp: number;
    weather: {
      main: string;
      icon: string;
    }[];
    pop: number;
    wind_speed: number;
  }[];
  daily: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      main: string;
      icon: string;
    }[];
    pop: number;
    wind_speed: number;
    humidity: number;
    sunrise: number;
    sunset: number;
  }[];
  alerts?: {
    event: string;
    description: string;
  }[];
}

export interface CyclingRecommendation {
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  message: string;
  tips: string[];
  gearSuggestions: string[];
}

export interface LocationSearchProps {
  onSearch: (location: string) => void;
}

export interface CurrentWeatherProps {
  data: WeatherData;
}

export interface HourlyForecastProps {
  data: WeatherData['hourly'];
  timezone: string;
}

export interface DailyForecastProps {
  data: WeatherData['daily'];
  timezone: string;
}

export interface CyclingRecommendationProps {
  data: WeatherData;
}

export interface WeatherAlertsProps {
  alerts?: WeatherData['alerts'];
}