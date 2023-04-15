import { useReducer } from "react";

function isEquivalent(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function createReducer<T extends Record<string, unknown>>(defaultValue: T) {
  return [
    (state: T, patch: Partial<T>) => {
      const next = { ...state, ...patch };
      if (isEquivalent(next, state)) {
        return state;
      }
      return next;
    },
    defaultValue,
  ] as const;
}

/**
 * Simple state is an object based state with a patcher.
 */
export function useSimpleState<T extends Record<string, unknown>>(
  defaultValue: T,
) {
  return useReducer(...createReducer(defaultValue));
}
