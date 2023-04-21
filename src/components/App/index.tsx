import { useQuery } from "@tanstack/react-query";

import * as classes from "./style.module.css";

import { Guess } from "~/src/components/Guess";
import { Guesser } from "~/src/components/Guesser";
import { TGame, defaultGameFields, fixMissingData, post } from "~/src/lib/api";
import { getTodaysGameId } from "~/src/lib/todaysGame";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { compareGames } from "~/src/lib/compareGames";
import { Button } from "~/src/components/Button";
import { Lives } from "~/src/components/Lives";
import { Score } from "~/src/components/Score";

const maxLives = 10;

export function App() {
  const [{ stage, score, currentLives, guesses }, dispatch] = useSimpleState({
    stage: "playing",
    score: 0,
    currentLives: maxLives,
    guesses: [] as TGame[],
  });

  const todaysGameId = getTodaysGameId();

  const { data: secretGame } = useQuery(
    [
      "/v4/games",
      {
        fields: defaultGameFields,
        where: `id = ${todaysGameId}`,
      },
    ] as const,
    ({ queryKey }) => post<TGame>(...queryKey),
    {
      select(data) {
        return fixMissingData(data[0]);
      },
    }
  );

  const handleGuess = (guessedGame: TGame) => {
    if (!secretGame) {
      return;
    }
    const comparison = compareGames(secretGame, guessedGame);

    if (comparison.id === "exact") {
      dispatch({
        stage: "victory",
        guesses: [...guesses, guessedGame],
        score: score + 1,
      });
    } else if (currentLives === 1) {
      dispatch({
        stage: "gameover",
        guesses: [...guesses, guessedGame],
        currentLives: 0,
      });
    } else {
      dispatch({
        guesses: [...guesses, guessedGame],
        currentLives: currentLives - 1,
      });
    }
  };

  const handleRestart = () => {
    dispatch({
      stage: "playing",
      currentLives: maxLives,
      guesses: [],
    });
  };

  if (!secretGame) {
    return <>Loading…</>;
  }

  return (
    <>
      <header className={classes.header}>
        <Lives current={currentLives} max={maxLives} />
        <Score score={score} />
      </header>

      <main className={classes.content}>
        {guesses.length > 0 ? (
          <ol className={classes.guesses}>
            {[...guesses].reverse().map((guessedGame, index) => (
              <li key={index}>
                <span className={classes.number}>{guesses.length - index}</span>
                <Guess
                  guess={guessedGame}
                  comparison={compareGames(secretGame, guessedGame)}
                />
              </li>
            ))}
          </ol>
        ) : (
          <p>Take a guess to start the game.</p>
        )}
      </main>

      <footer className={classes.footer}>
        {stage === "playing" ? (
          <Guesser onGuess={handleGuess} />
        ) : stage === "victory" ? (
          <>
            🎉 Congratulations! <Button onClick={handleRestart}>Restart</Button>
          </>
        ) : (
          <>
            😵 Game over! <Button onClick={handleRestart}>Restart</Button>
          </>
        )}

        <p className={classes.copy}>
          Made by{" "}
          <a href="https://twitter.com/haggen" target="_blank" rel="noreferrer">
            me
          </a>
          . Data by{" "}
          <a href="https://api-docs.igdb.com/" target="_blank" rel="noreferrer">
            IGDB.com
          </a>
          . Source on{" "}
          <a
            href="https://github.com/haggen/dailygametrivia"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </>
  );
}
