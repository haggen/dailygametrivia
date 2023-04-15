import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Guesser } from "src/components/Guesser";
import { TGame, post } from "src/lib/api";
import { getTodaysGameId } from "src/lib/todaysGame";

import classes from "./style.module.css";
import { Guess } from "src/components/Guess";
import { useSimpleState } from "src/lib/useSimpleState";

export function Game() {
  const [guesses, setGuesses] = useState([] as TGame[]);
  const [{ score, lives }] = useSimpleState({
    score: 0,
    lives: 10,
  });

  const todaysGameId = getTodaysGameId();

  const { data } = useQuery(
    [
      "/v4/games",
      `
        fields *;
        where id = ${todaysGameId};
      `,
    ] as const,
    ({ queryKey }) => post<TGame>(...queryKey)
  );

  const handleGuess = (guess: TGame) => {
    setGuesses([...guesses, guess]);
  };

  if (!data) {
    return "Loading...";
  }

  return (
    <>
      x{score}
      {guesses.length}/{lives}
      {data[0].name}
      <ol>
        {guesses.reverse().map((guess, index) => (
          <li key={guess.id}>
            {index + 1}.
            <Guess elected={data[0]} guessed={guess} />
          </li>
        ))}
      </ol>
      <Guesser onGuess={handleGuess} />
    </>
  );
}
