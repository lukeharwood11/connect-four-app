import React, { useState, useEffect } from 'react';
import './game.css';

interface WinningMove {
  row: number;
  col: number;
  sequence?: number[][];
}

interface GameState {
  board: number[][];
  currentPlayer: 1 | -1;
  gameOver: boolean;
  winner: number | null;
  isError: boolean;
  winningMove?: WinningMove;
}

interface BoardProps {
  onGameOver: (winner: string, winningMove?: WinningMove) => void;
  onError: (error: string) => void;
  isWaitingForAI: boolean;
  disabled: boolean;
  setLoading: (loading: boolean) => void;
  agent: string;
  onRestart?: () => void;
  onMove?: () => void;
  resetSignal: number;
}

export const Board: React.FC<BoardProps> = ({ 
  onGameOver, 
  onError,
  isWaitingForAI,
  disabled,
  setLoading,
  agent,
  onRestart,
  onMove,
  resetSignal,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(6).fill(0).map(() => Array(7).fill(0)),
    currentPlayer: 1,
    gameOver: false,
    winner: null,
    isError: false
  });

  useEffect(() => {
    if (resetSignal > 0) {
      setGameState({
        board: Array(6).fill(0).map(() => Array(7).fill(0)),
        currentPlayer: 1,
        gameOver: false,
        winner: null,
        isError: false,
        winningMove: undefined
      });
    }
  }, [resetSignal]);

  const handleError = (error: string) => {
    setGameState({
      board: Array(6).fill(0).map(() => Array(7).fill(0)),
      currentPlayer: 1,
      gameOver: false,
      winner: null,
      isError: true
    });
    onError(error);
  };

  const handleGameOver = (winner: string, winningMove?: WinningMove) => {
    setGameState(prevState => ({
      ...prevState,
      gameOver: true,
      winner: winner === 'Player One' ? 1 : -1,
      winningMove: winningMove
    }));
    
    onGameOver(winner, winningMove);
  };

  const handleColumnClick = async (columnIndex: number) => {
    if (disabled || isWaitingForAI || !canMakeMove(columnIndex)) {
      return;
    }

    onMove?.();
    
    // Player's move
    const newBoard = makeMove(columnIndex, 1); // 1 for player
    setGameState(newBoard);
    
    // Check if player won
    if (newBoard.winningMove) {
      handleGameOver('Player One', newBoard.winningMove);
      return;
    }

    // AI's turn
    setLoading(true);
    try {
      const response = await fetch(`/api/agent/${agent}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: newBoard.board }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI move');
      }

      const { move } = await response.json();
      
      // Apply AI's move
      const boardAfterAI = makeMove(move, -1); // -1 for AI
      setGameState(boardAfterAI);

      // Check if AI won
      if (boardAfterAI.winningMove) {
        handleGameOver('AI', boardAfterAI.winningMove);
      }
      
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const canMakeMove = (columnIndex: number): boolean => {
    return columnIndex >= 0 && columnIndex < 7 && gameState.board[0][columnIndex] === 0;
  };

  const makeMove = (column: number, player: 1 | -1): GameState => {
    const newState = { ...gameState };
    newState.currentPlayer = player;
    const row = dropPiece(newState, column);
    
    const winResult = checkWin(newState.board, player);
    if (winResult) {
      newState.gameOver = true;
      newState.winner = player;
      newState.winningMove = winResult;
      return newState;
    }

    if (isBoardFull(newState.board)) {
      newState.gameOver = true;
      return newState;
    }

    newState.currentPlayer = -player as -1 | 1;
    return newState;
  };

  const dropPiece = (state: GameState, column: number): number => {
    for (let row = 5; row >= 0; row--) {
      if (state.board[row][column] === 0) {
        state.board[row][column] = state.currentPlayer;
        return row;
      }
    }
    return -1;
  };

  const isBoardFull = (board: number[][]): boolean => {
    return board[0].every(cell => cell !== 0);
  };

  const checkWin = (board: number[][], player: number): WinningMove | null => {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === player &&
            board[row][col] === board[row][col + 1] &&
            board[row][col] === board[row][col + 2] &&
            board[row][col] === board[row][col + 3]) {
          return {
            row,
            col: col + 3,  // Return the last piece that completed the win
            sequence: [
              [row, col],
              [row, col + 1],
              [row, col + 2],
              [row, col + 3]
            ]
          };
        }
      }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col] === player &&
            board[row][col] === board[row + 1][col] &&
            board[row][col] === board[row + 2][col] &&
            board[row][col] === board[row + 3][col]) {
          return {
            row: row + 3,  // Return the last piece that completed the win
            col,
            sequence: [
              [row, col],
              [row + 1, col],
              [row + 2, col],
              [row + 3, col]
            ]
          };
        }
      }
    }

    // Check diagonal (positive slope)
    for (let row = 3; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === player &&
            board[row][col] === board[row - 1][col + 1] &&
            board[row][col] === board[row - 2][col + 2] &&
            board[row][col] === board[row - 3][col + 3]) {
          return {
            row: row - 3,  // Return the last piece that completed the win
            col: col + 3,
            sequence: [
              [row, col],
              [row - 1, col + 1],
              [row - 2, col + 2],
              [row - 3, col + 3]
            ]
          };
        }
      }
    }

    // Check diagonal (negative slope)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === player &&
            board[row][col] === board[row + 1][col + 1] &&
            board[row][col] === board[row + 2][col + 2] &&
            board[row][col] === board[row + 3][col + 3]) {
          return {
            row: row + 3,  // Return the last piece that completed the win
            col: col + 3,
            sequence: [
              [row, col],
              [row + 1, col + 1],
              [row + 2, col + 2],
              [row + 3, col + 3]
            ]
          };
        }
      }
    }

    return null;
  };

  return (
    <div className="game-container">
      <div className="board">
        {[...Array(7)].map((_, colIndex) => (
          <Column 
            key={colIndex} 
            column={colIndex}
            board={gameState.board}
            onMove={handleColumnClick}
            disabled={isWaitingForAI || gameState.gameOver}
            winningSequence={gameState.winningMove?.sequence}
          />
        ))}
      </div>
      {gameState.gameOver && gameState.winner && (
        <div className="game-status">
          {gameState.winner === 1 ? "You won! 🎉" : "AI wins! 🤖"}
        </div>
      )}
      {gameState.gameOver && !gameState.winner && (
        <div className="game-status">
          It's a draw! 🤝
        </div>
      )}
    </div>
  );
};

interface ColumnProps {
  column: number;
  board: number[][];
  onMove: (column: number) => void;
  disabled: boolean;
  winningSequence?: number[][];
}

export const Column = ({ column, board, onMove, disabled, winningSequence }: ColumnProps) => {
  const handleClick = () => {
    if (!disabled) {
      onMove(column);
    }
  };

  return (
    <div 
      className={`column ${disabled ? 'disabled' : ''}`} 
      onClick={handleClick}
    >
      {[...Array(6)].map((_, rowIndex) => (
        <Entry 
          key={rowIndex} 
          value={board[rowIndex][column]}
          isWinningCell={winningSequence?.some(([row, col]) => row === rowIndex && col === column)}
        />
      ))}
    </div>
  );
};

interface EntryProps {
  value: number;
  isWinningCell?: boolean;
}

export const Entry = ({ value, isWinningCell }: EntryProps) => {
  const getEntryClass = () => {
    let className = "entry";
    if (value === 1) className += " player-one";
    if (value === -1) className += " player-two";
    if (isWinningCell) className += " winning-cell";
    return className;
  };

  return (
    <div className={getEntryClass()}></div>
  );
};
