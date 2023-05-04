import { Game } from "~/src/lib/data";

export type Match = "exact" | "partial" | "mismatch" | "higher" | "lower";

function compareName(a: Game, b: Game): Match {
  if (a.name === b.name) {
    return "exact";
  }
  return "mismatch";
}

function compareReleaseYear(a: Game, b: Game): Match {
  if (a.releaseYear === b.releaseYear) {
    return "exact";
  } else if (a.releaseYear > b.releaseYear) {
    return "higher";
  } else if (a.releaseYear < b.releaseYear) {
    return "lower";
  }
  return "mismatch";
}

function compareLists<T extends { id: number }>(a: T[], b: T[]): Match {
  const intersection = a.filter((a) => b.some((b) => a.id === b.id));
  if (intersection.length === a.length && intersection.length === b.length) {
    return "exact";
  }
  if (intersection.length > 0) {
    return "partial";
  }
  return "mismatch";
}

function comparePlatforms(a: Game, b: Game): Match {
  return compareLists(a.platforms, b.platforms);
}

function compareGenres(a: Game, b: Game): Match {
  return compareLists(a.genres, b.genres);
}

function comparePlayerPerspectives(a: Game, b: Game): Match {
  return compareLists(a.playerPerspectives, b.playerPerspectives);
}

function compareEngines(a: Game, b: Game): Match {
  return compareLists(a.gameEngines, b.gameEngines);
}

function compareModes(a: Game, b: Game): Match {
  return compareLists(a.gameModes, b.gameModes);
}

function compareCollection(a: Game, b: Game): Match {
  if (a.collection.id === b.collection.id) {
    return "exact";
  }
  return "mismatch";
}

function compareInvolvedCompanies(a: Game, b: Game): Match {
  const intersection = a.involvedCompanies.filter((a) =>
    b.involvedCompanies.some((b) => a.company.id === b.company.id)
  );
  if (
    intersection.length === a.involvedCompanies.length &&
    intersection.length === b.involvedCompanies.length
  ) {
    return "exact";
  }
  if (intersection.length > 0) {
    return "partial";
  }
  return "mismatch";
}

export function compareGames(a: Game, b: Game) {
  return {
    id: (a.id === b.id ? "exact" : "mismatch") as Match,
    name: compareName(a, b),
    releaseYear: compareReleaseYear(a, b),
    platforms: comparePlatforms(a, b),
    genres: compareGenres(a, b),
    playerPerspectives: comparePlayerPerspectives(a, b),
    involvedCompanies: compareInvolvedCompanies(a, b),
    gameEngines: compareEngines(a, b),
    gameModes: compareModes(a, b),
    collection: compareCollection(a, b),
  } as const;
}
