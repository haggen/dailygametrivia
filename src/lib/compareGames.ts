import { Game } from "src/lib/api";

export type Match = "exact" | "partial" | "mismatch" | "greater" | "lesser";

export function compareGames(a: Game, b: Game) {
  const results: Record<string, Match> = {
    name: "mismatch",
    first_release_date: "mismatch",
  };

  if (a.name === b.name) {
    results.name = "exact";
  }

  if (a.first_release_date === b.first_release_date) {
    results.first_release_date = "exact";
  } else if (a.first_release_date > b.first_release_date) {
    results.first_release_date = "greater";
  } else if (a.first_release_date < b.first_release_date) {
    results.first_release_date = "lesser";
  }

  return results;
}
