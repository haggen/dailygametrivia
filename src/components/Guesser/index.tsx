import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { Search, Option } from "~/src/components/Search";
import {
  TGame,
  defaultGameCriteria,
  defaultGameFields,
  fixMissingData,
  post,
} from "~/src/lib/api";

type Props = { onGuess: (game: TGame) => void };

export function Guesser({ onGuess }: Props) {
  const [guess, setGuess] = useState<TGame>();
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
    ({ queryKey }) => post<TGame[]>(...queryKey),
    {
      enabled: query.length > 0,
      select: (data) =>
        data.map(fixMissingData).map(
          (game) =>
            ({
              key: String(game.id),
              value: game,
              label: game.name,
            } as Option<TGame>)
        ),
    }
  );

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const handleChange = (option: Option<TGame>) => {
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
      <Search
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
