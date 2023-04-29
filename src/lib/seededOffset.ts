const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

/**
 * Create seed based off date and score.
 */
function getSeed(level = 0) {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  return [y, m, d, level].join("");
}

/**
 * Get random offset based off a seed.
 */
function getSeededOffset(seed: string, count: number) {
  const product = seed
    .split("")
    .map((n) => primes[parseInt(n, 10)])
    .reduce((a, b) => a * b);
  return product % count;
}

/**
 * ...
 */
export function getTodaysOffset(level: number, count: number) {
  const seed = getSeed(level);
  return getSeededOffset(seed, count);
}
