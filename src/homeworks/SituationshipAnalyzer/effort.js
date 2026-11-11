/**
 * Slide contract.
 * @typedef {Readonly<{
 *   id: string,
 *   actor: 'EM' | 'AI_DO',
 *   steps: number,
 *   multiplier: number,
 * }>} EffortSignal
 */

export const ACTOR_LABEL = { EM: 'Em', AI_DO: 'Ai đó' };

/** @param {EffortSignal} signal impact = how much it counts: steps x weight */
export const impactOf = (signal) => signal.steps * signal.multiplier;

// Trust boundary: the form hands over raw numbers, so reject bad ones here.
export function createSignal({ actor, steps, multiplier }) {
  if (!(actor in ACTOR_LABEL)) throw new RangeError('Unknown actor');
  if (!Number.isInteger(steps) || steps < 1) {
    throw new RangeError('Steps must be a whole number of at least 1');
  }
  if (!Number.isFinite(multiplier) || multiplier < 0) {
    throw new RangeError('Weight must be a number of at least 0');
  }
  return Object.freeze({
    id: crypto.randomUUID(),
    actor,
    steps,
    multiplier,
  });
}

// The log is append-only: a new array, the old one is never touched.
export const appendSignal = (signals, signal) => [...signals, signal];
