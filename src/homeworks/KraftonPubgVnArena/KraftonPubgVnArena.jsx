import { useState } from 'react';
import { createArenaDrops, SQUAD_STANDINGS } from './arena-data.js';

export function KraftonPubgVnArena() {
  const [drops] = useState(() => createArenaDrops());

  return (
    <section aria-labelledby='arena-heading'>
      <h2 id='arena-heading'>KRAFTON x PUBG Vietnam Arena</h2>
      <p>
        {drops.length} crate drops, {SQUAD_STANDINGS.length} squads.
      </p>
    </section>
  );
}
