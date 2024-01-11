import { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";

import { Square } from "./components/Square";

import { WinnerModal } from "./components/WinnerModal";

import { TURNS } from "./constants";

import { checkEndGame, checkWinnerFrom } from "./logic/board";

function App() {
  const [board, setBoard] = useState(() => {
    const savedBoard = localStorage.getItem("board");
    return savedBoard ? JSON.parse(savedBoard) : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const savedTurn = localStorage.getItem("turn");
    return savedTurn ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    localStorage.removeItem("board");
    localStorage.removeItem("turn");
  };

  checkEndGame(board);

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    //guardar juego
    localStorage.setItem("board", JSON.stringify(newBoard));
    localStorage.setItem("turn", newTurn);

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Cero Mata Cero</h1>
      <button onClick={resetGame}>Resetear juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  );
}

export default App;
