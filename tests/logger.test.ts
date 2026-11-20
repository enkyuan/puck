import { describe, expect, test } from 'bun:test'
import { BOTTOM, TOP, levelAt } from '../src/components/bottles'
import { drinkOz } from '../src/state/press'
import { CAPACITIES, fillFraction, initialState, reducer, totalOz, type Action } from '../src/state/logger'

const run = (...actions: Action[]) => actions.reduce(reducer, initialState)
const add = (oz: number): Action => ({ type: 'add', oz })
const up: Action = { type: 'step', direction: 1 }
const down: Action = { type: 'step', direction: -1 }

describe('logging', () => {
  test('add logs the reported amount', () => {
    expect(run(add(4), add(2)).entries).toEqual([4, 2])
    expect(totalOz(run(add(4), add(2), add(6)).entries)).toBe(12)
  })

  test('step changes the bottle capacity and stops at both ends', () => {
    expect(run(up).capacity).toBe(96)
    expect(run(down).capacity).toBe(48)
    expect(run(up, up, up).capacity).toBe(CAPACITIES[CAPACITIES.length - 1])
    expect(run(down, down, down, down, down, down).capacity).toBe(CAPACITIES[0])
  })

  test('undo removes only the latest entry, and is harmless when empty', () => {
    expect(run(add(4), add(2), { type: 'undo' }).entries).toEqual([4])
    expect(run({ type: 'undo' }).entries).toEqual([])
  })

  test('the bottle starts full and drains to empty at capacity', () => {
    expect(fillFraction(0, 64)).toBe(1)
    expect(fillFraction(32, 64)).toBe(0.5)
    expect(fillFraction(100, 64)).toBe(0)
    expect(fillFraction(16, 32)).toBe(0.5)
  })
})

describe('bottle fill', () => {
  test('empty at the bottom, full at the top', () => {
    expect(levelAt(0)).toBeCloseTo(BOTTOM, 5)
    expect(levelAt(1)).toBeCloseTo(TOP, 5)
  })

  test('level rises monotonically with volume', () => {
    let prev = levelAt(0)
    for (let f = 0.05; f <= 1.0001; f += 0.05) {
      expect(levelAt(f)).toBeLessThanOrEqual(prev)
      prev = levelAt(f)
    }
  })

  test('fill follows volume, not height', () => {
    // The dome and cap hold little water, so the last tenth of the volume climbs
    // much further than the first tenth.
    expect(levelAt(0.9) - levelAt(1)).toBeGreaterThan((levelAt(0) - levelAt(0.1)) * 2)
  })
})

describe('micro:bit', () => {
  test('reads the ounces from a "You just drank" line, even after the clear-screen escape', () => {
    expect(drinkOz('\x1b[H\x1b[2JYou just drank 4 ounces of water!')).toBe(4)
    expect(drinkOz('You just drank 6 ounces of water!\r')).toBe(6)
  })

  test('ignores the running total, partial and garbled lines', () => {
    expect([" You've now drank 6 ounces of water", ' water', '', 'x1', '0'].map(drinkOz)).toEqual([null, null, null, null, null])
  })
})
