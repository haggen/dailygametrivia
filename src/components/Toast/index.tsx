import { ReactNode } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type Props = {
  type?: "default" | "positive" | "negative";
  icon: ReactNode;
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
      <figure>{icon}</figure>
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      {extra}
    </div>
  );
}
