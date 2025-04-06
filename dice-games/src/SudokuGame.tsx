import { useState, useEffect, useCallback } from 'react';

type CellValue = number | null;
type Board = CellValue[][];
type Difficulty = 'easy' | 'medium' | 'hard';

const SudokuGame = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialBoard, setInitialBoard] = useState<Board>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<boolean[][][]>(
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => Array(9).fill(false)))
  );

  // Generate a new Sudoku puzzle
  const generatePuzzle = useCallback(() => {
    setIsRunning(false);
    setTimer(0);
    setMistakes(0);
    setIsComplete(false);
    setSelectedCell(null);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => Array(9).fill(false))));

    // Create a solved Sudoku board
    const solvedBoard = solveSudoku(Array(9).fill(null).map(() => Array(9).fill(null)));
    
    if (!solvedBoard) return;

    // Create a puzzle by removing numbers based on difficulty
    const puzzle = JSON.parse(JSON.stringify(solvedBoard));
    const cellsToRemove = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;

    let removedCells = 0;
    while (removedCells < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        removedCells++;
      }
    }

    setBoard(JSON.parse(JSON.stringify(puzzle)));
    setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
    setIsRunning(true);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  // Check if board is complete
  useEffect(() => {
    if (isRunning && !isComplete) {
      const isBoardComplete = board.every((row, rowIndex) => 
        row.every((cell, colIndex) => 
          cell !== null && isValidPlacement(board, rowIndex, colIndex, cell)
        )
      );
      
      if (isBoardComplete) {
        setIsComplete(true);
        setIsRunning(false);
      }
    }
  }, [board, isRunning, isComplete]);

  // Solve Sudoku using backtracking
  const solveSudoku = (board: Board): Board | null => {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return board; // Puzzle solved
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        
        if (solveSudoku(board)) {
          return board;
        }
        
        board[row][col] = null; // Backtrack
      }
    }
    
    return null; // No solution found
  };

  const findEmptyCell = (board: Board): [number, number] | null => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          return [row, col];
        }
      }
    }
    return null;
  };

  const isValidPlacement = (board: Board, row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num && x !== col) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num && x !== row) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let x = boxRow; x < boxRow + 3; x++) {
      for (let y = boxCol; y < boxCol + 3; y++) {
        if (board[x][y] === num && x !== row && y !== col) return false;
      }
    }
    
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    // Don't allow changing initial puzzle cells
    if (initialBoard[row][col] !== null || isComplete) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isComplete) return;
    const [row, col] = selectedCell;

    if (notesMode) {
      const newNotes = [...notes];
      newNotes[row][col][num - 1] = !newNotes[row][col][num - 1];
      setNotes(newNotes);
    } else {
      const newBoard = [...board];
      newBoard[row][col] = num;
      setBoard(newBoard);

      // Check if the move is valid
      if (!isValidPlacement(newBoard, row, col, num)) {
        setMistakes(prev => prev + 1);
      }
    }
  };

  const handleClearCell = () => {
    if (!selectedCell || isComplete) return;
    const [row, col] = selectedCell;

    if (notesMode) {
      const newNotes = [...notes];
      newNotes[row][col] = Array(9).fill(false);
      setNotes(newNotes);
    } else {
      const newBoard = [...board];
      newBoard[row][col] = null;
      setBoard(newBoard);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getCellClass = (row: number, col: number): string => {
    let classes = [
      'w-10 h-10 flex items-center justify-center border',
      'text-lg font-medium cursor-pointer select-none',
      'transition-colors duration-100'
    ];

    // Add borders for 3x3 boxes
    if (row % 3 === 2 && row < 8) classes.push('border-b-2 border-gray-800');
    if (col % 3 === 2 && col < 8) classes.push('border-r-2 border-gray-800');
    if (row % 3 === 0) classes.push('border-t-2 border-gray-800');
    if (col % 3 === 0) classes.push('border-l-2 border-gray-800');

    // Selected cell
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      classes.push('bg-blue-200');
    }
    // Initial puzzle cells
    else if (initialBoard[row][col] !== null) {
      classes.push('bg-gray-100 font-bold');
    }
    // Invalid cells
    else if (board[row][col] !== null && !isValidPlacement(board, row, col, board[row][col]!)) {
      classes.push('bg-red-100 text-red-700');
    }
    // Empty cells
    else if (board[row][col] === null) {
      classes.push('bg-white');
    }
    // Valid filled cells
    else {
      classes.push('bg-white');
    }

    return classes.join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Sudoku</h1>
        
        {/* Game Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={generatePuzzle}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              New Game
            </button>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="bg-white px-3 py-2 rounded-md shadow-sm">
              <span className="font-medium">⏱️ {formatTime(timer)}</span>
            </div>
            <div className="bg-white px-3 py-2 rounded-md shadow-sm">
              <span className="font-medium">❌ {mistakes}</span>
            </div>
          </div>
        </div>

        {/* Sudoku Board */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 mx-auto w-fit">
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== null ? (
                    cell
                  ) : (
                    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                      {notes[rowIndex][colIndex].map((note, noteIndex) => (
                        note && (
                          <span 
                            key={noteIndex} 
                            className="text-xs text-gray-500 flex items-center justify-center"
                          >
                            {noteIndex + 1}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center font-medium"
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={handleClearCell}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
            >
              Clear
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setNotesMode(!notesMode)}
              className={`px-4 py-2 rounded-md ${notesMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Notes: {notesMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Game Completion */}
        {isComplete && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            <p className="font-bold">Congratulations! 🎉</p>
            <p>You solved the puzzle in {formatTime(timer)} with {mistakes} mistakes!</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">How to Play</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Fill the grid so that every row, column, and 3x3 box contains 1-9</li>
            <li>Click a cell to select it, then click a number to fill</li>
            <li>Toggle "Notes" to add/remove pencil marks</li>
            <li>Red cells indicate incorrect numbers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;