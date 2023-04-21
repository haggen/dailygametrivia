import { ComponentProps } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type Props = ComponentProps<"input">;

export function Input({ className, ...props }: Props) {
  const classList = new ClassList();
  classList.add(classes.input);
  if (className) {
    classList.add(className);
  }

  return <input className={classList.toString()} {...props} />;
}
