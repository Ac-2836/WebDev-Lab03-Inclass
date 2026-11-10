import { memo } from 'react';

// Slide contract. Re-renders only when its own props change; the parent
// passes referentially stable onNoteOn / onNoteOff.
export const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  isBlack,
  isPressed,
  onNoteOn,
  onNoteOff,
}) {
  return (
    <button
      type='button'
      className={`key ${isBlack ? 'key--black' : 'key--white'}`}
      aria-pressed={isPressed}
      onPointerDown={() => onNoteOn(midi)}
      onPointerUp={() => onNoteOff(midi)}
    >
      <span>{noteName}</span>
    </button>
  );
});
