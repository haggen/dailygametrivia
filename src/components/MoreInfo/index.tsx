import { Game } from "~/src/lib/data";

type Props = {
  game: Game;
};

export function MoreInfo({ game }: Props) {
  const url = new URL("https://www.youtube.com/results?search_query=");
  url.searchParams.set("search_query", game.name + " gameplay");

  return (
    <a href={url.toString()} target="_blank" rel="noreferrer">
      {game.name}
    </a>
  );
}
