import Balancer from "react-wrap-balancer";
import { useState } from "react";
import { createPortal } from "react-dom";

import classes from "./style.module.css";

import { Icon } from "~/src/components/Icon";
import { Outcome } from "~/src/lib/compareGames";
import { Game } from "~/src/lib/data";
import { Tooltip } from "~/src/components/Tooltip";
import { ClassList } from "~/src/lib/classList";

function getIcon(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return <Icon name="exact" className={classes.icon} />;
    case Outcome.Partial:
      return <Icon name="partial" className={classes.icon} />;
    case Outcome.Mismatch:
      return <Icon name="mismatch" className={classes.icon} />;
    case Outcome.Higher:
      return <Icon name="higher" className={classes.icon} />;
    case Outcome.Lower:
      return <Icon name="lower" className={classes.icon} />;
    default:
      throw new Error(`Unknown outcome: ${outcome}`);
  }
}

function getDescription<T extends keyof Game>(key: T, game: Game) {
  switch (key) {
    case "releaseYear":
      return game.releaseYear;
    case "genres":
      return game.genres.map((genre) => genre.name).join(", ");
    case "platforms":
      return game.platforms
        .map((platform) => platform.abbreviation ?? platform.name)
        .join(", ");
    case "playerPerspectives":
      return game.playerPerspectives
        .map((platform) => platform.name)
        .join(", ");
    case "gameEngines":
      return game.gameEngines.map((engine) => engine.name).join(", ");
    case "gameModes":
      return game.gameModes.map((mode) => mode.name).join(", ");
    case "collection":
      return game.collection.name;
    case "involvedCompanies":
      return game.involvedCompanies
        .map((involvement) => involvement.company.name)
        .join(", ");
    default:
      return `(${key}) ${JSON.stringify(game[key])}`;
  }
}

function getPartialTooltip(name: string, outcome: Outcome) {
  if (outcome === Outcome.Exact) {
    return (
      <>
        The game has exactly these <strong>{name}</strong>.
      </>
    );
  }
  if (outcome === Outcome.Partial) {
    return (
      <>
        The game has one or more of these <strong>{name}</strong>.
      </>
    );
  }
  return (
    <>
      The game doesn't have any of these <strong>{name}</strong>.
    </>
  );
}

function getTooltip(attribute: keyof Game, outcome: Outcome) {
  switch (attribute) {
    case "releaseYear":
      if (outcome === Outcome.Higher) {
        return (
          <>
            The game was <strong>released</strong> later than this year.
          </>
        );
      }
      if (outcome === Outcome.Lower) {
        return (
          <>
            The game was <strong>released</strong> earlier than this year.
          </>
        );
      }
      return (
        <>
          The game was <strong>released</strong> in this year.
        </>
      );
    case "genres":
      return getPartialTooltip("genres", outcome);
    case "platforms":
      return getPartialTooltip("platforms", outcome);
    case "playerPerspectives":
      return getPartialTooltip("perspectives", outcome);
    case "gameEngines":
      return getPartialTooltip("engines", outcome);
    case "gameModes":
      return getPartialTooltip("modes", outcome);
    case "collection":
      if (outcome === Outcome.Exact) {
        return (
          <>
            The game belongs to this <strong>series</strong>.
          </>
        );
      }
      return (
        <>
          The game doesn't belong to this <strong>series</strong>.
        </>
      );
    case "involvedCompanies":
      return getPartialTooltip("companies", outcome);
    default:
      return `(${attribute}) ${outcome}`;
  }
}

const tooltipColors = {
  [Outcome.Exact]: "green",
  [Outcome.Partial]: "yellow",
  [Outcome.Mismatch]: "red",
  [Outcome.Higher]: "red",
  [Outcome.Lower]: "red",
};

type Props = {
  game: Game;
  attribute: keyof Game;
  outcome: Outcome;
};

export function Hint({ game, attribute, outcome }: Props) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [tooltip, setTooltip] = useState(false);

  const handleClick = () => {
    setTooltip(true);
  };

  const handleMouseEnter = () => {
    setTooltip(true);
  };

  const handleMouseLeave = () => {
    setTooltip(false);
  };

  const classList = new ClassList(classes.hint);
  if (outcome === Outcome.Exact) {
    classList.add(classes.exact);
  } else if (outcome === Outcome.Partial) {
    classList.add(classes.partial);
  } else if (outcome === Outcome.Mismatch) {
    classList.add(classes.mismatch);
  } else if (outcome === Outcome.Higher) {
    classList.add(classes.higher);
  } else if (outcome === Outcome.Lower) {
    classList.add(classes.lower);
  }

  return (
    <div
      ref={setElement}
      className={String(classList)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getIcon(outcome)}
      <Balancer>{getDescription(attribute, game)}</Balancer>

      {createPortal(
        <Tooltip
          reference={element}
          active={tooltip}
          color={tooltipColors[outcome]}
          offset={{ mainAxis: -6, crossAxis: 14 }}
        >
          <p>{getTooltip(attribute, outcome)}</p>
        </Tooltip>,
        document.body
      )}
    </div>
  );
}
