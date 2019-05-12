import React from "react";
import classnames from "classnames";

const buttonClassnames =
  "bg-accent text-white font-bold text-2xl py-8 px-16 rounded";

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["button"]>;

export function Button({ children, onClick, className, disabled }: Props) {
  return (
    <button
      className={classnames(buttonClassnames, className, {
        "opacity-50 cursor-not-allowed": disabled
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
