'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const symbol_X = '🐱';
const markname_X = "cat";
const symbol_O = '🐶';
const markname_O = "dog";

let state = createInitialState();

function render() {
  cells.forEach((cell, i) => {
    const mark = state.board[i];
    cell.textContent = mark === 'X' ? symbol_X : mark === 'O' ? symbol_O : '';
    cell.className   = 'cell' + (mark ? ` ${mark === 'X' ? markname_X : markname_O}` : '');
    cell.disabled    = mark !== '' || state.gameOver;
  });
}

function setStatus(msg, cls = '') {
  status.textContent = msg;
  status.className   = 'status' + (cls ? ` ${cls}` : '');
}

function handleClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (state.board[idx] || state.gameOver) return;

  const nextBoard = applyMove(state.board, idx, state.current);
  if (!nextBoard) return;
  state.board = nextBoard;
  render();

  // Animate the placed cell
  cells[idx].classList.add('placed');

  const result = checkWinner(state.board);

  if (result) {
    state.gameOver = true;
    if (result.winner) {
      result.combo.forEach(i => cells[i].classList.add('winning'));
      const emoji = result.winner === 'X' ? symbol_X : symbol_O;
      setStatus(`Player ${emoji} wins!`, 'win');
    } else {
      setStatus("It's a draw!", 'draw');
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  const nextEmoji = state.current === 'X' ? symbol_X : symbol_O;
  setStatus(`Player ${nextEmoji}'s turn`);
}

function restartGame() {
  state = createInitialState();
  render();
  const emoji = state.current === 'X' ? symbol_X : symbol_O;
  setStatus(`Player ${emoji}'s turn`);
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

// Initial render
render();
const initialEmoji = state.current === 'X' ? symbol_X : symbol_O;
setStatus(`Player ${initialEmoji}'s turn`);
