import { useLayoutEffect, useRef } from "react";

type Effect = () => void;

/**
 * Schedule a one time effect for the next render.
 */
export function useScheduledLayoutEffect(): (effect: Effect) => void;
export function useScheduledLayoutEffect(
  defaultEffect: Effect,
): (effect?: Effect) => void;
export function useScheduledLayoutEffect(defaultEffect?: Effect) {
  const scheduleRef = useRef<Effect[]>([]);

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
