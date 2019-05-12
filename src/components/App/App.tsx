import React, { useEffect, useReducer } from "react";
import { detectZone } from "../../services/zone";
import { ZoneState, ZoneEvents } from "../../types";
import {
  getCurrentLocation,
  watchCurrentLocation
} from "../../services/geolocation";
import {
  requestForNotificationPermission,
  sendNotification
} from "../../services/notification";
import "./App.css";
import { Page } from "../Page";
import { Button } from "../Button";
import { Debug } from "../Debug";
import { PublicZone } from "../Zone";
import { getNotificationText } from "../../utils/getNotificationText";
import { ErrorScreen } from "./ErrorScreen";
import { ZoneSuccessScreen } from "./ZoneSuccessScreen";
import { PendingScreen } from "./PendingScreen";
import { IdleScreen } from "./IdleScreen";
import { logger } from "../../utils/logger";

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
            sendEvent({
              type: "SET_ZONE",
              payload: { zone: detectZone(point) }
            });
          },
          err => {
            sendEvent({
              type: "SET_ZONE_ERROR",
              payload: { error: err }
            });
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

  // Detect zone based on current location
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
        {state.zoneState === "Idle" ? (
          <IdleScreen
            onZoneFind={() => sendEvent({ type: "DETECT_LOCATION" })}
          />
        ) : null}
        {state.zoneState === "Pending" ? <PendingScreen /> : null}
        {state.zoneState === "Success" ? (
          <ZoneSuccessScreen
            state={{ zone: state.zone, zoneWatchState: state.zoneWatchState }}
            onRefresh={() => sendEvent({ type: "DETECT_LOCATION" })}
            onWatchLocation={() =>
              sendEvent({
                type: "WATCH_LOCATION"
              })
            }
          />
        ) : null}
        {state.zoneState === "Error" ? <ErrorScreen /> : null}
      </main>
    </div>
  );
};

export default App;
