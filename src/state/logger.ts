export const CAPACITIES = [16, 24, 32, 48, 64, 96] as const // fl oz, the bottle sizes the buttons step through

type Capacity = (typeof CAPACITIES)[number]

export type State = {
  capacity: Capacity // how much the full bottle holds
  entries: number[] // fl oz per drink, oldest first
}

export type Action = { type: 'step'; direction: 1 | -1 } | { type: 'add'; oz: number } | { type: 'undo' }

export const initialState: State = { capacity: 64, entries: [] }

export const totalOz = (entries: readonly number[]) => entries.reduce((sum, oz) => sum + oz, 0)

// The bottle starts full and drains as drinks are logged.
export const remainingOz = (total: number, capacity: number) => Math.max(0, capacity - total)
export const fillFraction = (total: number, capacity: number) => remainingOz(total, capacity) / capacity

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'step': {
      const next = CAPACITIES[CAPACITIES.indexOf(state.capacity) + action.direction]
      return next === undefined ? state : { ...state, capacity: next }
    }
    case 'add':
      return { ...state, entries: [...state.entries, action.oz] }
    case 'undo':
      return { ...state, entries: state.entries.slice(0, -1) }
  }
}

// Persistence: entries reset each day; the chosen capacity carries over.
const KEY = 'puck:v5' // v4 stored a per-drink amount instead of the bottle capacity
const today = () => new Date().toDateString()

export function loadState(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    const entries: unknown[] = saved.day === today() && Array.isArray(saved.entries) ? saved.entries : []
    return {
      capacity: CAPACITIES.find((c) => c === saved.capacity) ?? initialState.capacity,
      entries: entries.filter((e) => typeof e === 'number'),
    }
  } catch {
    return initialState
  }
}

export function saveState({ capacity, entries }: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ day: today(), capacity, entries }))
  } catch {
    // Storage can be unavailable or full; the app still works without it.
  }
}
