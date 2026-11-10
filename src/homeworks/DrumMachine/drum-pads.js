// Pads are looked up by KeyboardEvent.code (the physical key), so Vietnamese
// IME (UniKey) cannot break the triggers.
const PADS = [
  { id: 'crash', label: 'Crash', code: 'KeyW', keyHint: 'W' },
  { id: 'kick', label: 'Kick', code: 'KeyA', keyHint: 'A' },
  { id: 'snare', label: 'Snare', code: 'KeyS', keyHint: 'S' },
  { id: 'hihat', label: 'Hi-hat', code: 'KeyD', keyHint: 'D' },
  { id: 'tom', label: 'Tom', code: 'KeyJ', keyHint: 'J' },
  { id: 'clap', label: 'Clap', code: 'KeyK', keyHint: 'K' },
  { id: 'ride', label: 'Ride', code: 'KeyL', keyHint: 'L' },
];

// Map<KeyboardEvent.code, pad>: the `padMap` argument of useDrumKeyboard.
export const PAD_MAP = new Map(PADS.map((pad) => [pad.code, pad]));
