export const AMOUNTS = [4, 8, 12, 16, 24] as const // fl oz
export const GOAL_OZ = 64

type Amount = (typeof AMOUNTS)[number]

export type State = {
  amount: Amount // the preselected amount for the next add
  entries: number[] // fl oz per add, oldest first
}

export type Action = { type: 'step'; direction: 1 | -1 } | { type: 'add' } | { type: 'undo' }

export const initialState: State = { amount: 8, entries: [] }

export const totalOz = (entries: readonly number[]) => entries.reduce((sum, oz) => sum + oz, 0)

// The bottle starts full and drains toward the goal.
export const remainingOz = (total: number) => Math.max(0, GOAL_OZ - total)
export const fillFraction = (total: number) => remainingOz(total) / GOAL_OZ

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'step': {
      const next = AMOUNTS[AMOUNTS.indexOf(state.amount) + action.direction]
      return next === undefined ? state : { ...state, amount: next }
    }
    case 'add':
      return { ...state, entries: [...state.entries, state.amount] }
    case 'undo':
      return { ...state, entries: state.entries.slice(0, -1) }
  }
}

// Persistence: entries reset each day; the chosen amount carries over.
const KEY = 'puck:v4' // v3 stored millilitres
const today = () => new Date().toDateString()

export function loadState(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    const entries: unknown[] = saved.day === today() && Array.isArray(saved.entries) ? saved.entries : []
    return {
      amount: AMOUNTS.find((a) => a === saved.amount) ?? initialState.amount,
      entries: entries.filter((e) => typeof e === 'number'),
    }
  } catch {
    return initialState
  }
}

export function saveState({ amount, entries }: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ day: today(), amount, entries }))
  } catch {
    // Storage can be unavailable or full; the app still works without it.
  }
}
