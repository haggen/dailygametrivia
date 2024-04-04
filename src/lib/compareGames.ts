import { Game } from "~/src/lib/data";

export enum Outcome {
  Exact = "exact",
  Partial = "partial",
  Mismatch = "mismatch",
  Higher = "higher",
  Lower = "lower",
}

function compareName(a: Game, b: Game): Outcome {
  if (a.name === b.name) {
    return Outcome.Exact;
  }
  return Outcome.Mismatch;
}

function compareReleaseYear(a: Game, b: Game): Outcome {
  if (a.releaseYear === b.releaseYear) {
    return Outcome.Exact;
  } else if (a.releaseYear > b.releaseYear) {
    return Outcome.Higher;
  } else if (a.releaseYear < b.releaseYear) {
    return Outcome.Lower;
  }
  return Outcome.Mismatch;
}

function compareLists<T extends { id: number }>(
  a: T[],
  b: T[],
  compare = (a: T, b: T) => a.id === b.id,
): Outcome {
  const intersection = a.filter((a) => b.some((b) => compare(a, b)));
  if (intersection.length === a.length && intersection.length === b.length) {
    return Outcome.Exact;
  }
  if (intersection.length > 0) {
    return Outcome.Partial;
  }
  return Outcome.Mismatch;
}

function comparePlatforms(a: Game, b: Game): Outcome {
  return compareLists(a.platforms, b.platforms);
}

function compareThemes(a: Game, b: Game): Outcome {
  return compareLists(a.themes, b.themes);
}

function compareGenres(a: Game, b: Game): Outcome {
  return compareLists(a.genres, b.genres);
}

function comparePlayerPerspectives(a: Game, b: Game): Outcome {
  return compareLists(a.playerPerspectives, b.playerPerspectives);
}

function compareEngines(a: Game, b: Game): Outcome {
  return compareLists(a.gameEngines, b.gameEngines);
}

function compareModes(a: Game, b: Game): Outcome {
  return compareLists(a.gameModes, b.gameModes);
}

function compareCollection(a: Game, b: Game): Outcome {
  if (a.collection.id === b.collection.id) {
    return Outcome.Exact;
  }
  return Outcome.Mismatch;
}

function compareInvolvedCompanies(a: Game, b: Game): Outcome {
  return compareLists(
    a.involvedCompanies,
    b.involvedCompanies,
    (a, b) => a.company.id === b.company.id,
  );
}

function compareId(a: Game, b: Game): Outcome {
  if (a.id === b.id) {
    return Outcome.Exact;
  }
  return Outcome.Mismatch;
}

export function compareGames(a: Game, b: Game) {
  return {
    id: compareId(a, b),
    name: compareName(a, b),
    releaseYear: compareReleaseYear(a, b),
    platforms: comparePlatforms(a, b),
    themes: compareThemes(a, b),
    genres: compareGenres(a, b),
    playerPerspectives: comparePlayerPerspectives(a, b),
    involvedCompanies: compareInvolvedCompanies(a, b),
    gameEngines: compareEngines(a, b),
    gameModes: compareModes(a, b),
    collection: compareCollection(a, b),
  } as const;
}
