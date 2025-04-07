import { Check, Edit2, Plus, Trash2, Volume2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PHRASES } from './data';


type Language = 'english' | 'french' | 'spanish';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Phrase {
  id: string;
  english: string;
  french: string;
  spanish: string;
  category: string;
  difficulty: Difficulty;
  lastPracticed?: Date;
  mastered: boolean;
}

const initialPhrases: Phrase[] = PHRASES;

const categories = ['All', 'Greetings', 'Common', 'Food', 'Travel'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const PhraseLearner = () => {
  const [phrases, setPhrases] = useState<Phrase[]>(() => {
    const saved = localStorage.getItem('phrases');
    return saved ? JSON.parse(saved) : initialPhrases;
  });
  const [targetLanguage, setTargetLanguage] = useState<Language>('french');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhrase, setNewPhrase] = useState<Omit<Phrase, 'id' | 'mastered'>>({ 
    english: '', 
    french: '', 
    spanish: '', 
    category: '', 
    difficulty: 'easy' 
  });
  const [editPhraseId, setEditPhraseId] = useState<string | null>(null);

  // Save phrases to localStorage
  useEffect(() => {
    localStorage.setItem('phrases', JSON.stringify(phrases));
  }, [phrases]);

  // Filter phrases based on selected category and difficulty
  const filteredPhrases = phrases.filter(phrase => {
    const categoryMatch = selectedCategory === 'All' || phrase.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || phrase.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const currentPhrase = filteredPhrases[currentPhraseIndex];

  // Speak the phrase using browser's speech synthesis
  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'french' ? 'fr-FR' : lang === 'spanish' ? 'es-ES' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const nextPhrase = () => {
    setShowAnswer(false);
    setCurrentPhraseIndex(prev => 
      prev >= filteredPhrases.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhrase = () => {
    setShowAnswer(false);
    setCurrentPhraseIndex(prev => 
      prev <= 0 ? filteredPhrases.length - 1 : prev - 1
    );
  };

  const markAsMastered = (id: string) => {
    setPhrases(phrases.map(phrase => 
      phrase.id === id ? { ...phrase, mastered: !phrase.mastered } : phrase
    ));
  };

  const addPhrase = () => {
    if (!newPhrase.english || !newPhrase.french || !newPhrase.spanish || !newPhrase.category) return;

    const phrase: Phrase = {
      ...newPhrase,
      id: Date.now().toString(),
      mastered: false
    };

    setPhrases([...phrases, phrase]);
    setNewPhrase({ english: '', french: '', spanish: '', category: '', difficulty: 'easy' });
    setShowAddForm(false);
  };

  const updatePhrase = () => {
    if (!editPhraseId || !newPhrase.english || !newPhrase.french || !newPhrase.spanish || !newPhrase.category) return;

    setPhrases(phrases.map(phrase => 
      phrase.id === editPhraseId ? { ...phrase, ...newPhrase } : phrase
    ));
    setEditPhraseId(null);
    setNewPhrase({ english: '', french: '', spanish: '', category: '', difficulty: 'easy' });
  };

  const deletePhrase = (id: string) => {
    setPhrases(phrases.filter(phrase => phrase.id !== id));
    if (currentPhrase?.id === id) {
      nextPhrase();
    }
  };

  const startEdit = (phrase: Phrase) => {
    setEditPhraseId(phrase.id);
    setNewPhrase({
      english: phrase.english,
      french: phrase.french,
      spanish: phrase.spanish,
      category: phrase.category,
      difficulty: phrase.difficulty
    });
  };

  const cancelEdit = () => {
    setEditPhraseId(null);
    setNewPhrase({ english: '', french: '', spanish: '', category: '', difficulty: 'easy' });
  };

  const masteredCount = phrases.filter(p => p.mastered).length;
  const progressPercentage = phrases.length > 0 ? Math.round((masteredCount / phrases.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Language Phrase Learner</h1>
        <p className="text-center text-gray-600 mb-8">Learn phrases in English, French, and Spanish</p>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Learning Progress</span>
            <span>{masteredCount}/{phrases.length} mastered ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Language Selection */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Practice Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Language</label>
                <div className="flex space-x-2">
                  {(['french', 'spanish'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setTargetLanguage(lang)}
                      className={`flex-1 py-2 rounded-md capitalize ${
                        targetLanguage === lang 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practice Mode</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPracticeMode('flashcards')}
                    className={`flex-1 py-2 rounded-md ${
                      practiceMode === 'flashcards' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => setPracticeMode('quiz')}
                    className={`flex-1 py-2 rounded-md ${
                      practiceMode === 'quiz' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'All')}
                >
                  <option value="All">All</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty} className="capitalize">
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Flashcard/Quiz Area */}
        {filteredPhrases.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              {practiceMode === 'flashcards' ? (
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">English</h3>
                    <p className="text-2xl font-bold">{currentPhrase.english}</p>
                    <button 
                      onClick={() => speak(currentPhrase.english, 'english')}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="inline mr-1" /> Pronounce
                    </button>
                  </div>

                  {showAnswer ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-2 capitalize">
                        {targetLanguage}
                      </h3>
                      <p className="text-2xl font-bold">
                        {targetLanguage === 'french' ? currentPhrase.french : currentPhrase.spanish}
                      </p>
                      <button 
                        onClick={() => speak(
                          targetLanguage === 'french' ? currentPhrase.french : currentPhrase.spanish, 
                          targetLanguage
                        )}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        <Volume2 className="inline mr-1" /> Pronounce
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-6"
                    >
                      Show Answer
                    </button>
                  )}

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={prevPhrase}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => markAsMastered(currentPhrase.id)}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        currentPhrase.mastered 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {currentPhrase.mastered ? (
                        <>
                          <Check className="mr-1" /> Mastered
                        </>
                      ) : 'Mark as Mastered'}
                    </button>
                    <button
                      onClick={nextPhrase}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-6">Quiz Mode Coming Soon!</h3>
                  <p className="text-gray-600">The quiz feature will test your knowledge of the phrases.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center mb-6">
            <p className="text-gray-600">No phrases match your selected filters.</p>
          </div>
        )}

        {/* Phrase Management */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Phrases</h2>
            <button
              onClick={() => {
                setShowAddForm(true);
                cancelEdit();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
            >
              <Plus className="mr-1" /> Add Phrase
            </button>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editPhraseId) && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-3">
                {editPhraseId ? 'Edit Phrase' : 'Add New Phrase'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newPhrase.english}
                    onChange={(e) => setNewPhrase({...newPhrase, english: e.target.value})}
                    placeholder="English phrase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">French</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newPhrase.french}
                    onChange={(e) => setNewPhrase({...newPhrase, french: e.target.value})}
                    placeholder="French translation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spanish</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newPhrase.spanish}
                    onChange={(e) => setNewPhrase({...newPhrase, spanish: e.target.value})}
                    placeholder="Spanish translation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newPhrase.category}
                    onChange={(e) => setNewPhrase({...newPhrase, category: e.target.value})}
                    placeholder="Category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newPhrase.difficulty}
                    onChange={(e) => setNewPhrase({...newPhrase, difficulty: e.target.value as Difficulty})}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff} className="capitalize">{diff}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={editPhraseId ? updatePhrase : addPhrase}
                  disabled={!newPhrase.english || !newPhrase.french || !newPhrase.spanish || !newPhrase.category}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    !newPhrase.english || !newPhrase.french || !newPhrase.spanish || !newPhrase.category
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Check className="mr-1" /> {editPhraseId ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => editPhraseId ? cancelEdit() : setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
                >
                  <X className="mr-1" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Phrases List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">French</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spanish</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {phrases.map(phrase => (
                  <tr key={phrase.id} className={phrase.mastered ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 whitespace-nowrap">{phrase.english}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{phrase.french}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{phrase.spanish}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{phrase.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize">{phrase.difficulty}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(phrase)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 />
                        </button>
                        <button
                          onClick={() => deletePhrase(phrase.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 />
                        </button>
                        <button
                          onClick={() => markAsMastered(phrase.id)}
                          className={phrase.mastered ? "text-green-600 hover:text-green-800" : "text-gray-600 hover:text-gray-800"}
                          title={phrase.mastered ? "Mark as unlearned" : "Mark as mastered"}
                        >
                          <Check />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhraseLearner;