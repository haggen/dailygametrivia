import { useQuery } from "@tanstack/react-query";

import * as classes from "./style.module.css";

import { Guess } from "~/src/components/Guess";
import { Form } from "~/src/components/Form";
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

const startingAttempts = 10;

export function App() {
  const [{ stage, level, score, attemptsLeft, history }, dispatch] =
    useSimpleState({
      stage: "playing",
      level: 0,
      score: 0,
      attemptsLeft: startingAttempts,
      history: [] as Game[],
    });

  const { data: gameOfTheDayOffset } = useQuery(
    ["/v4/games/count", { where: defaultGameCriteria }] as const,
    ({ queryKey }) => post<{ count: number }>(...queryKey),
    {
      select({ count }) {
        return getGameOfTheDayOffset(level, count);
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

  const handleVictory = (game: Game) => {
    dispatch({
      stage: "victory",
      score: score + 1,
      history: [...history, game],
    });
  };

  const handleGameOver = (game: Game) => {
    dispatch({
      stage: "gameover",
      history: [...history, game],
      attemptsLeft: 0,
    });
  };

  const handleGuess = (game: Game) => {
    if (!gameOfTheDay) {
      return;
    }
    const comparison = compareGames(gameOfTheDay, game);

    if (comparison.id === "exact") {
      handleVictory(game);
    } else if (attemptsLeft === 1) {
      handleGameOver(game);
    } else {
      dispatch({
        history: [...history, game],
        attemptsLeft: attemptsLeft - 1,
      });
    }
  };

  const handleNext = () => {
    dispatch({
      stage: "playing",
      attemptsLeft: startingAttempts,
      history: [],
      level: score,
    });
  };

  return (
    <>
      <header className={classes.header}>
        <Lives current={attemptsLeft} max={startingAttempts} />
        <Score score={score} />
      </header>

      <main className={classes.content}>
        {gameOfTheDay ? (
          history.length > 0 ? (
            <ol className={classes.history}>
              {[...history].reverse().map((guessedGame, index) => (
                <li key={index}>
                  <span className={classes.number}>
                    {history.length - index}
                  </span>
                  <Guess
                    guess={guessedGame}
                    comparison={compareGames(gameOfTheDay, guessedGame)}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <Help />
          )
        ) : (
          <div className="banner">
            <h1 aria-label="Loading">🧠</h1>
            <p>Thinking of a game…</p>
          </div>
        )}
      </main>

      <footer className={classes.footer}>
        {stage === "playing" ? (
          gameOfTheDay ? (
            <Form onGuess={handleGuess} />
          ) : null
        ) : stage === "victory" ? (
          <Toast
            type="positive"
            icon="popper"
            title="Correct!"
            message="You may continue playing."
            extra={
              <Button color="green" onClick={handleNext}>
                Next →
              </Button>
            }
          />
        ) : (
          <>
            <Toast
              type="negative"
              icon="dead"
              title="Game over!"
              message="You can try again tomorrow."
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
