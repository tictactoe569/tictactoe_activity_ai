'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');

let state = createInitialState();
let scoreX = 0, scoreO = 0;

// Maps logical symbols (X, O) to display emojis
const SYMBOL_MAP = { X: '🐱', O: '🐶' };

function updateScoreDisplay() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
}

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = SYMBOL_MAP[state.board[i]] || '';
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
      if (result.winner === 'X') { scoreX++; } else { scoreO++; }
      updateScoreDisplay();
      result.combo.forEach(i => cells[i].classList.add('winning'));
      setStatus(`${SYMBOL_MAP[result.winner]} wins!`, 'win');
    } else {
      setStatus("It's a draw!", 'draw');
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  setStatus(`${SYMBOL_MAP[state.current]}'s turn`);
}

function restartGame() {
  state = createInitialState();
  render();
  setStatus(`${SYMBOL_MAP[state.current]}'s turn`);
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

// Initial render
render();
setStatus(`${SYMBOL_MAP[state.current]}'s turn`);
