import React from 'react';
import './components.css';

interface GameErrorModalProps {
  isVisible: boolean;
  message?: string;
  onReturn: () => void;
}

export const GameErrorModal: React.FC<GameErrorModalProps> = ({
  isVisible,
  message = "An unexpected error occurred",
  onReturn,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modern">
        <div className="error-icon">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="error-svg"
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16c-1.5-2-3.5-2-8 0" />
            <circle cx="9" cy="9" r=".5" fill="currentColor" />
            <circle cx="15" cy="9" r=".5" fill="currentColor" />
          </svg>
        </div>
        <h2 className="error-title">Oops!</h2>
        <p className="error-message">{message}</p>
        <button className="theme-gradient-button" onClick={onReturn}>
          Try Again
        </button>
      </div>
    </div>
  );
}; 