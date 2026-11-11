import { useId } from 'react';
import styles from './KraftonPubgVnArena.module.css';
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
    <article className={styles.card} aria-labelledby={headingId}>
      <h3 id={headingId}>{drop.title}</h3>
      <dl className={styles.facts}>
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
      <output className={styles.phase}>{PHASE_LABEL[phase]}</output>
      {/* aria-disabled, not disabled: a focused button that becomes
          disabled drops focus to <body>. Clicks are ignored unless the
          drop is live; the in-flight lock lives in the parent. */}
      <button
        type='button'
        className={styles.claim}
        aria-disabled={isClaiming || phase !== 'AIRDROP_LIVE'}
        onClick={() => phase === 'AIRDROP_LIVE' && onClaim(drop)}
      >
        {isClaiming ? 'Claiming...' : 'Claim crate'}
      </button>
    </article>
  );
}
