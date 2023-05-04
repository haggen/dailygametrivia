import { useLayoutEffect, useRef } from "react";

/**
 * Schedule a one time effect for the next render.
 */
export function useScheduledEffect(): (effect: () => void) => void;
export function useScheduledEffect(
  defaultEffect: () => void
): (effect?: () => void) => void;
export function useScheduledEffect(defaultEffect?: () => void) {
  const scheduleRef = useRef<(() => void)[]>([]);

  useLayoutEffect(() => {
    scheduleRef.current.forEach((effect) => effect());
    scheduleRef.current = [];
  });

  return (effect = defaultEffect) => {
    if (effect) {
      scheduleRef.current.push(effect);
    }
  };
}
