import { useState } from 'react';
import CryptoApp from './CryptoApp';
import SecureCryptoApp from './SecureCryptoApp';
import './App.css'

function App() {
  const [showSecure, setShowSecure] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center gap-2 p-4">
        <button
          onClick={() => setShowSecure(!showSecure)}
          className={`px-4 py-2 rounded-md font-medium ${
            showSecure 
              ? 'bg-gray-200 text-gray-700' 
              : 'bg-blue-600 text-white'
          }`}
        >
          Basic Version
        </button>
        <button
          onClick={() => setShowSecure(!showSecure)}
          className={`px-4 py-2 rounded-md font-medium ${
            showSecure 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Secure Version
        </button>
      </div>
      
      {showSecure ? <SecureCryptoApp /> : <CryptoApp />}
    </div>
  );
}

export default App
