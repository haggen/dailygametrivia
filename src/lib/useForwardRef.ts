import { ForwardedRef, useRef, useEffect } from "react";

export function useForwardRef<T>(
  forwardedRef: ForwardedRef<T>,
  initialValue: T | null = null
) {
  const ref = useRef<T>(initialValue);

  useEffect(() => {
    if (!forwardedRef) return;

    if (typeof forwardedRef === "function") {
      forwardedRef(ref.current);
    } else {
      forwardedRef.current = ref.current;
    }
  }, [forwardedRef]);

  return ref;
}
