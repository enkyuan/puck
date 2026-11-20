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
4, 8, 12, 16 and 24 fl oz; Undo removes the last entry. The bottle fills toward a
64 fl oz goal. State is a pure reducer in `src/state/logger.ts`, saved to
`localStorage` for the day.

## micro:bit

Flash `microbit/main.py` (MakeCode/Python editor, over USB). It prints `0` or `1` for
pin 2 every 100 ms, with a pull-up, so closing pin 2 to GND counts as a press. In
Chrome or Edge, click "Connect micro:bit"; each press logs the preselected amount once,
however long the contact is held. The app reads the USB serial output with Web Serial, which needs
HTTPS or `localhost`. The micro:bit also sends the radio messages `pressed` and
`not pressed` on channel 16; a second micro:bit that prints them works the same way.
