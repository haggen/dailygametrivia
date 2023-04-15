import { useQuery } from "@tanstack/react-query";
import { Guesser } from "src/components/Guesser";
import { post } from "src/lib/api";
import { getTodaysGameId } from "src/lib/todaysGame";

import classes from "./style.module.css";

export function Layout() {
  const todaysGameId = getTodaysGameId();
  const query = `
    fields name;
    where id = ${todaysGameId};
  `;
  const { data } = useQuery(["games", query], () => post("/v4/games", query));

  const handleGuess = (guess) => {
    console.log({ guess });
  };

  return (
    <>
      {data?.[0].name}
      <Guesser onGuess={handleGuess} />
    </>
  );
}
