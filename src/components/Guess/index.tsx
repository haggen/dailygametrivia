import * as classes from "./style.module.css";

import { TGame } from "~/src/lib/api";
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

function format<T extends keyof TGame>(key: T, game: TGame) {
  switch (key) {
    case "first_release_date":
      return <>{new Date(game.first_release_date * 1000).getFullYear()}</>;
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
    case "player_perspectives":
      return (
        <>
          {game.player_perspectives.map((platform) => platform.name).join(", ")}
        </>
      );
    case "game_engines":
      return <>{game.game_engines.map((engine) => engine.name).join(", ")}</>;
    case "game_modes":
      return <>{game.game_modes.map((mode) => mode.name).join(", ")}</>;
    case "involved_companies":
      return (
        <>
          {game.involved_companies
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
  "first_release_date",
  "platforms",
  "genres",
  "player_perspectives",
  "game_modes",
  "game_engines",
  "involved_companies",
] as const;

type Props = {
  guess: TGame;
  comparison: Record<string, Match>;
};

export function Guess({ guess, comparison }: Props) {
  return (
    <article className={classes.guess}>
      <h1>{guess.name}</h1>
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
