import { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from './GrandPiano88.module.css';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import { midiToFrequency, PIANO_KEYS } from './piano-keys.js';
import {
  finishRecording,
  recordNoteOff,
  recordNoteOn,
} from './recorder.js';
import { replaySequence } from './replay.js';

const SPEEDS = [0.5, 1, 2];

export function GrandPiano88() {
  const [synth] = useState(() => new PolyphonicSynth());
  const [pressed, setPressed] = useState(() => new Set());
  const [recording, setRecording] = useState(false);
  const [sequence, setSequence] = useState([]);
  // IDLE | PLAYING | STOPPED | FINISHED
  const [replay, setReplay] = useState('IDLE');
  const [speed, setSpeed] = useState(1);
  const recordingRef = useRef(false);
  const replayRef = useRef(null);
  const speedId = useId();

  useEffect(() => {
    return () => {
      replayRef.current?.abort(); // cancel pending playback timers
      synth.close();
    };
  }, [synth]);

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

  const playSequence = async () => {
    const controller = new AbortController();
    replayRef.current = controller;
    setReplay('PLAYING');
    try {
      await replaySequence(sequence, {
        speed,
        noteOn: handleNoteOn,
        noteOff: handleNoteOff,
        signal: controller.signal,
      });
      setReplay('FINISHED');
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    } finally {
      if (replayRef.current === controller) replayRef.current = null;
    }
  };

  const stopSequence = () => {
    replayRef.current?.abort();
    setReplay('STOPPED');
  };

  return (
    <section className={styles.piano} aria-labelledby='piano-heading'>
      <h2 id='piano-heading'>88-Key Polyphonic Piano</h2>
      <section
        className={styles.sequencer}
        aria-labelledby='sequencer-heading'
      >
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
        <label htmlFor={speedId}>Replay speed</label>
        <select
          id={speedId}
          value={speed}
          disabled={replay === 'PLAYING'}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          {SPEEDS.map((value) => (
            <option key={value} value={value}>{value}x</option>
          ))}
        </select>
        <button
          type='button'
          disabled={recording || replay === 'PLAYING' || sequence.length === 0}
          onClick={playSequence}
        >
          Play sequence
        </button>
        <button
          type='button'
          disabled={replay !== 'PLAYING'}
          onClick={stopSequence}
        >
          Stop Sequence
        </button>
        <output aria-live='polite'>Replay: {replay.toLowerCase()}</output>
      </section>
      <section
        className={styles.scroller}
        aria-label='Piano keyboard, scrolls sideways'
        tabIndex={0}
      >
        <ol className={styles.strip} aria-label='Piano keys, A0 to C8'>
          {PIANO_KEYS.map((key) => (
            <li
              key={key.midi}
              className={key.isBlack ? styles.blackSlot : styles.whiteSlot}
            >
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
    </section>
  );
}
