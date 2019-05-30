import React from "react";
import { Page } from "./Page";
import { colors } from "./styles";
import { PacmanIndicator } from "react-native-indicators";

export function PendingScreen() {
  return (
    <Page alignment="Middle">
      <PacmanIndicator size={100} color={colors.accent} />
    </Page>
  );
}
