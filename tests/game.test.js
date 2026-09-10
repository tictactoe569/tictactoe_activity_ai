'use strict';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a board from a 9-char string (' ', 'X', 'O', '🐱', '🐶'), or from 9 emojis. */
function boardFrom(str) {
  // Handle emoji-based strings (each emoji as one character)
  if (str.includes('🐱') || str.includes('🐶')) {
    const chars = [];
    for (const ch of str) {
      chars.push(ch === ' ' ? '' : ch);
    }
    return chars;
  }
  return str.split('').map(c => (c === ' ' ? '' : c));
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

  test('first player is CAT', () => {
    expect(createInitialState().current).toBe(CAT);
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
  test('CAT -> DOG', () => {
    expect(getNextPlayer(CAT)).toBe(DOG);
  });

  test('DOG -> CAT', () => {
    expect(getNextPlayer(DOG)).toBe(CAT);
  });
});

// ---------------------------------------------------------------------------
// applyMove
// ---------------------------------------------------------------------------

describe('applyMove', () => {
  test('places the player mark on the correct cell', () => {
    const board = Array(9).fill('');
    const next = applyMove(board, 4, CAT);
    expect(next[4]).toBe(CAT);
  });

  test('does not mutate the original board', () => {
    const board = Array(9).fill('');
    applyMove(board, 0, CAT);
    expect(board[0]).toBe('');
  });

  test('returns null when cell is already occupied', () => {
    const board = boardFrom('🐱        ');
    expect(applyMove(board, 0, DOG)).toBeNull();
  });

  test('returns null for index below 0', () => {
    expect(applyMove(Array(9).fill(''), -1, CAT)).toBeNull();
  });

  test('returns null for index above 8', () => {
    expect(applyMove(Array(9).fill(''), 9, CAT)).toBeNull();
  });

  test('all other cells remain unchanged', () => {
    const board = Array(9).fill('');
    const next = applyMove(board, 3, DOG);
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
    const board = boardFrom('🐱🐶🐱🐶🐱🐶    ');
    expect(checkWinner(board)).toBeNull();
  });
});

describe('checkWinner — CAT wins', () => {
  test('top row', () => {
    const board = boardFrom('🐱🐱🐱🐶🐶    ');
    const result = checkWinner(board);
    expect(result).not.toBeNull();
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([0, 1, 2]);
  });

  test('middle row', () => {
    //   🐶      <- 0-2
    // 🐱 🐱 🐱    <- 3-5
    //   🐶      <- 6-8
    const board = boardFrom(' 🐶 🐱🐱🐱🐶  ');
    const result = checkWinner(board);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([3, 4, 5]);
  });

  test('bottom row', () => {
    const b = Array(9).fill('');
    b[6] = CAT; b[7] = CAT; b[8] = CAT;
    b[0] = DOG; b[1] = DOG; b[3] = DOG;
    const result = checkWinner(b);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([6, 7, 8]);
  });

  test('left column', () => {
    const b = Array(9).fill('');
    b[0] = CAT; b[3] = CAT; b[6] = CAT;
    b[1] = DOG; b[4] = DOG;
    const result = checkWinner(b);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([0, 3, 6]);
  });

  test('middle column', () => {
    const b = Array(9).fill('');
    b[1] = CAT; b[4] = CAT; b[7] = CAT;
    b[0] = DOG; b[3] = DOG;
    const result = checkWinner(b);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([1, 4, 7]);
  });

  test('right column', () => {
    const b = Array(9).fill('');
    b[2] = CAT; b[5] = CAT; b[8] = CAT;
    b[0] = DOG; b[1] = DOG;
    const result = checkWinner(b);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([2, 5, 8]);
  });

  test('main diagonal (top-left to bottom-right)', () => {
    const b = Array(9).fill('');
    b[0] = CAT; b[4] = CAT; b[8] = CAT;
    b[1] = DOG; b[2] = DOG;
    const result = checkWinner(b);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([0, 4, 8]);
  });

  test('anti-diagonal (top-right to bottom-left)', () => {
    const b = Array(9).fill('');
    b[2] = CAT; b[4] = CAT; b[6] = CAT;
    b[0] = DOG; b[1] = DOG;
    const result = checkWinner(b);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([2, 4, 6]);
  });
});

describe('checkWinner — DOG wins', () => {
  test('top row', () => {
    const b = Array(9).fill('');
    b[0] = DOG; b[1] = DOG; b[2] = DOG;
    b[3] = CAT; b[4] = CAT;
    const result = checkWinner(b);
    expect(result.winner).toBe(DOG);
    expect(result.combo).toEqual([0, 1, 2]);
  });

  test('left column', () => {
    const b = Array(9).fill('');
    b[0] = DOG; b[3] = DOG; b[6] = DOG;
    b[1] = CAT; b[4] = CAT;
    const result = checkWinner(b);
    expect(result.winner).toBe(DOG);
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
    b[0] = CAT; b[1] = CAT; b[2] = CAT;
    const result = checkWinner(b);
    expect(typeof result.winner).toBe('string');
    expect(Array.isArray(result.combo)).toBe(true);
    expect(result.combo).toHaveLength(3);
  });

  test('combo indices are valid board positions', () => {
    const b = Array(9).fill('');
    b[0] = DOG; b[1] = DOG; b[2] = DOG;
    const { combo } = checkWinner(b);
    combo.forEach(i => {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThanOrEqual(8);
    });
  });
});
