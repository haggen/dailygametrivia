/**
 * Twitch's IGDB API.
 * @see https://api-docs.igdb.com/#endpoints
 */

/**
 * Game type.
 */
export type Game = {
  id: number;
  name: string;
  first_release_date: number;
  platforms: { id: number; name: string; abbreviation?: string }[];
  genres: { id: number; name: string }[];
  player_perspectives: { id: number; name: string }[];
  game_engines: { id: number; name: string }[];
  collection: { id: number; name: string };
  game_modes: { id: number; name: string }[];
  involved_companies: { id: number; company: { id: number; name: string } }[];
};

export type Options = {
  fields?: string;
  search?: string;
  where?: string;
  limit?: number;
  offset?: number;
};

/**
 * Serialize request options.
 */
function serialize(options: Options) {
  const copy = { ...options };
  if (copy.search) {
    copy.search = `"${copy.search}"`;
  }
  return Object.keys(copy)
    .map((key) => `${key} ${copy[key as keyof Options]};`)
    .join("\n");
}

/**
 * Post to IGDB.
 */
export async function post<T>(pathname: string, options: Options) {
  const url = new URL("https://d3cui0qbfwctuu.cloudfront.net");
  url.pathname = pathname;
  const response = await fetch(url, {
    method: "POST",
    body: serialize(options),
  });
  return (await response.json()) as Promise<T>;
}

/**
 * Fix missing data.
 */
export function fixGameData(game: Semipartial<Game, "id" | "name">) {
  if (!game.game_engines) {
    game.game_engines = [{ id: 0, name: "Unknown Engine" }];
  }
  if (!game.collection) {
    game.collection = { id: game.id, name: game.name };
  }
  return game as Game;
}

/**
 * Selected platforms.
 */
const selectedPlatformIds = [
  6, // PC (Microsoft Windows)

  11, // Xbox
  12, // Xbox 360
  49, // Xbox One
  169, // Xbox Series X|S

  7, // PlayStation
  8, // PlayStation 2
  9, // PlayStation 3
  48, // PlayStation 4
  167, // PlayStation 5

  19, // Super Nintendo Entertainment System
  4, // Nintendo 64
  24, // Game Boy Advance
  21, // Nintendo GameCube
  41, // Wii U
  130, // Nintendo Switch
];

const selectedCategories = [
  0, // Main Game
  4, // Expansion
];

const minimumRating = 1;
const minimumRatingCount = 50;

/**
 * Default game criteria.
 */
export const defaultGameCriteria = `category = (${selectedCategories}) & platforms = (${selectedPlatformIds}) & total_rating > ${minimumRating} & total_rating_count > ${minimumRatingCount} & version_parent = null & name != null & first_release_date != null & genres != null & player_perspectives != null & involved_companies != null & game_modes != null`;

/**
 * Default game fields.
 */
export const defaultGameFields =
  "name, first_release_date, genres.name, player_perspectives.name, involved_companies.company.name, platforms.name, platforms.abbreviation, game_engines.name, game_modes.name, franchise.name, collection.name";
