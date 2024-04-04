/**
 * Create seed based off date and level.
 */
function createSeed(date: Date, level: number) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return [y, m, d, level].join("");
}

/**
 * Get a number from a seed.
 */
function getSeededNumber(seed: string) {
  return Array<undefined>(seed.length)
    .fill(undefined)
    .reduce(
      (result, _, index) => result + Math.pow(seed.charCodeAt(index), index),
      1,
    );
}

/**
 * Get offset based today's date and given level.
 */
export function getTodaysOffset(level: number, count: number) {
  return getSeededNumber(createSeed(new Date(), level)) % count;
}
