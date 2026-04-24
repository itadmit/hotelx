/**
 * Pricing constants for HotelX founders offer.
 *
 * Two parallel sets of numbers:
 *  - LIST: the "normal" price (used for struck-through anchors)
 *  - FOUNDERS: what hotels actually pay during the founders cohort
 */

export const LIST = {
  base: 99,
  perRoom: 12,
  onboarding: 290,
  training: 190,
  retainerMonthly: 39,
  retainerMonthsFree: 6,
} as const;

export const FOUNDERS = {
  base: 0,
  perRoom: 6,
  onboarding: 0,
  training: 0,
  retainerMonthly: 0,
  retainerMonthsFree: 6,
} as const;

export function listMonthly(rooms: number) {
  return LIST.base + LIST.perRoom * rooms;
}

export function foundersMonthly(rooms: number) {
  return FOUNDERS.base + FOUNDERS.perRoom * rooms;
}

export function monthlySavings(rooms: number) {
  return listMonthly(rooms) - foundersMonthly(rooms);
}

/**
 * The full first-year saving vs list:
 *  - 12 monthly diffs
 *  - one-time onboarding + training
 *  - 6 free months of retainer
 */
export function firstYearSavings(rooms: number) {
  const monthlyDiff = monthlySavings(rooms) * 12;
  const oneTime = LIST.onboarding + LIST.training;
  const retainer = LIST.retainerMonthly * LIST.retainerMonthsFree;
  return monthlyDiff + oneTime + retainer;
}

export function listFirstYearTotal(rooms: number) {
  return (
    listMonthly(rooms) * 12 +
    LIST.onboarding +
    LIST.training +
    LIST.retainerMonthly * LIST.retainerMonthsFree
  );
}

export function foundersFirstYearTotal(rooms: number) {
  return foundersMonthly(rooms) * 12;
}

export function formatUsd(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
