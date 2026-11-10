import { useCallback, useEffect, useState } from 'react';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { midiToFrequency, PIANO_KEYS } from './piano-keys.js';

export function GrandPiano88() {
  const [synth] = useState(() => new PolyphonicSynth());
  const [pressed, setPressed] = useState(() => new Set());

  useEffect(() => () => synth.close(), [synth]);

  // Stable callbacks: PianoKey is memoized, so these must not change.
  const handleNoteOn = useCallback(
    (midi) => {
      synth.noteOn(midi, midiToFrequency(midi));
      setPressed((prev) => (prev.has(midi) ? prev : new Set(prev).add(midi)));
    },
    [synth],
  );

  const handleNoteOff = useCallback(
    (midi) => {
      synth.noteOff(midi);
      setPressed((prev) => {
        if (!prev.has(midi)) return prev;
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    },
    [synth],
  );

  return (
    <section aria-labelledby='piano-heading'>
      <h2 id='piano-heading'>88-Key Polyphonic Piano</h2>
      <ol aria-label='Piano keys, A0 to C8'>
        {PIANO_KEYS.map((key) => (
          <li key={key.midi}>
            <PianoKey
              midi={key.midi}
              noteName={key.noteName}
              isBlack={key.isBlack}
              isPressed={pressed.has(key.midi)}
              onNoteOn={handleNoteOn}
              onNoteOff={handleNoteOff}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
