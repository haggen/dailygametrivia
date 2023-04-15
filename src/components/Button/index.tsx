import { ElementType, forwardRef } from "react";
import { ClassList } from "src/lib/classList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "src/lib/shared";

import classes from "./style.module.css";

type AcceptableElements = "button" | "a";
type Props = {};

/**
 * Button component.
 */
function Button<E extends AcceptableElements = "button">(
  { as, ...props }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("button" as ElementType);
  const classList = new ClassList();
  classList.add(classes.button);
  props.type ??= "button";
  props.className ??= classList.toString();
  return <Component ref={ref} {...props} />;
}

const forwardRefButton = forwardRef(Button) as typeof Button;
export { forwardRefButton as Button };
