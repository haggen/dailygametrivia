import { TGame } from "~/src/lib/api";

export type Match = "exact" | "partial" | "mismatch" | "higher" | "lower";

function compareName(a: TGame, b: TGame): Match {
  if (a.name === b.name) {
    return "exact";
  }
  return "mismatch";
}

function compareReleaseYear(a: TGame, b: TGame): Match {
  const ya = new Date(a.first_release_date * 1000).getFullYear();
  const yb = new Date(b.first_release_date * 1000).getFullYear();

  if (ya === yb) {
    return "exact";
  } else if (ya > yb) {
    return "higher";
  } else if (ya < yb) {
    return "lower";
  }
  return "mismatch";
}

function compareRelationships<T extends { id: number }>(a: T[], b: T[]): Match {
  const intersection = a.filter((a) => b.some((b) => a.id === b.id));
  if (intersection.length === a.length && intersection.length === b.length) {
    return "exact";
  }
  if (intersection.length > 0) {
    return "partial";
  }
  return "mismatch";
}

function comparePlatforms(a: TGame, b: TGame): Match {
  return compareRelationships(a.platforms, b.platforms);
}

function compareGenres(a: TGame, b: TGame): Match {
  return compareRelationships(a.genres, b.genres);
}

function comparePlayerPerspectives(a: TGame, b: TGame): Match {
  return compareRelationships(a.player_perspectives, b.player_perspectives);
}

function compareEngines(a: TGame, b: TGame): Match {
  return compareRelationships(a.game_engines, b.game_engines);
}

function compareModes(a: TGame, b: TGame): Match {
  return compareRelationships(a.game_modes, b.game_modes);
}

function compareInvolvedCompanies(a: TGame, b: TGame): Match {
  const intersection = a.involved_companies.filter((a) =>
    b.involved_companies.some((b) => a.company.id === b.company.id)
  );
  if (
    intersection.length === a.involved_companies.length &&
    intersection.length === b.involved_companies.length
  ) {
    return "exact";
  }
  if (intersection.length > 0) {
    return "partial";
  }
  return "mismatch";
}

export function compareGames(a: TGame, b: TGame) {
  return {
    id: a.id === b.id ? "exact" : "mismatch",
    name: compareName(a, b),
    first_release_date: compareReleaseYear(a, b),
    platforms: comparePlatforms(a, b),
    genres: compareGenres(a, b),
    player_perspectives: comparePlayerPerspectives(a, b),
    involved_companies: compareInvolvedCompanies(a, b),
    game_engines: compareEngines(a, b),
    game_modes: compareModes(a, b),
  } as const;
}
