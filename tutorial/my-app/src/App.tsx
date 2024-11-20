import "./App.css";
import { useState } from "react";

interface SquareProps {
  value: string;
  onSquareClick: () => void;
}

interface BoardProps {
  xIsNext: boolean;
  squares: string[];
  onPlay: (squares: string[]) => void;
  move: number;
}

function Square({value, onSquareClick}: SquareProps) {
  return <button className="square" onClick={ onSquareClick }>{ value }</button>;
}

function calculateWinner(squares: string[]) {
  const lines = [
    [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], // rows
    [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ], // columns
    [ 0, 4, 8 ], [ 2, 4, 6 ] // diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [ a, b, c ] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], position: lines[i]};
    }
  }
  return {winner: null, position: null};
}

function Board({xIsNext, squares, onPlay, move}: BoardProps) {
  const {winner, position} = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${ winner }`;
    position?.forEach((i) => {
      document.getElementsByClassName('square')[i].classList.add('winner');
    });
  } else {
    status = `Next player: ${ xIsNext ? 'X' : 'O' }`;
  }
  if (!winner && move === 9) {
    status = 'Draw!';
  }

  const handleClick = (i: number) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  const board = [];
  board.push(
    <div key="status" className="status">{ status }</div>,
    <div key="moveCounter" className="moveCounter">You're at #{ move === 0 ? 'start ' : move } move</div>
  );
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      row.push(<Square key={ index } value={ squares[index] } onSquareClick={ () => handleClick(index) }/>);
    }
    board.push(<div key={ `row-${ i }` } className="board-row">{ row }</div>);
  }
  return (board)
}

export default function Game() {
  const [ history, setHistory ] = useState([ Array(9).fill('') ]);
  const [ currentMove, setCurrentMove ] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ orderByASC, setOrderByASC ] = useState(true);
  const moves = history.map((_squares: string[], move: number) => {
    let description;
    if (move > 0) {
      description = `Go to move #${ move }`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={ move }>
        <button onClick={ () => jumpTo(move) }>{ description }</button>
      </li>
    )
  });

  function handlePlay(nextSquares: string[]) {
    const nextHistory = [ ...history.slice(0, currentMove + 1), nextSquares ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setOrderByASC(!orderByASC);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={ xIsNext } squares={ currentSquares } onPlay={ handlePlay } move={ currentMove }/>
      </div>
      <div className="game-info">
        <button className="sort-moves" onClick={ sortMoves }>{ orderByASC ? "오름차순" : "내림차순" }</button>
        <ol>{ orderByASC ? moves : [ ...moves ].reverse() }</ol>
      </div>
    </div>
  );
}
