import { ChangeEvent, KeyboardEvent, MouseEvent, useId } from "react";
import { Input } from "src/components/Input";
import { useDebounce } from "src/lib/useDebounce";
import { useFocusTrap } from "src/lib/useFocusTrap";
import { useSimpleState } from "src/lib/useSimpleState";

export type Option<T> = {
  key: string;
  value: T;
  label: string;
};

type Props<T> = {
  query: string;
  options: Option<T>[];
  loading?: boolean;
  onSearch: (value: string) => void;
  onChange: (option: Option<T>) => void;
};

export function ComboBox<T>({
  query: lastQuery,
  loading,
  options,
  onSearch,
  onChange,
}: Props<T>) {
  const listId = useId();

  const [{ query, mask, selectedIndex, isExpanded }, dispatch] = useSimpleState(
    {
      query: lastQuery,
      mask: "",
      selectedIndex: -1,
      isExpanded: false,
    }
  );

  const focusTrapRef = useFocusTrap<HTMLDivElement>((focused) => {
    dispatch({ isExpanded: focused });
  });

  const handleDebouncedSearch = useDebounce(onSearch, 500);

  const handleOptionSelect = (index: number) => {
    const option = options[index];
    if (option) {
      dispatch({ selectedIndex: index, mask: option.label });
    }
  };

  const handleCommitSelection = (index: number) => {
    const option = options[index];
    if (option) {
      dispatch({
        mask: option.label,
        selectedIndex: index,
        isExpanded: false,
      });
      onChange(option);
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    dispatch({
      query: value,
      mask: "",
      selectedIndex: -1,
      isExpanded: true,
    });

    handleDebouncedSearch(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      handleOptionSelect((selectedIndex + 1) % options.length);
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      handleOptionSelect((options.length + selectedIndex - 1) % options.length);
      event.preventDefault();
    } else if (event.key === "Enter") {
      handleCommitSelection(selectedIndex);
    }
  };

  const handleListClick = (event: MouseEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest("[data-index]");
    if (!target) {
      return;
    }
    const index = target.getAttribute("data-index");
    if (!index) {
      throw new Error("Option has no index");
    }
    handleCommitSelection(Number(index));
  };

  const handleOptionMouseEnter = (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget.closest("[data-index]");
    if (!target) {
      return;
    }
    const index = target.getAttribute("data-index");
    if (!index) {
      throw new Error("Option has no index");
    }
    handleOptionSelect(Number(index));
  };

  return (
    <div ref={focusTrapRef}>
      <Input
        required
        type="search"
        role="combobox"
        aria-expanded={isExpanded}
        aria-autocomplete="list"
        value={mask || query}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      {isExpanded ? (
        <ul
          role="listbox"
          id={listId}
          aria-label="Games"
          tabIndex={0}
          onClick={handleListClick}
          onKeyDown={handleKeyDown}
        >
          {loading ? (
            <li>Loading…</li>
          ) : query ? (
            options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={option.key}
                  role="option"
                  data-index={index}
                  onMouseEnter={handleOptionMouseEnter}
                >
                  {option.label}
                </li>
              ))
            ) : query !== lastQuery ? (
              <li>Typing…</li>
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
