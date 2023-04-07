/**
 * Custom hashing.
 */
export function createHash(input: string) {
  let r = 0;

  for (let i = 0, l = input.length; i < l; i++) {
    r = ((r << 5) - r + input.charCodeAt(i)) | 0;
  }

  return Math.abs(r);
}
