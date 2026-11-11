const WEAPONS = ['M416', 'AKM', 'Kar98k', 'SCAR-L', 'AWM', 'Beryl', 'UMP45'];

/**
 * Deterministic fake kill feed (seeded LCG, so the same list every load).
 * @param {number} count
 * @param {string[]} squadNames
 */
export function generateKillFeed(count, squadNames, seed = 20260611) {
  let state = seed;
  const next = (max) => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return Math.floor((state / 4294967296) * max);
  };
  return Array.from({ length: count }, (_, index) => {
    const killer = next(squadNames.length);
    const victim =
      (killer + 1 + next(squadNames.length - 1)) % squadNames.length;
    const seconds = Math.floor(index * 0.35);
    const pad = (n) => String(n).padStart(2, '0');
    return {
      id: `kill-${index + 1}`,
      clock: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
      killer: squadNames[killer],
      victim: squadNames[victim],
      weapon: WEAPONS[next(WEAPONS.length)],
    };
  });
}

/**
 * Pure windowing for a fixed-row-height list: which rows to render for the
 * current scroll position, plus `overscan` extra rows on each side.
 */
export function getVisibleWindow({
  scrollTop,
  viewportHeight,
  rowHeight,
  total,
  overscan = 4,
}) {
  // Both bounds are clamped to the list, so an offset past the end still
  // yields the last rows instead of an empty window.
  const firstVisible = Math.min(
    total,
    Math.floor(Math.max(0, scrollTop) / rowHeight),
  );
  const lastVisible = Math.min(
    total,
    Math.ceil((scrollTop + viewportHeight) / rowHeight),
  );
  const start = Math.max(0, firstVisible - overscan);
  const end = Math.min(total, lastVisible + overscan);
  return { start, end: Math.max(start, end) };
}
