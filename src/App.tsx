import React, { useEffect, useReducer } from "react";
import { detectZone } from "./polygon";
import { ZoneState, ZoneEvents } from "./types";
import { getCurrentLocation, watchCurrentLocation } from "./geolocation";
import "./App.css";

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
    default:
      return initialState;
  }
}

const App: React.FC = () => {
  const [state, sendEvent] = useReducer(reducer, initialState);

  useEffect(() => {
    switch (state.zoneWatchState) {
      case "Watching":
        return watchCurrentLocation(
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
        return window.alert((state.error as PositionError).message);
      case "Success":
      case "Idle":
      default:
      // noop
    }
  }, [state.zoneState]);

  return (
    <div className="App">
      {process.env.NODE_ENV === "development" ? (
        <aside className="sidebar">
          <pre>
            {JSON.stringify(
              state,
              (key, value) => (value === undefined ? "undefined" : value),
              2
            )}
          </pre>
        </aside>
      ) : null}
      <header className="App-header">
        {state.zoneState === "Idle" ? (
          <button
            onClick={() => {
              sendEvent({ type: "DETECT_LOCATION" });
            }}
          >
            Show My Zone
          </button>
        ) : null}
        {state.zoneState === "Pending" ? (
          <button disabled>Detecting your HSL zone...</button>
        ) : null}
        {state.zoneState === "Success" ? (
          <>
            <button
              onClick={() => {
                sendEvent({ type: "DETECT_LOCATION" });
              }}
            >
              Show My Zone
            </button>
            <button
              onClick={() => {
                sendEvent({
                  type: "WATCH_LOCATION"
                });
              }}
              disabled={state.zoneWatchState === "Watching"}
            >
              Watch for live zone changes
            </button>
            {state.zoneWatchState === "Watching" ? (
              <p>Watching live location...</p>
            ) : null}
            <h1>Your zone is {state.zone}</h1>
          </>
        ) : null}
        {state.zoneState === "Error" ? (
          <h1 style={{ color: "red" }}>Error</h1>
        ) : null}
      </header>
    </div>
  );
};

export default App;
