# Puck

A water logger. React, Vite, Base UI, StyleX, Bun.

```sh
bun install
bun add @stylexjs/stylex && bun add -d @stylexjs/unplugin   # first run only
bun run dev
bun run build     # not `bun build`, which is Bun's own bundler
bun test tests/   # reducer tests
```

One tap logs the preselected amount. The minus and plus buttons step through
4, 8, 12, 16 and 24 fl oz; Undo removes the last entry. The bottle starts full at 64 fl oz
and drains as you log drinks; the counter shows what is left. State is a pure reducer in `src/state/logger.ts`, saved to
`localStorage` for the day.

## micro:bit

Flash `microbit/main.py` (MakeCode/Python editor, over USB) to the receiver micro:bit. It
listens for the radio message `pressed` on channel 16 (sent by a second micro:bit watching pin 2)
and prints "You just drank N ounces of water!" each time the button is released (`pressed` to
`not pressed`). In Chrome or Edge, click "Connect micro:bit" and pick the receiver; each release
adds the preselected amount to the bottle and total. The app reads the micro:bit's serial output
over WebUSB (via `dapjs`), which needs HTTPS or `localhost`. Close any other tab or tool using
the micro:bit (MakeCode, Mu), since only one can hold the USB device.
