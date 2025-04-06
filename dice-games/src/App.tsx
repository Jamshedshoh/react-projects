import "./App.css";
import DiceGame from "./DiceGame";
import SudokuGame from "./SudokuGame";
import PuzzleMatchGame from "./PuzzleMatchGame";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<'dice' | 'sudoku' | 'puzzle'>('dice');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Games</h1>
        
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('dice')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'dice' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Dice Game
          </button>
          <button
            onClick={() => setActiveTab('sudoku')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'sudoku'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sudoku
          </button>
          <button
            onClick={() => setActiveTab('puzzle')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'puzzle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Puzzle Match
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'dice' ? <DiceGame /> : activeTab === 'sudoku' ? <SudokuGame /> : <PuzzleMatchGame />}
        </div>
      </div>
    </div>
  );
}

export default App;
