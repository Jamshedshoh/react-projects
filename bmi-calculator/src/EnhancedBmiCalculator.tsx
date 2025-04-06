import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type UnitSystem = 'metric' | 'imperial';
type Gender = 'male' | 'female' | 'other';

interface BmiRecord {
  date: Date;
  bmi: number;
  weight: number;
  height: number;
  unitSystem: UnitSystem;
  age: number;
  gender: Gender;
}

const EnhancedBmiCalculator = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [history, setHistory] = useState<BmiRecord[]>([]);
  const [showChart, setShowChart] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('bmiHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setHistory(historyWithDates);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('bmiHistory', JSON.stringify(history));
    }
  }, [history]);

  const calculateBmi = () => {
    if (!height || !weight || !age) return;

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseInt(age);

    if (heightValue <= 0 || weightValue <= 0 || ageValue <= 0) return;

    let calculatedBmi: number;

    if (unitSystem === 'metric') {
      calculatedBmi = weightValue / Math.pow(heightValue / 100, 2);
    } else {
      calculatedBmi = (703 * weightValue) / Math.pow(heightValue, 2);
    }

    const roundedBmi = parseFloat(calculatedBmi.toFixed(1));
    setBmi(roundedBmi);
    determineBmiCategory(roundedBmi, ageValue);

    // Add to history
    const newRecord: BmiRecord = {
      date: new Date(),
      bmi: roundedBmi,
      weight: weightValue,
      height: heightValue,
      unitSystem,
      age: ageValue,
      gender
    };

    setHistory(prev => [newRecord, ...prev.slice(0, 9)]); // Keep last 10 records
  };

  const determineBmiCategory = (bmiValue: number, ageValue: number) => {
    // Different categories for children/adolescents vs adults
    if (ageValue < 18) {
      // Simplified pediatric categories (in reality would use growth charts)
      if (bmiValue < 5) {
        setBmiCategory('Underweight (pediatric)');
      } else if (bmiValue >= 5 && bmiValue < 85) {
        setBmiCategory('Normal weight (pediatric)');
      } else if (bmiValue >= 85 && bmiValue < 95) {
        setBmiCategory('Overweight (pediatric)');
      } else {
        setBmiCategory('Obese (pediatric)');
      }
    } else {
      // Adult categories
      if (bmiValue < 18.5) {
        setBmiCategory('Underweight');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory('Normal weight');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
    setAge('');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bmiHistory');
  };

  // Prepare data for the chart
  const chartData = {
    labels: history.map(record => format(record.date, 'MMM d')),
    datasets: [
      {
        label: 'BMI',
        data: history.map(record => record.bmi),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1
      },
      {
        label: 'Weight',
        data: history.map(record => record.weight),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'BMI'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: `Weight (${unitSystem === 'metric' ? 'kg' : 'lbs'})`
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Advanced BMI Calculator</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
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
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  min="2"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="flex space-x-4">
                  {(['male', 'female', 'other'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-4 py-2 rounded-md capitalize ${gender === g ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

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
                disabled={!height || !weight || !age}
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
                    bmiCategory.includes('Underweight') ? 'text-yellow-500' :
                    bmiCategory.includes('Normal') ? 'text-green-500' :
                    bmiCategory.includes('Overweight') ? 'text-orange-500' :
                    'text-red-500'
                  }`}>
                    {bmiCategory}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results/History Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">History</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowChart(!showChart)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md"
                >
                  {showChart ? 'Show Table' : 'Show Chart'}
                </button>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-md"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>

            {showChart ? (
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                {history.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">BMI</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">Weight</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase text-gray-500">Height</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {history.map((record, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                            {format(record.date, 'MMM d, yyyy')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.bmi}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.weight} {record.unitSystem === 'metric' ? 'kg' : 'lbs'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.height} {record.unitSystem === 'metric' ? 'cm' : 'in'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No history yet. Calculate your BMI to see results here.
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">BMI Categories:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Adults (≥18)</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex justify-between">
                      <span className="text-yellow-600">Underweight</span>
                      <span>&lt; 18.5</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-green-600">Normal weight</span>
                      <span>18.5 - 24.9</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-orange-600">Overweight</span>
                      <span>25 - 29.9</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-red-600">Obese</span>
                      <span>≥ 30</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Children (2-17)*</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex justify-between">
                      <span className="text-yellow-600">Underweight</span>
                      <span>&lt; 5th %ile</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-green-600">Normal weight</span>
                      <span>5th - 85th %ile</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-orange-600">Overweight</span>
                      <span>85th - 95th %ile</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-red-600">Obese</span>
                      <span>≥ 95th %ile</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">* Pediatric categories are simplified. Actual assessment uses growth charts.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>BMI is a screening tool but not a diagnostic of body fatness or health. It may not be accurate for athletes, pregnant women, or the elderly. Consult a healthcare provider for assessment.</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBmiCalculator;