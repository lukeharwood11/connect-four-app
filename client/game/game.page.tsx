import React, { useState } from "react";
import "./game.css";
import { Board } from "./board";
import { getRandomName } from "./utils";
import { StartGameModal } from "../components/start-game-modal";
import { AIThinking } from "../components/ai-thinking";
import { GameErrorModal } from "../components/game-error-modal";

export const GamePage = () => {
  const [agent, setAgent] = useState('minimax');
  const aiName = getRandomName(agent);
  const [playerName, setPlayerName] = useState("Player One");
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [showStartModal, setShowStartModal] = useState(true);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const resetGame = () => {
    setIsPlayerOneTurn(true);
    setIsAIThinking(false);
    setGameError(null);
    setGameOver(false);
    setWinner('');
    setHasGameStarted(false);
  };

  const getAgentDisplayName = (agentType: string) => {
    const agentMap: { [key: string]: string } = {
      'ql': 'Q-Learning',
      'minimax': 'Minimax',
      'random': 'Random',
    };
    return agentMap[agentType.toLowerCase()] || agentType.toUpperCase();
  };

  const handleGameStart = (name: string) => {
    setPlayerName(name);
    setIsModalOpen(false);
    setGameOver(false);
    setGameError(null);
  };

  const handleGameOver = (winner: string) => {
    setIsAIThinking(false);
    setGameOver(true);
    setWinner(winner);
  };

  const handleError = (errorMessage: string) => {
    setGameError(errorMessage);
    setIsAIThinking(false);
    setIsWaitingForAI(false);
    setShowStartModal(true);
    setIsModalOpen(true);
  };

  const handleMenu = () => {
    handleRestart();
    setIsModalOpen(true);
  };

  const handleRestart = () => {
    resetGame();
    setResetSignal(prev => prev + 1);
  };

  const handleColumnClick = () => {
    setHasGameStarted(true);
  };

  return (
    <div className="game-page">
      <StartGameModal 
        agent={agent}
        onAgentChange={setAgent}
        isOpen={isModalOpen}
        onStart={handleGameStart}
      />
      <AIThinking isThinking={isAIThinking} />
      <GameErrorModal 
        isVisible={!!gameError}
        message={gameError || undefined}
        onReturn={resetGame}
      />
      <div className="game-content">
        <div className="board-header">
          <div className={`player player-one ${isPlayerOneTurn ? 'active' : ''}`}>
            <span className="player-name">{playerName}</span>
            <span className="player-indicator"></span>
          </div>
          <div className="versus">VS</div>
          <div className={`player player-two ${!isPlayerOneTurn ? 'active' : ''}`}>
            <span className="player-name">{aiName}</span>
            <span className="player-indicator"></span>
            <span className="agent-tag">{getAgentDisplayName(agent)}</span>
          </div>
        </div>
        <div className="game-controls">
          <button className="game-button menu-button" onClick={handleMenu}>
            Menu
          </button>
          <button 
            className={`game-button restart-button ${!hasGameStarted ? 'disabled' : ''}`}
            onClick={handleRestart}
            disabled={!hasGameStarted}
          >
            Restart
          </button>
        </div>
        <Board 
          onGameOver={handleGameOver}
          onError={handleError}
          isWaitingForAI={isWaitingForAI}
          disabled={!!gameError || isAIThinking}
          setLoading={setIsAIThinking}
          agent={agent}
          onRestart={handleRestart}
          onMove={handleColumnClick}
          resetSignal={resetSignal}
        />
      </div>
    </div>
  );
}
