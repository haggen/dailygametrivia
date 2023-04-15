import { TGame } from "src/lib/api";

import classes from "./style.module.css";

export type Match = "exact" | "partial" | "mismatch" | "higher" | "lower";

function compareName(a: TGame, b: TGame): Match {
  if (a.name === b.name) {
    return "exact";
  }
  return "mismatch";
}

function compareReleaseYear(a: TGame, b: TGame): Match {
  const ya = new Date(a.first_release_date * 1000).getFullYear();
  const yb = new Date(b.first_release_date * 1000).getFullYear();

  if (ya === yb) {
    return "exact";
  } else if (ya > yb) {
    return "higher";
  } else if (ya < yb) {
    return "lower";
  }
  return "mismatch";
}

export function compareGames(a: TGame, b: TGame) {
  return {
    id: a.id === b.id ? "exact" : "mismatch",
    name: compareName(a, b),
    releaseYear: compareReleaseYear(a, b),
  } as const;
}

type Props = {
  elected: TGame;
  guessed: TGame;
};

export function Guess({ elected, guessed }: Props) {
  const isCorrect = elected.id === guessed.id;
  const comparison = compareGames(elected, guessed);
  return (
    <article className={classes.guess}>
      <h1>{isCorrect}</h1>
      <ul>
        {Object.keys(comparison).map((key) => (
          <li key={key}>
            {key}: {comparison[key as keyof typeof comparison]}
          </li>
        ))}
      </ul>
    </article>
  );
}
