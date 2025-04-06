import { useState } from 'react';

const CryptoApp = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simple encryption/decryption function (Caesar cipher for demonstration)
  const handleCrypto = () => {
    if (!inputText) return;
    
    if (mode === 'encrypt') {
      const encrypted = inputText.split('').map((char, index) => {
        const keyChar = password.charCodeAt(index % password.length) || 1;
        return String.fromCharCode(char.charCodeAt(0) + keyChar);
      }).join('');
      setOutputText(btoa(encrypted)); // Base64 encode for better readability
    } else {
      try {
        const decoded = atob(inputText);
        const decrypted = decoded.split('').map((char, index) => {
          const keyChar = password.charCodeAt(index % password.length) || 1;
          return String.fromCharCode(char.charCodeAt(0) - keyChar);
        }).join('');
        setOutputText(decrypted);
      } catch (e) {
        setOutputText('Invalid encrypted text or password');
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Text Encryption/Decryption
        </h1>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-md ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-md ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Decrypt
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'encrypt' ? 'Text to encrypt' : 'Text to decrypt'}
          </label>
          <textarea
            id="inputText"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Enter your secret message...' : 'Paste encrypted text here...'}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secret password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleCrypto}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!inputText || !password}
          >
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
          <button
            onClick={clearAll}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Clear All
          </button>
        </div>

        {outputText && (
          <div className="mt-6">
            <label htmlFor="outputText" className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'encrypt' ? 'Encrypted text' : 'Decrypted text'}
            </label>
            <div className="relative">
              <textarea
                id="outputText"
                rows={4}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                value={outputText}
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
            {mode === 'encrypt' && outputText && (
              <p className="mt-2 text-sm text-gray-500">
                Share this encrypted text along with the password to decrypt it.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoApp;