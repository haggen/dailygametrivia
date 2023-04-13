import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useId, useState } from "react";
import { debounce } from "src/lib/debounce";

import { Input } from "src/components/Input";
import { post } from "src/lib/api";

import classes from "./style.module.css";

const debouncedPost = debounce(post, 500);

function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const id = useId();
  return {
    id,
    value,
    onChange: (event: ChangeEvent) => {
      if ("value" in event.currentTarget) {
        setValue(event.currentTarget.value as string);
      }
    },
  };
}

export function GuessForm() {
  const input = useInput();
  const query = `
    fields name, first_release_date;
    search "${input.value.replace('"', `\"`)}";
    where category = 0 & aggregated_rating_count > 10;
  `;
  const { data: dataList } = useQuery(
    ["games", query],
    () => debouncedPost("/v4/games", query),
    {
      enabled: input.value.length > 0,
      select(data) {
        return data.map((game) => {
          const release = new Date(game.first_release_date * 1000);
          return {
            value: String(game.id),
            children: `${game.name} (${release.getFullYear()})`,
          };
        });
      },
    }
  );

  return (
    <form>
      <Input type="search" {...input} dataList={dataList} autoComplete="off" />
      <button type="submit">Guess</button>
    </form>
  );
}
