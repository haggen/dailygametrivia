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

const maxLives = 10;
const firstTenPrimeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

function getSeed() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  return parseInt([y, m, d].join(""), 10);
}

function getRandomIndex(seed: number, listCount: number) {
  // convert each number from seed to a correspondent prime number
  const seedPrimeNumbers = seed
    .toString()
    .split("")
    .map((n) => firstTenPrimeNumbers[parseInt(n, 10)]);
  // multiply all the correspondent prime numbers
  const seedPrimeProduct = seedPrimeNumbers.reduce((a, b) => a * b);
  // get the modulo of the product by the list count
  return seedPrimeProduct % listCount;
}

function getGameQueryOffset(gameListLength: number) {
  const seed = getSeed();
  return getRandomIndex(seed, gameListLength);
}

export function App() {
  const [{ stage, score, currentLives, guesses }, dispatch] = useSimpleState({
    stage: "playing",
    score: 0,
    currentLives: maxLives,
    guesses: [] as Game[],
  });

  const { data: gameQueryOffset } = useQuery(
    ["/v4/games/count", { where: defaultGameCriteria }] as const,
    ({ queryKey }) => post<{ count: number }>(...queryKey),
    {
      select({ count: gameListLength }) {
        return getGameQueryOffset(gameListLength);
      },
    }
  );

  const { data: secretGame } = useQuery(
    [
      "/v4/games",
      {
        fields: defaultGameFields,
        where: defaultGameCriteria,
        sort: "id",
        offset: gameQueryOffset,
        limit: 1,
      },
    ] as const,
    ({ queryKey }) => post<Game[]>(...queryKey),
    {
      enabled: typeof gameQueryOffset === "number",
      select(game) {
        return fixGameData(game[0]);
      },
    }
  );

  const handleGuess = (guessedGame: Game) => {
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
