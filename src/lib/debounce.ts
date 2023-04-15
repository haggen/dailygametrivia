/**
 * Debounce an async function.
 */
export function debounce<P extends Array<unknown>, R>(
  fn: (...arg: P) => Promise<R>,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...arg: P): Promise<R> => {
    clearTimeout(timeoutId);
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        fn(...arg)
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  };
}
