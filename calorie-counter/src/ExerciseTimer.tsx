import { useState, useEffect, useRef } from 'react';

type TimerMode = 'prepare' | 'work' | 'rest' | 'recover';
type TimerPreset = {
  name: string;
  prepare: number;
  work: number;
  rest: number;
  recover: number;
  rounds: number;
};

const ExerciseTimer = () => {
  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode>('prepare');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  
  // Timer settings
  const [prepareTime, setPrepareTime] = useState(10);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [recoverTime, setRecoverTime] = useState(30);
  
  // Presets
  const [presets, setPresets] = useState<TimerPreset[]>([
    {
      name: 'Tabata',
      prepare: 10,
      work: 20,
      rest: 10,
      recover: 30,
      rounds: 8
    },
    {
      name: 'HIIT',
      prepare: 10,
      work: 45,
      rest: 15,
      recover: 60,
      rounds: 5
    },
    {
      name: 'Strength',
      prepare: 15,
      work: 90,
      rest: 60,
      recover: 90,
      rounds: 3
    }
  ]);
  
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize timer
  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  // Play sound when mode changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, [currentMode]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentMode('prepare');
    setTimeLeft(prepareTime);
    setCurrentRound(1);
  };

  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentMode('prepare');
    setTimeLeft(prepareTime);
    setCurrentRound(1);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return nextPhase();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextPhase = (): number => {
    switch (currentMode) {
      case 'prepare':
        setCurrentMode('work');
        return workTime;
      case 'work':
        setCurrentMode('rest');
        return restTime;
      case 'rest':
        if (currentRound >= totalRounds) {
          setCurrentMode('recover');
          return recoverTime;
        } else {
          setCurrentRound(prev => prev + 1);
          setCurrentMode('work');
          return workTime;
        }
      case 'recover':
        clearInterval(timerRef.current);
        setIsRunning(false);
        return 0;
      default:
        return 0;
    }
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const loadPreset = (preset: TimerPreset) => {
    setPrepareTime(preset.prepare);
    setWorkTime(preset.work);
    setRestTime(preset.rest);
    setRecoverTime(preset.recover);
    setTotalRounds(preset.rounds);
    resetTimer();
    setTimeLeft(preset.prepare);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getModeColor = (mode: TimerMode): string => {
    switch (mode) {
      case 'prepare': return 'bg-yellow-500';
      case 'work': return 'bg-red-500';
      case 'rest': return 'bg-green-500';
      case 'recover': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeLabel = (mode: TimerMode): string => {
    switch (mode) {
      case 'prepare': return 'Get Ready';
      case 'work': return 'Work';
      case 'rest': return 'Rest';
      case 'recover': return 'Recover';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Exercise Timer</h1>
        <p className="text-center text-gray-600 mb-8">Interval timer for your workouts</p>

        {/* Hidden audio element for alerts */}
        <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" />

        {/* Timer Display */}
        <div className={`${getModeColor(currentMode)} rounded-xl shadow-lg p-6 mb-6 transition-colors duration-300`}>
          <div className="text-center text-white">
            <div className="text-lg font-medium mb-1">{getModeLabel(currentMode)}</div>
            <div className="text-6xl font-bold my-4">{formatTime(timeLeft)}</div>
            <div className="text-lg">
              Round {currentRound} of {totalRounds}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>

        {/* Presets */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Presets</h2>
          <div className="grid grid-cols-3 gap-3">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPreset(preset)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Timer Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prepare Time (sec)</label>
              <input
                type="number"
                min="0"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={prepareTime}
                onChange={(e) => setPrepareTime(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Time (sec)</label>
              <input
                type="number"
                min="1"
                max="600"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={workTime}
                onChange={(e) => setWorkTime(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rest Time (sec)</label>
              <input
                type="number"
                min="0"
                max="600"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={restTime}
                onChange={(e) => setRestTime(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recover Time (sec)</label>
              <input
                type="number"
                min="0"
                max="600"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={recoverTime}
                onChange={(e) => setRecoverTime(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rounds</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={totalRounds}
                onChange={(e) => setTotalRounds(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimer;