import * as classes from "./style.module.css";

import { compareGames, Match } from "~/src/lib/compareGames";
import { Game } from "~/src/lib/data";

const MATCH_KEYS: Array<MatchAttributeKey> = [
  "platforms",
  "genres",
  "playerPerspectives",
  "gameModes",
  "gameEngines",
  "involvedCompanies",
];

type MatchAttributeKey =
  | "platforms"
  | "genres"
  | "playerPerspectives"
  | "gameModes"
  | "gameEngines"
  | "involvedCompanies";

type MatchAttributeValue = {
  abbreviation?: string;
  name?: string;
};

type MatchAttribute = Record<MatchAttributeKey, MatchAttributeValue>;

type Props = {
  history: Game[];
  secretGame: Game;
};

type YearsRange = [number, number];

function getYearsRange(secretGame: Game, guessedGames: Game[]): YearsRange {
  const yearsRange: YearsRange = [1957, new Date().getFullYear()];

  for (const guessedGame of guessedGames) {
    if (guessedGame.releaseYear == secretGame.releaseYear) {
      yearsRange[0] = guessedGame.releaseYear;
      yearsRange[1] = guessedGame.releaseYear;
    }
    if (
      guessedGame.releaseYear > secretGame.releaseYear &&
      guessedGame.releaseYear < yearsRange[1]
    ) {
      yearsRange[1] = guessedGame.releaseYear - 1;
    }
    if (
      guessedGame.releaseYear < secretGame.releaseYear &&
      guessedGame.releaseYear > yearsRange[0]
    ) {
      yearsRange[0] = guessedGame.releaseYear + 1;
    }
  }

  return yearsRange;
}

function getExactMatches(secretGame: Game, guessedGames: Game[]) {
  const matches: MatchAttribute | object = {};
  for (const guessedGame of guessedGames) {
    const comparison: Record<string, Match> = compareGames(
      secretGame,
      guessedGame
    );
    for (const key of MATCH_KEYS) {
      if (comparison[key] == "exact") {
        if (key == "involvedCompanies") {
          matches[key] = guessedGame[key].map((item) => item.company);
        } else {
          matches[key] = guessedGame[key];
        }
      }
    }
  }
  return matches;
}

function concatMatchAttribute(
  items: { abbreviation?: string; name?: string }[]
): string {
  return items
    .map((item) => item.abbreviation || item.name)
    .filter((value) => value !== undefined)
    .join(", ");
}

function getSummaryText(
  yearsRange: YearsRange,
  matches: Record<string, [object]>
) {
  let yearRangeText = "";
  let matchTexts: string[] = [];
  if (yearsRange) {
    // if both years are the same (player guessed the secret game year), no need to show both
    yearRangeText =
      yearsRange[0] == yearsRange[1]
        ? `${yearsRange[0]}`
        : `${yearsRange[0]}-${yearsRange[1]}`;
  }

  if (matches) {
    // concat the matches of the same type
    // example: Shooter, RPG, Adventure (genres)
    matchTexts = Object.entries(matches).map((entry) =>
      concatMatchAttribute(entry[1])
    );
  }

  // concat the different match types
  // example: 2011-2020 ◆ Shooter, Adventure ◆ SinglePlayer
  return [yearRangeText, ...matchTexts].join(" ◆ ");
}

export function Summary({ history, secretGame }: Props) {
  if (!history.length) return null;
  const yearsRange: YearsRange = getYearsRange(secretGame, history);
  const matches: Record<string, [object]> = getExactMatches(
    secretGame,
    history
  );

  const summaryText = getSummaryText(yearsRange, matches);
  return <span className={classes.summary}>{summaryText}</span>;
}
