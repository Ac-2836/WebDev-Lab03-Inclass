import { PIANO_KEYS } from './piano-keys.js';

const BLACK_COUNT = PIANO_KEYS.filter((key) => key.isBlack).length;
const WHITE_COUNT = PIANO_KEYS.length - BLACK_COUNT;

export function GrandPiano88() {
  return (
    <section aria-labelledby='piano-heading'>
      <h2 id='piano-heading'>88-Key Polyphonic Piano</h2>
      <p>
        {PIANO_KEYS.length} keys: {WHITE_COUNT} white and {BLACK_COUNT} black,
        {' '}{PIANO_KEYS[0].noteName} to {PIANO_KEYS.at(-1).noteName}.
      </p>
    </section>
  );
}
