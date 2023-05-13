import Balancer from "react-wrap-balancer";

import * as classes from "./style.module.css";

import { Game } from "~/src/lib/data";
import { Outcome } from "~/src/lib/compareGames";
import { Hint } from "~/src/components/Hint";

const availableInformation = [
  "collection",
  "releaseYear",
  "platforms",
  "genres",
  "themes",
  "playerPerspectives",
  "gameModes",
  "gameEngines",
  "involvedCompanies",
] as const;

type Props = {
  guess: Game;
  comparison: Record<string, Outcome>;
};

export function Guess({ guess, comparison }: Props) {
  return (
    <div className={classes.guess}>
      <a href={guess.url} target="_blank" rel="noreferrer">
        <Balancer as="h1">{guess.name}</Balancer>
      </a>

      <ul>
        {availableInformation.map((key) => (
          <li key={key}>
            <Hint outcome={comparison[key]} game={guess} attribute={key} />
          </li>
        ))}
      </ul>
    </div>
  );
}
