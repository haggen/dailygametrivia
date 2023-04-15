/**
 * Twitch's IGDB API, proxied.
 * @see https://api-docs.igdb.com/#endpoints
 */

/**
 * Game type.
 */
export type Game = {
  id: number;
  name: string;
  first_release_date: number;
};

/**
 * Response type.
 */
type Response<T> = T[];

/**
 * Post to IGDB.
 */
export async function post<T>(pathname: string, body: string) {
  const url = new URL("https://d3cui0qbfwctuu.cloudfront.net");
  url.pathname = pathname;
  const response = await fetch(url, { method: "POST", body });
  return (await response.json()) as Response<T>;
}

/**
 * Default criteria when guessing games.
 */
export const defaultCriteria = "category = (0, 2, 4) & aggregated_rating > 50";
