import React from 'react';
import '../components/components.css';

interface AIThinkingProps {
  isThinking: boolean;
}

export const AIThinking = ({ isThinking }: AIThinkingProps) => {
  if (!isThinking) return null;

  return (
    <div className="thinking-overlay">
      <div className="thinking-content">
        <div className="thinking-animation">
          <div className="dot-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="thinking-dot" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <div className="thinking-text">Thinking...</div>
      </div>
    </div>
  );
}; 