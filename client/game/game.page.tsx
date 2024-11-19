import React from "react";
import "./game.css";
import { Board } from "./board";

export const GamePage = () => {
  return (
    <div className="game-page">
      <div className="game-content">
        <Board />
      </div>
    </div>
  );
}
