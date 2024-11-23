import React, { useState, useEffect } from 'react';
import '../components/components.css';

interface StartGameModalProps {
  agent: string;
  onAgentChange: (agent: string) => void;
  onStart: (playerName: string) => void;
  isOpen: boolean;
  onReset?: () => void;
}

export const StartGameModal = ({ agent, onAgentChange, onStart, isOpen, onReset }: StartGameModalProps) => {
  const [playerName, setPlayerName] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      setPlayerName("");
      if (onReset) onReset();
    }
  }, [isOpen, onReset]);

  const handleStart = () => {
    const name = playerName.trim() || "Player One";
    onStart(name);
  };

  const handleAgentSelect = (agent: string) => {
    onAgentChange(agent);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modern">
        <h1 className="title theme-gradient-text">AI Connect Four</h1>
        
        <div className="floating-input-container">
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder=" "
            autoFocus
          />
          <label htmlFor="playerName">Your Name</label>
          <div className="input-underline"></div>
        </div>

        <div className="ai-selection compact">
          <h2>Select Opponent</h2>
          <div className="ai-options-container">
            {[
              { id: 'openai', name: 'OpenAI', icon: '🦾' },
              // { id: 'ql', name: 'Q-Learning', icon: '🧠' },
              { id: 'minimax', name: 'Minimax', icon: '🤖' },
              { id: 'random', name: 'Random', icon: '🎲' }
            ].map(a => (
              <div 
                key={a.id}
                className={`ai-option ${agent === a.id ? 'selected' : ''}`}
                onClick={() => handleAgentSelect(a.id)}
              >
                <span className="ai-icon">{a.icon}</span>
                <span className="ai-name">{a.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="start-button theme-gradient-button"
          onClick={handleStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}; 