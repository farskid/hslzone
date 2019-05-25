import React from "react";

type ENV = "development" | "test" | "production";
type Props = {
  env: ENV;
  state: object;
  children?: React.ReactNode;
};
export function Debug({ env, state, children }: Props) {
  return env === "development" ? (
    <aside className="sidebar">
      <pre>
        {JSON.stringify(
          state,
          (key, value) => (value === undefined ? "undefined" : value),
          2
        )}
      </pre>
      {children}
    </aside>
  ) : null;
}
