import { ComponentProps, ForwardedRef, forwardRef } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type Props = ComponentProps<"input">;

function Input(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  const classList = new ClassList();
  classList.add(classes.input);
  if (className) {
    classList.add(className);
  }

  return <input ref={ref} className={classList.toString()} {...props} />;
}

const forwardRefInput = forwardRef(Input) as typeof Input;
export { forwardRefInput as Input };
