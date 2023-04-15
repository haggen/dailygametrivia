import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "src/components/Button";
import { ComboBox, Option } from "src/components/ComboBox";
import { TGame, defaultCriteria, post } from "src/lib/api";

type Props = { onGuess: (game: TGame) => void };

export function Guesser({ onGuess }: Props) {
  const [guess, setGuess] = useState<TGame>();
  const [query, setQuery] = useState("");

  const { data: options = [], isFetching } = useQuery(
    [
      "/v4/games",
      `
        fields name, first_release_date;
        search "${query.replace('"', '\\"')}";
        where ${defaultCriteria};
      `,
    ] as const,
    ({ queryKey }) => post<TGame>(...queryKey),
    {
      enabled: query.length > 0,
      select: (data) =>
        data.map(
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

  const handleSubmit = () => {
    if (guess) {
      onGuess(guess);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <ComboBox
        query={query}
        options={options}
        loading={isFetching}
        onSearch={handleSearch}
        onChange={handleChange}
      />
      <Button type="submit" onClick={handleSubmit}>
        Guess
      </Button>
    </form>
  );
}
