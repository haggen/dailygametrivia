import { CSSProperties, ElementType, forwardRef } from "react";

import classes from "./style.module.css";

import { ClassList } from "src/lib/classList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "src/lib/shared";

type AcceptableElementType =
  | "span"
  | "div"
  | "ul"
  | "ol"
  | "li"
  | "header"
  | "section"
  | "article"
  | "footer"
  | "figure"
  | "menu"
  | "form";

type Props = {
  flexDirection?: CSSProperties["flexDirection"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
  flexWrap?: CSSProperties["flexWrap"];
  flex?: CSSProperties["flex"];
};

function Flex<E extends AcceptableElementType = "div">(
  {
    as,
    children,
    flexDirection,
    alignItems = flexDirection !== "column" ? "center" : undefined,
    justifyContent,
    gap,
    flex,
    flexWrap,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList();
  classList.add(classes.flex);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = classList.toString();

  props.style = {
    flexDirection: flexDirection,
    alignItems: alignItems,
    justifyContent: justifyContent,
    gap,
    flexWrap: flexWrap,
    flex,
    ...props.style,
  };

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

const forwardRefFlex = forwardRef(Flex) as typeof Flex;

export { forwardRefFlex as Flex };
