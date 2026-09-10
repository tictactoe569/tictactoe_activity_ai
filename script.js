'use strict';

// WINNING_COMBOS, checkWinner, getNextPlayer, applyMove, createInitialState, createScoreState, updateScore, CAT, DOG
// are provided by game.js, loaded before this script.

const cells    = document.querySelectorAll('.cell');
const status   = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const scoreboard    = document.getElementById('scoreboard');
const scoreCat      = document.getElementById('score-cat');
const scoreDog      = document.getElementById('score-dog');
const scoreDraws    = document.getElementById('score-draws');
const startChampBtn = document.getElementById('start-championship');
const endChampBtn   = document.getElementById('end-championship');

const symbolClass = { [CAT]: 'cat', [DOG]: 'dog' };

let state = createInitialState();
let championshipActive = false;
let score = createScoreState();

function renderScore() {
  scoreCat.textContent   = score.cat;
  scoreDog.textContent   = score.dog;
  scoreDraws.textContent = score.draws;
}

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = state.board[i];
    cell.className   = 'cell' + (state.board[i] ? ` ${symbolClass[state.board[i]]}` : '');
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
      setStatus(`${result.winner} wins!`, 'win');
      if (championshipActive) {
        score = updateScore(score, result.winner);
        renderScore();
      }
    } else {
      setStatus("It's a draw!", 'draw');
      if (championshipActive) {
        score = updateScore(score, null);
        renderScore();
      }
    }
    // Disable all cells
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  setStatus(`${state.current}'s turn`);
}

function restartGame() {
  state = createInitialState();
  render();
  setStatus(`🐱's turn`);
}

function startChampionship() {
  championshipActive = true;
  score = createScoreState();
  renderScore();
  scoreboard.hidden = false;
  startChampBtn.hidden = true;
  endChampBtn.hidden = false;
  restartGame();
  setStatus('🏆 Campeonato iniciado! 🐱 jogando');
}

function endChampionship() {
  championshipActive = false;
  scoreboard.hidden = true;
  startChampBtn.hidden = false;
  endChampBtn.hidden = true;
  restartGame();
  setStatus('🏆 Campeonato encerrado');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
startChampBtn.addEventListener('click', startChampionship);
endChampBtn.addEventListener('click', endChampionship);

// Initial render
render();
setStatus(`🐱's turn`);
