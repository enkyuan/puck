// microbit/main.py (the receiver) prints "You just drank N ounces of water!" each time the button is
// released, after a clear-screen escape, so the line may not start with the text. Returns N, or null
// for any other line (the running-total line, partial or garbled output).
export function drinkOz(line: string): number | null {
  const match = /You just drank (\d+) ounces/.exec(line)
  return match ? Number(match[1]) : null
}
