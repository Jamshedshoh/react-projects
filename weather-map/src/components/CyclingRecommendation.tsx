import { CyclingRecommendationProps } from '../types/weatherTypes';
import { getCyclingRecommendation } from '../utils/cyclingUtils';
import { Bike, Sun, CloudRain, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

const CyclingRecommendation = ({ data }: CyclingRecommendationProps) => {
  const recommendation = getCyclingRecommendation(data);

  const getLevelColor = () => {
    switch (recommendation.level) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'dangerous': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = () => {
    switch (recommendation.level) {
      case 'excellent': return <CheckCircle className="mr-1" />;
      case 'dangerous': return <AlertTriangle className="mr-1" />;
      default: return <Bike className="mr-1" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Bike className="mr-2" /> Cycling Recommendation
        </h2>
        
        <div className={`flex items-center px-4 py-2 rounded-lg mb-4 ${getLevelColor()}`}>
          {getLevelIcon()}
          <span className="font-medium">{recommendation.message}</span>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Tips:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {recommendation.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Gear Suggestions:</h3>
          <div className="flex flex-wrap gap-2">
            {recommendation.gearSuggestions.map((gear, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {gear}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyclingRecommendation;