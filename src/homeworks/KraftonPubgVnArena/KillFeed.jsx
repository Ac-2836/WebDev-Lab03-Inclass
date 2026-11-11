import { useState } from 'react';
import { getVisibleWindow } from './kill-feed.js';
import styles from './KraftonPubgVnArena.module.css';

const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 320;

export function KillFeed({ events }) {
  const [scrollTop, setScrollTop] = useState(0);
  const { start, end } = getVisibleWindow({
    scrollTop,
    viewportHeight: VIEWPORT_HEIGHT,
    rowHeight: ROW_HEIGHT,
    total: events.length,
  });

  // Only the rows in the window exist in the DOM. The list is padded with
  // the height of the rows above and below, so the scrollbar is the real
  // size. The sizes are CSS custom properties (the one place that needs a
  // style attribute: they depend on the scroll position).
  const listVars = {
    '--row-height': `${ROW_HEIGHT}px`,
    '--viewport-height': `${VIEWPORT_HEIGHT}px`,
    '--rows-before': `${start * ROW_HEIGHT}px`,
    '--rows-after': `${(events.length - end) * ROW_HEIGHT}px`,
  };

  return (
    <section aria-labelledby='kill-feed-heading'>
      <h3 id='kill-feed-heading'>Kill feed</h3>
      <section
        className={styles.feedScroller}
        style={listVars}
        aria-label={`Kill feed, ${events.length} eliminations, scrolls`}
        tabIndex={0}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <ol className={styles.feedList} start={start + 1}>
          {events.slice(start, end).map((event, offset) => (
            <li
              key={event.id}
              aria-setsize={events.length}
              aria-posinset={start + offset + 1}
            >
              <time>{event.clock}</time> {event.killer} eliminated{' '}
              {event.victim} ({event.weapon})
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
