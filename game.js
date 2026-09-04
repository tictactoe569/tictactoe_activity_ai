'use strict';

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
    current: '🐱',
    gameOver: false,
  };
}

/**
 * Returns the initial score state.
 */
function createInitialScore() {
  return { cat: 0, dog: 0 };
}

/**
 * Returns a new score object with the winner's count incremented.
 * @param {{ cat: number, dog: number }} score
 * @param {'🐱'|'🐶'} winner
 * @returns {{ cat: number, dog: number }}
 */
function incrementScore(score, winner) {
  const next = { ...score };
  if (winner === '🐱') next.cat += 1;
  else if (winner === '🐶') next.dog += 1;
  return next;
}

/**
 * Returns the next player given the current one.
 * @param {'🐱'|'🐶'} current
 * @returns {'🐱'|'🐶'}
 */
function getNextPlayer(current) {
  return current === '🐱' ? '🐶' : '🐱';
}

/**
 * Returns a new board with the move applied, or null if the move is invalid.
 * @param {string[]} board
 * @param {number}   index  0-8
 * @param {'🐱'|'🐶'} player
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
 *   - Object with winner ('🐱'|'🐶') and winning combo indices if someone won.
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

// Allow require() in Node.js (Jest) while remaining a plain script in the browser.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WINNING_COMBOS, createInitialState, createInitialScore, incrementScore, getNextPlayer, applyMove, checkWinner };
}
