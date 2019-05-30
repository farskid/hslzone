import React from "react";
import { Page } from "./Page";
import { Button } from "./Button";

type Props = { onZoneFind: () => void };
export function IdleScreen({ onZoneFind }: Props) {
  return (
    <Page alignment="Bottom">
      <Button
        onClick={() => {
          onZoneFind();
        }}
        text="Find My Zone"
        style={{ marginBottom: 200 }}
        size="large"
      />
    </Page>
  );
}
