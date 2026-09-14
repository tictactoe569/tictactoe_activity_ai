'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');

let state = createInitialState();
let lastMove = null;   // índice da última jogada (para undo)
let redoMove = null;   // índice desfeito (para redo no futuro)

const SYMBOL = { X: '🐱', O: '🐶' };

const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = SYMBOL[state.board[i]] || '';
    cell.className   = 'cell' + (state.board[i] ? ` ${state.board[i].toLowerCase()}` : '');
    cell.disabled    = state.board[i] !== '' || state.gameOver;
  });
  undoBtn.disabled = lastMove === null || state.gameOver;
  redoBtn.disabled = redoMove === null || state.gameOver;
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
  lastMove = idx;
  redoMove = null;   // nova jogada invalida o redo pendente
  render();

  // Animate the placed cell
  cells[idx].classList.add('placed');

  const result = checkWinner(state.board);

  if (result) {
    state.gameOver = true;
    if (result.winner) {
      result.combo.forEach(i => cells[i].classList.add('winning'));
      setStatus(`${SYMBOL[result.winner]} wins!`, 'win');
    } else {
      setStatus("It's a draw!", 'draw');
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    render();
    return;
  }

  state.current = getNextPlayer(state.current);
  setStatus(`${SYMBOL[state.current]}'s turn`);
}

function handleUndo() {
  if (lastMove === null || state.gameOver) return;

  redoMove = lastMove;   // guarda para redo futuro
  const newState = undoMove(state, lastMove);
  if (!newState) return;

  state = newState;
  lastMove = null;       // só pode desfazer uma vez
  render();
  setStatus(`${SYMBOL[state.current]}'s turn`);
}

function handleRedo() {
  if (redoMove === null || state.gameOver) return;

  const idx = redoMove;
  const nextBoard = applyMove(state.board, idx, state.current);
  if (!nextBoard) return;

  state.board = nextBoard;
  lastMove = idx;
  redoMove = null;
  render();

  cells[idx].classList.add('placed');

  const result = checkWinner(state.board);

  if (result) {
    state.gameOver = true;
    if (result.winner) {
      result.combo.forEach(i => cells[i].classList.add('winning'));
      setStatus(`${SYMBOL[result.winner]} wins!`, 'win');
    } else {
      setStatus("It's a draw!", 'draw');
    }
    cells.forEach(c => (c.disabled = true));
    render();
    return;
  }

  state.current = getNextPlayer(state.current);
  setStatus(`${SYMBOL[state.current]}'s turn`);
}

function restartGame() {
  state = createInitialState();
  lastMove = null;
  redoMove = null;
  render();
  setStatus(`${SYMBOL[state.current]}'s turn`);
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', handleUndo);
redoBtn.addEventListener('click', handleRedo);

// Initial render
render();
setStatus(`${SYMBOL[state.current]}'s turn`);
