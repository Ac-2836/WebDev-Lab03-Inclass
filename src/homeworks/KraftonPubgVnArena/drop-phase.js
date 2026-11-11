// How long a live airdrop can be claimed before it expires.
export const DROP_WINDOW_MS = 5 * 60 * 1000;

/**
 * Phase is derived, never stored: the clock and the stock decide it.
 * @param {{ remainingMs: number, stock: number, isExpired: boolean }} input
 * @returns {import('./arena-data.js').DropPhase}
 */
export function getDropPhase({ remainingMs, stock, isExpired }) {
  if (remainingMs > 0) return 'WARMUP';
  if (stock <= 0) return 'LOOTED_OUT';
  if (isExpired) return 'EXPIRED';
  return 'AIRDROP_LIVE';
}

export const PHASE_LABEL = {
  WARMUP: 'Airdrop incoming',
  AIRDROP_LIVE: 'Airdrop live',
  LOOTED_OUT: 'Looted out',
  EXPIRED: 'Airdrop expired',
};
