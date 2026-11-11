import { useState } from 'react';
import { createArenaDrops } from './arena-data.js';
import { CrateDropCard } from './CrateDropCard.jsx';

export function KraftonPubgVnArena() {
  const [drops] = useState(() => createArenaDrops());

  return (
    <section aria-labelledby='arena-heading'>
      <h2 id='arena-heading'>KRAFTON x PUBG Vietnam Arena</h2>
      <ul aria-label='Crate drops'>
        {drops.map((drop) => (
          <li key={drop.id}>
            <CrateDropCard drop={drop} stock={drop.remainingStock} />
          </li>
        ))}
      </ul>
    </section>
  );
}
