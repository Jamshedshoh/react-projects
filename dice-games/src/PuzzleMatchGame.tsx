import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TileType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';
type Position = { row: number; col: number };
type Board = TileType[][];

const tileTypes: TileType[] = ['red', 'blue', 'green', 'yellow', 'purple'];
const boardSize = 8;
const minMatchLength = 3;

const PuzzleMatchGame = () => {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(30);
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);

  // Initialize the board
  const initializeBoard = useCallback(() => {
    const newBoard: Board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    
    // Fill the board with random tiles, ensuring no initial matches
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        newBoard[row][col] = getRandomTileType(newBoard, row, col);
      }
    }
    
    setBoard(newBoard);
    setScore(0);
    setMovesLeft(30);
    setGameOver(false);
    setCombo(0);
  }, []);

  // Get random tile type that doesn't create initial matches
  const getRandomTileType = (currentBoard: Board, row: number, col: number): TileType => {
    let availableTypes = [...tileTypes];
    
    // Check left 2 tiles (only if we have at least 2 columns to the left)
    if (col >= 2) {
      const left1 = currentBoard[row][col - 1];
      const left2 = currentBoard[row][col - 2];
      if (left1 && left2 && left1 === left2) {
        availableTypes = availableTypes.filter(type => type !== left1);
      }
    }
    
    // Check top 2 tiles (only if we have at least 2 rows above)
    if (row >= 2) {
      const top1 = currentBoard[row - 1][col];
      const top2 = currentBoard[row - 2][col];
      if (top1 && top2 && top1 === top2) {
        availableTypes = availableTypes.filter(type => type !== top1);
      }
    }
    
    // If no available types (shouldn't happen with proper board size and tile types)
    if (availableTypes.length === 0) {
      return tileTypes[Math.floor(Math.random() * tileTypes.length)];
    }
    
    return availableTypes[Math.floor(Math.random() * availableTypes.length)];
  };

  // Initialize on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Check for matches after board changes
  useEffect(() => {
    if (board.length === 0) return;

    const matches = findAllMatches(board);
    if (matches.length > 0) {
      handleMatches(matches);
    } else if (movesLeft <= 0) {
      setGameOver(true);
    }
  }, [board, movesLeft]);

  // Handle tile selection
  const handleTileClick = (row: number, col: number) => {
    if (isAnimating || gameOver) return;

    if (!selectedTile) {
      setSelectedTile({ row, col });
      return;
    }

    // Check if tiles are adjacent
    if (
      (Math.abs(selectedTile.row - row) === 1 && selectedTile.col === col) ||
      (Math.abs(selectedTile.col - col) === 1 && selectedTile.row === row)
    ) {
      swapTiles(selectedTile, { row, col });
    }
    
    setSelectedTile(null);
  };

  // Swap two tiles
  const swapTiles = (pos1: Position, pos2: Position) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setMovesLeft(prev => prev - 1);

    const newBoard = [...board];
    const temp = newBoard[pos1.row][pos1.col];
    newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
    newBoard[pos2.row][pos2.col] = temp;

    setBoard(newBoard);
  };

  // Find all matches on the board
  const findAllMatches = (currentBoard: Board): Position[][] => {
    const matches: Position[][] = [];

    // Check horizontal matches
    for (let row = 0; row < boardSize; row++) {
      let match: Position[] = [];
      for (let col = 0; col < boardSize; col++) {
        if (match.length === 0 || 
            currentBoard[row][col] === currentBoard[match[0].row][match[0].col]) {
          match.push({ row, col });
        } else {
          if (match.length >= minMatchLength) {
            matches.push([...match]);
          }
          match = [{ row, col }];
        }
      }
      if (match.length >= minMatchLength) {
        matches.push(match);
      }
    }

    // Check vertical matches
    for (let col = 0; col < boardSize; col++) {
      let match: Position[] = [];
      for (let row = 0; row < boardSize; row++) {
        if (match.length === 0 || 
            currentBoard[row][col] === currentBoard[match[0].row][match[0].col]) {
          match.push({ row, col });
        } else {
          if (match.length >= minMatchLength) {
            matches.push([...match]);
          }
          match = [{ row, col }];
        }
      }
      if (match.length >= minMatchLength) {
        matches.push(match);
      }
    }

    return matches;
  };

  // Handle matched tiles
  const handleMatches = (matches: Position[][]) => {
    const matchedPositions = new Set<string>();
    const matchedTiles: Position[] = [];
    
    // Collect all unique matched positions
    matches.forEach(match => {
      match.forEach(pos => {
        const posKey = `${pos.row},${pos.col}`;
        if (!matchedPositions.has(posKey)) {
          matchedPositions.add(posKey);
          matchedTiles.push(pos);
        }
      });
    });

    // Calculate score
    const points = matchedTiles.length * 10 * (combo + 1);
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);

    // Remove matched tiles
    const newBoard = [...board];
    matchedTiles.forEach(pos => {
      newBoard[pos.row][pos.col] = null as unknown as TileType; // Will be replaced later
    });

    setBoard(newBoard);

    // Animate removal and refill
    setTimeout(() => {
      refillBoard(newBoard);
    }, 300);
  };

  // Refill the board after matches
  const refillBoard = (currentBoard: Board) => {
    const newBoard: Board = JSON.parse(JSON.stringify(currentBoard));
    
    // Drop tiles from above
    for (let col = 0; col < boardSize; col++) {
      let emptyRow = boardSize - 1;
      
      for (let row = boardSize - 1; row >= 0; row--) {
        if (newBoard[row][col] !== null) {
          newBoard[emptyRow][col] = newBoard[row][col];
          if (emptyRow !== row) {
            newBoard[row][col] = null as unknown as TileType;
          }
          emptyRow--;
        }
      }
      
      // Fill empty spaces at top with new tiles
      for (let row = emptyRow; row >= 0; row--) {
        newBoard[row][col] = tileTypes[Math.floor(Math.random() * tileTypes.length)];
      }
    }

    setBoard(newBoard);
    setIsAnimating(false);
  };

  // Get tile color class
  const getTileColor = (tile: TileType) => {
    switch (tile) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-400';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-300';
    }
  };

  // Check if position is selected
  const isSelected = (row: number, col: number) => {
    return selectedTile?.row === row && selectedTile?.col === col;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Puzzle Match</h1>
        
        {/* Game Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Moves Left</div>
            <div className="text-2xl font-bold">{movesLeft}</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Combo</div>
            <div className="text-2xl font-bold">x{combo}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-8 gap-1 mx-auto w-fit">
            {board.map((row, rowIndex) => (
              row.map((tile, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-10 h-10 rounded-md cursor-pointer ${getTileColor(tile)} ${
                    isSelected(rowIndex, colIndex) ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                  }`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <AnimatePresence>
                    {tile === null && (
                      <motion.div
                        className="absolute inset-0 bg-gray-200 rounded-md"
                        initial={{ scale: 1 }}
                        animate={{ scale: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center mb-6">
          <button
            onClick={initializeBoard}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md"
          >
            New Game
          </button>
        </div>

        {/* Game Over */}
        {gameOver && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Over!</h2>
            <p className="text-lg mb-4">Your final score: {score}</p>
            <button
              onClick={initializeBoard}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Play Again
            </button>
          </div>
        )}

        {/* How to Play */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">How to Play</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Click on a tile to select it</li>
            <li>Click on an adjacent tile to swap them</li>
            <li>Match 3 or more tiles of the same color to score points</li>
            <li>You have 30 moves to get the highest score</li>
            <li>Combos multiply your points!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PuzzleMatchGame;