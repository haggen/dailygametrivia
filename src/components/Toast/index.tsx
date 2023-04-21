import { ReactNode } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { Icon } from "~/src/components/Icon";

type Props = {
  type?: "default" | "positive" | "negative";
  icon: string;
  title: string;
  message: string;
  extra?: ReactNode;
};

export function Toast({
  type = "default",
  icon,
  title,
  message,
  extra,
}: Props) {
  const classList = new ClassList();
  classList.add(classes.toast);
  classList.add(classes[type]);

  return (
    <div className={classList.toString()}>
      <figure>
        <Icon name={icon} size="2.5rem" />
      </figure>
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      {extra}
    </div>
  );
}
