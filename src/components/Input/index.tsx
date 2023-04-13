import { ComponentProps, ElementType, useId } from "react";
import { ClassList } from "src/lib/classList";

import classes from "./style.module.css";

type Option = ComponentProps<"option">;

type Props = ComponentProps<"input"> & {
  initialValue?: string;
  dataList?: string[] | Option[];
};

function renderDataListOption(option: string | Option, index: number) {
  if (typeof option === "string") {
    return <option key={option}>{option}</option>;
  }

  return <option key={String(option.value ?? index)} {...option} />;
}

export function Input({ initialValue, dataList, ...props }: Props) {
  const dataListId = useId();

  const classList = new ClassList();
  classList.add(classes.flex);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = classList.toString();

  return (
    <>
      <input list={dataListId} {...props} />
      {dataList ? (
        <datalist id={dataListId}>
          {dataList.map(renderDataListOption)}
        </datalist>
      ) : null}
    </>
  );
}
