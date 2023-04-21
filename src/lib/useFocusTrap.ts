import { useEffect, useRef } from "react";

/**
 * Control whether focus is trapped within a referred element.
 */
export function useFocusTrap<T extends HTMLElement>(
  callback: (focused: boolean) => void
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const handleFocusIn = () => {
      if (!elementRef?.current) {
        return;
      }
      if (elementRef.current.contains(document.activeElement)) {
        callback(true);
      }
    };
    document.addEventListener("focusin", handleFocusIn);

    const handleFocusOut = () => {
      setTimeout(() => {
        if (!elementRef?.current) {
          return;
        }
        if (!elementRef.current.contains(document.activeElement)) {
          callback(false);
        }
      }, 0);
    };
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [callback]);

  return elementRef;
}
