// weatherUtils.ts
export const getWeatherIcon = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const formatTemperature = (temp: number) => {
  return `${Math.round(temp)}°C`;
};

export const formatTime = (timestamp: number, timezone: string) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    timeZone: timezone,
  });
};

export const formatDate = (timestamp: number, timezone: string) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  });
};

export const getWindDirection = (deg: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index];
};