// A 409 carries the stock the server has now, like a conflict response body.
export class ClaimError extends Error {
  constructor(status, message, remainingStock = null) {
    super(message);
    this.name = 'ClaimError';
    this.status = status;
    this.remainingStock = remainingStock;
  }
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      window.clearTimeout(timerId);
      reject(signal.reason);
    };
    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Local stand-in for the PVS store backend. The decision (stock check,
 * decrement) runs in one synchronous step after the network delay, so two
 * claims for the last crate can never both succeed.
 *
 * - 409 'Looted Out' when the stock is gone, or when another squad "looted"
 *   the crate first (`lootedOutRate`, so rollback is easy to observe).
 * - A repeated `claimId` replays the first answer (idempotent).
 * - Aborting during the delay leaves the stock untouched.
 *
 * @param {{
 *   stockById: Record<string, number>,
 *   latencyMs?: [number, number],
 *   lootedOutRate?: number,
 *   random?: () => number,
 * }} options
 */
export function createClaimServer({
  stockById,
  latencyMs = [250, 650],
  lootedOutRate = 0.25,
  random = Math.random,
}) {
  const stock = new Map(Object.entries(stockById));
  const answers = new Map(); // claimId -> { remainingStock } | { error }

  const decide = (dropId) => {
    if (!stock.has(dropId)) {
      return { error: new ClaimError(404, 'Unknown drop') };
    }
    if (stock.get(dropId) <= 0 || random() < lootedOutRate) {
      stock.set(dropId, 0);
      return { error: new ClaimError(409, 'Looted Out', 0) };
    }
    stock.set(dropId, stock.get(dropId) - 1);
    return { remainingStock: stock.get(dropId) };
  };

  return {
    async claim(dropId, { claimId, signal } = {}) {
      if (!claimId) throw new TypeError('claimId is required');
      const [min, max] = latencyMs;
      await delay(min + random() * (max - min), signal);
      if (!answers.has(claimId)) answers.set(claimId, decide(dropId));
      const answer = answers.get(claimId);
      if (answer.error) throw answer.error;
      return { dropId, claimId, remainingStock: answer.remainingStock };
    },
    getStock: (dropId) => stock.get(dropId),
  };
}
