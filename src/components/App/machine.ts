import { Machine, assign } from "xstate";
import { Zone } from "../../types";
import {
  getCurrentLocation,
  watchCurrentLocation,
  clearLocationWatch,
  detectLocationSupport
} from "../../services/geolocation";
import { detectZone } from "../../services/zone";

export type ZoneContext = {
  error: PositionError | undefined;
  zone: Zone | undefined;
};

type WatchLocationEvent = { type: "LOCATION_CHANGED"; data: Zone };
export type ZoneEvents =
  | { type: "DETECT_ZONE" }
  | { type: "REFRESH" }
  | WatchLocationEvent
  | { type: "WATCH_LOCATION" };

export type ZoneStateSchema = {
  states: {
    preparing: {};
    ready: {
      states: {
        zone_idle: {};
        zone_pending: {};
        zone_available: {
          states: {
            history: {};
            not_watching: {};
            watching: {};
          };
        };
        zone_error: {};
      };
    };
    error: {};
  };
};

export const zoneMachine = Machine<ZoneContext, ZoneStateSchema>(
  {
    id: "zoneMachine",
    initial: "preparing",
    context: { error: undefined, zone: undefined },
    states: {
      preparing: {
        invoke: {
          src: "detectLocationSupport",
          id: "detectLocationSupport",
          onDone: {
            target: "ready"
          },
          onError: {
            target: "error"
          }
        }
      },
      ready: {
        initial: "zone_idle",
        states: {
          zone_idle: {
            on: {
              DETECT_ZONE: {
                target: "zone_pending"
              }
            }
          },
          zone_pending: {
            invoke: {
              id: "detectZone",
              src: "detectZone",
              onDone: {
                target: "zone_available",
                actions: ["setZone"]
              },
              onError: {
                target: "zone_error",
                actions: ["setError"]
              }
            }
          },
          zone_available: {
            initial: "not_watching",
            on: {
              REFRESH: {
                target: "zone_pending"
              },
              LOCATION_CHANGED: {
                target: ".history",
                actions: ["setZone", "sendNotif"]
              }
            },
            states: {
              history: {
                type: "history",
                history: "deep"
              },
              not_watching: {
                on: {
                  WATCH_LOCATION: {
                    target: "watching"
                  }
                }
              },
              watching: {
                invoke: {
                  id: "watchLocation",
                  src: "watchLocationService"
                }
              }
            }
          },
          zone_error: {
            on: {
              DETECT_ZONE: {
                target: "zone_pending"
              }
            }
          }
        }
      },
      error: {
        type: "final"
      }
    }
  },
  {
    services: {
      detectLocationSupport: (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          const isSupported = detectLocationSupport();
          if (isSupported) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      },
      detectZone: (): Promise<Zone> => {
        return new Promise((resolve, reject) => {
          getCurrentLocation(
            point => {
              const zone = detectZone(point);
              resolve(zone);
            },
            error => {
              reject(error);
            }
          );
        });
      },
      watchLocationService: (ctx, e) => (callback, onEvent) => {
        const watchId = watchCurrentLocation(
          point => {
            const newZone = detectZone(point);
            // Avoid unnecessary call to parent
            if (ctx.zone !== newZone) {
              callback({
                type: "LOCATION_CHANGED",
                data: newZone
              });
              new Notification(`changed zone ${newZone}`);
            }
          },
          err => {
            // noop (don't care about watch errors)
            console.error(err);
          }
        );
        return () => {
          clearLocationWatch(watchId);
        };
      }
    },
    actions: {
      setZone: assign({
        zone: (_, e) => e.data
      }),
      setError: assign({
        error: (_, e) => e.data
      }),
      sendNotif: (ctx, e) => {
        if ("Notification" in window) {
          if (Notification.permission === "default") {
            Notification.requestPermission()
              .then(permission => {
                if (permission === "granted") {
                  new Notification(`Your zone changed to ${e.data}`);
                }
              })
              .catch(err => {});
          } else if (Notification.permission === "granted") {
            new Notification(`Your zone changed to ${e.data}`);
          }
        }
      }
    }
  }
);
