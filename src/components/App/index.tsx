import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import * as classes from "./style.module.css";

import {
  Game,
  defaultGameCriteria,
  defaultGameFields,
  fixGameData,
  post,
} from "~/src/lib/api";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { getGameOfTheDayOffset } from "~/src/lib/gameOfTheDay";
import { compareGames } from "~/src/lib/compareGames";
import { Guess } from "~/src/components/Guess";
import { Help } from "~/src/components/Help";
import { Form } from "~/src/components/Form";
import { Lives } from "~/src/components/Lives";
import { Score } from "~/src/components/Score";
import { Toast } from "~/src/components/Toast";
import { Button } from "~/src/components/Button";
import {
  getStorageKeyOfTheDay,
  loadState,
  saveState,
} from "~/src/lib/storedState";

type State = {
  stage: "playing" | "victory" | "gameover";
  level: number;
  score: number;
  history: Game[];
  attemptsLeft: number;
};

const startingAttempts = 10;

function getInitialState(key: string) {
  const state = loadState<State>(key);

  return (
    state ?? {
      stage: "playing",
      level: 0,
      score: 0,
      history: [],
      attemptsLeft: startingAttempts,
    }
  );
}

export function App() {
  const storageKeyOfTheDay = getStorageKeyOfTheDay();

  const [{ stage, level, score, history, attemptsLeft }, dispatch] =
    useSimpleState<State>(getInitialState(storageKeyOfTheDay));

  useEffect(() => {
    saveState(storageKeyOfTheDay, {
      stage,
      level,
      score,
      history,
      attemptsLeft,
    });
  }, [attemptsLeft, history, level, score, stage, storageKeyOfTheDay]);

  const bestScore = loadState<number>("bestScore") ?? 0;
  useEffect(() => {
    if (score > bestScore) {
      saveState("bestScore", score);
    }
  }, [bestScore, score]);

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
      level: score,
      history: [],
      attemptsLeft: startingAttempts,
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
