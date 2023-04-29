import { CSSProperties, useState } from "react";
import Balancer from "react-wrap-balancer";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";

const pages = [
  <>You have 10 attempts to find out the secret game of the day.</>,
  <>
    With each guess we'll compare attributes such as year of release, genres,
    player's perspective, game modes and more.
  </>,
  <>
    To each attribute we'll give a hint of either{" "}
    <strong style={{ color: "var(--color-green)" }}>exact</strong>,{" "}
    <strong style={{ color: "var(--color-yellow)" }}>partial</strong> or{" "}
    <strong style={{ color: "var(--color-red)" }}>mismatch</strong>.
  </>,
  <>If you win you'll get to keep playing with a new game to figure out.</>,
  <>But if you lose you'll have to wait for tomorrow's game.</>,
  <>Take your first guess to start and good luck!</>,
];

type Props = {
  style?: CSSProperties;
};

export function Help({ style }: Props) {
  const [index, setIndex] = useState(0);

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (index < pages.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <article className={classes.help} style={style}>
      <p>
        <Balancer>{pages[index]}</Balancer>
      </p>
      <ul>
        <li>
          <Button onClick={handleBack} disabled={index === 0}>
            Back
          </Button>
        </li>
        <li>
          <Button onClick={handleNext} disabled={index === pages.length - 1}>
            Next
          </Button>
        </li>
      </ul>
    </article>
  );
}
