// The outline comes from a radius profile r(y), and the same profile gives the volume at
// each height, so a fill fraction maps to a water level by volume, not by height.
// Units are viewBox units; the bottle is centred on x = 60.

const CX = 60
const R = 48 // body half-width
const CORNER = 16 // bottom corner radius
const NOTCH = 3 // how far the two notches between the base lobes rise
export const TOP = 12
export const BOTTOM = 204
export const VIEWBOX = `0 0 120 ${BOTTOM + 12}`

// Like Math.max, but with the joint between the two inputs rounded off over a range of k.
const softMax = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.max(a, b) + (h * h * k) / 4
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

// Half-width at height y: a cap nub blended into a dome, the straight body, rounded corners.
function radius(y: number) {
  const nub = 14 + Math.sqrt(16 - Math.max(0, 16 - y) ** 2)
  const dome = R * Math.sqrt(1 - clamp01((70 - y) / 44) ** 2)
  const corner = R - CORNER + Math.sqrt(CORNER ** 2 - Math.max(0, y - (BOTTOM - CORNER)) ** 2)
  return Math.min(softMax(nub, dome, 6), corner)
}

// Bottom edge between the corners: three smooth lobes. Where two lobes cross they meet in a
// tight corner (the soft maximum rounds it by about a unit).
const edge = (x: number) =>
  [-2 * CORNER, 0, 2 * CORNER].reduce(
    (y, c) => softMax(y, BOTTOM - NOTCH * ((x - c) / CORNER) ** 2, 1),
    -Infinity,
  )

const point = (x: number, y: number) => `${x.toFixed(2)} ${y}`
const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)

const ys = range(TOP, BOTTOM, 0.25)
const left = ys.map((y) => point(CX - radius(y), y))
const right = ys.map((y) => point(CX + radius(y), y)).reverse()
const bottom = range(CORNER - R, R - CORNER, 0.5).map((x) => point(CX + x, edge(x)))

export const BODY = `M${[...left, ...bottom, ...right].join('L')}Z`

// Volume of each horizontal slice (circular cross-section), summed from the bottom up.
const SLICES = 240
const dy = (BOTTOM - TOP) / SLICES
const area = Array.from({ length: SLICES }, (_, i) => Math.PI * radius(BOTTOM - (i + 0.5) * dy) ** 2)
const total = area.reduce((a, b) => a + b)

/** y of the water surface when the bottle holds `fraction` (0..1) of its volume. */
export function levelAt(fraction: number) {
  const target = clamp01(fraction) * total
  let filled = 0
  for (let i = 0; i < SLICES; i++) {
    if (filled + area[i] >= target) return BOTTOM - (i + (target - filled) / area[i]) * dy
    filled += area[i]
  }
  return TOP
}
