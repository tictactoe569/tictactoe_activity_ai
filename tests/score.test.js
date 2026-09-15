'use strict';

// ---------------------------------------------------------------------------
// createScore
// ---------------------------------------------------------------------------

describe('createScore', () => {
  test('returns an object with 🐱 and 🐶 both at 0', () => {
    const s = createScore();
    expect(s['🐱']).toBe(0);
    expect(s['🐶']).toBe(0);
  });

  test('each call returns a distinct object', () => {
    const s1 = createScore();
    const s2 = createScore();
    expect(s1).not.toBe(s2);
  });
});

// ---------------------------------------------------------------------------
// incrementScore
// ---------------------------------------------------------------------------

describe('incrementScore', () => {
  test('increments 🐱 when winner is 🐱', () => {
    const s = createScore();
    const next = incrementScore(s, '🐱');
    expect(next['🐱']).toBe(1);
    expect(next['🐶']).toBe(0);
  });

  test('increments 🐶 when winner is 🐶', () => {
    const s = createScore();
    const next = incrementScore(s, '🐶');
    expect(next['🐱']).toBe(0);
    expect(next['🐶']).toBe(1);
  });

  test('does not mutate the original score object', () => {
    const s = createScore();
    incrementScore(s, '🐱');
    expect(s['🐱']).toBe(0);
  });

  test('returns a new object, not the same reference', () => {
    const s = createScore();
    const next = incrementScore(s, '🐱');
    expect(next).not.toBe(s);
  });

  test('does not increment when winner is null (draw)', () => {
    const s = createScore();
    const next = incrementScore(s, null);
    expect(next['🐱']).toBe(0);
    expect(next['🐶']).toBe(0);
  });

  test('accumulates multiple wins correctly', () => {
    let s = createScore();
    s = incrementScore(s, '🐱');
    s = incrementScore(s, '🐱');
    s = incrementScore(s, '🐶');
    expect(s['🐱']).toBe(2);
    expect(s['🐶']).toBe(1);
  });
});