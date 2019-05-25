import React from "react";
import { Page } from "../Page";

export function PendingScreen({ children }: { children?: React.ReactNode }) {
  return (
    <Page alignment="Middle">
      <p className="text-white text-2xl">{children}</p>
    </Page>
  );
}
