// microbit/main.py prints 0 (pin 2 pulled low: pressed) or 1 about every 100 ms over USB serial.
// A press is the 1 -> 0 edge, so holding the contact logs one drink, not ten a second.
// Lines from a receiver micro:bit echoing the radio messages ('pressed' / 'not pressed') work too.
export function pressDetector() {
  let down = true // so a contact that is already closed when we connect doesn't log
  return (line: string) => {
    const v = line.trim()
    if (!['0', '1', 'pressed', 'not pressed'].includes(v)) return false // partial or garbled line
    const pressed = v === '0' || v === 'pressed'
    const edge = pressed && !down
    down = pressed
    return edge
  }
}
