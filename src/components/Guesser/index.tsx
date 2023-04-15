import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "src/components/Button";
import { ComboBox, Option } from "src/components/ComboBox";
import { Game, defaultCriteria, post } from "src/lib/api";
import { debounce } from "src/lib/debounce";

type Props = { onGuess: (game: Game) => void };

export function Guesser({ onGuess }: Props) {
  const [guess, setGuess] = useState<Game>();
  const [query, setQuery] = useState("");

  const { data: options = [], isFetching } = useQuery(
    ["/v4/games", query] as const,
    ({ queryKey }) =>
      post<Game>(
        queryKey[0],
        `
          fields name, first_release_date;
          search "${queryKey[1].replace('"', '\\"')}";
          where ${defaultCriteria};
        `
      ),
    {
      enabled: query.length > 0,
      select: (data) =>
        data.map(
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
