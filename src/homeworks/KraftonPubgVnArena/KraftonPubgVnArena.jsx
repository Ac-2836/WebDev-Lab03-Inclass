import { useEffect, useRef, useState } from 'react';
import { createArenaDrops, SQUAD_STANDINGS } from './arena-data.js';
import { createClaimServer } from './claim-server.js';
import { CrateDropCard } from './CrateDropCard.jsx';
import { generateKillFeed } from './kill-feed.js';
import { KillFeed } from './KillFeed.jsx';
import { Leaderboard } from './Leaderboard.jsx';
import styles from './KraftonPubgVnArena.module.css';

export function KraftonPubgVnArena() {
  const [drops] = useState(() => createArenaDrops());
  const [stockById, setStockById] = useState(() =>
    Object.fromEntries(drops.map((d) => [d.id, d.remainingStock])));
  const [server] = useState(() => createClaimServer({
    stockById: Object.fromEntries(drops.map((d) => [d.id, d.remainingStock])),
  }));
  const [killEvents] = useState(() =>
    generateKillFeed(5000, SQUAD_STANDINGS.map((s) => s.squadName)));
  const [claimingIds, setClaimingIds] = useState(() => new Set());
  const [notice, setNotice] = useState('');
  const [failure, setFailure] = useState('');
  const inFlightRef = useRef(new Map()); // dropId -> claimId (sync lock)
  const controllersRef = useRef(new Set());

  useEffect(() => {
    const controllers = controllersRef.current;
    return () => controllers.forEach((controller) => controller.abort());
  }, []);

  const setStock = (dropId, update) =>
    setStockById((prev) => ({ ...prev, [dropId]: update(prev[dropId]) }));

  const claimDrop = async (drop) => {
    // The ref is read synchronously, so a double click before the next
    // render still cannot start a second claim.
    if (inFlightRef.current.has(drop.id)) return;
    const claimId = crypto.randomUUID();
    const controller = new AbortController();
    inFlightRef.current.set(drop.id, claimId);
    controllersRef.current.add(controller);
    setClaimingIds((prev) => new Set(prev).add(drop.id));
    setFailure('');
    setNotice(`Claiming ${drop.title}...`);
    setStock(drop.id, (stock) => stock - 1); // optimistic deduction
    try {
      const result = await server.claim(drop.id, {
        claimId,
        signal: controller.signal,
      });
      setStock(drop.id, () => result.remainingStock);
      setNotice(`Claimed ${drop.title}. ${result.remainingStock} left.`);
    } catch (error) {
      if (error.name === 'AbortError') return; // unmounted mid-claim
      // Roll back: the optimistic guess is replaced by the server's stock
      // (409) or restored (any other failure).
      setStock(drop.id, (stock) => error.remainingStock ?? stock + 1);
      setNotice('');
      setFailure(
        `Could not claim ${drop.title}: ${error.message}. `
        + 'Your claim was rolled back.',
      );
    } finally {
      inFlightRef.current.delete(drop.id);
      controllersRef.current.delete(controller);
      setClaimingIds((prev) => {
        const next = new Set(prev);
        next.delete(drop.id);
        return next;
      });
    }
  };

  return (
    <section className={styles.arena} aria-labelledby='arena-heading'>
      <h2 id='arena-heading'>KRAFTON x PUBG Vietnam Arena</h2>
      <output className={styles.notice}>{notice}</output>
      {failure && (
        <p className={styles.failure} role='alert'>{failure}</p>
      )}
      <ul className={styles.drops} aria-label='Crate drops'>
        {drops.map((drop) => (
          <li key={drop.id}>
            <CrateDropCard
              drop={drop}
              stock={stockById[drop.id]}
              isClaiming={claimingIds.has(drop.id)}
              onClaim={claimDrop}
            />
          </li>
        ))}
      </ul>
      <Leaderboard standings={SQUAD_STANDINGS} />
      <KillFeed events={killEvents} />
    </section>
  );
}
