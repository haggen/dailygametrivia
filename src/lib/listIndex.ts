export function getPreviousIndex(index: number) {
  return Math.max(index - 1, 0);
}

export function getNextIndex(index: number, length: number) {
  return Math.min(index + 1, length - 1);
}
