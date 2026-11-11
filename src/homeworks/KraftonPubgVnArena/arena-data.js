/**
 * Slide contracts (KRAFTON x PUBG Vietnam Arena). Do not change the shape.
 *
 * @typedef {'WARMUP' | 'AIRDROP_LIVE' | 'LOOTED_OUT' | 'EXPIRED'} DropPhase
 *
 * @typedef {Readonly<{
 *   id: string,
 *   title: string,
 *   priceVnd: number,
 *   remainingStock: number,
 *   dropEpochMs: number,
 * }>} PubgCrateDrop
 *
 * @typedef {Readonly<{
 *   squadId: string,
 *   squadName: string,
 *   wwcdCount: number,
 *   placementPts: number,
 *   killPts: number,
 * }>} PubgVnSquadStanding
 */

/**
 * Crate drops are scheduled relative to `nowMs` so a fresh page always has a
 * countdown to watch, one drop already live, and one with little stock.
 * @param {number} nowMs
 * @returns {PubgCrateDrop[]}
 */
export function createArenaDrops(nowMs = Date.now()) {
  return [
    {
      id: 'crate-vip',
      title: 'PVS Finals VIP Pass + 5,000 G-Coin',
      priceVnd: 1_500_000,
      remainingStock: 3,
      dropEpochMs: nowMs + 20_000,
    },
    {
      id: 'crate-day1',
      title: 'PVS Grand Finals Day 1 Ticket',
      priceVnd: 450_000,
      remainingStock: 10,
      dropEpochMs: nowMs + 45_000,
    },
    {
      id: 'crate-gcoin-1k',
      title: 'G-Coin Contraband Crate x1,000',
      priceVnd: 99_000,
      remainingStock: 25,
      dropEpochMs: nowMs - 5_000,
    },
    {
      id: 'crate-gcoin-5k',
      title: 'G-Coin Contraband Crate x5,000',
      priceVnd: 450_000,
      remainingStock: 2,
      dropEpochMs: nowMs + 90_000,
    },
  ];
}

/** @type {PubgVnSquadStanding[]} */
export const SQUAD_STANDINGS = [
  {
    squadId: 'te',
    squadName: 'The Expendables',
    wwcdCount: 4,
    placementPts: 118,
    killPts: 96,
  },
  {
    squadId: 'ces',
    squadName: 'Cerberus Esports',
    wwcdCount: 3,
    placementPts: 104,
    killPts: 88,
  },
  {
    squadId: 'roy',
    squadName: 'Roy Esports',
    wwcdCount: 2,
    placementPts: 87,
    killPts: 91,
  },
  {
    squadId: 'agg',
    squadName: 'AGG',
    wwcdCount: 2,
    placementPts: 92,
    killPts: 70,
  },
  {
    squadId: 'ge',
    squadName: 'Genius Esports',
    wwcdCount: 1,
    placementPts: 75,
    killPts: 64,
  },
];
