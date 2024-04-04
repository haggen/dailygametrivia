import { ElementType, forwardRef } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "~/src/lib/shared";

type AcceptableElements = "button" | "a";
type Props = {
  color?: "blue" | "red" | "green" | "yellow";
};

/**
 * Button component.
 */
function Button<E extends AcceptableElements = "button">(
  { as, color = "blue", ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("button" as ElementType);
  const classList = new ClassList();
  classList.add(classes.button);
  classList.add(classes[color]);
  props.type ??= "button";
  props.className ??= classList.toString();
  return <Component ref={ref} {...props} />;
}

const forwardRefButton = forwardRef(Button) as typeof Button;
export { forwardRefButton as Button };
