import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";

/**
 * Get a debounced version of a function that is stable across renders.
 */
export function useDebounce<P extends unknown[]>(
  callback: (...parameters: P) => void,
  delay: number
) {
  const callbackRef = useRef(callback);
  const debounceRef = useRef(
    debounce((...parameters: P) => callbackRef.current(...parameters), delay)
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return debounceRef.current;
}
