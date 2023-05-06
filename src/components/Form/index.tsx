import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  RefObject,
} from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { DataList, Option } from "~/src/components/DataList";
import { Input } from "~/src/components/Input";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { useFocusTrap } from "~/src/lib/useFocusTrap";
import { Flex } from "~/src/components/Flex";
import { Game, load, search } from "~/src/lib/data";
import { getPreviousIndex, getNextIndex } from "~/src/lib/listIndex";

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  onSubmit: (game: Game) => void;
};

export function Form({ inputRef, onSubmit }: Props) {
  const [
    {
      isExpanded,
      queryValue,
      isLoading,
      options,
      selectedIndex,
      candidateIndex,
    },
    patch,
  ] = useSimpleState({
    isExpanded: false,
    isLoading: true,
    queryValue: "",
    options: [] as Option<Game>[],
    selectedIndex: -1,
    candidateIndex: -1,
  });

  useEffect(() => {
    load()
      .then(() => {
        patch({ isLoading: false });
      })
      .catch((error) => {
        throw new Error("Failed to load the database.", { cause: error });
      });
  }, [patch]);

  const dataListId = useId();
  const dataListRef = useRef<HTMLUListElement>(null);

  useFocusTrap([inputRef, dataListRef], (focused) => {
    patch({ isExpanded: focused });
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    const options =
      value.length > 0
        ? search(value).map(
            (game) =>
              ({
                key: String(game.id),
                label: game.name,
                value: game,
              } as Option<Game>)
          )
        : [];

    options.forEach((option) => {
      const homonymous = options.find(
        ({ key, label }) => key !== option.key && label === option.label
      );
      if (homonymous) {
        option.label = `${option.value.name} (${option.value.releaseYear})`;
      }
    });

    patch({
      isExpanded: true,
      options,
      candidateIndex: -1,
      selectedIndex: -1,
      queryValue: value,
    });
  };

  const handleClick = () => {
    patch({ isExpanded: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        handleSelect(getPreviousIndex(candidateIndex));
        break;
      case "ArrowDown":
        handleSelect(getNextIndex(candidateIndex, options.length));
        break;
      case "Enter":
        if (!isExpanded) {
          return;
        }
        handleCommit(candidateIndex);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const handleSelect = (index: number) => {
    const option = options[index];
    if (option) {
      patch({
        isExpanded: true,
        candidateIndex: index,
      });
    }
  };

  const handleCommit = (index: number) => {
    const option = options[index];
    if (option) {
      patch({
        candidateIndex: -1,
        selectedIndex: index,
        queryValue: option.label,
        isExpanded: false,
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const option = options[selectedIndex];
    if (!option) {
      return;
    }

    patch({ queryValue: "", options: [], selectedIndex: -1 });
    onSubmit(option.value);
  };

  if (isLoading) {
    return null;
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {isExpanded ? (
        <div className={classes.popover}>
          <DataList
            id={dataListId}
            ref={dataListRef}
            selectedIndex={candidateIndex}
            options={options}
            onSelect={handleSelect}
            onCommit={handleCommit}
            message={
              options.length > 0
                ? undefined
                : queryValue
                ? "No results."
                : undefined
            }
          />
        </div>
      ) : null}

      <Flex gap="0.25rem">
        <Input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-controls={dataListId}
          aria-label="Search games"
          aria-expanded={isExpanded}
          aria-autocomplete="list"
          value={queryValue}
          onClick={handleClick}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type to search games…"
          className={classes.input}
          required
          autoFocus
        />
        <Button type="submit" disabled={selectedIndex < 0}>
          Guess
        </Button>
      </Flex>
    </form>
  );
}
