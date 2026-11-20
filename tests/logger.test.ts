import { describe, expect, test } from 'bun:test'
import { BOTTOM, TOP, levelAt } from '../src/components/bottles'
import { pressDetector } from '../src/state/press'
import { AMOUNTS, fillFraction, initialState, reducer, totalOz, type Action } from '../src/state/logger'

const run = (...actions: Action[]) => actions.reduce(reducer, initialState)
const add: Action = { type: 'add' }
const up: Action = { type: 'step', direction: 1 }
const down: Action = { type: 'step', direction: -1 }

describe('logging', () => {
  test('add logs the preselected amount, and the amount carries over', () => {
    expect(run(add).entries).toEqual([8])
    expect(run(up, add, add).entries).toEqual([12, 12])
    expect(totalOz(run(up, add, add).entries)).toBe(24)
  })

  test('step moves through the presets and stops at both ends', () => {
    expect(run(up).amount).toBe(12)
    expect(run(down).amount).toBe(4)
    expect(run(up, up, up, up, up).amount).toBe(AMOUNTS[AMOUNTS.length - 1])
    expect(run(down, down, down).amount).toBe(AMOUNTS[0])
  })

  test('undo removes only the latest entry, and is harmless when empty', () => {
    expect(run(add, up, add, { type: 'undo' }).entries).toEqual([8])
    expect(run({ type: 'undo' }).entries).toEqual([])
  })

  test('fillFraction is clamped to the bottle', () => {
    expect(fillFraction(0)).toBe(0)
    expect(fillFraction(32)).toBe(0.5)
    expect(fillFraction(100)).toBe(1)
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
  const presses = (lines: string[]) => {
    const isPress = pressDetector()
    return lines.filter(isPress).length
  }

  test('logs once per press, not once per reading while held', () => {
    expect(presses(['1', '1', '0', '0', '0', '1', '1', '0', '1'])).toBe(2)
  })

  test('ignores a contact already closed at connect, and garbled lines', () => {
    expect(presses(['0', '0', '1', '0'])).toBe(1)
    expect(presses(['1', '', 'x1', '0', '\r0\r', '0'])).toBe(1)
  })

  test('accepts the radio messages from a receiver micro:bit', () => {
    expect(presses(['not pressed', 'pressed', 'pressed', 'not pressed', 'pressed'])).toBe(2)
  })
})
