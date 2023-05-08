import { useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";

import * as classes from "./style.module.css";

import { Game, getCount, getGame, getId, load } from "~/src/lib/data";
import { useSimpleState } from "~/src/lib/useSimpleState";
import { getTodaysOffset } from "~/src/lib/seededOffset";
import { Outcome, compareGames } from "~/src/lib/compareGames";
import { Tutorial } from "~/src/components/Tutorial";
import { Form } from "~/src/components/Form";
import { Score } from "~/src/components/Score";
import { Toast } from "~/src/components/Toast";
import { Button } from "~/src/components/Button";
import * as Storage from "~/src/lib/storage";
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
  const state = Storage.load<State>(key);

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
  const dailyKey = Storage.getDailyKey();

  const [{ stage, level, history, remainingAttempts }, dispatch] =
    useSimpleState<State>(getInitialSession(dailyKey));

  useEffect(() => {
    Storage.save(dailyKey, {
      stage,
      level,
      history,
      remainingAttempts,
    });
  }, [remainingAttempts, history, level, stage, dailyKey]);

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

  const inputRef = useRef<HTMLInputElement>(null);

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

    if (comparison.id === Outcome.Exact) {
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

  const handleHelp = (page: number, total: number) => {
    if (page === total - 1) {
      inputRef.current?.focus();
    }
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
          <Tutorial onChange={handleHelp}>
            <p>
              <Balancer>You have 10 guesses to find the secret game.</Balancer>
            </p>
            <p>
              <Balancer>
                For each guess you'll get hints about the secret game.
              </Balancer>
            </p>
            <p>
              <Balancer>
                If you guess correctly you'll get to keep playing with a new
                game.
              </Balancer>
            </p>
            <p>
              <Balancer>
                If you lose you'll have to wait until tomorrow to play again.
              </Balancer>
            </p>
            <p>
              <Balancer>Take your first guess to start and good luck!</Balancer>
            </p>
          </Tutorial>
        )}
      </main>

      <footer className={classes.footer}>
        {stage === "playing" ? (
          <Form inputRef={inputRef} onSubmit={handleGuess} />
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
        ) : stage === "gameover" ? (
          <>
            <Toast
              type="negative"
              icon="dead"
              title="Bummer."
              message={
                <>
                  The game was <MoreInfo game={secretGame} />. You can try again
                  tomorrow.
                </>
              }
            />
          </>
        ) : null}

        <Copy />
      </footer>
    </>
  );
}
