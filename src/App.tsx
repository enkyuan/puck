import { useEffect, useReducer } from 'react'
import * as stylex from '@stylexjs/stylex'
import { Button } from '@base-ui/react/button'
import { Progress } from '@base-ui/react/progress'
import { Minus, Plus } from 'blode-icons-react'
import { Bottle } from './components/Bottle'
import { useMicrobit } from './state/microbit'
import { CAPACITIES, fillFraction, loadState, remainingOz, reducer, saveState, totalOz } from './state/logger'
import { colors, fonts, shadows } from './tokens.stylex'

const number = new Intl.NumberFormat()

const s = stylex.create({
  page: {
    minHeight: '100dvh',
    boxSizing: 'border-box',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    color: colors.ink,
    fontFamily: fonts.sans,
  },
  column: { width: '100%', maxWidth: '22rem', display: 'flex', flexDirection: 'column', gap: '16px' },
  bottle: { display: 'flex', justifyContent: 'center' },
  readout: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '44px', margin: 0 },
  // Tabular digits on the number spans only: in this font tnum also widens spaces.
  num: { fontVariantNumeric: 'tabular-nums' },
  mono: { fontFamily: fonts.mono },
  total: { fontSize: '2.5rem', lineHeight: 1 },
  goal: { color: colors.muted },
  // 14px buttons in 6px padding give the toolbar a concentric 20px radius.
  toolbar: {
    display: 'flex',
    gap: '4px',
    padding: '6px',
    borderRadius: '20px',
    backgroundColor: colors.surface,
    boxShadow: shadows.ring,
  },
  // Shared by every button: 44px hit area, press feedback, focus ring.
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    height: '44px',
    borderWidth: 0,
    borderRadius: '14px',
    color: colors.ink,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    scale: { default: 'none', ':active': 0.96 },
    transitionProperty: 'scale, background-color',
    transitionDuration: { default: '150ms', '@media (prefers-reduced-motion: reduce)': '0ms' },
    transitionTimingFunction: 'ease-out',
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.focus}` },
  },
  step: {
    width: '44px',
    backgroundColor: { default: 'transparent', ':hover': colors.accentSoft },
    opacity: { default: 1, ':disabled': 0.35 },
  },
  capacity: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '1.05rem',
    fontWeight: 600,
  },
  link: { fontSize: '0.95rem', paddingInline: '8px', textDecorationLine: 'underline' },
  status: { alignSelf: 'center', fontSize: '0.95rem', color: colors.muted },
})

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const total = totalOz(state.entries)
  const left = remainingOz(total, state.capacity)

  const microbit = useMicrobit((oz) => dispatch({ type: 'add', oz }))

  useEffect(() => saveState(state), [state])

  return (
    <main aria-label="Puck" {...stylex.props(s.page)}>
      <div {...stylex.props(s.column)}>
        <Progress.Root
          aria-label="Water drank today"
          value={Math.min(total, state.capacity)}
          max={state.capacity}
          {...stylex.props(s.bottle)}
        >
          <Bottle fraction={fillFraction(total, state.capacity)} />
        </Progress.Root>

        <p {...stylex.props(s.readout)}>
          <span aria-live="polite">
            <span {...stylex.props(s.num, s.mono, s.total)}>{number.format(total)}</span>{' '}
            <span {...stylex.props(s.goal)}>
              {left === 0 ? (
                'fl oz drank, goal reached'
              ) : (
                <>
                  of <span {...stylex.props(s.num)}>{number.format(state.capacity)}</span> fl oz drank
                </>
              )}
            </span>
          </span>
          {total > 0 && (
            <Button onClick={() => dispatch({ type: 'undo' })} {...stylex.props(s.button, s.link)}>
              Undo
            </Button>
          )}
        </p>

        <div {...stylex.props(s.toolbar)}>
          <Button
            aria-label="Smaller bottle"
            disabled={state.capacity === CAPACITIES[0]}
            onClick={() => dispatch({ type: 'step', direction: -1 })}
            {...stylex.props(s.button, s.step)}
          >
            <Minus size={20} strokeWidth={2} />
          </Button>
          <span {...stylex.props(s.capacity)}>
            Bottle <span {...stylex.props(s.num, s.mono)}>{state.capacity}</span> fl oz
          </span>
          <Button
            aria-label="Larger bottle"
            disabled={state.capacity === CAPACITIES[CAPACITIES.length - 1]}
            onClick={() => dispatch({ type: 'step', direction: 1 })}
            {...stylex.props(s.button, s.step)}
          >
            <Plus size={20} strokeWidth={2} />
          </Button>
        </div>

        {microbit.supported &&
          (microbit.connected ? (
            <span role="status" {...stylex.props(s.status)}>micro:bit connected</span>
          ) : (
            <Button onClick={microbit.connect} {...stylex.props(s.button, s.link)}>
              Connect micro:bit
            </Button>
          ))}
      </div>
    </main>
  )
}
