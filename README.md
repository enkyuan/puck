# Puck

A water logger. React, Vite, Base UI, StyleX, Bun.

```sh
bun install
bun add @stylexjs/stylex && bun add -d @stylexjs/unplugin   # first run only
bun run dev
bun run build     # not `bun build`, which is Bun's own bundler
bun test tests/   # reducer tests
```

The minus and plus buttons step the bottle size through 16, 24, 32, 48, 64 and 96 fl oz
(64 by default). The bottle starts full and drains as drinks are logged; the counter counts up the fl oz drank, and Undo removes the last drink. Each drink's size comes from the micro:bit. State is a
pure reducer in `src/state/logger.ts`, saved to `localStorage` for the day.

## micro:bit

Flash `microbit/main.py` (MakeCode/Python editor, over USB) to the receiver micro:bit. It
listens for the radio message `pressed` on channel 16 (sent by a second micro:bit watching pin 2)
and prints "You just drank N ounces of water!" each time the button is released (`pressed` to
`not pressed`). In Chrome or Edge, click "Connect micro:bit" and pick the receiver; each release
logs the ounces the micro:bit reports. The app reads the micro:bit's serial output
over WebUSB (via `dapjs`), which needs HTTPS or `localhost`. Close any other tab or tool using
the micro:bit (MakeCode, Mu), since only one can hold the USB device.
