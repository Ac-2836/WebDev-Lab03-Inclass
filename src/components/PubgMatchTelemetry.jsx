import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../api/pubg-telemetry.js';
import styles from './PubgMatchTelemetry.module.css';

const SQUAD_OPTIONS = [
  { id: 'ces', label: 'Cerberus Esports (CES)' },
  { id: 'te', label: 'The Expendables (TE)' },
  { id: 'ge', label: 'Genius Esports (GE)' },
];

export function PubgMatchTelemetry({ defaultSquadId = 'te' }) {
  const [squadId, setSquadId] = useState(defaultSquadId);
  const [view, setView] = useState({ status: 'IDLE', data: null, error: null });
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });
    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => setView({ status: 'SUCCESS', data, error: null }))
      .catch((err) => {
        // An intentional abort (squad switch / unmount) is not an error.
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });
    return () => controller.abort();
  }, [squadId, retryTick]);

  return (
    <section className={styles.radar} aria-label='PUBG VN Live Telemetry'>
      <nav className={styles.squads} aria-label='Squad selector'>
        {SQUAD_OPTIONS.map((squad) => (
          <button
            key={squad.id}
            type='button'
            aria-pressed={squad.id === squadId}
            onClick={() => setSquadId(squad.id)}
          >
            {squad.label}
          </button>
        ))}
      </nav>
      <TelemetryView
        view={view}
        onRetry={() => setRetryTick((tick) => tick + 1)}
      />
    </section>
  );
}

function TelemetryView({ view, onRetry }) {
  if (view.status === 'IDLE' || view.status === 'LOADING') {
    return (
      <section
        className={`${styles.panel} ${styles.skeleton}`}
        aria-busy='true'
      >
        Syncing KRAFTON Radar...
      </section>
    );
  }
  if (view.status === 'ERROR') {
    return (
      <section className={`${styles.panel} ${styles.alert}`} role='alert'>
        <p>Blue-Zone Link Lost: {view.error}</p>
        <button type='button' className={styles.retry} onClick={onRetry}>
          Reconnect Satellite (Retry)
        </button>
      </section>
    );
  }
  const squad = view.data;
  return (
    <article className={styles.panel} aria-live='polite'>
      <h3>{squad.name}</h3>
      <dl className={styles.stats}>
        <dt>Map</dt>
        <dd>{squad.map}</dd>
        <dt>Phase</dt>
        <dd>{squad.phase}</dd>
        <dt>Alive</dt>
        <dd>{squad.alive}</dd>
        <dt>Kills</dt>
        <dd>{squad.kills}</dd>
        <dt>WWCD</dt>
        <dd>{squad.wwcdProb}</dd>
        <dt>Status</dt>
        <dd>{squad.status}</dd>
      </dl>
    </article>
  );
}
