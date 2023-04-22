import { useQuery } from "@tanstack/react-query";

import * as classes from "./style.module.css";

import { Guess } from "~/src/components/Guess";
import { Guesser } from "~/src/components/Guesser";
import {
  Game,
  defaultGameCriteria,
  defaultGameFields,
  fixGameData,
  post,
} from "~/src/lib/api";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { compareGames } from "~/src/lib/compareGames";
import { Button } from "~/src/components/Button";
import { Lives } from "~/src/components/Lives";
import { Score } from "~/src/components/Score";
import { Toast } from "~/src/components/Toast";
import { Help } from "~/src/components/Help";
import { getGameOfTheDayOffset } from "~/src/lib/gameOfTheDay";

const maxLives = 10;

export function App() {
  const [{ stage, score, currentLives, guesses }, dispatch] = useSimpleState({
    stage: "playing",
    score: 0,
    currentLives: maxLives,
    guesses: [] as Game[],
  });

  const { data: gameOfTheDayOffset } = useQuery(
    ["/v4/games/count", { where: defaultGameCriteria }] as const,
    ({ queryKey }) => post<{ count: number }>(...queryKey),
    {
      select({ count }) {
        return getGameOfTheDayOffset(count);
      },
    }
  );

  const { data: gameOfTheDay } = useQuery(
    [
      "/v4/games",
      {
        fields: defaultGameFields,
        where: defaultGameCriteria,
        sort: "id",
        offset: gameOfTheDayOffset,
        limit: 1,
      },
    ] as const,
    ({ queryKey }) => post<Game[]>(...queryKey),
    {
      enabled: typeof gameOfTheDayOffset === "number",
      select(game) {
        return fixGameData(game[0]);
      },
    }
  );

  const handleGuess = (guessedGame: Game) => {
    if (!gameOfTheDay) {
      return;
    }
    const comparison = compareGames(gameOfTheDay, guessedGame);

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

  if (!gameOfTheDay) {
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
                  comparison={compareGames(gameOfTheDay, guessedGame)}
                />
              </li>
            ))}
          </ol>
        ) : (
          <Help />
        )}
      </main>

      <footer className={classes.footer}>
        {stage === "playing" ? (
          <Guesser onGuess={handleGuess} />
        ) : stage === "victory" ? (
          <Toast
            type="positive"
            icon="popper"
            title="Correct!"
            message="You can play again tomorrow."
            extra={<Button onClick={handleRestart}>Restart</Button>}
          />
        ) : (
          <>
            <Toast
              type="negative"
              icon="dead"
              title="Game over!"
              message="You can try again tomorrow."
              extra={<Button onClick={handleRestart}>Restart</Button>}
            />
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
