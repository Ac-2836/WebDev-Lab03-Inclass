import { useId } from 'react';
import { DROP_WINDOW_MS, getDropPhase, PHASE_LABEL } from './drop-phase.js';
import { formatCountdown, formatVnd } from './format.js';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';

export function CrateDropCard({ drop, stock, isClaiming, onClaim }) {
  const headingId = useId();
  const untilDrop = usePubgAirdropTimer(drop.dropEpochMs);
  const untilExpiry = usePubgAirdropTimer(drop.dropEpochMs + DROP_WINDOW_MS);
  const phase = getDropPhase({
    remainingMs: untilDrop.remainingMs,
    stock,
    isExpired: untilExpiry.isLive,
  });

  return (
    <article aria-labelledby={headingId}>
      <h3 id={headingId}>{drop.title}</h3>
      <dl>
        <dt>Price</dt>
        <dd>{formatVnd(drop.priceVnd)}</dd>
        <dt>Stock</dt>
        <dd>{stock}</dd>
        {phase === 'WARMUP' && (
          <>
            <dt>Drops in</dt>
            <dd><time>{formatCountdown(untilDrop.remainingMs)}</time></dd>
          </>
        )}
        {phase === 'AIRDROP_LIVE' && (
          <>
            <dt>Claim window closes in</dt>
            <dd><time>{formatCountdown(untilExpiry.remainingMs)}</time></dd>
          </>
        )}
      </dl>
      {/* Only the phase label is live: it changes on phase changes, not on
          every countdown tick. */}
      <output>{PHASE_LABEL[phase]}</output>
      {/* aria-disabled (not disabled) while claiming keeps keyboard focus on
          the button; the click handler is guarded by the in-flight lock. */}
      <button
        type='button'
        disabled={phase !== 'AIRDROP_LIVE'}
        aria-disabled={isClaiming}
        onClick={() => onClaim(drop)}
      >
        {isClaiming ? 'Claiming...' : 'Claim crate'}
      </button>
    </article>
  );
}
