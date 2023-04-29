import { RefObject, useEffect } from "react";

function isTrapped(elementRefs: RefObject<HTMLElement>[]) {
  return elementRefs.some(({ current: element }) => {
    return (
      element && element.isConnected && element.contains(document.activeElement)
    );
  });
}

/**
 * Track when focus is trapped within referred elements.
 */
export function useFocusTrap(
  elementRefs: RefObject<HTMLElement>[],
  callback: (focused: boolean) => void
) {
  useEffect(() => {
    const handleFocusIn = () => {
      if (isTrapped(elementRefs)) {
        callback(true);
      }
    };
    document.addEventListener("focusin", handleFocusIn);

    const handleFocusOut = () => {
      setTimeout(() => {
        if (!isTrapped(elementRefs)) {
          callback(false);
        }
      }, 0);
    };
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [callback, elementRefs]);
}
