import { useState, useEffect } from 'react';

type Language = {
  code: string;
  name: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
];

type Translation = {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
};

const Translator = () => {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);

  // Mock translation function (in a real app, you would call an API here)
  const translateText = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock translation - in a real app you would use a translation API
    const mockTranslations: Record<string, Record<string, string>> = {
      en: {
        es: `(Spanish) ${sourceText}`,
        fr: `(French) ${sourceText}`,
        de: `(German) ${sourceText}`,
      },
      es: {
        en: `(English) ${sourceText}`,
        fr: `(French) ${sourceText}`,
      },
      // Add more mock translations as needed
    };

    const translated = mockTranslations[sourceLanguage]?.[targetLanguage] || `(Translated to ${targetLanguage}) ${sourceText}`;
    setTranslatedText(translated);

    // Add to history
    const newTranslation: Translation = {
      id: Date.now().toString(),
      sourceText,
      translatedText: translated,
      sourceLanguage,
      targetLanguage,
      timestamp: new Date(),
    };
    setHistory(prev => [newTranslation, ...prev.slice(0, 9)]); // Keep last 10 translations

    setIsTranslating(false);
  };

  // Auto-translate when source text changes
  useEffect(() => {
    if (autoTranslate && sourceText) {
      const delayDebounce = setTimeout(() => {
        translateText();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [sourceText, autoTranslate, sourceLanguage, targetLanguage]);

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearText = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Language Translator</h1>
        <p className="text-center text-gray-600 mb-8">Translate between multiple languages</p>

        {/* Language Selectors */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              id="sourceLanguage"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={`source-${lang.code}`} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapLanguages}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full mt-6 sm:mt-0"
            aria-label="Swap languages"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="w-full sm:w-auto">
            <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select
              id="targetLanguage"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={`target-${lang.code}`} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Source Text */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {getLanguageName(sourceLanguage)}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(sourceText)}
                  disabled={!sourceText}
                  className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                  title="Copy"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => setSourceText('')}
                  disabled={!sourceText}
                  className="p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                  title="Clear"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <textarea
              className="w-full h-48 px-4 py-3 focus:outline-none resize-none"
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>

          {/* Translated Text */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {getLanguageName(targetLanguage)}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(translatedText)}
                  disabled={!translatedText}
                  className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                  title="Copy"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => setTranslatedText('')}
                  disabled={!translatedText}
                  className="p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                  title="Clear"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="w-full h-48 px-4 py-3 overflow-auto">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                translatedText || <span className="text-gray-400">Translation will appear here</span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={translateText}
            disabled={!sourceText || isTranslating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
          <button
            onClick={clearText}
            disabled={!sourceText && !translatedText}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Clear All
          </button>
          <label className="inline-flex items-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Auto-translate</span>
          </label>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>

        {/* Translation History */}
        {showHistory && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Translation History</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No translation history yet</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {history.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{item.sourceText}</div>
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-600">{item.translatedText}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Language Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Supported Languages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {languages.map((lang) => (
              <div key={lang.code} className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-gray-500 block mt-1">{lang.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;