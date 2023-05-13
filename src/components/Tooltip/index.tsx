import { CSSProperties, ReactNode, createContext, useContext } from "react";
import {
  OffsetOptions,
  Placement,
  offset as offsetMiddleware,
  useFloating,
} from "@floating-ui/react-dom";
import { createPortal } from "react-dom";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { useSimpleState } from "~/src/lib/useSimpleState";

type Context = {
  set: (props: TooltipProps) => void;
  clear: () => void;
};

const Context = createContext<Context>({
  set: () => undefined,
  clear: () => undefined,
});

// eslint-disable-next-line react-refresh/only-export-components
export function useTooltip() {
  return useContext(Context);
}

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  const [props, patch] = useSimpleState<TooltipProps>({
    reference: null,
    children: null,
  });

  const value = {
    set: (props: TooltipProps) => {
      patch(props);
    },
    clear: () => {
      patch({ reference: null, children: null });
    },
  };

  return (
    <Context.Provider value={value}>
      {children}
      {createPortal(<Tooltip {...props} />, document.body)}
    </Context.Provider>
  );
}

type TooltipProps = {
  reference: HTMLElement | null;
  color?: "red" | "green" | "yellow" | string;
  style?: CSSProperties;
  placement?: Placement;
  offset?: OffsetOptions;
  children: ReactNode;
};

export function Tooltip({
  reference,
  placement,
  color,
  offset,
  children,
}: TooltipProps) {
  const { refs, floatingStyles } = useFloating({
    elements: { reference },
    placement,
    middleware: [offsetMiddleware(offset)],
  });

  const classList = new ClassList(classes.tooltip);
  if (reference) {
    classList.add(classes.active);
  }
  if (color) {
    classList.add(classes[color]);
  }

  return (
    <div
      ref={refs.setFloating}
      role="tooltip"
      className={String(classList)}
      style={floatingStyles}
    >
      <svg
        className={classes.pointer}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,10 H10 L5,5 Q0,0 0,5 z" />
      </svg>

      <div className={classes.content}>{children}</div>
    </div>
  );
}
