'use strict';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a board from a 9-char string (' ', 'X', 'O').
 * 'X' is converted to CAT ('🐱'), 'O' to DOG ('🐶') for readability.
 */
function boardFrom(str) {
  return str
    .split('')
    .map(c => (c === ' ' ? '' : c === 'X' ? CAT : c === 'O' ? DOG : c));
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

  test('first player is CAT (🐱)', () => {
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
    const board = boardFrom('X        ');
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
    const board = boardFrom('X        ');
    expect(checkWinner(board)).toBeNull();
  });

  test('no winner yet with several moves', () => {
    // X O X
    // O X O
    //       (game still going)
    const board = boardFrom('XOXOX    ');
    expect(checkWinner(board)).toBeNull();
  });
});

describe('checkWinner — X wins', () => {
  test('top row', () => {
    const board = boardFrom('XXXOO    ');
    const result = checkWinner(board);
    expect(result).not.toBeNull();
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([0, 1, 2]);
  });

  test('middle row', () => {
    //   O      <- 0-2
    // X X X    <- 3-5
    //   O      <- 6-8
    const board = boardFrom(' O XXXO  ');
    const result = checkWinner(board);
    expect(result.winner).toBe(CAT);
    expect(result.combo).toEqual([3, 4, 5]);
  });

  test('bottom row', () => {
    const board = boardFrom('OO OOXXX ');
    //                       012 345 678
    // Wait: 'OO OOXXX ' -> indices 6,7,8 = X,X,X — no wait let me recount
    // 'OO OOXXX ' -> O O ' ' O O X X X ' '
    // Actually let me fix this properly
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

describe('checkWinner — O wins', () => {
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
    // X O X
    // X X O
    // O X O  — no three in a row
    const b = boardFrom('XOXXXOOOO');
    // Wait let me think: X O X / X X O / O X O
    // Row 0: X O X - no
    // Row 1: X X O - no
    // Row 2: O X O - no
    // Col 0: X X O - no
    // Col 1: O X X - no
    // Col 2: X O O - no
    // Diag: X X O - no
    // Anti: X X O - no
    // Actually: XOXXXOOOO -> indices: X O X X X O O O O
    // That has XXX at 2,3,4 being X X X — that IS a win. Let me use a proper draw board.
    // Known draw: X O X / O O X / X X O
    const draw = boardFrom('XOXOOXXX O'.replace(' ', ''));
    // 'XOXOOXXXO' -> X O X / O O X / X X O
    // Row 0: X O X - no
    // Row 1: O O X - no
    // Row 2: X X O - no
    // Col 0: X O X - no
    // Col 1: O O X - no
    // Col 2: X X O - no
    // Diag: X O O - no
    // Anti: X O X - no  ✓ draw
    const result = checkWinner(draw);
    expect(result).not.toBeNull();
    expect(result.winner).toBeNull();
    expect(result.combo).toEqual([]);
  });

  test('another valid draw board', () => {
    // O X O
    // O X X
    // X O X
    const b = boardFrom('OXOOXXXOX');
    // Row 0: O X O - no
    // Row 1: O X X - no
    // Row 2: X O X - no
    // Col 0: O O X - no
    // Col 1: X X O - no
    // Col 2: O X X - no
    // Diag: O X X - no
    // Anti: O X X - no  ✓ draw
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

// ---------------------------------------------------------------------------
// Score / Championship functions
// ---------------------------------------------------------------------------

describe('createScoreState', () => {
  test('starts both players at zero', () => {
    const s = createScoreState();
    expect(s.cat).toBe(0);
    expect(s.dog).toBe(0);
  });
});

describe('incrementScore', () => {
  test('adds a point to cat when winner is CAT', () => {
    const s = createScoreState();
    const next = incrementScore(s, CAT);
    expect(next.cat).toBe(1);
    expect(next.dog).toBe(0);
  });

  test('adds a point to dog when winner is DOG', () => {
    const s = createScoreState();
    const next = incrementScore(s, DOG);
    expect(next.cat).toBe(0);
    expect(next.dog).toBe(1);
  });

  test('draw (null winner) leaves score unchanged', () => {
    const s = createScoreState();
    const next = incrementScore(s, null);
    expect(next.cat).toBe(0);
    expect(next.dog).toBe(0);
  });

  test('draw (undefined winner) leaves score unchanged', () => {
    const s = createScoreState();
    const next = incrementScore(s, undefined);
    expect(next.cat).toBe(0);
    expect(next.dog).toBe(0);
  });

  test('does not mutate the original score object', () => {
    const s = { cat: 2, dog: 1 };
    incrementScore(s, CAT);
    expect(s.cat).toBe(2);
    expect(s.dog).toBe(1);
  });

  test('accumulates across multiple calls', () => {
    let s = createScoreState();
    s = incrementScore(s, CAT);
    s = incrementScore(s, DOG);
    s = incrementScore(s, CAT);
    expect(s).toEqual({ cat: 2, dog: 1 });
  });
});

describe('resetScore', () => {
  test('returns a fresh zeroed score', () => {
    const s = { cat: 5, dog: 3 };
    const next = resetScore(s); // argument ignored by design
    expect(next).toEqual({ cat: 0, dog: 0 });
  });
});

describe('getPlayerLabel', () => {
  test('CAT maps to Cat', () => {
    expect(getPlayerLabel(CAT)).toBe('Cat');
  });

  test('DOG maps to Dog', () => {
    expect(getPlayerLabel(DOG)).toBe('Dog');
  });
});
