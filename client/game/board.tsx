import React from 'react';
import './game.css';

export const Board = () => {

  return (
    <div className="board">
      <Column />
      <Column />
      <Column />
      <Column />
      <Column />
      <Column />
      <Column />
    </div>
  );
}

export const Column = () => {

  const handleClick = () => {
    console.log("Column Clicked!");
  }

  return (
    <div className="column" onClick={handleClick}>
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
    </div>
  );
}

export const Entry = () => {
  return (
    <div className="entry"></div>
  );
}
