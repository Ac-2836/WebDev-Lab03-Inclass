// Resolves after `ms`; rejects (and clears its timer) as soon as the signal
// aborts, so no scheduled playback outlives a Stop.
export function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      window.clearTimeout(timerId);
      reject(signal.reason);
    };
    const timerId = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, Math.max(0, ms));
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

// Plays the FIFO sequence at `speed` (0.5, 1 or 2). Each start time is taken
// from the first note's clock, so timer drift does not pile up. Notes still
// sounding when the replay is aborted are released before it rejects.
export async function replaySequence(
  sequence,
  { speed = 1, noteOn, noteOff, signal },
) {
  const startedAt = performance.now();
  const sounding = new Set();
  const releases = [];
  let offsetMs = 0;
  try {
    for (const { midi, freqHz, durationMs, deltaMs } of sequence) {
      offsetMs += deltaMs / speed;
      await wait(offsetMs - (performance.now() - startedAt), signal);
      noteOn(midi, freqHz);
      sounding.add(midi);
      const release = wait(durationMs / speed, signal).then(() => {
        sounding.delete(midi);
        noteOff(midi);
      });
      release.catch(() => {}); // an abort is handled by `finally` below
      releases.push(release);
    }
    await Promise.all(releases);
  } finally {
    sounding.forEach((midi) => noteOff(midi));
  }
}
