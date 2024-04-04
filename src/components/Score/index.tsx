import * as classes from "./style.module.css";

import { pluralize } from "~/src/lib/pluralize";
import { Icon } from "~/src/components/Icon";

type Props = {
  remaining: number;
  initial: number;
  level: number;
};

export function Score({ remaining, initial, level }: Props) {
  return (
    <header className={classes.score} aria-label="Game score">
      <figure
        aria-label={pluralize(
          remaining,
          "1 attempt left",
          `${remaining} attempts left`,
        )}
      >
        {Array(initial)
          .fill(null)
          .map((_, i) =>
            remaining > i ? (
              <Icon key={i} name="heart" color="var(--color-red)" />
            ) : (
              <Icon key={i} name="heart" color="var(--color-text-dimmed)" />
            ),
          )}
      </figure>

      <span aria-label={`Level ${level}`}>Lv.{level}</span>
    </header>
  );
}
