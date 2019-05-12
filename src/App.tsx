import React, { useEffect, useReducer } from "react";
import { detectZone } from "./zone";
import { ZoneState, ZoneEvents } from "./types";
import { getCurrentLocation, watchCurrentLocation } from "./geolocation";
import {
  requestForNotificationPermission,
  sendNotification
} from "./notification";
import "./App.css";
import { Page } from "./Page";
import { Button } from "./Button";
import { Debug } from "./Debug";
import { PublicZone } from "./components/Zone";
import { getNotificationText } from "./utils/getNotificationText";

const initialState: ZoneState = {
  error: undefined,
  zone: undefined,
  zoneState: "Idle",
  zoneWatchState: "Not_Watching",
  zoneWatchId: undefined,
  notificationState: Notification.permission
};
function reducer(state: ZoneState, event: ZoneEvents): ZoneState {
  switch (event.type) {
    case "DETECT_LOCATION":
      return {
        ...state,
        zoneState: "Pending",
        zoneWatchId: undefined,
        zoneWatchState: "Not_Watching"
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
    case "REQUEST_FOR_NOTIFICATION_PERMISSION":
      return {
        ...state,
        notificationState: "default"
      };
    case "SET_NOTIFICATION_PERMISSION":
      return {
        ...state,
        notificationState: event.payload.permission
      };
    default:
      return initialState;
  }
}

const App: React.FC = () => {
  const [state, sendEvent] = useReducer(reducer, initialState);

  function sendEventWithLog(event: ZoneEvents) {
    console.group(event);
    console.groupEnd();
    sendEvent(event);
  }

  // Request for notification permission
  useEffect(() => {
    switch (state.notificationState) {
      case "default":
        requestForNotificationPermission()
          .then(permission => {
            sendEventWithLog({
              type: "SET_NOTIFICATION_PERMISSION",
              payload: { permission }
            });
          })
          .catch(err => {
            // TODO: report the error somewhere
            console.error(err);
          });
        break;
      case "NOT_AVAILABLE":
      // noop
      case "granted":
      // noop
      default:
      // noop
    }
  }, [state.notificationState]);

  // Start / Clear watching for location changes
  useEffect(() => {
    switch (state.zoneWatchState) {
      case "Watching":
        const watchId = watchCurrentLocation(
          point => {
            console.log(point, detectZone(point));
            sendEventWithLog({
              type: "SET_ZONE",
              payload: { zone: detectZone(point) }
            });
          },
          err => {
            sendEventWithLog({
              type: "SET_ZONE_ERROR",
              payload: { error: err }
            });
          }
        );
        return sendEventWithLog({
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

  // Detect zone based on current location
  useEffect(() => {
    switch (state.zoneState) {
      case "Pending":
        return getCurrentLocation(
          point => {
            sendEventWithLog({
              type: "SET_ZONE",
              payload: { zone: detectZone(point) }
            });
          },
          err => {
            sendEventWithLog({
              type: "SET_ZONE_ERROR",
              payload: { error: err }
            });
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

  // Notify user when zoen changes
  useEffect(() => {
    if (state.notificationState === "granted") {
      if (state.zone !== undefined) {
        sendNotification("HSL Zone Changed!", getNotificationText(state.zone));
      }
    }
  }, [state.zone]);

  return (
    <div className="h-full">
      <Debug env={process.env.NODE_ENV} state={state} />
      <main role="main" className="h-full">
        {/* <h1>You're in zone {state.zone}</h1> */}
        {state.zoneState === "Idle" ? (
          <Page alignment="Bottom">
            <Button
              onClick={() => {
                sendEventWithLog({ type: "DETECT_LOCATION" });
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
                  sendEventWithLog({ type: "DETECT_LOCATION" });
                }}
              >
                Refresh
              </Button>
              <Button
                className="w-4/5 sm:w-auto"
                onClick={() => {
                  sendEventWithLog({
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
