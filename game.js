'use strict';

// Player symbols: 🐱 (cat face) replaces the traditional 'X',
// 🐶 (dog face) replaces the traditional 'O'.
const CAT = '🐱';
const DOG = '🐶';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

/**
 * Returns the initial game state.
 */
function createInitialState() {
  return {
    board:   Array(9).fill(''),
    current: CAT,
    gameOver: false,
  };
}

/**
 * Returns the next player given the current one.
 * @param {string} current one of CAT ('🐱') or DOG ('🐶')
 * @returns {string} the other player symbol
 */
function getNextPlayer(current) {
  return current === CAT ? DOG : CAT;
}

/**
 * Returns a new board with the move applied, or null if the move is invalid.
 * @param {string[]} board
 * @param {number}   index  0-8
 * @param {string} player one of CAT ('🐱') or DOG ('🐶')
 * @returns {string[]|null}
 */
function applyMove(board, index, player) {
  if (index < 0 || index > 8) return null;
  if (board[index] !== '')    return null;
  const next = board.slice();
  next[index] = player;
  return next;
}

/**
 * Checks the board for a winner or draw.
 * @param {string[]} board
 * @returns {{ winner: string, combo: number[] }|{ winner: null, combo: [] }|null}
 *   - Object with winner (CAT or DOG) and winning combo indices if someone won.
 *   - Object with winner null and empty combo if the board is full (draw).
 *   - null if the game is still in progress.
 */
function checkWinner(board) {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  if (board.every(cell => cell !== '')) return { winner: null, combo: [] };
  return null;
}

// ---------------------------------------------------------------------------
// Score / Championship  (pure functions, no DOM)
// ---------------------------------------------------------------------------

/**
 * Returns the initial score state (both players at zero).
 * @returns {{ cat: number, dog: number }}
 */
function createScoreState() {
  return { cat: 0, dog: 0 };
}

/**
 * Returns a new score object with one point added for the given winner.
 * @param {{ cat: number, dog: number }} score
 * @param {string} winner  CAT or DOG (or null/empty for draw — score unchanged)
 * @returns {{ cat: number, dog: number }} new score object
 */
function incrementScore(score, winner) {
  if (winner === CAT) return { cat: score.cat + 1, dog: score.dog };
  if (winner === DOG) return { cat: score.cat, dog: score.dog + 1 };
  return { ...score }; // draw – no change
}

/**
 * Returns a fresh zeroed score.
 * @returns {{ cat: number, dog: number }}
 */
function resetScore() {
  return { cat: 0, dog: 0 };
}

/**
 * Returns the player label for display (capitalized).
 * @param {string} player  CAT or DOG
 * @returns {string}
 */
function getPlayerLabel(player) {
  return player === CAT ? 'Cat' : 'Dog';
}

// Allow require() in Node.js (Jest) while remaining a plain script in the browser.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WINNING_COMBOS, CAT, DOG,
    createInitialState, getNextPlayer, applyMove, checkWinner,
    createScoreState, incrementScore, resetScore, getPlayerLabel,
  };
}
