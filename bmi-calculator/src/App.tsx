import "./App.css";
import BmiCalculator from "./BmiCalculator";
import EnhancedBmiCalculator from "./EnhancedBmiCalculator";
import GymCalculator from "./GymCalculator";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<'basic' | 'enhanced' | 'gym'>('basic');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex space-x-2 p-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Basic BMI
        </button>
        <button
          onClick={() => setActiveTab('enhanced')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'enhanced' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Enhanced BMI
        </button>
        <button
          onClick={() => setActiveTab('gym')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'gym' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Gym Calculator
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'basic' && <BmiCalculator />}
        {activeTab === 'enhanced' && <EnhancedBmiCalculator />}
        {activeTab === 'gym' && <GymCalculator />}
      </div>
    </div>
  );
}

export default App;
