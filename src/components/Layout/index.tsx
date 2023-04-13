import { useQuery } from "@tanstack/react-query";
import { GuessForm } from "src/components/GuessForm";
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

  return (
    <>
      {data?.[0].name}
      <GuessForm />
    </>
  );
}
