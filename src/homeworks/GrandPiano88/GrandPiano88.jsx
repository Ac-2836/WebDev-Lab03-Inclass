import { useCallback, useEffect, useRef, useState } from 'react';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { midiToFrequency, PIANO_KEYS } from './piano-keys.js';
import {
  finishRecording,
  recordNoteOff,
  recordNoteOn,
} from './recorder.js';

export function GrandPiano88() {
  const [synth] = useState(() => new PolyphonicSynth());
  const [pressed, setPressed] = useState(() => new Set());
  const [recording, setRecording] = useState(false);
  const [sequence, setSequence] = useState([]);
  const recordingRef = useRef(false);

  useEffect(() => () => synth.close(), [synth]);

  // Switching window or app while holding keys must not leave notes ringing.
  useEffect(() => {
    const releaseAll = () => {
      const nowMs = performance.now();
      if (recordingRef.current) {
        const held = [...synth.voices.keys()];
        setSequence((prev) =>
          held.reduce((ev, midi) => recordNoteOff(ev, midi, nowMs), prev));
      }
      synth.allNotesOff();
      setPressed((prev) => (prev.size === 0 ? prev : new Set()));
    };
    window.addEventListener('blur', releaseAll);
    return () => window.removeEventListener('blur', releaseAll);
  }, [synth]);

  // Stable callbacks: PianoKey is memoized, so these must not change.
  const handleNoteOn = useCallback(
    (midi) => {
      if (synth.voices.has(midi)) return; // already sounding: not a new note
      const freqHz = midiToFrequency(midi);
      const nowMs = performance.now();
      synth.noteOn(midi, freqHz);
      if (recordingRef.current) {
        setSequence((prev) => recordNoteOn(prev, midi, freqHz, nowMs));
      }
      setPressed((prev) => (prev.has(midi) ? prev : new Set(prev).add(midi)));
    },
    [synth],
  );

  const handleNoteOff = useCallback(
    (midi) => {
      const nowMs = performance.now();
      synth.noteOff(midi);
      if (recordingRef.current) {
        setSequence((prev) => recordNoteOff(prev, midi, nowMs));
      }
      setPressed((prev) => {
        if (!prev.has(midi)) return prev;
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    },
    [synth],
  );

  const startRecording = () => {
    recordingRef.current = true;
    setRecording(true);
    setSequence([]);
  };

  const stopRecording = () => {
    const nowMs = performance.now();
    recordingRef.current = false;
    setRecording(false);
    setSequence((prev) => finishRecording(prev, nowMs));
  };

  return (
    <section aria-labelledby='piano-heading'>
      <h2 id='piano-heading'>88-Key Polyphonic Piano</h2>
      <section aria-labelledby='sequencer-heading'>
        <h3 id='sequencer-heading'>Sequencer</h3>
        <button
          type='button'
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? 'Stop recording' : 'Start recording'}
        </button>
        <output aria-live='polite'>
          {recording ? 'Recording: ' : 'Recorded: '}
          {sequence.length} {sequence.length === 1 ? 'note' : 'notes'}
        </output>
      </section>
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
