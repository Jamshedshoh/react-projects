import { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, Play, Pause, Check, X, Volume2, RotateCw } from 'lucide-react';

const SpellingChecker = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [corrections, setCorrections] = useState<{word: string; suggestions: string[]}[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize media recorder
  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
            audioChunksRef.current = [];
          };
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
        });
    }

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const checkSpelling = async () => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    setCorrections([]);
    
    // Mock API call - replace with real spell check API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock spelling corrections
      const mockCorrections = [
        { word: 'helo', suggestions: ['hello', 'help', 'hero'] },
        { word: 'wrld', suggestions: ['world', 'wild', 'word'] }
      ].filter(correction => 
        text.toLowerCase().includes(correction.word.toLowerCase())
      );
      
      setCorrections(mockCorrections);
    } catch (error) {
      console.error('Error checking spelling:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const applyCorrection = (original: string, correction: string) => {
    setText(text.replace(new RegExp(original, 'gi'), correction));
    setCorrections(corrections.filter(c => c.word !== original));
  };

  const speakText = () => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetAll = () => {
    setText('');
    setAudioURL('');
    setCorrections([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Spelling Checker & Voice Recorder</h1>
        <p className="text-center text-gray-600 mb-8">Check your spelling and practice pronunciation</p>

        {/* Text Input Area */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Enter your text</h2>
            <div className="flex space-x-2">
              <button
                onClick={speakText}
                disabled={!text}
                className={`p-2 rounded-full ${!text ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
                title="Speak text"
              >
                <Volume2 className="h-5 w-5" />
              </button>
              <button
                onClick={resetAll}
                disabled={!text && !audioURL}
                className={`p-2 rounded-full ${!text && !audioURL ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Reset all"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type or record your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Voice Recorder */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Voice Recorder</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Record
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center"
                >
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop
                </button>
              )}
              <span className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></span>
              <span className="text-sm text-gray-600">
                {isRecording ? 'Recording...' : audioURL ? 'Recording ready' : 'Not recorded'}
              </span>
            </div>

            {audioURL && (
              <div className="flex items-center space-x-2">
                {!isPlaying ? (
                  <button
                    onClick={playRecording}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
                    title="Play recording"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
                    title="Pause recording"
                  >
                    <Pause className="h-5 w-5" />
                  </button>
                )}
                <audio
                  ref={audioRef}
                  src={audioURL}
                  onEnded={() => setIsPlaying(false)}
                  hidden
                />
                <span className="text-sm text-gray-600">
                  {isPlaying ? 'Playing...' : 'Ready to play'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Spelling Checker */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Spelling Check</h2>
            <button
              onClick={checkSpelling}
              disabled={!text || isChecking}
              className={`px-4 py-2 rounded-lg flex items-center ${
                !text || isChecking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isChecking ? (
                <>
                  <RotateCw className="h-5 w-5 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Check Spelling
                </>
              )}
            </button>
          </div>

          {corrections.length > 0 ? (
            <div className="space-y-3">
              {corrections.map((correction, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-yellow-800">"{correction.word}" may be incorrect</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {correction.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => applyCorrection(correction.word, suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                    <button
                      onClick={() => setCorrections(corrections.filter(c => c.word !== correction.word))}
                      className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-sm"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              {isChecking
                ? 'Checking your text for errors...'
                : 'No spelling errors detected. Try checking your text.'}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3">How to Use</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Type or record your text using the voice recorder</li>
            <li>Click "Check Spelling" to identify potential errors</li>
            <li>Select a suggestion to correct your text</li>
            <li>Use the speaker icon to hear your text read aloud</li>
            <li>Record your pronunciation and compare with the text</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpellingChecker;