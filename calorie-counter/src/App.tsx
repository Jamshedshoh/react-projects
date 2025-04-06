import "./App.css";
import CalorieCounter from "./CalorieCounter";
import ExerciseTodo from "./ExerciseTodo";
import ExerciseTimer from "./ExerciseTimer";
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'exercises' | 'timer'>('nutrition');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'nutrition' 
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Nutrition
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'exercises'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Exercises
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'timer'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Timer
        </button>
      </div>

      {activeTab === 'nutrition' && <CalorieCounter />}
      {activeTab === 'exercises' && <ExerciseTodo />}
      {activeTab === 'timer' && <ExerciseTimer />}
    </div>
  );
}

export default App;
