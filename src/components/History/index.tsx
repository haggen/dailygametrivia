import { useEffect } from "react";

import * as classes from "./style.module.css";

import { compareGames } from "~/src/lib/compareGames";
import { Guess } from "~/src/components/Guess";
import { Game } from "~/src/lib/data";

type Props = {
  history: Game[];
  mysteryGame: Game;
};

export function History({ history, mysteryGame }: Props) {
  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  });

  const reversed = history.concat().reverse();

  return (
    <ol className={classes.history}>
      {reversed.map((game, index) => (
        <li key={index} className={classes.item}>
          <div className={classes.attempt}>{history.length - index}</div>
          <Guess guess={game} comparison={compareGames(mysteryGame, game)} />
        </li>
      ))}
    </ol>
  );
}
