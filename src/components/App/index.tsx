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
        {gameOfTheDay ? (
          history.length > 0 ? (
            <History history={history} gameOfTheDay={gameOfTheDay} />
          ) : (
            <Help />
          )
        ) : (
          <div className="banner">
            <h1>Loading</h1> <p>Thinking of a game…</p>
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
            icon="party"
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

        <Copy />
      </footer>
    </>
  );
}
