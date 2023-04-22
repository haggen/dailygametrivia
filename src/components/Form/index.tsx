import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { SearchInput, Option } from "~/src/components/SearchInput";
import {
  Game,
  defaultGameCriteria,
  defaultGameFields,
  fixGameData,
  post,
} from "~/src/lib/api";

type Props = { onGuess: (game: Game) => void };

export function Form({ onGuess }: Props) {
  const [guess, setGuess] = useState<Game>();
  const [query, setQuery] = useState("");

  const { data: options = [], isFetching } = useQuery(
    [
      "/v4/games",
      {
        search: query,
        fields: defaultGameFields,
        where: defaultGameCriteria,
        limit: 100,
      },
    ] as const,
    ({ queryKey }) => post<Game[]>(...queryKey),
    {
      enabled: query.length > 0,
      select: (data) =>
        data.map(fixGameData).map(
          (game) =>
            ({
              key: String(game.id),
              value: game,
              label: game.name,
            } as Option<Game>)
        ),
    }
  );

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const handleChange = (option: Option<Game>) => {
    setGuess(option.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (guess) {
      onGuess(guess);
    }
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <SearchInput
        className={classes.input}
        options={options}
        query={query}
        loading={isFetching}
        onSearch={handleSearch}
        onChange={handleChange}
      />
      <Button type="submit">Guess</Button>
    </form>
  );
}
