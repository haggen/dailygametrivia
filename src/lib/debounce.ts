/**
 * Debounce an async function.
 */
export function debounce<P extends Array<unknown>, R>(
  fn: (...arg: P) => Promise<R>,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  let promise: Promise<R> | undefined;

  return (...arg: P): Promise<R> => {
    clearTimeout(timeoutId);
    promise ??= new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        fn(...arg)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            promise = undefined;
          });
      }, delay);
    });
    return promise;
  };
}
