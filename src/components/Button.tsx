import React from "react";
import classnames from "classnames";

const buttonClassnames =
  "bg-accent text-white font-bold text-1.5xl sm:text-2xl py-6 sm:py-8 px-8 sm:px-16 rounded";

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["button"]>;

export function Button({ children, onClick, className, disabled }: Props) {
  return (
    <button
      className={classnames(buttonClassnames, className, {
        "opacity-50 cursor-not-allowed": disabled,
        "cursor-pointer": !disabled
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
