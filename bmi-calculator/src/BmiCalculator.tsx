import { useState } from 'react';

type UnitSystem = 'metric' | 'imperial';

const BmiCalculator = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const calculateBmi = () => {
    if (!height || !weight) return;

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);

    if (heightValue <= 0 || weightValue <= 0) return;

    let calculatedBmi: number;

    if (unitSystem === 'metric') {
      // BMI = weight (kg) / (height (m))^2
      calculatedBmi = weightValue / Math.pow(heightValue / 100, 2);
    } else {
      // BMI = 703 × weight (lb) / (height (in))^2
      calculatedBmi = (703 * weightValue) / Math.pow(heightValue, 2);
    }

    setBmi(parseFloat(calculatedBmi.toFixed(1)));
    determineBmiCategory(calculatedBmi);
  };

  const determineBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setBmiCategory('Normal weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obese');
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">BMI Calculator</h1>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-4 py-2 rounded-md ${unitSystem === 'metric' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-4 py-2 rounded-md ${unitSystem === 'imperial' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Imperial (lb/in)
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
            </label>
            <input
              type="number"
              id="height"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unitSystem === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              id="weight"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unitSystem === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={calculateBmi}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!height || !weight}
          >
            Calculate BMI
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>

        {bmi !== null && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-center text-gray-800">Your Results</h2>
            <div className="mt-2 text-center">
              <p className="text-4xl font-bold text-blue-600">{bmi}</p>
              <p className={`mt-2 text-lg font-medium ${
                bmiCategory === 'Underweight' ? 'text-yellow-500' :
                bmiCategory === 'Normal weight' ? 'text-green-500' :
                bmiCategory === 'Overweight' ? 'text-orange-500' :
                'text-red-500'
              }`}>
                {bmiCategory}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <h3 className="text-sm font-medium text-gray-700">BMI Categories:</h3>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Underweight</span>
                  <span>&lt; 18.5</span>
                </li>
                <li className="flex justify-between">
                  <span>Normal weight</span>
                  <span>18.5 - 24.9</span>
                </li>
                <li className="flex justify-between">
                  <span>Overweight</span>
                  <span>25 - 29.9</span>
                </li>
                <li className="flex justify-between">
                  <span>Obese</span>
                  <span>≥ 30</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>BMI is a screening tool but not a diagnostic of body fatness or health. Consult a healthcare provider for assessment.</p>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;