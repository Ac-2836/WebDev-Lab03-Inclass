import { useId, useState } from 'react';
import styles from './KraftonPubgVnArena.module.css';
import { rankStandings, SORT_OPTIONS, totalPoints } from './leaderboard.js';

export function Leaderboard({ standings }) {
  const queryId = useId();
  const sortId = useId();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('total');

  // Derived during render: only the two inputs live in state.
  const rows = rankStandings(standings, { query, sortBy });

  return (
    <section
      className={styles.leaderboard}
      aria-labelledby='leaderboard-heading'
    >
      <h3 id='leaderboard-heading'>PVS Leaderboard</h3>
      <form
        className={styles.controls}
        role='search'
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor={queryId}>Squad name</label>
        <input
          id={queryId}
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>
      <output>
        Showing {rows.length} of {standings.length} squads
      </output>
      <section
        className={styles.tableScroll}
        aria-label='Squad standings table, scrolls sideways on small screens'
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption>Squad standings</caption>
          <thead>
            <tr>
              <th scope='col'>Rank</th>
              <th scope='col'>Squad</th>
              <th scope='col'>WWCD</th>
              <th scope='col'>Placement</th>
              <th scope='col'>Kills</th>
              <th scope='col'>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>No squads match.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.squadId}>
                  <td>{row.rank}</td>
                  <th scope='row'>{row.squadName}</th>
                  <td>{row.wwcdCount}</td>
                  <td>{row.placementPts}</td>
                  <td>{row.killPts}</td>
                  <td>{totalPoints(row)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
