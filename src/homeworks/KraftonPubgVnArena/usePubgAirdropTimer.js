import { useEffect, useState } from 'react';

const TICK_MS = 200;

// Remaining time is always derived from the wall clock, never decremented:
// a throttled background tab that skips ticks still shows the right value.
export const remainingMsAt = (targetEpochMs, serverOffsetMs = 0) =>
  Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs));

// Slide contract: usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0)
// returns { remainingMs, isLive }.
export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  const [remainingMs, setRemainingMs] = useState(() =>
    remainingMsAt(targetEpochMs, serverOffsetMs));

  useEffect(() => {
    // The countdown is shown in whole seconds, so state only changes (and
    // React only renders) when the displayed second does, or at zero.
    const syncClock = () =>
      setRemainingMs((prev) => {
        const next = remainingMsAt(targetEpochMs, serverOffsetMs);
        return Math.ceil(prev / 1000) === Math.ceil(next / 1000) ? prev : next;
      });
    syncClock();
    const timerId = window.setInterval(syncClock, TICK_MS);
    // Resync immediately when a background tab becomes visible again.
    const onWake = () => {
      if (document.visibilityState === 'visible') syncClock();
    };
    document.addEventListener('visibilitychange', onWake);
    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [targetEpochMs, serverOffsetMs]);

  return { remainingMs, isLive: remainingMs === 0 };
}
