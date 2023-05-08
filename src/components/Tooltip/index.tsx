import { CSSProperties, ReactNode } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type Props = {
  active: boolean;
  color?: "red" | "green" | "yellow" | string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Tooltip({ active, color, style, children }: Props) {
  const classList = new ClassList(classes.tooltip);
  if (active) {
    classList.add(classes.active);
  }
  if (color) {
    classList.add(classes[color]);
  }

  return (
    <div role="tooltip" className={String(classList)} style={style}>
      {children}

      <svg
        className={classes.pointer}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,10 H10 L5,5 Q0,0 0,5 z" />
      </svg>
    </div>
  );
}
