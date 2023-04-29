import { useEffect, useState } from "react";

import * as classes from "./style.module.css";

import { Game, getCount, getGame, getId, load } from "~/src/lib/data";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { getTodaysOffset } from "~/src/lib/seededOffset";
import { compareGames } from "~/src/lib/compareGames";
import { Help } from "~/src/components/Help";
import { Form } from "~/src/components/Form";
import { Score } from "~/src/components/Score";
import { Toast } from "~/src/components/Toast";
import { Button } from "~/src/components/Button";
import {
  getSessionKey as getSessionKey,
  getSession,
  setSession as setSession,
} from "~/src/lib/storedState";
import { History } from "~/src/components/History";
import { MoreInfo } from "~/src/components/MoreInfo";

type State = {
  stage: "playing" | "victory" | "gameover";
  remainingAttempts: number;
  level: number;
  history: Game[];
};

const initialAttempts = 10;

function getInitialSession(key: string) {
  const state = getSession<State>(key);

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
  const sessionKey = getSessionKey();

  const [{ stage, level, history, remainingAttempts }, dispatch] =
    useSimpleState<State>(getInitialSession(sessionKey));

  useEffect(() => {
    setSession(sessionKey, {
      stage,
      level,
      history,
      remainingAttempts,
    });
  }, [remainingAttempts, history, level, stage, sessionKey]);

  const [secretGame, setSecretGame] = useState<Game>();

  useEffect(() => {
    load()
      .then(() => {
        const count = getCount();
        const offset = getTodaysOffset(level, count);
        const id = getId(offset);
        const game = getGame(id);

        setSecretGame(game);
      })
      .catch((error) => {
        throw new Error("Failed to load the database.", { cause: error });
      });
  }, [level]);

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
    if (!secretGame) {
      return;
    }
    const comparison = compareGames(secretGame, game);

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

  if (!secretGame) {
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
          <History history={history} secretGame={secretGame} />
        ) : (
          <Help />
        )}
      </main>

      <footer className={classes.footer}>
        {stage === "playing" ? (
          secretGame ? (
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
                  The game was{" "}
                  <strong>
                    <MoreInfo game={secretGame} />
                  </strong>
                  . You can try again tomorrow.
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
