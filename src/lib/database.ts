import { match } from "~/src/lib/search";

/**
 * Game type.
 */
export type Game = {
  id: number;
  name: string;
  firstReleaseDate: number;
  platforms: { id: number; name: string; abbreviation?: string }[];
  genres: { id: number; name: string }[];
  playerPerspectives: { id: number; name: string }[];
  gameEngines: { id: number; name: string }[];
  collection: { id: number; name: string };
  gameModes: { id: number; name: string }[];
  involvedCompanies: { id: number; company: { id: number; name: string } }[];
};

/**
 * Database type.
 */
type Database = {
  games: Record<string, Game>;
  count: number;
};

let database: Database;

/**
 * Load and return the database.
 */
export async function getDatabase() {
  if (!database) {
    database = await import("~/src/database.json");
  }
  return database;
}

/**
 * Search games in the database and return sorted results.
 */
export function search(query: string, limit = 50) {
  const games = Object.values(database.games);
  const results = [];

  for (const game of games) {
    if (match(query, game.name)) {
      results.push(game);
    }

    if (results.length === limit) {
      break;
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
