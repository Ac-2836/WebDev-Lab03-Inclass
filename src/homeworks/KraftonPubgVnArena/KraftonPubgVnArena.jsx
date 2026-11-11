import { useState } from 'react';
import { createArenaDrops, SQUAD_STANDINGS } from './arena-data.js';
import { formatCountdown } from './format.js';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';

export function KraftonPubgVnArena() {
  const [drops] = useState(() => createArenaDrops());
  const { remainingMs, isLive } = usePubgAirdropTimer(drops[0].dropEpochMs);

  return (
    <section aria-labelledby='arena-heading'>
      <h2 id='arena-heading'>KRAFTON x PUBG Vietnam Arena</h2>
      <p>
        {drops.length} crate drops, {SQUAD_STANDINGS.length} squads.
      </p>
      <p>
        {drops[0].title}:{' '}
        {isLive ? 'airdrop live' : (
          <time>{formatCountdown(remainingMs)}</time>
        )}
      </p>
    </section>
  );
}
