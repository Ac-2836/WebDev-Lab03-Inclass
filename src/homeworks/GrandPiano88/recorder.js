// Pure, immutable recorder. Events stay in the order the notes were
// pressed (FIFO), so replay can walk the array front to back.
//   deltaMs    : time since the previous note was pressed (0 for the first)
//   durationMs : how long the note was held

export function recordNoteOn(events, midi, freqHz, nowMs) {
  const previous = events.at(-1);
  const deltaMs = previous ? Math.round(nowMs - previous.startMs) : 0;
  return [
    ...events,
    { midi, freqHz, startMs: nowMs, durationMs: null, deltaMs },
  ];
}

// Closes the most recent still-open note with this midi; ignored otherwise.
export function recordNoteOff(events, midi, nowMs) {
  const index = events.findLastIndex(
    (event) => event.midi === midi && event.durationMs === null,
  );
  if (index === -1) return events;
  return events.map((event, i) =>
    i === index
      ? { ...event, durationMs: Math.round(nowMs - event.startMs) }
      : event);
}

// Final sequence in the slide shape; notes still held end at `nowMs`.
export function finishRecording(events, nowMs) {
  return events.map(({ midi, freqHz, startMs, durationMs, deltaMs }) => ({
    midi,
    freqHz,
    durationMs: durationMs ?? Math.round(nowMs - startMs),
    deltaMs,
  }));
}
