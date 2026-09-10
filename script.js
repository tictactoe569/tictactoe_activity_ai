'use strict';

// ---------------------------------------------------------------------------
// game.js provides: WINNING_COMBOS, CAT, DOG, createInitialState,
// getNextPlayer, applyMove, checkWinner, createScoreState,
// incrementScore, resetScore, getPlayerLabel
// ---------------------------------------------------------------------------

// ---- DOM refs ----
const cells          = document.querySelectorAll('.cell');
const statusEl       = document.getElementById('status');
const restartBtn     = document.getElementById('restart');
const scoreboard     = document.getElementById('scoreboard');
const scoreCat       = document.getElementById('score-cat');
const scoreDog       = document.getElementById('score-dog');
const modeModal      = document.getElementById('mode-modal');
const btnChampionship = document.getElementById('btn-championship');
const btnFreeplay    = document.getElementById('btn-freeplay');

// ---- State ----
let state = createInitialState();
let score = createScoreState();
let championshipMode = false;

// ---- Helpers ----

const symbolClass = {
  [CAT]: 'cat',
  [DOG]: 'dog',
};

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = state.board[i];
    cell.className   = 'cell' + (state.board[i] ? ` ${symbolClass[state.board[i]]}` : '');
    cell.disabled    = state.board[i] !== '' || state.gameOver;
  });
}

function setStatus(msg, cls = '') {
  statusEl.textContent = msg;
  statusEl.className   = 'status' + (cls ? ` ${cls}` : '');
}

function updateScoreDisplay() {
  scoreCat.textContent = score.cat;
  scoreDog.textContent = score.dog;
}

function showScoreboard() {
  scoreboard.classList.remove('hidden');
}

function hideScoreboard() {
  scoreboard.classList.add('hidden');
}

function clearChampionshipButtons() {
  // Remove any dynamically added championship action buttons
  document.querySelectorAll('.champ-btn').forEach(btn => btn.remove());
}

// ---- Championship action buttons ----

function addChampionshipButtons() {
  clearChampionshipButtons();

  const actions = document.querySelector('.actions');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn champ-btn';
  nextBtn.textContent = '▶ Próxima Partida';
  nextBtn.addEventListener('click', () => startMatch());

  const restartChampBtn = document.createElement('button');
  restartChampBtn.className = 'btn champ-btn';
  restartChampBtn.textContent = '🔄 Reiniciar Campeonato';
  restartChampBtn.addEventListener('click', () => restartChampionship());

  const endBtn = document.createElement('button');
  endBtn.className = 'btn btn-secondary champ-btn';
  endBtn.textContent = '⏹ Encerrar Campeonato';
  endBtn.addEventListener('click', () => endChampionship());

  actions.appendChild(nextBtn);
  actions.appendChild(restartChampBtn);
  actions.appendChild(endBtn);
  restartBtn.classList.add('hidden');
}

function showStandardButtons() {
  clearChampionshipButtons();
  restartBtn.classList.remove('hidden');
}

// ---- Game flow ----

function startMatch() {
  state = createInitialState();
  render();
  clearChampionshipButtons();
  if (championshipMode) {
    setStatus(`Player ${state.current}'s turn — Campeonato`);
  } else {
    setStatus(`Player ${state.current}'s turn`);
  }
}

function restartChampionship() {
  score = resetScore();
  updateScoreDisplay();
  startMatch();
}

function endChampionship() {
  championshipMode = false;
  hideScoreboard();
  showStandardButtons();
  state = createInitialState();
  render();
  // Show a summary before the modal
  const summary = `🏁 Campeonato encerrado!\n\n🐱 Cat: ${score.cat} vitórias\n🐶 Dog: ${score.dog} vitórias`;
  alert(summary); // quick summary; modal will follow
  score = resetScore();
  showModeModal();
}

// ---- Mode modal ----

function showModeModal() {
  modeModal.classList.remove('hidden');
}

function hideModeModal() {
  modeModal.classList.add('hidden');
}

function enterChampionshipMode() {
  championshipMode = true;
  score = resetScore();
  updateScoreDisplay();
  showScoreboard();
  hideModeModal();
  startMatch();
}

function enterFreePlayMode() {
  championshipMode = false;
  hideScoreboard();
  hideModeModal();
  showStandardButtons();
  startMatch();
}

// ---- Click handler ----

function handleClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (state.board[idx] || state.gameOver) return;

  const nextBoard = applyMove(state.board, idx, state.current);
  if (!nextBoard) return;
  state.board = nextBoard;
  render();

  cells[idx].classList.add('placed');

  const result = checkWinner(state.board);

  if (result) {
    state.gameOver = true;
    if (result.winner) {
      result.combo.forEach(i => cells[i].classList.add('winning'));
      if (championshipMode) {
        score = incrementScore(score, result.winner);
        updateScoreDisplay();
        setStatus(`🏆 ${getPlayerLabel(result.winner)} venceu esta partida!`, 'win');
        addChampionshipButtons();
      } else {
        setStatus(`Player ${result.winner} wins!`, 'win');
      }
    } else {
      setStatus("It's a draw!", 'draw');
      if (championshipMode) {
        addChampionshipButtons();
      }
    }
    cells.forEach(c => (c.disabled = true));
    return;
  }

  state.current = getNextPlayer(state.current);
  if (championshipMode) {
    setStatus(`Player ${state.current}'s turn — Campeonato`);
  } else {
    setStatus(`Player ${state.current}'s turn`);
  }
}

// ---- Event listeners ----

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', startMatch);
btnChampionship.addEventListener('click', enterChampionshipMode);
btnFreeplay.addEventListener('click', enterFreePlayMode);

// ---- Initialisation ----
// Show the mode modal on page load (game starts only after user choice)
showModeModal();
