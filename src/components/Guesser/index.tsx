import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, KeyboardEvent, MouseEvent, useId, useState } from "react";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Game, post } from "src/lib/api";
import { debounce } from "src/lib/debounce";
import { useFocusTrap } from "src/lib/useFocusTrap";
import { useSimpleState } from "src/lib/useSimpleState";

const debouncedPost = debounce(post, 500);

type Props<T> = {
  onChange: (option: T) => void;
};

function ComboBox<T extends { name: string }>({ onChange }: Props<T>) {
  const listId = useId();

  const [{ searchValue, searchMask, selectedIndex, isExpanded }, dispatch] =
    useSimpleState({
      searchValue: "",
      searchMask: "",
      selectedIndex: -1,
      isExpanded: false,
    });

  const query = `
    fields name, first_release_date;
    search "${searchValue.replace('"', '\\"')}";
    where category = 0 & aggregated_rating_count > 10;
  `;

  const { data: options = [], isFetching } = useQuery(
    ["/v4/games", query] as const,
    ({ queryKey }) => debouncedPost(...queryKey),
    {
      enabled: searchValue.length > 0,
    }
  );

  const focusTrapRef = useFocusTrap<HTMLDivElement>((focused) => {
    dispatch({ isExpanded: focused });
  });

  const handleOptionSelect = (index: number) => {
    const option = options[index];
    if (option) {
      dispatch({ selectedIndex: index, searchMask: option.name });
    }
  };

  const handleCommitSelection = (index: number) => {
    const option = options[index];
    if (option) {
      dispatch({
        selectedIndex: index,
        searchMask: option.name,
        isExpanded: false,
      });
      onChange(option);
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      searchMask: "",
      searchValue: event.currentTarget.value,
      isExpanded: true,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      handleOptionSelect((selectedIndex + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      handleOptionSelect((options.length + selectedIndex - 1) % options.length);
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

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest("[data-index]");
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
        type="search"
        role="combobox"
        aria-expanded={isExpanded}
        aria-autocomplete="list"
        value={searchMask || searchValue}
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
          {isFetching ? (
            <li>Loading…</li>
          ) : searchValue ? (
            options.length > 0 ? (
              options.map((game, index) => (
                <li
                  key={game.id}
                  role="option"
                  data-index={index}
                  onMouseEnter={handleMouseEnter}
                >
                  {game.name}
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

type Props = { onGuess: (game: Game) => void };

export function Guesser({ onGuess }: Props) {
  const [value, setValue] = useState<Game>();

  const handleChange = (game: Game) => {
    setValue(game);
  };

  const handleSubmit = () => {
    if (value) {
      onGuess(value);
    }
  };

  return (
    <div>
      <ComboBox onChange={handleChange} />
      <Button onClick={handleSubmit}>Guess</Button>
    </div>
  );
}
