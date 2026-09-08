'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const scoreCat = document.getElementById('score-cat');
const scoreDog = document.getElementById('score-dog');

let state = createInitialState();
let scores = { cat: 0, dog: 0 };

function render() {
  cells.forEach((cell, i) => {
    const symbol = state.board[i] === 'X' ? '🐱' : state.board[i] === 'O' ? '🐶' : '';
    cell.textContent = symbol;
    cell.className   = 'cell' + (state.board[i] ? ` ${state.board[i].toLowerCase()}` : '');
    cell.disabled    = state.board[i] !== '' || state.gameOver;
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
      const winnerEmoji = result.winner === 'X' ? '🐱' : '🐶';
      // Update score
      if (result.winner === 'X') {
        scores.cat++;
        scoreCat.textContent = scores.cat;
      } else {
        scores.dog++;
        scoreDog.textContent = scores.dog;
      }
      setStatus(`Player ${winnerEmoji} wins!`, 'win');
    } else {
      setStatus("It's a draw!", 'draw');
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  const emoji = state.current === 'X' ? '🐱' : '🐶';
  setStatus(`Player ${emoji}'s turn`);
}

function restartGame() {
  state = createInitialState();
  render();
  const emoji = state.current === 'X' ? '🐱' : '🐶';
  setStatus(`Player ${emoji}'s turn`);
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

// Initial render
render();
const initialEmoji = state.current === 'X' ? '🐱' : '🐶';
setStatus(`Player ${initialEmoji}'s turn`);
