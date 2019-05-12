import React from "react";
import { ZoneState } from "../types";

type ENV = "development" | "test" | "production";
type Props = {
  env: ENV;
  state: ZoneState;
};
export function Debug({ env, state }: Props) {
  return env === "development" ? (
    <aside className="sidebar">
      <pre>
        {JSON.stringify(
          state,
          (key, value) => (value === undefined ? "undefined" : value),
          2
        )}
      </pre>
    </aside>
  ) : null;
}
