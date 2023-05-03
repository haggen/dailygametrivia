import { CSSProperties, Children, ReactNode, useState } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";

type Props = {
  children: ReactNode[];
  page?: number;
  style?: CSSProperties;
  onChange?: (page: number, total: number) => void;
};

export function Help({
  children,
  page: initialPage = 0,
  style,
  onChange,
}: Props) {
  const [page, setPage] = useState(initialPage);

  const total = Children.count(children);

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
      onChange?.(page - 1, total);
    }
  };

  const handleNext = () => {
    if (page < total - 1) {
      setPage(page + 1);
      onChange?.(page + 1, total);
    }
  };

  const isLastPage = page === total - 1;
  // const isSecondToLastPage = page === total - 2;

  return (
    <article className={classes.help} style={style}>
      {Children.toArray(children)[page]}

      <menu>
        <li>
          <Button onClick={handleBack} disabled={page === 0}>
            Back
          </Button>
        </li>
        <li>
          <Button onClick={handleNext} disabled={isLastPage}>
            Next
          </Button>
        </li>
      </menu>
    </article>
  );
}
