import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import * as classes from "./style.module.css";

import { Game, getDatabase } from "~/src/lib/database";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { getGameOfTheDayOffset } from "~/src/lib/gameOfTheDay";
import { compareGames } from "~/src/lib/compareGames";
import { Help } from "~/src/components/Help";
import { Form } from "~/src/components/Form";
import { Score } from "~/src/components/Score";
import { Toast } from "~/src/components/Toast";
import { Button } from "~/src/components/Button";
import {
  getStorageKeyOfTheDay,
  loadState,
  saveState,
} from "~/src/lib/storedState";
import { History } from "~/src/components/History";

type State = {
  stage: "playing" | "victory" | "gameover";
  remainingAttempts: number;
  level: number;
  history: Game[];
};

const initialAttempts = 10;

function getInitialState(key: string) {
  const state = loadState<State>(key);

  return (
    state ?? {
      stage: "playing",
      level: 1,
      history: [],
      remainingAttempts: initialAttempts,
    }
  );
}

function Copy() {
  return (
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
  );
}

export function App() {
  const storageKeyOfTheDay = getStorageKeyOfTheDay();

  const [{ stage, level, history, remainingAttempts }, dispatch] =
    useSimpleState<State>(getInitialState(storageKeyOfTheDay));

  useEffect(() => {
    saveState(storageKeyOfTheDay, {
      stage,
      level,
      history,
      remainingAttempts,
    });
  }, [remainingAttempts, history, level, stage, storageKeyOfTheDay]);

  const { data: gameOfTheDay } = useQuery(
    ["gameOfTheDay"],
    () => Promise.resolve(getDatabase()),
    {
      select({ count, games }) {
        const offset = getGameOfTheDayOffset(level, count);
        return games[Object.keys(games)[offset]];
      },
    }
  );

  const handleVictory = (game: Game) => {
    dispatch({
      stage: "victory",
      history: [...history, game],
    });
  };

  const handleGameOver = (game: Game) => {
    dispatch({
      stage: "gameover",
      history: [...history, game],
      remainingAttempts: 0,
    });
  };

  const handleGuess = (game: Game) => {
    if (!gameOfTheDay) {
      return;
    }
    const comparison = compareGames(gameOfTheDay, game);

    if (comparison.id === "exact") {
      handleVictory(game);
    } else if (remainingAttempts > 1) {
      dispatch({
        remainingAttempts: remainingAttempts - 1,
        history: [...history, game],
      });
    } else {
      handleGameOver(game);
    }
  };

  const handleNext = () => {
    dispatch({
      stage: "playing",
      level: level + 1,
      history: [],
      remainingAttempts: initialAttempts,
    });
  };

  if (!gameOfTheDay) {
    return null;
  }

  return (
    <>
      <div className={classes.header}>
        <Score
          remaining={remainingAttempts}
          initial={initialAttempts}
          level={level}
        />
      </div>

      <main className={classes.content}>
        {history.length > 0 ? (
          <History history={history} gameOfTheDay={gameOfTheDay} />
        ) : (
          <Help />
        )}
      </main>

      <footer className={classes.footer}>
        {stage === "playing" ? (
          gameOfTheDay ? (
            <Form onSubmit={handleGuess} />
          ) : null
        ) : stage === "victory" ? (
          <Toast
            type="positive"
            icon="party"
            title="Nice!"
            message="You get to play the next level."
            extra={
              <Button color="green" onClick={handleNext}>
                Continue
              </Button>
            }
          />
        ) : (
          <>
            <Toast
              type="negative"
              icon="dead"
              title="Bummer."
              message={
                <>
                  The game was <strong>{gameOfTheDay?.name}</strong>. You can
                  try again tomorrow.
                </>
              }
            />
          </>
        )}

        <Copy />
      </footer>
    </>
  );
}
