const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];
const BLACK_SEMITONES = new Set([1, 3, 6, 8, 10]);
export const FIRST_MIDI = 21; // A0
export const LAST_MIDI = 108; // C8

export const midiToFrequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

export const midiToNoteName = (midi) =>
  `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;

// 88 keys generated from the MIDI range; nothing is hardcoded per key.
export const PIANO_KEYS = Array.from(
  { length: LAST_MIDI - FIRST_MIDI + 1 },
  (_, index) => {
    const midi = FIRST_MIDI + index;
    return {
      midi,
      noteName: midiToNoteName(midi),
      isBlack: BLACK_SEMITONES.has(midi % 12),
      freqHz: midiToFrequency(midi),
    };
  },
);
