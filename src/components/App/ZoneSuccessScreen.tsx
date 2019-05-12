import React from "react";
import { Page } from "../Page";
import { ZoneState, ZoneEvents } from "../../types";
import { PublicZone } from "../Zone";
import { Button } from "../Button";

type Props = {
  state: Pick<ZoneState, "zone" | "zoneWatchState">;
  onRefresh: () => void;
  onWatchLocation: () => void;
};
export function ZoneSuccessScreen({
  state,
  onRefresh,
  onWatchLocation
}: Props) {
  return (
    <Page alignment="Bottom">
      <div className="mb-32">
        {state.zone !== undefined ? (
          <h1 className="text-center text-white text-3xl sm:text-5xl">
            Your zone is{" "}
            <span className="text-success relative-text-size">
              <PublicZone name={state.zone} />
            </span>
          </h1>
        ) : null}
        {state.zoneWatchState === "Watching" ? (
          <p className="w-full text-align-center text-accent text-center">
            Watching live location...
          </p>
        ) : null}
      </div>
      <div className="flex flex-col justify-end items-center w-full sm:w-2/3">
        <Button
          className="mb-3 w-4/5 sm:w-auto"
          onClick={() => {
            onRefresh();
          }}
        >
          Refresh
        </Button>
        <Button
          className="w-4/5 sm:w-auto"
          onClick={() => {
            onWatchLocation();
          }}
          disabled={state.zoneWatchState === "Watching"}
        >
          Watch for live zone changes
        </Button>
      </div>
    </Page>
  );
}
