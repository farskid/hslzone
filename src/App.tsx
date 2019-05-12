import React, { useEffect, useReducer } from "react";
import { detectZone } from "./polygon";
import { ZoneState, ZoneEvents } from "./types";
import { getCurrentLocation, watchCurrentLocation } from "./geolocation";
import "./App.css";
import { Page } from "./Page";
import { Button } from "./Button";
import { Debug } from "./Debug";

const initialState: ZoneState = {
  error: undefined,
  zone: undefined,
  zoneState: "Idle",
  zoneWatchState: "Not_Watching",
  zoneWatchId: undefined
};
function reducer(state: ZoneState, event: ZoneEvents): ZoneState {
  switch (event.type) {
    case "DETECT_LOCATION":
      return {
        ...state,
        zoneState: "Pending"
      };
    case "SET_ZONE":
      return {
        ...state,
        zone: event.payload.zone,
        zoneState: "Success"
      };
    case "SET_ZONE_ERROR":
      return {
        ...state,
        error: event.payload.error,
        zoneState: "Error"
      };
    case "WATCH_LOCATION":
      return {
        ...state,
        zoneWatchState: "Watching"
      };
    case "SET_WATCH_ID":
      return {
        ...state,
        zoneWatchId: event.payload.watchId
      };
    default:
      return initialState;
  }
}

const App: React.FC = () => {
  const [state, sendEvent] = useReducer(reducer, initialState);

  useEffect(() => {
    switch (state.zoneWatchState) {
      case "Watching":
        const watchId = watchCurrentLocation(
          point => {
            sendEvent({
              type: "SET_ZONE",
              payload: { zone: detectZone(point) }
            });
          },
          err => {
            sendEvent({ type: "SET_ZONE_ERROR", payload: { error: err } });
          }
        );
        return sendEvent({
          type: "SET_WATCH_ID",
          payload: {
            watchId
          }
        });
      case "Not_Watching":
      default:
      // noop
    }

    return () => {
      if (state.zoneWatchId) {
        navigator.geolocation.clearWatch(state.zoneWatchId);
      }
    };
  }, [state.zoneWatchState]);

  useEffect(() => {
    switch (state.zoneState) {
      case "Pending":
        return getCurrentLocation(
          point => {
            sendEvent({
              type: "SET_ZONE",
              payload: { zone: detectZone(point) }
            });
          },
          err => {
            sendEvent({ type: "SET_ZONE_ERROR", payload: { error: err } });
          }
        );
      case "Error":
        // TODO: Report the crash somewhere
        if (process.env.NODE_ENV === "development") {
          window.alert((state.error as PositionError).message);
        }
        return;
      case "Success":
      case "Idle":
      default:
      // noop
    }
  }, [state.zoneState]);

  return (
    <div className="h-full">
      <Debug env={process.env.NODE_ENV} state={state} />
      <main role="main" className="h-full">
        {/* <h1>You're in zone {state.zone}</h1> */}
        {state.zoneState === "Idle" ? (
          <Page alignment="Bottom">
            <Button
              onClick={() => {
                sendEvent({ type: "DETECT_LOCATION" });
              }}
            >
              Find My Zone
            </Button>
          </Page>
        ) : null}
        {state.zoneState === "Pending" ? (
          <Page alignment="Middle">
            <p className="text-white text-2xl">Detecting your HSL zone...</p>
          </Page>
        ) : null}
        {state.zoneState === "Success" ? (
          <Page alignment="Bottom">
            <h1 className="text-center text-white text-3xl sm:text-5xl mb-32">
              Your zone is{" "}
              <span className="text-success" style={{ fontSize: "2em" }}>
                {state.zone}
              </span>
            </h1>
            {state.zoneWatchState === "Watching" ? (
              <p className="w-full mt-5 text-align-center text-success text-center">
                Watching live location...
              </p>
            ) : null}
            <div className="flex flex-col justify-end items-center w-full sm:w-2/3">
              <Button
                className="mb-3 w-4/5 sm:w-auto"
                onClick={() => {
                  sendEvent({ type: "DETECT_LOCATION" });
                }}
              >
                Refresh
              </Button>
              <Button
                className="w-4/5 sm:w-auto"
                onClick={() => {
                  sendEvent({
                    type: "WATCH_LOCATION"
                  });
                }}
                disabled={state.zoneWatchState === "Watching"}
              >
                Watch for live zone changes
              </Button>
            </div>
          </Page>
        ) : null}
        {state.zoneState === "Error" ? (
          <Page>
            <h1 className="text-danger">Try Again</h1>
          </Page>
        ) : null}
      </main>
    </div>
  );
};

export default App;
