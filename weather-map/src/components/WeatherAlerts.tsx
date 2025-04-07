import { WeatherAlertsProps } from '../types/weatherTypes';
import { AlertTriangle } from 'lucide-react';

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Weather Alerts</h3>
            {alerts.map((alert, index) => (
              <div key={index} className="mt-2">
                <p className="text-sm font-medium text-red-700">{alert.event}</p>
                <p className="text-sm text-red-600">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;