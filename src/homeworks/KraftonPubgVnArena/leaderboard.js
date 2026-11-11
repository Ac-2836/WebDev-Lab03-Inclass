const SORT_FIELDS = {
  total: (s) => s.placementPts + s.killPts,
  wwcd: (s) => s.wwcdCount,
  placement: (s) => s.placementPts,
  kills: (s) => s.killPts,
};

export const SORT_OPTIONS = [
  { value: 'total', label: 'Total points' },
  { value: 'wwcd', label: 'WWCD' },
  { value: 'placement', label: 'Placement points' },
  { value: 'kills', label: 'Kill points' },
];

export const totalPoints = SORT_FIELDS.total;

/**
 * Pure: sorts by the chosen metric (descending, ties by squad name), assigns
 * the rank from the full table, then filters by squad name. Filtering never
 * changes a squad's rank. The input array is not mutated.
 */
export function rankStandings(standings, { query = '', sortBy = 'total' }) {
  const metric = SORT_FIELDS[sortBy] ?? SORT_FIELDS.total;
  const needle = query.trim().toLowerCase();
  return standings
    .toSorted(
      (a, b) =>
        metric(b) - metric(a) || a.squadName.localeCompare(b.squadName),
    )
    .map((standing, index) => ({ ...standing, rank: index + 1 }))
    .filter((standing) => standing.squadName.toLowerCase().includes(needle));
}
