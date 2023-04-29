import { Game } from "~/src/lib/database";

export type Match = "exact" | "partial" | "mismatch" | "higher" | "lower";

function compareName(a: Game, b: Game): Match {
  if (a.name === b.name) {
    return "exact";
  }
  return "mismatch";
}

function compareReleaseDate(a: Game, b: Game): Match {
  const ya = new Date(a.firstReleaseDate * 1000).getFullYear();
  const yb = new Date(b.firstReleaseDate * 1000).getFullYear();

  if (ya === yb) {
    return "exact";
  } else if (ya > yb) {
    return "higher";
  } else if (ya < yb) {
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
    id: a.id === b.id ? "exact" : "mismatch",
    name: compareName(a, b),
    firstReleaseDate: compareReleaseDate(a, b),
    platforms: comparePlatforms(a, b),
    genres: compareGenres(a, b),
    playerPerspectives: comparePlayerPerspectives(a, b),
    involvedCompanies: compareInvolvedCompanies(a, b),
    gameEngines: compareEngines(a, b),
    gameModes: compareModes(a, b),
    collection: compareCollection(a, b),
  } as const;
}
