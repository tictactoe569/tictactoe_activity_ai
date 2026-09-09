'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const scoreCat = document.getElementById('scoreCat');
const scoreDog = document.getElementById('scoreDog');

let state = createInitialState();
let score = { cat: 0, dog: 0 };

function updateScoreDisplay() {
  scoreCat.textContent = score.cat;
  scoreDog.textContent = score.dog;
}

function render() {
  cells.forEach((cell, i) => {
    const symbol = state.board[i];
    cell.textContent = symbol;
    const playerClass = symbol === '🐱' ? 'x' : symbol === '🐶' ? 'o' : '';
    cell.className   = 'cell' + (playerClass ? ` ${playerClass}` : '');
    cell.disabled    = symbol !== '' || state.gameOver;
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
      setStatus(`Player ${result.winner} wins!`, 'win');
      // Update score
      if (result.winner === '🐱') score.cat++;
      else score.dog++;
      updateScoreDisplay();
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

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

// Initial render
render();
setStatus(`Player ${state.current}'s turn`);