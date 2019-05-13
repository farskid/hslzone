import React, { useEffect, useReducer } from "react";
import { detectZone, getZone } from "../../services/zone";
import { ZoneState, ZoneEvents } from "../../types";
import {
  getCurrentLocation,
  watchCurrentLocation,
  getWatchId
} from "../../services/geolocation";
import {
  requestForNotificationPermission,
  sendNotification
} from "../../services/notification";
import "./App.css";
import { Debug } from "../Debug";
import { getNotificationText } from "../../utils/getNotificationText";
import { ErrorScreen } from "./ErrorScreen";
import { ZoneSuccessScreen } from "./ZoneSuccessScreen";
import { PendingScreen } from "./PendingScreen";
import { IdleScreen } from "./IdleScreen";
import { logger } from "../../utils/logger";

const initialState: ZoneState = {
  error: undefined,
  zoneState: "Idle",
  zoneWatchState: "Not_Watching",
  notificationState:
    (window as any).Notification !== undefined
      ? (window as any).Notification.permission
      : "NOT_AVAILABLE"
};
function reducer(state: ZoneState, event: ZoneEvents): ZoneState {
  switch (event.type) {
    case "DETECT_LOCATION":
      return {
        ...state,
        zoneState: "Pending",
        zoneWatchState: "Not_Watching"
      };
    case "SET_ZONE_SUCCESS":
      return {
        ...state,
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
  const [state, sendEvent] = useReducer(
    process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
    initialState
  );

  // Request for notification permission
  useEffect(() => {
    switch (state.notificationState) {
      case "default":
        requestForNotificationPermission()
          .then(permission => {
            sendEvent({
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
      case "granted":
      default:
      // noop
    }
  }, [state.notificationState]);

  // Start / Clear watching for location changes
  useEffect(() => {
    switch (state.zoneWatchState) {
      case "Watching":
        watchCurrentLocation(
          point => {
            detectZone(point);
            sendEvent({
              type: "SET_ZONE_SUCCESS"
            });
          },
          err => {
            sendEvent({
              type: "SET_ZONE_ERROR",
              payload: { error: err }
            });
          }
        );
      case "Not_Watching":
      default:
      // noop
    }

    return () => {
      const watchId = getWatchId();
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [state.zoneWatchState]);

  // Detect zone based on current location
  useEffect(() => {
    switch (state.zoneState) {
      case "Pending":
        return getCurrentLocation(
          point => {
            detectZone(point);
            sendEvent({
              type: "SET_ZONE_SUCCESS"
            });
          },
          err => {
            sendEvent({
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
    if (state.zoneState === "Success") {
      if (state.notificationState === "granted") {
        const zone = getZone();
        if (zone !== undefined) {
          sendNotification("HSL Zone Changed!", getNotificationText(zone));
        }
      }
    }
  }, [getZone()]);

  const zone = getZone();
  return (
    <div className="h-full">
      <Debug env={process.env.NODE_ENV} state={state} />
      <main role="main" className="h-full">
        {state.zoneState === "Idle" ? (
          <IdleScreen
            onZoneFind={() => sendEvent({ type: "DETECT_LOCATION" })}
          />
        ) : null}
        {state.zoneState === "Pending" ? <PendingScreen /> : null}
        {state.zoneState === "Success" ? (
          <ZoneSuccessScreen
            state={{ zone: zone, zoneWatchState: state.zoneWatchState }}
            onRefresh={() => sendEvent({ type: "DETECT_LOCATION" })}
            onWatchLocation={() =>
              sendEvent({
                type: "WATCH_LOCATION"
              })
            }
          />
        ) : null}
        {state.zoneState === "Error" ? (
          <ErrorScreen
            onRefresh={() => sendEvent({ type: "DETECT_LOCATION" })}
          />
        ) : null}
      </main>
    </div>
  );
};

export default App;
