import * as stylex from '@stylexjs/stylex'

const dark = '@media (prefers-color-scheme: dark)'

// Every colour is OKLCH: L (lightness), C (chroma), H (hue). Names are on the right.
// Neutrals keep their original values (converted from hex); the accent is powder blue.
export const colors = stylex.defineVars({
  bg: {
    default: 'oklch(0.955 0.011 89.723)', // parchment
    [dark]: 'oklch(0.183 0.004 285.994)', // graphite
  },
  surface: {
    default: 'oklch(0.985 0.005 95.098)', // ivory
    [dark]: 'oklch(0.22 0.01 285.577)', // charcoal
  },
  ink: {
    default: 'oklch(0.21 0.008 274.533)', // ink black
    [dark]: 'oklch(0.945 0.007 286.271)', // mist white
  },
  muted: {
    default: 'oklch(0.482 0.018 90.354)', // umber grey
    [dark]: 'oklch(0.716 0.016 285.994)', // cool grey
  },
  // The empty jug. Lightened from the old sand so the blue water stands out against it.
  line: {
    default: 'oklch(0.9 0.016 89.4)', // sand
    [dark]: 'oklch(0.296 0.014 285.485)', // slate
  },
  accent: {
    default: 'oklch(0.79 0.074 240)', // powder blue
    [dark]: 'oklch(0.82 0.062 240)', // pale powder blue
  },
  // Hover goes lighter in both modes, which also raises the label contrast.
  accentHover: {
    default: 'oklch(0.84 0.053 240)', // baby blue
    [dark]: 'oklch(0.88 0.036 240)', // frost blue
  },
  onAccent: {
    default: 'oklch(0.2 0.03 250)', // midnight navy
    [dark]: 'oklch(0.183 0.004 285.994)', // graphite
  },
  accentSoft: {
    default: 'oklch(0.93 0.025 240)', // ice blue
    [dark]: 'oklch(0.34 0.04 245)', // deep steel blue
  },
  // Focus rings need 3:1 against the page, which the pastel accent can't give in light mode.
  focus: {
    default: 'oklch(0.55 0.127 245)', // cerulean
    [dark]: 'oklch(0.82 0.062 240)', // pale powder blue
  },
})

// Depth as layered transparent shadows (ring + lift + ambient) rather than borders.
export const shadows = stylex.defineVars({
  ring: {
    default:
      '0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px -1px oklch(0 0 0 / 0.06), 0 2px 4px 0 oklch(0 0 0 / 0.04)',
    [dark]: '0 0 0 1px oklch(1 0 0 / 0.08)',
  },
})

export const fonts = stylex.defineVars({
  sans: "'Glide', system-ui, sans-serif",
  mono: "'Glide Mono', ui-monospace, monospace",
})
