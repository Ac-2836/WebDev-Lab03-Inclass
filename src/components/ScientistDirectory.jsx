import { useState } from 'react';
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
  const [people] = useState(initialData);

  return (
    <section className={styles.directory} aria-label='Pioneer Directory'>
      <ul className={styles.list}>
        {people.map((p) => (
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
