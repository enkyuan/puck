import { useId } from 'react'
import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens.stylex'
import { BODY, BOTTOM, TOP, VIEWBOX, levelAt } from './bottles'

const s = stylex.create({
  svg: { display: 'block', height: 'min(52dvh, 26rem)', width: 'auto' },
  empty: { fill: colors.line },
  water: {
    fill: colors.accent,
    // A transition (not a keyframe) so a second tap retargets the level mid-flight.
    transitionProperty: 'transform',
    transitionDuration: { default: '500ms', '@media (prefers-reduced-motion: reduce)': '0ms' },
    transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  level: (offset: number) => ({ transform: `translateY(${offset}px)` }),
})

export function Bottle({ fraction }: { fraction: number }) {
  const clip = useId().replace(/:/g, '')

  return (
    <svg viewBox={VIEWBOX} aria-hidden="true" {...stylex.props(s.svg)}>
      <clipPath id={clip}>
        <path d={BODY} />
      </clipPath>
      <path d={BODY} {...stylex.props(s.empty)} />
      <g clipPath={`url(#${clip})`}>
        <rect
          y={TOP}
          width="120"
          height={BOTTOM - TOP + 4}
          {...stylex.props(s.water, s.level(levelAt(fraction) - TOP))}
        />
      </g>
    </svg>
  )
}
