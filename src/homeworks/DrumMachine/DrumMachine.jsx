import { useEffect, useId, useRef, useState } from 'react';
import { createDrumAudio, MIN_DB } from './drum-audio.js';
import { PAD_MAP } from './drum-pads.js';
import { useDrumKeyboard } from './useDrumKeyboard.js';

const PADS = [...PAD_MAP.values()];
const PAD_BY_ID = new Map(PADS.map((pad) => [pad.id, pad]));
const FLASH_MS = 150;
const MAX_HITS = 6;
const METER_DECAY_DB = 1.2; // meter falls this many dB per frame

export function DrumMachine() {
  const [activeIds, setActiveIds] = useState(() => new Set());
  const [hits, setHits] = useState([]);
  const [audio] = useState(createDrumAudio);
  const timersRef = useRef(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      audio.close();
    };
  }, [audio]);

  // A pad stays "pressed" for FLASH_MS after each hit (chords can overlap).
  const triggerPad = (padId) => {
    audio.play(padId);
    setHits((prev) => {
      const hit = {
        id: crypto.randomUUID(),
        n: (prev[0]?.n ?? 0) + 1,
        pad: PAD_BY_ID.get(padId),
      };
      return [hit, ...prev].slice(0, MAX_HITS);
    });
    window.clearTimeout(timersRef.current.get(padId));
    setActiveIds((prev) => new Set(prev).add(padId));
    timersRef.current.set(
      padId,
      window.setTimeout(() => {
        setActiveIds((prev) => {
          const next = new Set(prev);
          next.delete(padId);
          return next;
        });
      }, FLASH_MS),
    );
  };

  useDrumKeyboard(PAD_MAP, triggerPad);

  return (
    <section aria-labelledby='drum-heading'>
      <h2 id='drum-heading'>Production Studio Drum Kit</h2>
      <ul aria-label='Drum pads'>
        {PADS.map((pad) => (
          <li key={pad.id}>
            <DrumPad
              pad={pad}
              isActive={activeIds.has(pad.id)}
              onTrigger={triggerPad}
            />
          </li>
        ))}
      </ul>
      <LevelMeter audio={audio} />
      <HitLog hits={hits} />
    </section>
  );
}

function HitLog({ hits }) {
  return (
    <section aria-labelledby='hit-log-heading'>
      <h3 id='hit-log-heading'>Hit log</h3>
      <output aria-live='polite' aria-atomic='false'>
        {hits.length === 0 ? 'No hits yet.' : null}
        {hits.map((hit) => (
          <span key={hit.id}>
            #{hit.n} {hit.pad.label} ({hit.pad.keyHint}){' '}
          </span>
        ))}
      </output>
    </section>
  );
}

// The meter value is written straight to the element each frame: a React
// state update at 60 fps would re-render the whole kit for no benefit.
function LevelMeter({ audio }) {
  const meterId = useId();
  const meterRef = useRef(null);

  useEffect(() => {
    let frameId = 0;
    let shown = MIN_DB;
    const tick = () => {
      shown = Math.max(audio.getLevelDb(), shown - METER_DECAY_DB);
      meterRef.current.value = shown;
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [audio]);

  return (
    <p>
      <label htmlFor={meterId}>Output level (dBFS)</label>{' '}
      <meter
        id={meterId}
        ref={meterRef}
        min={MIN_DB}
        max={0}
        low={-18}
        high={-6}
        optimum={MIN_DB}
        value={MIN_DB}
      />
    </p>
  );
}

function DrumPad({ pad, isActive, onTrigger }) {
  const handlePointerDown = (e) => {
    if (e.button === 0) onTrigger(pad.id);
  };

  // Enter / Space on a focused pad (native button click is not used, so a
  // pointer hit is never counted twice).
  const handleKeyDown = (e) => {
    if (e.repeat) return;
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      onTrigger(pad.id);
    }
  };

  return (
    <button
      type='button'
      aria-pressed={isActive}
      aria-keyshortcuts={pad.keyHint}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    >
      <kbd>{pad.keyHint}</kbd> {pad.label}
    </button>
  );
}
