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
  const release = () => onNoteOff(midi);

  // Enter / Space hold a note on a focused key, like a pointer press.
  const handleKeyDown = (e) => {
    if (e.repeat || (e.code !== 'Enter' && e.code !== 'Space')) return;
    e.preventDefault();
    onNoteOn(midi);
  };

  const handleKeyUp = (e) => {
    if (e.code === 'Enter' || e.code === 'Space') release();
  };

  // Every way a press can end (up, leave, cancel, blur) releases the note,
  // so a note can never get stuck.
  return (
    <button
      type='button'
      className={`key ${isBlack ? 'key--black' : 'key--white'}`}
      aria-pressed={isPressed}
      onPointerDown={(e) => e.button === 0 && onNoteOn(midi)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={release}
    >
      <span>{noteName}</span>
    </button>
  );
});
