// cyclingUtils.ts
import { WeatherData, CyclingRecommendation } from '../types/weatherTypes';

export const getCyclingRecommendation = (data: WeatherData): CyclingRecommendation => {
  const { current } = data;
  const temp = current.temp;
  const windSpeed = current.wind_speed;
  const precipitation = current.weather[0].main;
  const visibility = current.visibility;
  const uvIndex = current.uv_index;

  // Temperature evaluation
  const tempRating = temp >= 15 && temp <= 25 ? 2 : 
                   (temp >= 10 && temp < 15) || (temp > 25 && temp <= 30) ? 1 : 0;

  // Wind evaluation
  const windRating = windSpeed < 20 ? 2 : windSpeed < 30 ? 1 : 0;

  // Precipitation evaluation
  const precipRating = ['Clear', 'Clouds'].includes(precipitation) ? 2 : 
                      ['Mist', 'Drizzle'].includes(precipitation) ? 1 : 0;

  // Visibility evaluation
  const visibilityRating = visibility > 5000 ? 2 : visibility > 1000 ? 1 : 0;

  // UV evaluation
  const uvRating = uvIndex < 6 ? 2 : uvIndex < 8 ? 1 : 0;

  const totalScore = tempRating + windRating + precipRating + visibilityRating + uvRating;

  if (totalScore >= 8) {
    return {
      level: 'excellent',
      message: 'Perfect cycling weather!',
      tips: [
        'Enjoy your ride!',
        'Great day for a long distance trip',
        'Consider sun protection if riding for extended periods'
      ],
      gearSuggestions: [
        'Regular cycling gear',
        'Sunglasses',
        'Sunscreen'
      ]
    };
  } else if (totalScore >= 6) {
    return {
      level: 'good',
      message: 'Good conditions for cycling',
      tips: [
        'Check wind direction before heading out',
        'Dress in layers for temperature changes'
      ],
      gearSuggestions: [
        'Windproof jacket',
        'Arm/Leg warmers'
      ]
    };
  } else if (totalScore >= 4) {
    return {
      level: 'fair',
      message: 'Fair conditions - ride with caution',
      tips: [
        'Be prepared for changing conditions',
        'Avoid exposed routes if windy',
        'Watch for slippery surfaces'
      ],
      gearSuggestions: [
        'Waterproof jacket',
        'Gloves',
        'Lights for visibility'
      ]
    };
  } else if (totalScore >= 2) {
    return {
      level: 'poor',
      message: 'Poor cycling conditions',
      tips: [
        'Consider indoor training instead',
        'If riding, stick to short distances',
        'Avoid busy roads'
      ],
      gearSuggestions: [
        'Full waterproof gear',
        'High-visibility clothing',
        'Mudguards'
      ]
    };
  } else {
    return {
      level: 'dangerous',
      message: 'Dangerous cycling conditions',
      tips: [
        'Not recommended to cycle today',
        'Consider alternative transportation',
        'If you must ride, take extreme caution'
      ],
      gearSuggestions: [
        'Only ride if absolutely necessary',
        'Full protective gear',
        'Emergency equipment'
      ]
    };
  }
};