import { ComponentProps, ForwardedRef, KeyboardEvent, forwardRef } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { useForwardRef } from "~/src/lib/useForwardRef";
import { useScheduledLayoutEffect } from "~/src/lib/useScheduledLayoutEffect";
import { getPreviousIndex, getNextIndex } from "~/src/lib/listIndex";

export type Option<T = unknown> = {
  key: string;
  value: T;
  label: string;
};

type Props<T> = Omit<ComponentProps<"ul">, "role" | "onSelect"> & {
  options: Option<T>[];
  selectedIndex: number;
  message?: string;
  onSelect: (index: number) => void;
  onCommit: (index: number) => void;
};

function DataList<T>(
  {
    options,
    selectedIndex,
    message,
    onSelect,
    onCommit,
    className,
    ...props
  }: Props<T>,
  ref: ForwardedRef<HTMLUListElement>
) {
  const listRef = useForwardRef(ref);

  const scrollToSelectedOption = useScheduledLayoutEffect(() => {
    listRef.current
      ?.querySelector('li[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowUp":
        onSelect(getPreviousIndex(selectedIndex));
        scrollToSelectedOption();
        break;
      case "ArrowDown":
        onSelect(getNextIndex(selectedIndex, options.length));
        scrollToSelectedOption();
        break;
      case "Enter":
        onCommit(selectedIndex);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const classList = new ClassList();
  classList.add(classes.options);
  if (className) {
    classList.add(className);
  }

  const getClickHandler = (index: number) => () => onCommit(index);
  const getMouseEnterHandler = (index: number) => () => onSelect(index);

  return (
    <ul
      ref={listRef}
      role="listbox"
      tabIndex={0}
      className={classList.toString()}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {message ? (
        <li>{message}</li>
      ) : (
        options.map((option, index) => (
          <li
            key={option.key}
            role="option"
            aria-selected={index === selectedIndex}
            className={index === selectedIndex ? classes.candidate : ""}
            onClick={getClickHandler(index)}
            onMouseEnter={getMouseEnterHandler(index)}
          >
            <span>{option.label}</span>
          </li>
        ))
      )}
    </ul>
  );
}

const forwardRefDataList = forwardRef(DataList);
export { forwardRefDataList as DataList };
