import { useId, useState } from 'react';
import styles from './ScientistDirectory.module.css';

export const SMART_PEOPLE = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
];

export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const queryId = useId();
  const minIqId = useId();
  const sortId = useId();
  const [people] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  // Derived during render: no extra state, no useEffect, one render pass.
  const needle = query.trim().toLowerCase();
  const visible = people
    .filter((p) => p.name.toLowerCase().includes(needle) && p.iq >= minIq)
    .toSorted((a, b) => (sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age));

  const handleMinIq = (e) => {
    const value = e.target.valueAsNumber;
    setMinIq(Number.isNaN(value) ? 0 : value);
  };

  return (
    <section className={styles.directory} aria-label='Pioneer Directory'>
      <form
        className={styles.controls}
        role='search'
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor={queryId}>Name</label>
        <input
          id={queryId}
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label htmlFor={minIqId}>Min IQ</label>
        <input
          id={minIqId}
          type='number'
          min='0'
          value={minIq}
          onChange={handleMinIq}
        />
        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value='iq-desc'>IQ (high to low)</option>
          <option value='age-asc'>Age (young to old)</option>
        </select>
      </form>
      <ul className={styles.list}>
        {visible.map((p) => (
          <li key={p.id} className={styles.row}>
            <span className={styles.name}>{p.name}</span>
            <span>IQ {p.iq}</span>
            <span>Age {p.age}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
