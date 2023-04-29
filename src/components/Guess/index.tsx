import Balancer from "react-wrap-balancer";

import * as classes from "./style.module.css";

import { Game } from "~/src/lib/data";
import { Icon } from "~/src/components/Icon";
import { Match } from "~/src/lib/compareGames";

function getIcon(match: Match) {
  switch (match) {
    case "exact":
      return <Icon name="exact" />;
    case "partial":
      return <Icon name="partial" />;
    case "mismatch":
      return <Icon name="mismatch" />;
    case "higher":
      return <Icon name="higher" />;
    case "lower":
      return <Icon name="lower" />;
    default:
      return <>?</>;
  }
}

function format<T extends keyof Game>(key: T, game: Game) {
  switch (key) {
    case "releaseYear":
      return <>{game.releaseYear}</>;
    case "genres":
      return <>{game.genres.map((genre) => genre.name).join(", ")}</>;
    case "platforms":
      return (
        <>
          {game.platforms
            .map((platform) => platform.abbreviation ?? platform.name)
            .join(", ")}
        </>
      );
    case "playerPerspectives":
      return (
        <>
          {game.playerPerspectives.map((platform) => platform.name).join(", ")}
        </>
      );
    case "gameEngines":
      return <>{game.gameEngines.map((engine) => engine.name).join(", ")}</>;
    case "gameModes":
      return <>{game.gameModes.map((mode) => mode.name).join(", ")}</>;
    case "collection":
      return <>{game.collection.name}</>;
    case "involvedCompanies":
      return (
        <>
          {game.involvedCompanies
            .map((involvement) => involvement.company.name)
            .join(", ")}
        </>
      );
    default:
      return (
        <>
          {key}: {String(game[key])}
        </>
      );
  }
}

const displayableComparisons = [
  "collection",
  "releaseYear",
  "platforms",
  "genres",
  "playerPerspectives",
  "gameModes",
  "gameEngines",
  "involvedCompanies",
] as const;

type Props = {
  guess: Game;
  comparison: Record<string, Match>;
};

export function Guess({ guess, comparison }: Props) {
  return (
    <article className={classes.guess}>
      <h1>
        <Balancer>{guess.name}</Balancer>
      </h1>
      <ul>
        {displayableComparisons.map((key) => (
          <li key={key} className={classes[comparison[key]]}>
            <span style={{ flex: "0 0 1rem", lineHeight: 1.25 }}>
              {getIcon(comparison[key])}
            </span>
            <span>{format(key, guess)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
