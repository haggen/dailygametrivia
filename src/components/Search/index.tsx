import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useId,
} from "react";

import * as classes from "./style.module.css";

import { Input } from "~/src/components/Input";
import { useDebounce } from "~/src/lib/useDebounce";
import { useFocusTrap } from "~/src/lib/useFocusTrap";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { ClassList } from "~/src/lib/classList";

export type Option<T = unknown> = {
  key: string;
  value: T;
  label: string;
};

type Props<T> = {
  options: Option<T>[];
  query: string;
  loading?: boolean;
  className?: string;
  onSearch: (value: string) => void;
  onChange: (option: Option<T>) => void;
};

export function Search<T>({
  className,
  options,
  query: lastQueryText,
  loading: isLoading,
  onSearch,
  onChange,
}: Props<T>) {
  const [{ queryText, previewText, selectedIndex, isFocused }, patch] =
    useSimpleState({
      isFocused: false,
      queryText: lastQueryText,
      previewText: null as null | string,
      selectedIndex: -1,
    });

  const focusTrapRef = useFocusTrap<HTMLDivElement>((focused) => {
    patch({ isFocused: focused });
  });

  const executeSearch = useDebounce(onSearch, 100);

  useEffect(() => {
    if (!focusTrapRef.current) {
      return;
    }
    if (!isFocused) {
      return;
    }
    focusTrapRef.current
      .querySelector('li[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [focusTrapRef, isFocused, selectedIndex]);

  const listId = useId();

  const handlePreview = (index: number) => {
    const option = options[index];
    if (option) {
      patch({ selectedIndex: index, previewText: option.label });
    }
  };

  const handleCommit = (index: number) => {
    const option = options[index];
    if (option) {
      patch({
        selectedIndex: index,
        previewText: option.label,
        isFocused: false,
      });
      onChange(option);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    patch({
      queryText: value,
      previewText: null,
      selectedIndex: -1,
      isFocused: true,
    });

    executeSearch(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      handlePreview((selectedIndex + 1) % options.length);
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      handlePreview((options.length + selectedIndex - 1) % options.length);
      event.preventDefault();
    } else if (event.key === "Enter") {
      if (isFocused) {
        handleCommit(selectedIndex);
        event.preventDefault();
      }
    } else if (event.key === "Escape") {
      if (previewText) {
        patch({ previewText: null });
        event.preventDefault();
      }
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest("[data-index]");
    if (!target) {
      return;
    }
    const index = target.getAttribute("data-index");
    if (!index) {
      throw new Error("Option has no index");
    }
    handleCommit(Number(index));
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget.closest("[data-index]");
    if (!target) {
      return;
    }
    const index = target.getAttribute("data-index");
    if (!index) {
      return;
    }
    handlePreview(Number(index));
  };

  const classList = new ClassList();
  classList.add(classes.control);
  if (className) {
    classList.add(className);
  }

  const isTyping = queryText !== lastQueryText;

  return (
    <div ref={focusTrapRef} className={classList.toString()}>
      <Input
        required
        type="search"
        role="combobox"
        aria-expanded={isFocused}
        aria-autocomplete="list"
        value={previewText ?? queryText}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      {isFocused ? (
        <ul
          role="listbox"
          id={listId}
          aria-label="Games"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {isLoading ? (
            <li>Loading…</li>
          ) : isTyping ? (
            <li>Typing…</li>
          ) : queryText ? (
            options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={option.key}
                  role="option"
                  aria-selected={index === selectedIndex}
                  data-index={index}
                  onMouseMove={handleMouseMove}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li>No results.</li>
            )
          ) : (
            <li>Type to start searching…</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
