import * as classes from "./style.module.css";

import { compareGames } from "~/src/lib/compareGames";
import { Guess } from "~/src/components/Guess";
import { Game } from "~/src/lib/database";

type Props = {
  history: Game[];
  gameOfTheDay: Game;
};

export function History({ history, gameOfTheDay }: Props) {
  const reversed = history.concat().reverse();

  return (
    <ol className={classes.history}>
      {reversed.map((game, index) => (
        <li key={index}>
          <span className={classes.attempt}>{history.length - index}</span>
          <Guess guess={game} comparison={compareGames(gameOfTheDay, game)} />
        </li>
      ))}
    </ol>
  );
}
