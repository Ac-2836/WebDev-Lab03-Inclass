import { useEffect, useRef, useState } from 'react';
import { PAD_MAP } from './drum-pads.js';
import { useDrumKeyboard } from './useDrumKeyboard.js';

const PADS = [...PAD_MAP.values()];
const FLASH_MS = 150;

export function DrumMachine() {
  const [activeIds, setActiveIds] = useState(() => new Set());
  const timersRef = useRef(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timerId) => window.clearTimeout(timerId));
  }, []);

  // A pad stays "pressed" for FLASH_MS after each hit (chords can overlap).
  const triggerPad = (padId) => {
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
    </section>
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
