import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

interface GameStats {
  rolls: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
}

const DiceGame = () => {
  const [dice1, setDice1] = useState<DiceValue>(1);
  const [dice2, setDice2] = useState<DiceValue>(1);
  const [rolling, setRolling] = useState(false);
  const [guess, setGuess] = useState<'higher' | 'lower' | 'same' | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [stats, setStats] = useState<GameStats>({
    rolls: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [lastRolls, setLastRolls] = useState<[DiceValue, DiceValue][]>([]);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('diceGameStats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse stats', e);
      }
    }
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('diceGameStats', JSON.stringify(stats));
  }, [stats]);

  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    setResult(null);
    setGuess(null);

    // Animate dice rolling
    const rolls = 10 + Math.floor(Math.random() * 10);
    let rollCount = 0;

    const rollInterval = setInterval(() => {
      rollCount++;
      setDice1(Math.floor(Math.random() * 6 + 1) as DiceValue);
      setDice2(Math.floor(Math.random() * 6 + 1) as DiceValue);

      if (rollCount >= rolls) {
        clearInterval(rollInterval);
        setRolling(false);
        checkResult();
        updateStats();
      }
    }, 100);
  };

  const makeGuess = (choice: 'higher' | 'lower' | 'same') => {
    setGuess(choice);
    rollDice();
  };

  const checkResult = () => {
    const sum = dice1 + dice2;
    const prevSum = lastRolls[0] ? lastRolls[0][0] + lastRolls[0][1] : null;

    if (!prevSum || !guess) return;

    let outcome: 'win' | 'lose' | null = null;

    if (
      (guess === 'higher' && sum > prevSum) ||
      (guess === 'lower' && sum < prevSum) ||
      (guess === 'same' && sum === prevSum)
    ) {
      outcome = 'win';
    } else {
      outcome = 'lose';
    }

    setResult(outcome);
  };

  const updateStats = () => {
    const newRolls = [[dice1, dice2], ...lastRolls].slice(0, 5) as [DiceValue, DiceValue][];
    setLastRolls(newRolls);

    setStats(prev => {
      const newStats = { ...prev, rolls: prev.rolls + 1 };
      
      if (result === 'win') {
        newStats.wins = prev.wins + 1;
        newStats.currentStreak = prev.currentStreak + 1;
        newStats.bestStreak = Math.max(prev.bestStreak, newStats.currentStreak);
      } else if (result === 'lose') {
        newStats.losses = prev.losses + 1;
        newStats.currentStreak = 0;
      }

      return newStats;
    });
  };

  const resetStats = () => {
    setStats({
      rolls: 0,
      wins: 0,
      losses: 0,
      currentStreak: 0,
      bestStreak: 0
    });
    setLastRolls([]);
  };

  const getDiceFace = (value: DiceValue) => {
    const dots = [];
    const positions = [
      [],                   // 0 (not used)
      ['center'],           // 1
      ['top-left', 'bottom-right'], // 2
      ['top-left', 'center', 'bottom-right'], // 3
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'], // 4
      ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'], // 5
      ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'] // 6
    ];

    for (let i = 0; i < value; i++) {
      dots.push(
        <div 
          key={i} 
          className={`absolute w-3 h-3 bg-black rounded-full ${positions[value][i]}`}
        />
      );
    }

    return dots;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Roll Two Dice</h1>
        <p className="text-center text-gray-600 mb-8">Guess if the next roll will be higher, lower, or the same</p>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {/* Previous Roll */}
          {lastRolls.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Previous Roll</h2>
              <div className="flex justify-center space-x-6">
                <div className="relative w-16 h-16 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-inner">
                  {getDiceFace(lastRolls[0][0])}
                </div>
                <div className="relative w-16 h-16 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-inner">
                  {getDiceFace(lastRolls[0][1])}
                </div>
              </div>
              <div className="text-center mt-2 font-medium">
                Total: {lastRolls[0][0] + lastRolls[0][1]}
              </div>
            </div>
          )}

          {/* Current Dice */}
          <div className="flex justify-center space-x-6 mb-6">
            <AnimatePresence>
              <motion.div
                key={`dice1-${dice1}`}
                initial={{ rotate: 0 }}
                animate={{ rotate: rolling ? 360 : 0 }}
                transition={{ duration: rolling ? 0.1 : 0.5 }}
                className="relative w-20 h-20 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg"
              >
                {getDiceFace(dice1)}
              </motion.div>
              <motion.div
                key={`dice2-${dice2}`}
                initial={{ rotate: 0 }}
                animate={{ rotate: rolling ? -360 : 0 }}
                transition={{ duration: rolling ? 0.1 : 0.5 }}
                className="relative w-20 h-20 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg"
              >
                {getDiceFace(dice2)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Guess Buttons */}
          {!rolling && lastRolls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => makeGuess('higher')}
                disabled={rolling}
                className={`py-2 px-3 rounded-md font-medium ${guess === 'higher' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Higher
              </button>
              <button
                onClick={() => makeGuess('same')}
                disabled={rolling}
                className={`py-2 px-3 rounded-md font-medium ${guess === 'same' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Same
              </button>
              <button
                onClick={() => makeGuess('lower')}
                disabled={rolling}
                className={`py-2 px-3 rounded-md font-medium ${guess === 'lower' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Lower
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`text-center py-2 rounded-md mb-4 ${result === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {result === 'win' ? 'You Won! 🎉' : 'You Lost 😢'}
            </div>
          )}

          {/* Roll Button */}
          {lastRolls.length === 0 && (
            <button
              onClick={rollDice}
              disabled={rolling}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {rolling ? 'Rolling...' : 'Start Game'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Total Rolls</div>
              <div className="text-2xl font-bold">{stats.rolls}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Win Rate</div>
              <div className="text-2xl font-bold">
                {stats.rolls > 0 ? Math.round((stats.wins / stats.rolls) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600">Wins</div>
              <div className="text-2xl font-bold text-green-700">{stats.wins}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-600">Losses</div>
              <div className="text-2xl font-bold text-red-700">{stats.losses}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600">Current Streak</div>
              <div className="text-2xl font-bold text-blue-700">{stats.currentStreak}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600">Best Streak</div>
              <div className="text-2xl font-bold text-purple-700">{stats.bestStreak}</div>
            </div>
          </div>

          <button
            onClick={resetStats}
            className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
          >
            Reset Stats
          </button>
        </div>

        {/* History */}
        {lastRolls.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Rolls</h2>
            <div className="space-y-2">
              {lastRolls.map((roll, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex space-x-3">
                    <div className="relative w-8 h-8 bg-white border border-gray-200 rounded-sm p-1">
                      {getDiceFace(roll[0])}
                    </div>
                    <div className="relative w-8 h-8 bg-white border border-gray-200 rounded-sm p-1">
                      {getDiceFace(roll[1])}
                    </div>
                  </div>
                  <div className="font-medium">{roll[0] + roll[1]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceGame;