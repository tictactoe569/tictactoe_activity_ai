'use strict';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a board from a 9-char string (' ', '🐱', '🐶'). */
function boardFrom(str) {
  return Array.from(str).map(c => (c === ' ' ? '' : c));
}

// ---------------------------------------------------------------------------
// WINNING_COMBOS
// ---------------------------------------------------------------------------

describe('WINNING_COMBOS', () => {
  test('has exactly 8 combos', () => {
    expect(WINNING_COMBOS).toHaveLength(8);
  });

  test('every combo contains exactly 3 unique indices in range 0-8', () => {
    WINNING_COMBOS.forEach(combo => {
      expect(combo).toHaveLength(3);
      combo.forEach(i => {
        expect(i).toBeGreaterThanOrEqual(0);
        expect(i).toBeLessThanOrEqual(8);
      });
      expect(new Set(combo).size).toBe(3);
    });
  });
});

// ---------------------------------------------------------------------------
// createInitialState
// ---------------------------------------------------------------------------

describe('createInitialState', () => {
  test('returns a board of 9 empty strings', () => {
    const { board } = createInitialState();
    expect(board).toHaveLength(9);
    expect(board.every(c => c === '')).toBe(true);
  });

  test('first player is 🐱', () => {
    expect(createInitialState().current).toBe('🐱');
  });

  test('gameOver is false', () => {
    expect(createInitialState().gameOver).toBe(false);
  });

  test('each call returns a distinct board array', () => {
    const s1 = createInitialState();
    const s2 = createInitialState();
    expect(s1.board).not.toBe(s2.board);
  });
});

// ---------------------------------------------------------------------------
// getNextPlayer
// ---------------------------------------------------------------------------

describe('getNextPlayer', () => {
  test('🐱 -> 🐶', () => {
    expect(getNextPlayer('🐱')).toBe('🐶');
  });

  test('🐶 -> 🐱', () => {
    expect(getNextPlayer('🐶')).toBe('🐱');
  });
});

// ---------------------------------------------------------------------------
// applyMove
// ---------------------------------------------------------------------------

describe('applyMove', () => {
  test('places the player mark on the correct cell', () => {
    const board = Array(9).fill('');
    const next = applyMove(board, 4, '🐱');
    expect(next[4]).toBe('🐱');
  });

  test('does not mutate the original board', () => {
    const board = Array(9).fill('');
    applyMove(board, 0, '🐱');
    expect(board[0]).toBe('');
  });

  test('returns null when cell is already occupied', () => {
    const board = boardFrom('🐱        ');
    expect(applyMove(board, 0, '🐶')).toBeNull();
  });

  test('returns null for index below 0', () => {
    expect(applyMove(Array(9).fill(''), -1, '🐱')).toBeNull();
  });

  test('returns null for index above 8', () => {
    expect(applyMove(Array(9).fill(''), 9, '🐱')).toBeNull();
  });

  test('all other cells remain unchanged', () => {
    const board = Array(9).fill('');
    const next = applyMove(board, 3, '🐶');
    next.forEach((cell, i) => {
      if (i !== 3) expect(cell).toBe('');
    });
  });
});

// ---------------------------------------------------------------------------
// checkWinner
// ---------------------------------------------------------------------------

describe('checkWinner — in-progress games return null', () => {
  test('empty board', () => {
    expect(checkWinner(Array(9).fill(''))).toBeNull();
  });

  test('one move played', () => {
    const board = boardFrom('🐱        ');
    expect(checkWinner(board)).toBeNull();
  });

  test('no winner yet with several moves', () => {
    // 🐱 🐶 🐱
    // 🐶 🐱 🐶
    //       (game still going)
    const board = boardFrom('🐱🐶🐱🐶🐱    ');
    expect(checkWinner(board)).toBeNull();
  });
});

describe('checkWinner — 🐱 wins', () => {
  test('top row', () => {
    const board = boardFrom('🐱🐱🐱🐶🐶    ');
    const result = checkWinner(board);
    expect(result).not.toBeNull();
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([0, 1, 2]);
  });

  test('middle row', () => {
    //   🐶      <- 0-2
    // 🐱 🐱 🐱    <- 3-5
    //   🐶      <- 6-8
    const board = boardFrom(' 🐶 🐱🐱🐱🐶  ');
    const result = checkWinner(board);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([3, 4, 5]);
  });

  test('bottom row', () => {
    const b = Array(9).fill('');
    b[6] = '🐱'; b[7] = '🐱'; b[8] = '🐱';
    b[0] = '🐶'; b[1] = '🐶'; b[3] = '🐶';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([6, 7, 8]);
  });

  test('left column', () => {
    const b = Array(9).fill('');
    b[0] = '🐱'; b[3] = '🐱'; b[6] = '🐱';
    b[1] = '🐶'; b[4] = '🐶';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([0, 3, 6]);
  });

  test('middle column', () => {
    const b = Array(9).fill('');
    b[1] = '🐱'; b[4] = '🐱'; b[7] = '🐱';
    b[0] = '🐶'; b[3] = '🐶';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([1, 4, 7]);
  });

  test('right column', () => {
    const b = Array(9).fill('');
    b[2] = '🐱'; b[5] = '🐱'; b[8] = '🐱';
    b[0] = '🐶'; b[1] = '🐶';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([2, 5, 8]);
  });

  test('main diagonal (top-left to bottom-right)', () => {
    const b = Array(9).fill('');
    b[0] = '🐱'; b[4] = '🐱'; b[8] = '🐱';
    b[1] = '🐶'; b[2] = '🐶';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([0, 4, 8]);
  });

  test('anti-diagonal (top-right to bottom-left)', () => {
    const b = Array(9).fill('');
    b[2] = '🐱'; b[4] = '🐱'; b[6] = '🐱';
    b[0] = '🐶'; b[1] = '🐶';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐱');
    expect(result.combo).toEqual([2, 4, 6]);
  });
});

describe('checkWinner — 🐶 wins', () => {
  test('top row', () => {
    const b = Array(9).fill('');
    b[0] = '🐶'; b[1] = '🐶'; b[2] = '🐶';
    b[3] = '🐱'; b[4] = '🐱';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐶');
    expect(result.combo).toEqual([0, 1, 2]);
  });

  test('left column', () => {
    const b = Array(9).fill('');
    b[0] = '🐶'; b[3] = '🐶'; b[6] = '🐶';
    b[1] = '🐱'; b[4] = '🐱';
    const result = checkWinner(b);
    expect(result.winner).toBe('🐶');
    expect(result.combo).toEqual([0, 3, 6]);
  });
});

describe('checkWinner — draw', () => {
  test('full board with no winner returns { winner: null, combo: [] }', () => {
    // 🐱 🐶 🐱
    // 🐶 🐶 🐱
    // 🐱 🐱 🐶  — no three in a row
    // Known draw: 🐱 🐶 🐱 / 🐶 🐶 🐱 / 🐱 🐱 🐶
    const draw = boardFrom('🐱🐶🐱🐶🐶🐱🐱🐱🐶');
    // Row 0: 🐱 🐶 🐱 - no
    // Row 1: 🐶 🐶 🐱 - no
    // Row 2: 🐱 🐱 🐶 - no
    // Col 0: 🐱 🐶 🐱 - no
    // Col 1: 🐶 🐶 🐱 - no
    // Col 2: 🐱 🐱 🐶 - no
    // Diag: 🐱 🐶 🐶 - no
    // Anti: 🐱 🐶 🐱 - no  ✓ draw
    const result = checkWinner(draw);
    expect(result).not.toBeNull();
    expect(result.winner).toBeNull();
    expect(result.combo).toEqual([]);
  });

  test('another valid draw board', () => {
    // 🐶 🐱 🐶
    // 🐶 🐱 🐱
    // 🐱 🐶 🐱
    const b = boardFrom('🐶🐱🐶🐶🐱🐱🐱🐶🐱');
    // Row 0: 🐶 🐱 🐶 - no
    // Row 1: 🐶 🐱 🐱 - no
    // Row 2: 🐱 🐶 🐱 - no
    // Col 0: 🐶 🐶 🐱 - no
    // Col 1: 🐱 🐱 🐶 - no
    // Col 2: 🐶 🐱 🐱 - no
    // Diag: 🐶 🐱 🐱 - no
    // Anti: 🐶 🐱 🐱 - no  ✓ draw
    const result = checkWinner(b);
    expect(result).not.toBeNull();
    expect(result.winner).toBeNull();
    expect(result.combo).toEqual([]);
  });
});

describe('checkWinner — result shape', () => {
  test('winning result has winner string and combo array', () => {
    const b = Array(9).fill('');
    b[0] = '🐱'; b[1] = '🐱'; b[2] = '🐱';
    const result = checkWinner(b);
    expect(typeof result.winner).toBe('string');
    expect(Array.isArray(result.combo)).toBe(true);
    expect(result.combo).toHaveLength(3);
  });

  test('combo indices are valid board positions', () => {
    const b = Array(9).fill('');
    b[0] = '🐶'; b[1] = '🐶'; b[2] = '🐶';
    const { combo } = checkWinner(b);
    combo.forEach(i => {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThanOrEqual(8);
    });
  });
});
