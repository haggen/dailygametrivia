/**
 * Game type.
 */
export type Game = {
  id: number;
  name: string;
  first_release_date: number;
};

type Response = Game[];

/**
 * Post to IGDB.
 */
export async function post(pathname: string, body: string) {
  const url = new URL("https://d3cui0qbfwctuu.cloudfront.net");
  url.pathname = pathname;
  const response = await fetch(url, { method: "POST", body });
  return (await response.json()) as Response;
}
