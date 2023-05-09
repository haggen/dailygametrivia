import { CSSProperties, ReactNode } from "react";
import {
  offset as offsetMiddleware,
  useFloating,
} from "@floating-ui/react-dom";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type Props = {
  reference: HTMLElement | null;
  active: boolean;
  color?: "red" | "green" | "yellow" | string;
  style?: CSSProperties;
  offset?:
    | { crossAxis: number }
    | { mainAxis: number }
    | { mainAxis: number; crossAxis: number };
  children: ReactNode;
};

export function Tooltip({ reference, active, color, offset, children }: Props) {
  const { refs, floatingStyles } = useFloating({
    elements: { reference },
    placement: "bottom-start",
    middleware: [offsetMiddleware(offset)],
  });

  const classList = new ClassList(classes.tooltip);
  if (active) {
    classList.add(classes.active);
  }
  if (color) {
    classList.add(classes[color]);
  }

  return (
    <div
      ref={refs.setFloating}
      role="tooltip"
      className={String(classList)}
      style={floatingStyles}
    >
      <svg
        className={classes.pointer}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,10 H10 L5,5 Q0,0 0,5 z" />
      </svg>

      <div className={classes.content}>{children}</div>
    </div>
  );
}
