import * as classes from "./style.module.css";

type Props = {
  score: number;
};

export function Score({ score }: Props) {
  return <span className={classes.score}>×{score}</span>;
}
