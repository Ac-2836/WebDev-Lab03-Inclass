import { useId, useRef, useState } from 'react';
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
  const resetRef = useRef(null);
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  // Derived during render: no extra state, no useEffect, one render pass.
  const needle = query.trim().toLowerCase();
  const minIqValue = minIq === '' ? 0 : minIq;
  const visible = people
    .filter((p) => p.name.toLowerCase().includes(needle) && p.iq >= minIqValue)
    .toSorted((a, b) => (sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age));

  const handleMinIq = (e) => {
    const value = e.target.valueAsNumber;
    // Keep '' so the field can be cleared; an empty field filters as 0.
    setMinIq(Number.isNaN(value) ? '' : value);
  };

  const handleDelete = (e, id) => {
    // Move focus to a surviving row before this button unmounts.
    const row = e.currentTarget.closest('li');
    const sibling = row.nextElementSibling ?? row.previousElementSibling;
    (sibling?.querySelector('button') ?? resetRef.current).focus();
    setPeople((prev) => prev.filter((p) => p.id !== id));
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
      <output className={styles.status} role='status' aria-live='polite'>
        Found {visible.length} pioneers
      </output>
      <ul className={styles.list}>
        {visible.map((p) => (
          <li key={p.id} className={styles.row}>
            <span className={styles.name}>{p.name}</span>
            <span>IQ {p.iq}</span>
            <span>Age {p.age}</span>
            <button
              type='button'
              className={styles.delete}
              aria-label={`Delete ${p.name}`}
              onClick={(e) => handleDelete(e, p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        ref={resetRef}
        type='button'
        className={styles.reset}
        onClick={() => setPeople(initialData)}
      >
        Reset
      </button>
    </section>
  );
}
