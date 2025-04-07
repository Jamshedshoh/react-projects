import { useState } from 'react';
import './App.css';
import PhraseLearner from './PhraseLearner';
import Translator from './Translator';
import SpellingChecker from './SpellingChecker';

function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'phraseLearner' | 'spellingChecker'>('translator');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex space-x-2 p-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('translator')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'translator'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Translator
        </button>
        <button
          onClick={() => setActiveTab('phraseLearner')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'phraseLearner'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Phrase Learner
        </button>
        <button
          onClick={() => setActiveTab('spellingChecker')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'spellingChecker'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Spelling Checker
        </button>
      </div>
      
      {activeTab === 'translator' && <Translator />}
      {activeTab === 'phraseLearner' && <PhraseLearner />}
      {activeTab === 'spellingChecker' && <SpellingChecker />}
    </div>
  );
}

export default App;
