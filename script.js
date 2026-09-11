'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

// Visual symbols (mapped from game.js internal X/O)
const CAT = '🐱';
const DOG = '🐶';
const symbolClass = { X: 'cat', O: 'dog' };

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');

let state = createInitialState();

// ── Score state ──
let scores = { cat: 0, dog: 0 };

function renderScoreboard() {
  document.getElementById('score-cat').textContent = scores.cat;
  document.getElementById('score-dog').textContent = scores.dog;
}

function render() {
  cells.forEach((cell, i) => {
    const mark = state.board[i];
    cell.textContent = mark === 'X' ? CAT : mark === 'O' ? DOG : '';
    cell.className   = 'cell' + (mark ? ` ${symbolClass[mark]}` : '');
    cell.disabled    = mark !== '' || state.gameOver;
  });
}

function setStatus(msg, cls = '') {
  // Replace X/O in status messages with visual emojis
  msg = msg.replace('X', CAT).replace('O', DOG);
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
      setStatus(`Player ${result.winner} wins!`, 'win');
      // Update score
      if (result.winner === 'X') scores.cat++;
      else scores.dog++;
      renderScoreboard();
    } else {
      setStatus("It's a draw!", 'draw');
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  setStatus(`Player ${state.current}'s turn`);
}

function restartGame() {
  state = createInitialState();
  render();
  setStatus(`Player ${state.current}'s turn`);
}

// Reset score
function resetScore() {
  scores = { cat: 0, dog: 0 };
  renderScoreboard();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
document.getElementById('reset-score').addEventListener('click', resetScore);

// Initial render
render();
renderScoreboard();
setStatus(`Player ${state.current}'s turn`);
