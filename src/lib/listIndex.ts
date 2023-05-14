export function getPreviousIndex(index: number, length: number, fold = false) {
  if (fold) {
    return Math.abs((index - 1) % length);
  }
  return Math.max(index - 1, 0);
}

export function getNextIndex(index: number, length: number, fold = false) {
  if (fold) {
    return (index + 1) % length;
  }
  return Math.min(index + 1, length - 1);
}
