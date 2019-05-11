import React from "react";
import classnames from "classnames";

enum VericalAlignment {
  Top = "justify-start",
  Middle = "justify-center",
  Bottom = "justify-end"
}

type Props = {
  children: React.ReactNode;
  alignment?: keyof typeof VericalAlignment;
};

export function Page({ children, alignment = "Middle" }: Props) {
  return (
    <div
      className={classnames(
        "flex flex-col items-center h-screen bg-black pb-8",
        VericalAlignment[alignment]
      )}
    >
      {children}
    </div>
  );
}
