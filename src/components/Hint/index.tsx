import Balancer from "react-wrap-balancer";
import { useRef } from "react";

import classes from "./style.module.css";

import { Icon } from "~/src/components/Icon";
import { Outcome } from "~/src/lib/compareGames";
import { Game } from "~/src/lib/data";
import { useTooltip } from "~/src/components/Tooltip";
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
      throw new Error(`Unknown outcome "${outcome}"`);
  }
}

function getReleaseYearLabel(game: Game) {
  return game.releaseYear;
}

function getGenresLabel(game: Game) {
  return game.genres.map((genre) => genre.name).join(", ");
}

function getThemesLabel(game: Game) {
  return game.themes.map((theme) => theme.name).join(", ");
}

function getPlatformsLabel(game: Game) {
  return game.platforms
    .map((platform) => platform.abbreviation ?? platform.name)
    .join(", ");
}

function getPlayerPerspectivesLabel(game: Game) {
  return game.playerPerspectives.map((platform) => platform.name).join(", ");
}

function getEnginesLabel(game: Game) {
  return game.gameEngines.map((engine) => engine.name).join(", ");
}

function getModesLabel(game: Game) {
  return game.gameModes.map((mode) => mode.name).join(", ");
}

function getCollectionLabel(game: Game) {
  return game.collection.name;
}

function getCompaniesLabel(game: Game) {
  return game.involvedCompanies
    .map((involvement) => involvement.company.name)
    .join(", ");
}

function getLabel(attribute: keyof Game, game: Game) {
  switch (attribute) {
    case "collection":
      return getCollectionLabel(game);
    case "releaseYear":
      return getReleaseYearLabel(game);
    case "platforms":
      return getPlatformsLabel(game);
    case "genres":
      return getGenresLabel(game);
    case "themes":
      return getThemesLabel(game);
    case "playerPerspectives":
      return getPlayerPerspectivesLabel(game);
    case "gameModes":
      return getModesLabel(game);
    case "gameEngines":
      return getEnginesLabel(game);
    case "involvedCompanies":
      return getCompaniesLabel(game);
    default:
      throw new Error(`Missing label for "${attribute}"`);
  }
}

function getReleaseYearTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Higher:
      return (
        <>
          The game's <strong>release year</strong> is higher.
        </>
      );

    case Outcome.Lower:
      return (
        <>
          The game's <strong>release year</strong> is lower.
        </>
      );

    case Outcome.Exact:
      return (
        <>
          The game's <strong>release year</strong> is exact.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome} for release year"`);
  }
}

function getGenresTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game has exactly these <strong>genres</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game has one or more of these <strong>genres</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't have any of these <strong>genres</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome}" for genres`);
  }
}

function getThemesTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game has exactly these <strong>themes</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game has one or more of these <strong>themes</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't have any of these <strong>themes</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome}" for themes`);
  }
}

function getPlatformsTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game has exactly these <strong>platforms</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game has one or more of these <strong>platforms</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't have any of these <strong>platforms</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome}" for platforms`);
  }
}

function getPerspectivesTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game has exactly these <strong>perspectives</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game has one or more of these <strong>perspectives</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't have any of these <strong>perspectives</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome}" for perspectives`);
  }
}

function getEnginesTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game uses exactly these <strong>engines</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game uses one or more of these <strong>engines</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't use any of these <strong>engines</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome}" for engines`);
  }
}

function getModesTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game has exactly these <strong>modes</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game has one or more of these <strong>modes</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't have any of these <strong>modes</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome}" for modes`);
  }
}

function getCollectionTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game belongs to this <strong>series</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't belong to this <strong>series</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome} for collection"`);
  }
}

function getCompaniesTooltip(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return (
        <>
          The game involves exactly these <strong>companies</strong>.
        </>
      );
    case Outcome.Partial:
      return (
        <>
          The game involves one or more of these <strong>companies</strong>.
        </>
      );
    case Outcome.Mismatch:
      return (
        <>
          The game doesn't involve any of these <strong>companies</strong>.
        </>
      );
    default:
      throw new Error(`Invalid outcome "${outcome} for involved companies"`);
  }
}

function getTooltip(attribute: keyof Game, outcome: Outcome) {
  switch (attribute) {
    case "collection":
      return getCollectionTooltip(outcome);
    case "releaseYear":
      return getReleaseYearTooltip(outcome);
    case "genres":
      return getGenresTooltip(outcome);
    case "themes":
      return getThemesTooltip(outcome);
    case "platforms":
      return getPlatformsTooltip(outcome);
    case "playerPerspectives":
      return getPerspectivesTooltip(outcome);
    case "gameModes":
      return getModesTooltip(outcome);
    case "gameEngines":
      return getEnginesTooltip(outcome);
    case "involvedCompanies":
      return getCompaniesTooltip(outcome);
    default:
      throw new Error(`Missing tooltip for "${attribute}"`);
  }
}

function getTooltipColor(outcome: Outcome) {
  switch (outcome) {
    case Outcome.Exact:
      return "green";
    case Outcome.Partial:
      return "yellow";
    case Outcome.Mismatch:
      return "red";
    case Outcome.Higher:
      return "red";
    case Outcome.Lower:
      return "red";
    default:
      throw new Error(`Unknown color for "${outcome}"`);
  }
}

type Props = {
  game: Game;
  attribute: keyof Game;
  outcome: Outcome;
};

export function Hint({ game, attribute, outcome }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);
  const tooltip = useTooltip();

  const showTooltip = () => {
    tooltip.set({
      reference: elementRef.current,
      children: getTooltip(attribute, outcome),
      color: getTooltipColor(outcome),
      offset: { crossAxis: 0, mainAxis: 0 },
    });
  };

  const handleClick = () => {
    showTooltip();
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    tooltip.clear();
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
      ref={elementRef}
      className={String(classList)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getIcon(outcome)}
      <Balancer>{getLabel(attribute, game)}</Balancer>
    </div>
  );
}
